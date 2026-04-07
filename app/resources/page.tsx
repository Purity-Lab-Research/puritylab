"use client";

import { useState, useMemo } from "react";
import PageHeader from "@/components/ui/PageHeader";

const inputCls =
  "w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-secondary focus:ring-1 focus:ring-secondary/20 outline-none font-body [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

const labelCls = "block text-xs font-semibold text-primary uppercase tracking-wider mb-1.5";

/* ─── Dosing Calculator ─── */
function DosingCalculator() {
  const [peptideMg, setPeptideMg] = useState("");
  const [waterMl, setWaterMl] = useState("");
  const [doseMcg, setDoseMcg] = useState("");

  const result = useMemo(() => {
    const p = parseFloat(peptideMg);
    const w = parseFloat(waterMl);
    const d = parseFloat(doseMcg);
    if (!p || !w || !d || p <= 0 || w <= 0 || d <= 0) return null;

    const totalMcg = p * 1000;
    const concPerMl = totalMcg / w;
    const concPerUnit = concPerMl / 100;
    const units = d / concPerUnit;
    const totalDoses = totalMcg / d;

    return {
      units: Math.round(units * 10) / 10,
      concPerUnit: Math.round(concPerUnit * 10) / 10,
      totalDoses: Math.floor(totalDoses),
    };
  }, [peptideMg, waterMl, doseMcg]);

  return (
    <div className="bg-surface border border-border rounded-xl p-8">
      <h3 className="font-heading text-xl font-bold text-primary mb-1">
        Dosing Calculator
      </h3>
      <p className="text-sm text-text-secondary mb-6">
        Calculate how many units to draw on your insulin syringe for a desired dose.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Peptide amount in vial (mg)</label>
            <input type="number" value={peptideMg} onChange={(e) => setPeptideMg(e.target.value)} placeholder="e.g. 10" className={inputCls} min="0" step="any" />
          </div>
          <div>
            <label className={labelCls}>Bacteriostatic water added (ml)</label>
            <input type="number" value={waterMl} onChange={(e) => setWaterMl(e.target.value)} placeholder="e.g. 2" className={inputCls} min="0" step="any" />
          </div>
          <div>
            <label className={labelCls}>Desired dose (mcg)</label>
            <input type="number" value={doseMcg} onChange={(e) => setDoseMcg(e.target.value)} placeholder="e.g. 250" className={inputCls} min="0" step="any" />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          {result ? (
            <div className="space-y-4">
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 text-center">
                <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Draw</p>
                <p className="font-heading text-4xl font-extrabold text-primary">{result.units}</p>
                <p className="text-sm text-text-secondary">units on your insulin syringe</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background rounded-lg p-3 text-center">
                  <p className="text-xs text-text-secondary">Per unit</p>
                  <p className="font-heading text-lg font-bold text-primary">{result.concPerUnit} mcg</p>
                </div>
                <div className="bg-background rounded-lg p-3 text-center">
                  <p className="text-xs text-text-secondary">Total doses</p>
                  <p className="font-heading text-lg font-bold text-primary">{result.totalDoses}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-sm text-text-secondary py-8">
              Enter values to calculate your dose.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Reconstitution Calculator ─── */
function ReconstitutionCalculator() {
  const [peptideMg, setPeptideMg] = useState("");
  const [waterMl, setWaterMl] = useState("");

  const result = useMemo(() => {
    const p = parseFloat(peptideMg);
    const w = parseFloat(waterMl);
    if (!p || !w || p <= 0 || w <= 0) return null;

    const totalMcg = p * 1000;
    const per10Units = (totalMcg / w) / 10;
    const perUnit = totalMcg / w / 100;

    return { per10Units: Math.round(per10Units * 10) / 10, perUnit: Math.round(perUnit * 10) / 10 };
  }, [peptideMg, waterMl]);

  const refTable = useMemo(() => {
    const p = parseFloat(peptideMg);
    if (!p || p <= 0) return [];
    return [1, 2, 3].map((ml) => ({
      ml,
      per10Units: Math.round(((p * 1000) / ml / 10) * 10) / 10,
      perUnit: Math.round(((p * 1000) / ml / 100) * 10) / 10,
    }));
  }, [peptideMg]);

  return (
    <div className="bg-surface border border-border rounded-xl p-8">
      <h3 className="font-heading text-xl font-bold text-primary mb-1">
        Reconstitution Calculator
      </h3>
      <p className="text-sm text-text-secondary mb-6">
        Determine the concentration after reconstituting your peptide.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Peptide amount (mg)</label>
            <input type="number" value={peptideMg} onChange={(e) => setPeptideMg(e.target.value)} placeholder="e.g. 5" className={inputCls} min="0" step="any" />
          </div>
          <div>
            <label className={labelCls}>Water volume (ml)</label>
            <input type="number" value={waterMl} onChange={(e) => setWaterMl(e.target.value)} placeholder="e.g. 2" className={inputCls} min="0" step="any" />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          {result ? (
            <div className="space-y-4">
              <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-text-secondary">Per 0.1ml (10 units)</span>
                  <span className="font-heading text-xl font-bold text-primary">{result.per10Units} mcg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-secondary">Per unit (0.01ml)</span>
                  <span className="font-heading text-xl font-bold text-primary">{result.perUnit} mcg</span>
                </div>
              </div>

              {refTable.length > 0 && (
                <div>
                  <p className="text-xs text-text-secondary mb-2">Reference table:</p>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-background">
                          <th className="px-3 py-2 text-left text-text-secondary font-semibold">Water</th>
                          <th className="px-3 py-2 text-right text-text-secondary font-semibold">Per 10 units</th>
                          <th className="px-3 py-2 text-right text-text-secondary font-semibold">Per unit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {refTable.map((row) => (
                          <tr key={row.ml} className={row.ml === parseFloat(waterMl) ? "bg-secondary/5" : ""}>
                            <td className="px-3 py-2 text-text-primary">{row.ml}ml</td>
                            <td className="px-3 py-2 text-right text-text-primary font-medium">{row.per10Units} mcg</td>
                            <td className="px-3 py-2 text-right text-text-primary font-medium">{row.perUnit} mcg</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-sm text-text-secondary py-8">
              Enter values to see concentrations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Cycle Planner ─── */
const PROTOCOL_PRESETS: Record<string, { label: string; daysPerWeek: number }> = {
  recovery: { label: "Recovery (daily)", daysPerWeek: 7 },
  fatloss: { label: "Fat Loss (5x/week)", daysPerWeek: 5 },
  performance: { label: "Performance (3x/week)", daysPerWeek: 3 },
  custom: { label: "Custom", daysPerWeek: 5 },
};

function CyclePlanner() {
  const [protocol, setProtocol] = useState("recovery");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [cycleWeeks, setCycleWeeks] = useState(4);
  const [customDays, setCustomDays] = useState(5);

  const daysPerWeek = protocol === "custom" ? customDays : PROTOCOL_PRESETS[protocol].daysPerWeek;

  const schedule = useMemo(() => {
    const start = new Date(startDate + "T00:00:00");
    if (isNaN(start.getTime())) return { weeks: [], totalInjections: 0, endDate: "" };

    const totalDays = cycleWeeks * 7;
    const endDate = new Date(start);
    endDate.setDate(endDate.getDate() + totalDays - 1);

    const weeks: { weekNum: number; days: { date: Date; isInjection: boolean; dayOfWeek: number }[] }[] = [];
    let totalInjections = 0;

    for (let w = 0; w < cycleWeeks; w++) {
      const days: { date: Date; isInjection: boolean; dayOfWeek: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(start);
        date.setDate(date.getDate() + w * 7 + d);
        const isInjection = d < daysPerWeek;
        if (isInjection) totalInjections++;
        days.push({ date, isInjection, dayOfWeek: date.getDay() });
      }
      weeks.push({ weekNum: w + 1, days });
    }

    return {
      weeks,
      totalInjections,
      endDate: endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
  }, [startDate, cycleWeeks, daysPerWeek]);

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="bg-surface border border-border rounded-xl p-8">
      <h3 className="font-heading text-xl font-bold text-primary mb-1">
        Cycle Planner
      </h3>
      <p className="text-sm text-text-secondary mb-6">
        Generate an injection schedule for your protocol.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Protocol</label>
            <select value={protocol} onChange={(e) => setProtocol(e.target.value)} className={inputCls}>
              {Object.entries(PROTOCOL_PRESETS).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
          {protocol === "custom" && (
            <div>
              <label className={labelCls}>Days per week</label>
              <input type="number" value={customDays} onChange={(e) => setCustomDays(Math.max(1, Math.min(7, parseInt(e.target.value) || 1)))} min="1" max="7" className={inputCls} />
            </div>
          )}
          <div>
            <label className={labelCls}>Start date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Cycle length</label>
            <select value={cycleWeeks} onChange={(e) => setCycleWeeks(Number(e.target.value))} className={inputCls}>
              <option value={4}>4 weeks</option>
              <option value={6}>6 weeks</option>
              <option value={8}>8 weeks</option>
              <option value={12}>12 weeks</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-background rounded-lg p-3 text-center">
              <p className="text-xs text-text-secondary">Total injections</p>
              <p className="font-heading text-lg font-bold text-primary">{schedule.totalInjections}</p>
            </div>
            <div className="bg-background rounded-lg p-3 text-center">
              <p className="text-xs text-text-secondary">Cycle ends</p>
              <p className="text-sm font-semibold text-primary">{schedule.endDate}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
            {dayLabels.map((d, i) => (
              <span key={i} className="text-[10px] text-text-secondary font-semibold">{d}</span>
            ))}
          </div>
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {schedule.weeks.map((week) => (
              <div key={week.weekNum}>
                <p className="text-[10px] text-text-secondary mb-0.5">Wk {week.weekNum}</p>
                <div className="grid grid-cols-7 gap-0.5">
                  {week.days.map((day, i) => (
                    <div
                      key={i}
                      className={`h-8 rounded flex items-center justify-center text-[10px] font-medium ${
                        day.isInjection
                          ? "bg-secondary text-white"
                          : "bg-background text-text-secondary"
                      }`}
                    >
                      {day.date.getDate()}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-[10px] text-text-secondary">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-secondary inline-block" /> Injection day</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-background border border-border inline-block" /> Rest day</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        title="Resources"
        description="Calculators and tools for peptide research."
        breadcrumbs={[{ label: "Resources" }]}
      />

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <DosingCalculator />
        <ReconstitutionCalculator />
        <CyclePlanner />
      </section>
    </>
  );
}
