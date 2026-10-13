"use client";

import { useState } from "react";

import { formatAmount } from "@/lib/format";
import type { Currency } from "@/lib/listing";

const FEES = [
  { key: "agency", label: "Agency fee" },
  { key: "legal", label: "Legal fee" },
  { key: "caution", label: "Caution deposit" },
] as const;

type FeeKey = (typeof FEES)[number]["key"];

/** Reads a percentage input, keeping it between 0 and 100. */
function toPercent(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
}

/**
 * Upfront cost of a Nigerian rental: a year's rent plus agency, legal and
 * caution fees, each a percentage of the rent. Client-side so the percentages
 * update the total as you type.
 */
export function MoveInCost({ rent, currency }: { rent: number; currency: Currency }) {
  // Raw input text, so a field can be cleared and retyped; it's clamped when used.
  const [percents, setPercents] = useState<Record<FeeKey, string>>({ agency: "10", legal: "10", caution: "10" });

  const fees = FEES.map((fee) => ({ ...fee, amount: Math.round((rent * toPercent(percents[fee.key])) / 100) }));
  const total = rent + fees.reduce((sum, fee) => sum + fee.amount, 0);

  return (
    <section className="mt-10 rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Total move-in cost</h2>
        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900">Estimate</span>
      </div>

      <dl className="mt-4 text-sm">
        <div className="flex justify-between gap-4 border-b border-line py-2.5">
          <dt className="text-muted">Yearly rent</dt>
          <dd className="font-medium">{formatAmount(rent, currency)}</dd>
        </div>
        {fees.map((fee) => (
          <div key={fee.key} className="flex items-center justify-between gap-4 border-b border-line py-2">
            <dt className="flex items-center gap-2 text-muted">
              <label htmlFor={`fee-${fee.key}`}>{fee.label}</label>
              <span className="flex items-center gap-1">
                <input
                  id={`fee-${fee.key}`}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={100}
                  step={0.5}
                  value={percents[fee.key]}
                  onChange={(e) => setPercents((p) => ({ ...p, [fee.key]: e.target.value }))}
                  className="field h-8 w-16 px-2 text-right"
                />
                %
              </span>
            </dt>
            <dd className="font-medium">{formatAmount(fee.amount, currency)}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-4 pt-3 text-base">
          <dt className="font-semibold">Total to move in</dt>
          <dd className="font-semibold text-brand">{formatAmount(total, currency)}</dd>
        </div>
      </dl>

      <p className="mt-3 text-xs text-muted">
        Estimate only. Fees are negotiable and vary by agent and landlord, and a service charge may apply on top.
        Confirm the final figures in writing before paying anything.
      </p>
    </section>
  );
}
