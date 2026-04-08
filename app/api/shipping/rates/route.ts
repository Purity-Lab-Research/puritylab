import { NextResponse } from "next/server";

// Flat rate shipping is calculated client-side. This endpoint is a stub.
export async function POST() {
  return NextResponse.json({ rates: [], message: "Flat rate shipping is calculated automatically." });
}
