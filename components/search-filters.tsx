import { Search } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import type { ReactNode } from "react";

import {
  BATH_OPTIONS,
  BED_OPTIONS,
  PRICE_OPTIONS,
  PROPERTY_TYPES,
  SORT_OPTIONS,
  buildListingsHref,
  hasActiveFilters,
  type ListingFilters,
} from "@/lib/filters";
import { formatPriceCompact } from "@/lib/format";

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

export function SearchFilters({ filters }: { filters: ListingFilters }) {
  return (
    // Keyed by the current URL so uncontrolled fields reset after navigation.
    <Form
      key={buildListingsHref(filters)}
      action="/properties"
      className="space-y-4 rounded-xl border border-line bg-surface p-4"
    >
      <Field label="Keyword" htmlFor="q">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={filters.q}
            placeholder="City, ZIP, street, MLS #"
            className="field pl-9"
          />
        </div>
      </Field>

      <Field label="Property type" htmlFor="type">
        <select id="type" name="type" defaultValue={filters.type ?? ""} className="field">
          <option value="">Any type</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Min price" htmlFor="minprice">
          <select id="minprice" name="minprice" defaultValue={filters.minprice ?? ""} className="field">
            <option value="">No min</option>
            {PRICE_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {formatPriceCompact(p)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Max price" htmlFor="maxprice">
          <select id="maxprice" name="maxprice" defaultValue={filters.maxprice ?? ""} className="field">
            <option value="">No max</option>
            {PRICE_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {formatPriceCompact(p)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Beds" htmlFor="minbeds">
          <select id="minbeds" name="minbeds" defaultValue={filters.minbeds ?? ""} className="field">
            <option value="">Any</option>
            {BED_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}+
              </option>
            ))}
          </select>
        </Field>
        <Field label="Baths" htmlFor="minbaths">
          <select id="minbaths" name="minbaths" defaultValue={filters.minbaths ?? ""} className="field">
            <option value="">Any</option>
            {BATH_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}+
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Sort by" htmlFor="sort">
        <select id="sort" name="sort" defaultValue={filters.sort} className="field">
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          className="h-10 flex-1 rounded-lg bg-brand px-4 text-sm font-medium text-brand-foreground transition hover:bg-brand-hover"
        >
          Apply filters
        </button>
        {hasActiveFilters(filters) && (
          <Link href="/properties" className="text-sm text-muted underline-offset-2 hover:text-foreground hover:underline">
            Clear
          </Link>
        )}
      </div>
    </Form>
  );
}
