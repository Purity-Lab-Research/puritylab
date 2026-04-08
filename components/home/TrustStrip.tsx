"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const guarantees = [
  {
    title: "98%+ Purity Guaranteed",
    description: "Every batch verified by independent third-party US labs",
    color: "bg-[#10B981]/10",
    iconColor: "text-[#10B981]",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  {
    title: "Cold Chain Shipping",
    description: "Temperature controlled delivery to protect peptide integrity",
    color: "bg-blue-50",
    iconColor: "text-blue-500",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    title: "CoA with Every Batch",
    description: "Third party tested in America with published certificates",
    color: "bg-amber-50",
    iconColor: "text-amber-500",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="m9 15 2 2 4-4" />
      </svg>
    ),
  },
];

export default function TrustStrip() {
  const animRef = useScrollAnimation();

  return (
    <section className="bg-white py-16 sm:py-20 border-t border-[#F0F0F0]">
      <div ref={animRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111]">
            Our Guarantee
          </h2>
          <p className="mt-3 text-[#6B7280] max-w-lg mx-auto">
            Quality you can verify, backed by transparency you can trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {guarantees.map((item) => (
            <div
              key={item.title}
              className="bg-white border border-[#F0F0F0] rounded-2xl p-8 text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col items-center"
            >
              <div className={`w-14 h-14 rounded-full ${item.color} flex items-center justify-center mb-5`}>
                <span className={item.iconColor}>{item.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-[#111111] mb-2">{item.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
