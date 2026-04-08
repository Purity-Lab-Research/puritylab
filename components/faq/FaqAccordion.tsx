"use client";

import { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import EditableText from "@/components/admin/EditableText";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSection {
  title: string;
  items: FaqItem[];
}

interface FaqAccordionProps {
  sections: FaqSection[];
  useDynamic?: boolean;
}

export default function FaqAccordion({
  sections: defaultSections,
  useDynamic = false,
}: FaqAccordionProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [sections, setSections] = useState<FaqSection[]>(defaultSections);

  useEffect(() => {
    if (!useDynamic) return;

    async function loadDynamic() {
      try {
        const res = await fetch("/api/admin/settings");
        if (!res.ok) return;
        const data = await res.json();
        const faqSetting = data.find(
          (item: { key: string; value: unknown }) => item.key === "faq_data"
        );
        if (faqSetting?.value) {
          const parsed =
            typeof faqSetting.value === "string"
              ? JSON.parse(faqSetting.value)
              : faqSetting.value;
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSections(parsed);
          }
        }
      } catch {
        // Keep defaults on error
      }
    }

    loadDynamic();
  }, [useDynamic]);

  function toggle(key: string) {
    setOpenKey((prev) => (prev === key ? null : key));
  }

  const sectionSlugs = ["general", "orders", "subscriptions"];

  return (
    <div className="space-y-10">
      {sections.map((section, si) => {
        const slug = sectionSlugs[si] || `section_${si + 1}`;
        return (
        <div key={si}>
          <h2 className="mb-4 text-xl font-bold text-[#111111]">
            <EditableText settingKey={`faq_${slug}_heading`}>{section.title}</EditableText>
          </h2>

          <div className="divide-y divide-[#F0F0F0] rounded-2xl border border-[#F0F0F0] bg-white overflow-hidden">
            {section.items.map((item, qi) => {
              const key = `${si}-${qi}`;
              const isOpen = openKey === key;

              return (
                <div key={key}>
                  <button
                    type="button"
                    onClick={() => toggle(key)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-[#111111] transition-colors hover:bg-[#FAFAFA]"
                    aria-expanded={isOpen}
                  >
                    <span>
                      <EditableText settingKey={`faq_${slug}_${qi + 1}_q`}>{item.question}</EditableText>
                    </span>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? "bg-[#111111]" : "bg-[#F0F0F0]"}`}>
                      {isOpen ? (
                        <Minus className="h-3.5 w-3.5 text-white" />
                      ) : (
                        <Plus className="h-3.5 w-3.5 text-[#6B7280]" />
                      )}
                    </span>
                  </button>

                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{
                      maxHeight: isOpen ? "500px" : "0px",
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <p className="px-5 pb-4 text-sm leading-relaxed text-[#6B7280]">
                      <EditableText settingKey={`faq_${slug}_${qi + 1}_a`}>{item.answer}</EditableText>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        );
      })}
    </div>
  );
}
