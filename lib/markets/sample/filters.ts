import { z } from "zod";

import { formatPriceCompact } from "@/lib/format";
import type { SampleMarket } from "@/lib/markets/sample/types";
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

export const SAMPLE_PAGE_SIZE = 12;

export const PURPOSES = [
  { value: "sale", label: "For sale" },
  { value: "rent", label: "For rent" },
] as const;

export const SAMPLE_SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price", label: "Price: low to high" },
  { value: "-price", label: "Price: high to low" },
] as const;

const BED_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n}+` }));

const DEFAULTS = { sort: "newest", page: 1 } as const;

function schemaFor(market: SampleMarket) {
  return z
    .object({
      q: textParam(80),
      purpose: enumParam(PURPOSES),
      region: enumParam(market.regions),
      type: enumParam(market.types),
      minprice: intParam(0, 100_000_000_000),
      maxprice: intParam(0, 100_000_000_000),
      minbeds: intParam(0, 20),
      sort: enumParam(SAMPLE_SORT_OPTIONS),
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
}

export type SampleFilters = z.output<ReturnType<typeof schemaFor>>;

const schemas = new Map<string, ReturnType<typeof schemaFor>>();

export function parseSampleFilters(market: SampleMarket, searchParams: RawSearchParams): SampleFilters {
  let schema = schemas.get(market.slug);
  if (!schema) {
    schema = schemaFor(market);
    schemas.set(market.slug, schema);
  }
  return schema.parse(searchParams);
}

export function sampleListingsHref(
  market: SampleMarket,
  filters: Partial<SampleFilters>,
  overrides: Partial<SampleFilters> = {},
) {
  return buildHref(market.basePath, { ...filters, ...overrides }, DEFAULTS);
}

/** Like sampleListingsHref, for /buy and /rent pages whose path already holds the purpose and state. */
export function sampleLocationHref(
  path: string,
  filters: Partial<SampleFilters>,
  overrides: Partial<SampleFilters> = {},
) {
  return buildHref(path, { ...filters, ...overrides, purpose: undefined, region: undefined }, DEFAULTS);
}

export function hasActiveSampleFilters({ q, purpose, region, type, minprice, maxprice, minbeds }: SampleFilters) {
  return [q, purpose, region, type, minprice, maxprice, minbeds].some((v) => v != null);
}

export function samplePriceOptions(market: SampleMarket) {
  return market.priceOptions.map((p) => ({ value: String(p), label: formatPriceCompact(p, market.currency) }));
}

/** "Flat / apartment listings for rent in Lagos" style heading for a search. */
export function describeSampleSearch(market: SampleMarket, { purpose, region, type }: SampleFilters) {
  const what = type ? `${labelFor(market.types, type)} listings` : "Properties";
  const why = purpose === "rent" ? " for rent" : purpose === "sale" ? " for sale" : "";
  const where = ` in ${(region && labelFor(market.regions, region)) || (market.placeName ?? market.name)}`;
  return `${what}${why}${where}`;
}

export function sampleFilterFields(market: SampleMarket, filters: SampleFilters): SelectField[] {
  const prices = samplePriceOptions(market);
  return [
    { name: "purpose", label: "Buy or rent", anyLabel: "Buy or rent", options: PURPOSES, value: filters.purpose, half: true },
    { name: "region", label: market.regionLabel, anyLabel: "Anywhere", options: market.regions, value: filters.region, half: true },
    { name: "type", label: "Property type", anyLabel: "Any type", options: market.types, value: filters.type },
    { name: "minprice", label: "Min price", anyLabel: "No min", options: prices, value: filters.minprice, half: true },
    { name: "maxprice", label: "Max price", anyLabel: "No max", options: prices, value: filters.maxprice, half: true },
    { name: "minbeds", label: "Bedrooms", anyLabel: "Any", options: BED_OPTIONS, value: filters.minbeds },
  ];
}
