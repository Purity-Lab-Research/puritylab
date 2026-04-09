import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ALLOWED_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token || url.startsWith("your_")) return null;
  return new Redis({ url, token });
}

// Admin API rate limiter: 60 requests per 60 seconds per user
let adminLimiter: Ratelimit | null = null;
function getAdminLimiter(): Ratelimit | null {
  if (adminLimiter) return adminLimiter;
  const redis = getRedis();
  if (!redis) return null;
  adminLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "60 s"),
    prefix: "rl:admin",
  });
  return adminLimiter;
}

// Global rate limiter: 100 requests per 60 seconds per IP
let globalLimiter: Ratelimit | null = null;
function getGlobalLimiter(): Ratelimit | null {
  if (globalLimiter) return globalLimiter;
  const redis = getRedis();
  if (!redis) return null;
  globalLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "60 s"),
    prefix: "rl:global",
  });
  return globalLimiter;
}

export async function middleware(request: NextRequest) {
  // Skip middleware for webhook routes  -  they need raw body for signature verification
  if (request.nextUrl.pathname.startsWith("/api/webhooks/")) {
    return NextResponse.next();
  }

  // Skip middleware for unsubscribe endpoint (one-click from emails)
  if (request.nextUrl.pathname === "/api/unsubscribe") {
    return NextResponse.next();
  }

  // Handle CORS preflight for API routes
  if (
    request.nextUrl.pathname.startsWith("/api/") &&
    request.method === "OPTIONS"
  ) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Affiliate tracking: capture ?ref= or ?aff= parameter and set cookie
  const refCode = request.nextUrl.searchParams.get("ref") || request.nextUrl.searchParams.get("aff");
  if (refCode && !request.nextUrl.pathname.startsWith("/api/")) {
    supabaseResponse.cookies.set("pl_aff", refCode.toUpperCase(), {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    supabaseResponse.cookies.set("pl_aff_ts", Date.now().toString(), {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    // Readable flag for UI discount notice (no sensitive data)
    supabaseResponse.cookies.set("pl_aff_active", "1", {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    // Fire click tracking asynchronously (non-blocking)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";
    fetch(`${siteUrl}/api/affiliate/click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: refCode.toUpperCase(),
        landingPage: pathname,
      }),
    }).catch(() => {});
  }

  // Global rate limit on API routes (100 req/min per IP)
  if (pathname.startsWith("/api/")) {
    const limiter = getGlobalLimiter();
    if (limiter) {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "unknown";
      const { success, reset } = await limiter.limit(`global:${ip}`);
      if (!success) {
        const retryAfter = Math.ceil((reset - Date.now()) / 1000);
        return NextResponse.json(
          { error: "Too many requests. Please try again in a moment." },
          {
            status: 429,
            headers: { "Retry-After": String(Math.max(retryAfter, 1)) },
          }
        );
      }
    }
  }

  // Protect checkout (require authentication)
  if (pathname === "/checkout" && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Protect affiliate dashboard
  if (pathname.startsWith("/affiliate/dashboard") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Protect account routes
  if (pathname.startsWith("/account") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    // Role check happens in admin layout (can't query DB in middleware efficiently)
  }

  // Redirect logged-in users from auth pages
  if ((pathname === "/login" || pathname === "/register") && user) {
    const raw = request.nextUrl.searchParams.get("redirect") || "/account";
    const redirect = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/account";
    const url = request.nextUrl.clone();
    url.pathname = redirect;
    url.searchParams.delete("redirect");
    return NextResponse.redirect(url);
  }

  // Rate-limit admin API routes (60 req/min per user)
  if (pathname.startsWith("/api/admin/")) {
    const limiter = getAdminLimiter();
    if (limiter) {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "unknown";
      const { success, reset } = await limiter.limit(`admin:${ip}`);
      if (!success) {
        const retryAfter = Math.ceil((reset - Date.now()) / 1000);
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          {
            status: 429,
            headers: { "Retry-After": String(Math.max(retryAfter, 1)) },
          }
        );
      }
    }
  }

  // Attach CORS headers to API responses
  if (request.nextUrl.pathname.startsWith("/api/")) {
    supabaseResponse.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
