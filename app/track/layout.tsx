import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Order",
  description: "Track your Purity Lab order status and shipping information.",
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
