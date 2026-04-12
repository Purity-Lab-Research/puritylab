"use client";

import { useState, useEffect } from "react";
import WaitlistForm from "@/components/prelaunch/WaitlistForm";

export default function WaitlistCTA() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/waitlist")
      .then((res) => res.json())
      .then((data) => {
        if (data.count >= 20) setCount(data.count);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111]">
          Be First in Line
        </h2>
        <p className="mt-4 text-[#6B7280] leading-relaxed">
          Our compounds are completing six-panel independent testing.
          We&apos;ll email you the moment everything is verified and ready to ship.
        </p>

        <div className="mt-8 max-w-md mx-auto">
          <WaitlistForm
            buttonLabel="Join the Waitlist"
            successMessage="You're on the list. We'll be in touch soon."
            layout="inline"
          />
        </div>

        {count !== null && (
          <p className="mt-4 text-sm text-[#6B7280]">
            {count.toLocaleString()} people are waiting
          </p>
        )}
      </div>
    </section>
  );
}
