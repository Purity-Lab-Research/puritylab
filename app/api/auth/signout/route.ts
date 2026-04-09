import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const rateLimited = await rateLimit(request, { limit: 10, windowMs: 60_000 });
  if (rateLimited) return rateLimited;

  const supabase = await createClient();
  await supabase.auth.signOut();

  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/login`);
}

export async function POST(request: NextRequest) {
  const rateLimited = await rateLimit(request, { limit: 10, windowMs: 60_000 });
  if (rateLimited) return rateLimited;

  const supabase = await createClient();
  await supabase.auth.signOut();

  const { origin } = new URL(request.url);
  // Use 303 See Other to convert POST redirect into GET
  return NextResponse.redirect(`${origin}/login`, { status: 303 });
}
