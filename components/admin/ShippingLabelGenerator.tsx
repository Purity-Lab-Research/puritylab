"use client";

// Automated label generation via Shippo has been removed.
// Labels are created manually through the carrier dashboard.

interface Props {
  orderId: string;
  rateId?: string | null;
}

export default function ShippingLabelGenerator({ orderId }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
      <p className="text-sm text-gray-600">
        Create shipping labels manually through your carrier dashboard (USPS, FedEx, or UPS).
      </p>
      <p className="text-xs text-gray-400 mt-1">Order: {orderId.slice(0, 8)}</p>
    </div>
  );
}
