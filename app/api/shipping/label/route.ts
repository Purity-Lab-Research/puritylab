import { NextResponse } from "next/server";

// Label generation is not currently active. Shipping labels are created manually.
export async function POST() {
  return NextResponse.json(
    { error: "Automated label generation is not currently enabled. Create labels manually through your carrier dashboard." },
    { status: 501 }
  );
}
