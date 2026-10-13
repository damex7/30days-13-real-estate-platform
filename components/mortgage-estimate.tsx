"use client";

import { useState } from "react";

import { formatAmount } from "@/lib/format";
import type { Currency } from "@/lib/listing";

const INPUTS = [
  { key: "deposit", label: "Deposit", suffix: "%", min: 0, max: 100, step: 1 },
  { key: "rate", label: "Interest rate", suffix: "% a year", min: 0, max: 50, step: 0.5 },
  { key: "years", label: "Term", suffix: "years", min: 1, max: 30, step: 1 },
] as const;

type InputKey = (typeof INPUTS)[number]["key"];

/** Standard amortized repayment: P·r / (1 − (1 + r)^−n), with r and n monthly. */
function monthlyRepayment(loan: number, annualRate: number, years: number) {
  const n = years * 12;
  const r = annualRate / 100 / 12;
  if (loan <= 0 || n <= 0) return 0;
  if (r === 0) return loan / n;
  return (loan * r) / (1 - (1 + r) ** -n);
}

/** A simple repayment estimate for a property for sale. Client-side so it updates as you type. */
export function MortgageEstimate({ price, currency }: { price: number; currency: Currency }) {
  // Raw input text, so a field can be cleared and retyped; it's clamped when used.
  const [raw, setRaw] = useState<Record<InputKey, string>>({ deposit: "30", rate: "18", years: "20" });
  const value = (key: InputKey) => {
    const { min, max } = INPUTS.find((i) => i.key === key)!;
    const n = Number(raw[key]);
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
  };

  const deposit = Math.round((price * value("deposit")) / 100);
  const loan = price - deposit;
  const monthly = monthlyRepayment(loan, value("rate"), value("years"));

  const rows = [
    { label: "Deposit", value: formatAmount(deposit, currency) },
    { label: "Loan amount", value: formatAmount(loan, currency) },
  ];

  return (
    <section className="mt-10 rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Mortgage estimate</h2>
        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900">Estimate</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {INPUTS.map((input) => (
          <div key={input.key} className="space-y-1.5">
            <label htmlFor={`mortgage-${input.key}`} className="text-xs font-medium text-muted">
              {input.label} ({input.suffix})
            </label>
            <input
              id={`mortgage-${input.key}`}
              type="number"
              inputMode="decimal"
              min={input.min}
              max={input.max}
              step={input.step}
              value={raw[input.key]}
              onChange={(e) => setRaw((v) => ({ ...v, [input.key]: e.target.value }))}
              className="field"
            />
          </div>
        ))}
      </div>

      <dl className="mt-4 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4 border-b border-line py-2.5">
            <dt className="text-muted">{row.label}</dt>
            <dd className="font-medium">{row.value}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-4 pt-3 text-base">
          <dt className="font-semibold">Monthly repayment</dt>
          <dd className="font-semibold text-brand">{formatAmount(Math.round(monthly), currency)}</dd>
        </div>
      </dl>

      <p className="mt-3 text-xs text-muted">
        Estimate only, not a mortgage offer. Real rates, fees, terms and eligibility depend on the lender.
      </p>
    </section>
  );
}
