import type { Currency } from "@/lib/listing";
import type { Option } from "@/lib/search-params";

/** Which photo pool a property type draws from. */
export type PhotoCategory = "house" | "bungalow" | "flat" | "small" | "land";

export type PropertyTypeDef = Option & {
  category: PhotoCategory;
  /** Noun used in generated titles, e.g. "Semi-Detached House". Omit for types titled by name alone. */
  titleNoun?: string;
};

export type Area = {
  name: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  blurb: string;
};

export type Agent = { name: string; company: string };

export type Seed = {
  id: number;
  purpose: "sale" | "rent";
  type: string;
  beds?: number;
  baths?: number;
  /** Nigerian listings count toilets separately from bathrooms. */
  toilets?: number;
  area: string;
  street: string;
  /** In the market's currency; rent is per the market's rent period. */
  price: number;
  /** Floor area, or plot size for land, in the market's size unit. */
  size: number;
  listed: string;
  agent: string;
  features: string[];
  /** Appended to the generated title, e.g. "with BQ". */
  titleSuffix?: string;
  /** Replaces the generated title. */
  title?: string;
  /** Ownership document or tenure, for sales. */
  doc?: string;
  /** Recurring service charge or levy, in the market's currency. */
  serviceCharge?: number;
  furnished?: boolean;
  condition?: string;
  parking?: number;
  /** Extra detail rows, e.g. ["EPC rating", "C"]. */
  extras?: [string, string][];
};

export type SampleMarket = {
  /** URL segment under /international, or "ng" for the home market. */
  slug: string;
  code: string;
  name: string;
  /** Name as used after "in", e.g. "the United Kingdom". Defaults to `name`. */
  placeName?: string;
  basePath: string;
  currency: Currency;
  rentPeriod: "year" | "month";
  sizeUnit: "sqm" | "sq ft";
  /** "State", "Emirate", "County"… */
  regionLabel: string;
  regions: readonly Option[];
  types: readonly PropertyTypeDef[];
  areas: Record<string, Area>;
  agents: Record<string, Agent>;
  seeds: Seed[];
  priceOptions: number[];
  /** Label for `Seed.doc`, e.g. "Title document" or "Tenure". */
  docLabel: string;
  serviceCharge: { label: string; period: "year" | "month" };
  /** Standard fee and deposit rows shown on every rental. */
  rentTerms: [string, string][];
  /** Price above which houses get the luxury photo set. */
  luxuryFrom: { sale: number; rent: number };
  /** Market-specific photo pools that replace the defaults. */
  photos?: Partial<Record<PhotoCategory | "luxuryHouse", string[]>>;
  keywordPlaceholder: string;
  tagline: string;
};
