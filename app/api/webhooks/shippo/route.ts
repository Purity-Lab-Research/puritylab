import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

const log = logger.child({ route: "/api/webhooks/shippo" });

// Webhook stub: accepts tracking updates if a carrier sends them.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const trackingNumber = body?.data?.tracking_number;
    const trackingStatus = body?.data?.tracking_status?.status;

    if (trackingNumber && trackingStatus) {
      const supabase = createAdminClient();
      const statusMap: Record<string, string> = {
        DELIVERED: "delivered",
        IN_TRANSIT: "shipped",
        RETURNED: "cancelled",
      };
      const mapped = statusMap[trackingStatus];
      if (mapped) {
        await supabase
          .from("orders")
          .update({ status: mapped })
          .eq("tracking_number", trackingNumber);
        log.info("Tracking update", { trackingNumber, status: mapped });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    log.error("Webhook error", { error: String(err) });
    return NextResponse.json({ received: true });
  }
}
