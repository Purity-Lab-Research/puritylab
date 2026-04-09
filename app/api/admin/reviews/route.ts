import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin";
import { verifyCsrf } from "@/lib/csrf";
import { logger } from "@/lib/logger";

// GET all reviews (admin)
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from("product_reviews")
      .select("*, product:products(name)")
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Admin reviews GET error", { error: String(error.message) });
      return NextResponse.json({ error: "Failed to load reviews" }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (err) {
    logger.error("Admin reviews GET error", { error: String(err) });
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

// PUT - approve/reject review
export async function PUT(req: NextRequest) {
  const csrfError = verifyCsrf(req);
  if (csrfError) return csrfError;

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, approved } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing review id" }, { status: 400 });
    }

    const db = createAdminClient();

    // Get the review to find product_id
    const { data: review } = await db
      .from("product_reviews")
      .select("product_id")
      .eq("id", id)
      .single();

    // Update review
    const { data, error } = await db
      .from("product_reviews")
      .update({ approved, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      logger.error("Admin reviews PUT error", { error: String(error.message), reviewId: id });
      return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
    }

    // Recalculate product avg_rating and review_count
    if (review) {
      const { data: stats } = await db
        .from("product_reviews")
        .select("rating")
        .eq("product_id", review.product_id)
        .eq("approved", true);

      const ratings = (stats ?? []).map((r: { rating: number }) => r.rating);
      const avg = ratings.length > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : 0;

      await db
        .from("products")
        .update({ avg_rating: Math.round(avg * 10) / 10, review_count: ratings.length })
        .eq("id", review.product_id);
    }

    return NextResponse.json(data);
  } catch (err) {
    logger.error("Admin reviews PUT error", { error: String(err) });
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

// DELETE review
export async function DELETE(req: NextRequest) {
  const csrfError = verifyCsrf(req);
  if (csrfError) return csrfError;

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing review id" }, { status: 400 });
    }

    const db = createAdminClient();

    // Get product_id before deleting
    const { data: review } = await db
      .from("product_reviews")
      .select("product_id")
      .eq("id", id)
      .single();

    const { error } = await db.from("product_reviews").delete().eq("id", id);
    if (error) {
      logger.error("Admin reviews DELETE error", { error: String(error.message), reviewId: id });
      return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
    }

    // Recalculate product stats
    if (review) {
      const { data: stats } = await db
        .from("product_reviews")
        .select("rating")
        .eq("product_id", review.product_id)
        .eq("approved", true);

      const ratings = (stats ?? []).map((r: { rating: number }) => r.rating);
      const avg = ratings.length > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : 0;

      await db
        .from("products")
        .update({ avg_rating: Math.round(avg * 10) / 10, review_count: ratings.length })
        .eq("id", review.product_id);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("Admin reviews DELETE error", { error: String(err) });
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
