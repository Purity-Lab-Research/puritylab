import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ALLOWED_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";

// Admin API rate limiter: 30 requests per 60 seconds per IP
let adminLimiter: Ratelimit | null = null;
function getAdminLimiter(): Ratelimit | null {
  if (adminLimiter) return adminLimiter;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token || url.startsWith("your_")) return null;
  adminLimiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(30, "60 s"),
    prefix: "rl:admin",
  });
  return adminLimiter;
}

export async function middleware(request: NextRequest) {
  // Skip middleware for webhook routes  -  they need raw body for signature verification
  if (request.nextUrl.pathname.startsWith("/api/webhooks/")) {
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

  // Rate-limit admin API routes (30 req/min per IP)
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
