import type { Currency, Listing } from "@/lib/listing";

const LOCALES: Record<Currency, string> = {
  NGN: "en-NG",
  USD: "en-US",
  GBP: "en-GB",
  AED: "en-AE",
  GHS: "en-GH",
  KES: "en-KE",
  ZAR: "en-ZA",
};

const fullFormatters = new Map<Currency, Intl.NumberFormat>();
const compactFormatters = new Map<Currency, Intl.NumberFormat>();

function formatter(cache: Map<Currency, Intl.NumberFormat>, currency: Currency, compact: boolean) {
  let f = cache.get(currency);
  if (!f) {
    f = new Intl.NumberFormat(LOCALES[currency], {
      style: "currency",
      currency,
      maximumFractionDigits: compact ? 2 : 0,
      ...(compact && { notation: "compact" }),
    });
    cache.set(currency, f);
  }
  return f;
}

const number = new Intl.NumberFormat("en-US");

const date = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatPrice(listing: Pick<Listing, "price" | "currency" | "pricePeriod">) {
  if (listing.price == null) return "Price on request";
  const amount = formatter(fullFormatters, listing.currency, false).format(listing.price);
  return listing.pricePeriod ? `${amount}/${listing.pricePeriod}` : amount;
}

export function formatAmount(value: number, currency: Currency) {
  return formatter(fullFormatters, currency, false).format(value);
}

export function formatPriceCompact(value: number, currency: Currency) {
  return formatter(compactFormatters, currency, true).format(value);
}

export function formatNumber(value: number) {
  return number.format(value);
}

export function formatDate(value: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : date.format(parsed);
}
