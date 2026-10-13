import "server-only";

import { formatAmount, formatNumber } from "@/lib/format";
import type { Listing, ListingResults } from "@/lib/listing";
import { SAMPLE_PAGE_SIZE, type SampleFilters } from "@/lib/markets/sample/filters";
import { PHOTO_POOLS, unsplash } from "@/lib/markets/sample/photos";
import type { PropertyTypeDef, SampleMarket, Seed } from "@/lib/markets/sample/types";

const listFormat = new Intl.ListFormat("en-GB", { type: "conjunction" });

/** Rotates through a pool so neighbouring listings don't share a cover photo. */
function pick(pool: string[], seed: Seed) {
  return pool[seed.id % pool.length];
}

function isLuxury(market: SampleMarket, seed: Seed) {
  return seed.price >= market.luxuryFrom[seed.purpose];
}

function photosFor(market: SampleMarket, seed: Seed, type: PropertyTypeDef) {
  const pools = { ...PHOTO_POOLS, ...market.photos };
  const luxury = isLuxury(market, seed);
  const interiors = [
    pick(luxury ? pools.luxuryLiving : pools.living, seed),
    pick(pools.kitchen, seed),
    pick(pools.bedroom, seed),
  ];
  switch (type.category) {
    case "land":
      return pools.land;
    case "small":
      return [pick(pools.small, seed), pick(pools.kitchen, seed), pick(pools.bedroom, seed)];
    case "house":
      return [pick(luxury ? pools.luxuryHouse : pools.house, seed), ...interiors];
    default:
      return [pick(pools[type.category], seed), ...interiors];
  }
}

/**
 * Lowercases a feature for use mid-sentence, leaving proper nouns alone:
 * "Swimming pool" → "swimming pool", but "Burj Khalifa view" and "DSQ" stay.
 */
function lowerFirst(feature: string) {
  const [first, second = ""] = feature.split(" ");
  const keep =
    first === first.toUpperCase() || /^[A-Z]/.test(second) || /^(Victorian|Georgian|Edwardian)$/.test(first);
  return keep ? feature : feature.charAt(0).toLowerCase() + feature.slice(1);
}

