"use client";

import EditableText from "@/components/admin/EditableText";

export default function CoaExplanation() {
  return (
    <div className="rounded-xl border border-border bg-surface p-8">
      <div className="mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-[10px] bg-secondary/10 flex items-center justify-center flex-shrink-0">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-secondary"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        </div>
        <h2 className="font-heading text-xl font-bold text-primary">
          <EditableText settingKey="coa_explanation_heading">
            Understanding Our COAs
          </EditableText>
        </h2>
      </div>

      <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
        <p>
          <EditableText settingKey="coa_explanation_intro">
            A Certificate of Analysis (COA) is a document issued by an
            independent third-party laboratory that confirms the identity,
            purity, and quality of a specific product batch. Each COA typically
            includes:
          </EditableText>
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <EditableText settingKey="coa_explanation_hplc">
              <strong className="text-text-primary">HPLC Analysis</strong>  - 
              High-Performance Liquid Chromatography measures the purity
              percentage of the peptide.
            </EditableText>
          </li>
          <li>
            <EditableText settingKey="coa_explanation_ms">
              <strong className="text-text-primary">
                Mass Spectrometry (MS)
              </strong>{" "}
              - Confirms the molecular identity of the peptide by measuring its
              molecular weight.
            </EditableText>
          </li>
          <li>
            <EditableText settingKey="coa_explanation_batch">
              <strong className="text-text-primary">Batch Number</strong> - A
              unique identifier linking the COA to a specific production batch.
            </EditableText>
          </li>
          <li>
            <EditableText settingKey="coa_explanation_appearance">
              <strong className="text-text-primary">
                Appearance &amp; Solubility
              </strong>{" "}
              - Physical characteristics of the product as observed during
              testing.
            </EditableText>
          </li>
        </ul>
        <p>
          <EditableText settingKey="coa_explanation_closing">
            We are committed to transparency and quality. If you have any
            questions about our testing or would like a COA for a specific
            product, please{" "}
            <a
              href="/contact"
              className="font-semibold text-secondary underline hover:text-primary transition-colors"
            >
              contact us
            </a>
            .
          </EditableText>
        </p>
      </div>
    </div>
  );
}
