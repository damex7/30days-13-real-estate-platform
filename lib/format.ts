const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});

const number = new Intl.NumberFormat("en-US");

const date = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatPrice(value: number | null) {
  return value == null ? "Price on request" : currency.format(value);
}

export function formatPriceCompact(value: number) {
  return compactCurrency.format(value);
}

export function formatNumber(value: number) {
  return number.format(value);
}

export function formatDate(value: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : date.format(parsed);
}

/** Collapses full and half baths into the usual "2.5" style count. */
export function formatBaths(full: number | null, half: number | null) {
  if (full == null && half == null) return null;
  return String((full ?? 0) + (half ?? 0) * 0.5);
}

const TYPE_LABELS: Record<string, string> = {
  RES: "Single family",
  CND: "Condo",
  RNT: "Rental",
  MLF: "Multi-family",
  CRE: "Commercial",
  LND: "Land",
  FRM: "Farm",
};

export function formatPropertyType(code: string | null) {
  if (!code) return null;
  return TYPE_LABELS[code] ?? code;
}