function plural(n: number | undefined, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

function titleFor(market: SampleMarket, seed: Seed, type: PropertyTypeDef) {
  if (seed.title) return seed.title;
  let base: string;
  if (type.category === "land") base = `${formatNumber(seed.size)} ${market.sizeUnit} Plot of Land`;
  else if (type.category === "small" || seed.beds == null) base = type.titleNoun ?? type.label;
  else base = `${seed.beds} Bedroom ${type.titleNoun ?? type.label}`;
  return seed.titleSuffix ? `${base} ${seed.titleSuffix}` : base;
}

function describe(market: SampleMarket, seed: Seed, type: PropertyTypeDef, title: string) {
  const area = market.areas[seed.area];
  const where = `${seed.street}, ${area.name}, ${area.city}`;
  const intro = `${title} ${seed.purpose === "sale" ? "for sale" : "to let"} on ${where}.`;
  const highlights = listFormat.format(seed.features.slice(0, 3).map(lowerFirst));
  const size = `${formatNumber(seed.size)} ${market.sizeUnit}`;

  let body: string;
  if (type.category === "land") {
    body = `The ${size} plot is ready for development. Highlights: ${highlights}.`;
  } else if (type.category === "small") {
    body = `A compact ${type.label.toLowerCase()} of about ${size}. Highlights: ${highlights}.`;
  } else {
    const rooms = [plural(seed.beds, "bedroom"), plural(seed.baths, "bathroom")];
    if (seed.toilets != null) rooms.push(plural(seed.toilets, "toilet"));
    body = `It has ${listFormat.format(rooms)} across about ${size}. Highlights: ${highlights}.`;
  }

  const charge = seed.serviceCharge
    ? `, plus ${market.serviceCharge.label.toLowerCase()} of ${formatAmount(seed.serviceCharge, market.currency)} a ${market.serviceCharge.period}`
    : "";
  const terms =
    seed.purpose === "sale"
      ? `${market.docLabel}: ${seed.doc}.`
      : `Rent is ${market.rentPeriod === "year" ? "paid yearly" : "quoted per month"}${charge}.`;

  return [intro, area.blurb, body, terms].join(" ");
}

function detailsFor(market: SampleMarket, seed: Seed, type: PropertyTypeDef) {
  const rows: [string, string | number | undefined][] = [
    ["Property type", type.label],
    ["Toilets", seed.toilets],
    ["Parking", seed.parking ? `${seed.parking} car${seed.parking === 1 ? "" : "s"}` : undefined],
    ["Furnishing", type.category === "land" ? undefined : seed.furnished ? "Furnished" : "Unfurnished"],
    ["Condition", seed.condition],
    [market.docLabel, seed.purpose === "sale" ? seed.doc : undefined],
    [
      market.serviceCharge.label,
      seed.serviceCharge
        ? `${formatAmount(seed.serviceCharge, market.currency)}/${market.serviceCharge.period}`
        : undefined,
    ],
    ...(seed.purpose === "rent" ? market.rentTerms : []),
    ...(seed.extras ?? []),
  ];
  return rows
    .filter((row): row is [string, string | number] => row[1] != null && row[1] !== "")
    .map(([label, value]) => ({ label, value: String(value) }));
}

function toListing(market: SampleMarket, seed: Seed): Listing {
  const area = market.areas[seed.area];
  const agent = market.agents[seed.agent];
  const type = market.types.find((t) => t.value === seed.type);
  if (!area || !agent || !type) throw new Error(`Bad seed ${market.code}-${seed.id}`);

  const title = titleFor(market, seed, type);
  const id = String(seed.id);

  return {
    id,
    href: `${market.basePath}/${id}`,
    reference: `Ref HS-${market.code}-${id}`,
    title,
    address: seed.street,
    locality: area.name === area.city ? area.city : `${area.name}, ${area.city}`,
    price: seed.price,
    currency: market.currency,
    pricePeriod: seed.purpose === "rent" ? market.rentPeriod : null,
    status: seed.purpose === "rent" ? { label: "For rent", tone: "blue" } : { label: "For sale", tone: "green" },
    typeLabel: type.label,
    beds: seed.beds ?? null,
    baths: seed.baths ?? null,
    area: { value: seed.size, unit: market.sizeUnit, kind: type.category === "land" ? "land" : "floor" },
    yearBuilt: null,
    photos: photosFor(market, seed, type).map(unsplash),
    description: describe(market, seed, type, title),
    listedAt: seed.listed,
    daysOnMarket: null,
    coords: { lat: area.lat, lng: area.lng },
    agent: {
      name: agent.name,
      company: agent.company,
      email: `${agent.name.toLowerCase().replaceAll(" ", ".")}@example.com`,
      phone: null,
    },
    details: detailsFor(market, seed, type),
    features: seed.features,
    schools: [],
    disclaimer:
      "Sample listing for demonstration. Prices are illustrative and agents are fictional. Photos from Unsplash.",
  };
}

type Entry = { seed: Seed; listing: Listing; region: string; city: string; haystack: string };

const entriesByMarket = new Map<string, Entry[]>();

function entriesFor(market: SampleMarket) {
  let entries = entriesByMarket.get(market.slug);
  if (!entries) {
    entries = market.seeds.map((seed) => {
      const listing = toListing(market, seed);
      const area = market.areas[seed.area];
      return {
        seed,
        listing,
        region: area.region,
        city: area.city,
        haystack: [listing.title, seed.street, area.name, area.city, listing.typeLabel, ...seed.features]
          .join(" ")
          .toLowerCase(),
      };
    });
    entriesByMarket.set(market.slug, entries);
  }
  return entries;
}

const newestFirst = (a: Entry, b: Entry) => b.seed.listed.localeCompare(a.seed.listed) || b.seed.id - a.seed.id;

export function searchSampleListings(market: SampleMarket, filters: SampleFilters): ListingResults {
  const words = filters.q?.toLowerCase().split(/\s+/).filter(Boolean) ?? [];

  const matches = entriesFor(market).filter(({ seed, region, haystack }) => {
    if (filters.purpose && seed.purpose !== filters.purpose) return false;
    if (filters.region && region !== filters.region) return false;
    if (filters.type && seed.type !== filters.type) return false;
    if (filters.minprice != null && seed.price < filters.minprice) return false;
    if (filters.maxprice != null && seed.price > filters.maxprice) return false;
    if (filters.minbeds != null && (seed.beds ?? 0) < filters.minbeds) return false;
    return words.every((word) => haystack.includes(word));
  });

  if (filters.sort === "price") matches.sort((a, b) => a.seed.price - b.seed.price);
  else if (filters.sort === "-price") matches.sort((a, b) => b.seed.price - a.seed.price);
  else matches.sort(newestFirst);

  const start = (filters.page - 1) * SAMPLE_PAGE_SIZE;
  return {
    listings: matches.slice(start, start + SAMPLE_PAGE_SIZE).map((e) => e.listing),
    hasNext: start + SAMPLE_PAGE_SIZE < matches.length,
    total: matches.length,
  };
}

export function getSampleListing(market: SampleMarket, id: string) {
  return entriesFor(market).find((e) => e.listing.id === id)?.listing ?? null;
}

export function getSampleListingIds(market: SampleMarket) {
  return entriesFor(market).map((e) => e.listing.id);
}

export function getNewestSampleListings(market: SampleMarket, count = 6) {
  return [...entriesFor(market)].sort(newestFirst).slice(0, count).map((e) => e.listing);
}

export function countSampleListingsByCity(market: SampleMarket) {
  const counts = new Map<string, { region: string; count: number }>();
  for (const { city, region } of entriesFor(market)) {
    counts.set(city, { region, count: (counts.get(city)?.count ?? 0) + 1 });
  }
  return [...counts].map(([city, { region, count }]) => ({ city, region, count }));
}

export function countSampleListings(market: SampleMarket) {
  return entriesFor(market).length;
}

/** First listing photo, for market cards on the international page. */
export function sampleMarketCover(market: SampleMarket) {
  return [...entriesFor(market)].sort(newestFirst)[0]?.listing.photos[0] ?? null;
}
