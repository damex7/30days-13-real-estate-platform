import { z } from "zod";

import { formatPriceCompact } from "@/lib/format";
import {
  buildHref,
  enumParam,
  intParam,
  labelFor,
  orderedRange,
  textParam,
  type RawSearchParams,
  type SelectField,
} from "@/lib/search-params";

export const US_BASE_PATH = "/international/us";
export const US_PAGE_SIZE = 12;

/**
 * Values accepted by the SimplyRETS `type` query param. Condos are left out on
 * purpose: the API's condo values return a mix of RES and CND listings.
 */
export const US_PROPERTY_TYPES = [
  { value: "residential", label: "Single family" },
  { value: "rental", label: "Rentals" },
  { value: "multifamily", label: "Multi-family" },
  { value: "commercial", label: "Commercial" },
  { value: "land", label: "Land" },
  { value: "farm", label: "Farm & ranch" },
] as const;

export const US_SORT_OPTIONS = [
  { value: "-listdate", label: "Newest" },
  { value: "listprice", label: "Price: low to high" },
  { value: "-listprice", label: "Price: high to low" },
] as const;

const PRICE_OPTIONS = [
  100_000, 250_000, 500_000, 750_000, 1_000_000, 2_500_000, 5_000_000, 10_000_000, 20_000_000,
].map((p) => ({ value: String(p), label: formatPriceCompact(p, "USD") }));
const BED_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n}+` }));
const BATH_OPTIONS = [1, 2, 3, 4].map((n) => ({ value: String(n), label: `${n}+` }));

const DEFAULTS = { sort: "-listdate", page: 1 } as const;

const schema = z
  .object({
    q: textParam(80),
    type: enumParam(US_PROPERTY_TYPES),
    minprice: intParam(0, 1_000_000_000),
    maxprice: intParam(0, 1_000_000_000),
    minbeds: intParam(0, 20),
    minbaths: intParam(0, 20),
    sort: enumParam(US_SORT_OPTIONS),
    page: intParam(1, 50),
  })
  .transform(({ minprice, maxprice, sort, page, ...rest }) => {
    const range = orderedRange(minprice, maxprice);
    return {
      ...rest,
      minprice: range.min,
      maxprice: range.max,
      sort: sort ?? DEFAULTS.sort,
      page: page ?? DEFAULTS.page,
    };
  });

export type UsFilters = z.output<typeof schema>;

export function parseUsFilters(searchParams: RawSearchParams) {
  return schema.parse(searchParams);
}

export function usListingsHref(filters: UsFilters, overrides: Partial<UsFilters> = {}) {
  return buildHref(US_BASE_PATH, { ...filters, ...overrides }, DEFAULTS);
}

export function hasActiveUsFilters({ q, type, minprice, maxprice, minbeds, minbaths }: UsFilters) {
  return [q, type, minprice, maxprice, minbeds, minbaths].some((v) => v != null);
}

export function usTypeLabel(type: string | undefined) {
  return labelFor(US_PROPERTY_TYPES, type);
}

export function usFilterFields(filters: UsFilters): SelectField[] {
  return [
    { name: "type", label: "Property type", anyLabel: "Any type", options: US_PROPERTY_TYPES, value: filters.type },
    { name: "minprice", label: "Min price", anyLabel: "No min", options: PRICE_OPTIONS, value: filters.minprice, half: true },
    { name: "maxprice", label: "Max price", anyLabel: "No max", options: PRICE_OPTIONS, value: filters.maxprice, half: true },
    { name: "minbeds", label: "Beds", anyLabel: "Any", options: BED_OPTIONS, value: filters.minbeds, half: true },
    { name: "minbaths", label: "Baths", anyLabel: "Any", options: BATH_OPTIONS, value: filters.minbaths, half: true },
  ];
}
