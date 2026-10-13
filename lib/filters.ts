import { z } from "zod";

export const PAGE_SIZE = 12;
const MAX_PAGE = 50;

/**
 * Values accepted by the SimplyRETS `type` query param. Condos are left out on
 * purpose: the API's condo values return a mix of RES and CND listings.
 */
export const PROPERTY_TYPES = [
  { value: "residential", label: "Single family" },
  { value: "rental", label: "Rentals" },
  { value: "multifamily", label: "Multi-family" },
  { value: "commercial", label: "Commercial" },
  { value: "land", label: "Land" },
  { value: "farm", label: "Farm & ranch" },
] as const;

export const SORT_OPTIONS = [
  { value: "-listdate", label: "Newest" },
  { value: "listprice", label: "Price: low to high" },
  { value: "-listprice", label: "Price: high to low" },
] as const;

export const PRICE_OPTIONS = [
  100_000, 250_000, 500_000, 750_000, 1_000_000, 2_500_000, 5_000_000,
  10_000_000, 20_000_000,
];
export const BED_OPTIONS = [1, 2, 3, 4, 5];
export const BATH_OPTIONS = [1, 2, 3, 4];

export type PropertyType = (typeof PROPERTY_TYPES)[number]["value"];
export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

const DEFAULT_SORT: SortValue = "-listdate";

/** Search params arrive as `string | string[] | undefined`; blank means unset. */
function firstValue(value: unknown) {
  const v = Array.isArray(value) ? value[0] : value;
  return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
}

function intParam(min: number, max: number) {
  return z
    .preprocess(firstValue, z.coerce.number().int().min(min).max(max).optional())
    .catch(undefined);
}

function enumParam<const T extends readonly { value: string }[]>(options: T) {
  const values = options.map((o) => o.value) as [T[number]["value"], ...T[number]["value"][]];
  return z.preprocess(firstValue, z.enum(values).optional()).catch(undefined);
}

const filtersSchema = z
  .object({
    q: z.preprocess(firstValue, z.string().max(80).optional()).catch(undefined),
    type: enumParam(PROPERTY_TYPES),
    minprice: intParam(0, 1_000_000_000),
    maxprice: intParam(0, 1_000_000_000),
    minbeds: intParam(0, 20),
    minbaths: intParam(0, 20),
    sort: enumParam(SORT_OPTIONS),
    page: intParam(1, MAX_PAGE),
  })
  .transform(({ minprice, maxprice, sort, page, ...rest }) => {
    // Forgive a reversed price range instead of returning nothing.
    const swap = minprice != null && maxprice != null && minprice > maxprice;
    return {
      ...rest,
      minprice: swap ? maxprice : minprice,
      maxprice: swap ? minprice : maxprice,
      sort: sort ?? DEFAULT_SORT,
      page: page ?? 1,
    };
  });

export type ListingFilters = z.output<typeof filtersSchema>;

export function parseFilters(searchParams: Record<string, string | string[] | undefined>) {
  return filtersSchema.parse(searchParams);
}

/** Serializes filters back into a `/properties` URL, omitting defaults. */
export function buildListingsHref(
  filters: ListingFilters,
  overrides: Partial<ListingFilters> = {},
) {
  const merged = { ...filters, ...overrides };
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(merged)) {
    if (value == null) continue;
    if (key === "sort" && value === DEFAULT_SORT) continue;
    if (key === "page" && value === 1) continue;
    params.set(key, String(value));
  }
  const query = params.toString();
  return query ? `/properties?${query}` : "/properties";
}

export function hasActiveFilters(filters: ListingFilters) {
  const { q, type, minprice, maxprice, minbeds, minbaths } = filters;
  return [q, type, minprice, maxprice, minbeds, minbaths].some((v) => v != null);
}

export function propertyTypeLabel(type: PropertyType | undefined) {
  return PROPERTY_TYPES.find((t) => t.value === type)?.label;
}
