"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-3">
          Unable to load products
        </h1>
        <p className="text-gray-600 mb-6">
          We had trouble loading the shop. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="fill" size="lg" onClick={() => reset()}>
            Try Again
          </Button>
          <Button href="/" variant="ghost" size="lg">
            Back to Home
          </Button>
        </div>
      </div>
    </section>
  );
}
