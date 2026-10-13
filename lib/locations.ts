import "server-only";

import { notFound } from "next/navigation";

import type { Crumb } from "@/components/breadcrumbs";
import { HOME_MARKET } from "@/lib/markets/sample";
import { getSampleListing } from "@/lib/markets/sample/listings";
import type { Area, Seed } from "@/lib/markets/sample/types";
import type { Option } from "@/lib/search-params";
import { locationPath, slugify } from "@/lib/urls";

/** URL segment → the purpose used in the data. */
export const PURPOSE_SEGMENTS = { buy: "sale", rent: "rent" } as const;

export type PurposeSegment = keyof typeof PURPOSE_SEGMENTS;
type Purpose = Seed["purpose"];

const PURPOSE_LABELS: Record<PurposeSegment, string> = { buy: "Buy", rent: "Rent" };

export type AreaEntry = { key: string; slug: string; state: string; area: Area };

const AREAS: AreaEntry[] = Object.entries(HOME_MARKET.areas).map(([key, area]) => ({
  key,
  slug: slugify(area.name),
  state: area.region,
  area,
}));

const seeds = HOME_MARKET.seeds;

export function purposeFromSegment(segment: string): Purpose | null {
  return Object.hasOwn(PURPOSE_SEGMENTS, segment) ? PURPOSE_SEGMENTS[segment as PurposeSegment] : null;
}

export function segmentFor(purpose: Purpose): PurposeSegment {
  return purpose === "sale" ? "buy" : "rent";
}

const matches = (seed: Seed, purpose: Purpose | undefined) => !purpose || seed.purpose === purpose;

/** States with at least one listing, optionally for one purpose. */
export function statesFor(purpose?: Purpose): Option[] {
  return HOME_MARKET.regions.filter((r) =>
    seeds.some((s) => matches(s, purpose) && HOME_MARKET.areas[s.area].region === r.value),
  );
}

/** Areas in a state with at least one listing, optionally for one purpose. */
export function areasFor(state: string, purpose?: Purpose) {
  return AREAS.filter((a) => a.state === state && seeds.some((s) => s.area === a.key && matches(s, purpose)));
}

export type Location = {
  purpose: Purpose;
  segment: PurposeSegment;
  state?: Option;
  area?: AreaEntry;
  path: string;
  crumbs: Crumb[];
  /** "Lekki Phase 1, Lagos", "Lagos" or "Nigeria". */
  placeName: string;
  /** "for rent" or "for sale". */
  purposePhrase: string;
  /** "Flats and houses for rent in Lekki Phase 1, Lagos". */
  heading: string;
};

/**
 * Turns /[purpose]/[state]/[area] params into a location, or 404s. The routes
 * already limit params with dynamicParams = false; checking again here keeps
 * the page safe on its own and narrows the plain strings to known values.
 */
export function resolveLocation(params: { purpose: string; state?: string; area?: string }): Location {
  const segment = params.purpose as PurposeSegment;
  const purpose = purposeFromSegment(params.purpose) ?? notFound();
  const state =
    params.state === undefined
      ? undefined
      : (statesFor(purpose).find((r) => r.value === params.state) ?? notFound());
  const area =
    params.area === undefined || !state
      ? undefined
      : (areasFor(state.value, purpose).find((a) => a.slug === params.area) ?? notFound());

  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: PURPOSE_LABELS[segment], href: locationPath(segment) },
  ];
  if (state) crumbs.push({ label: state.label, href: locationPath(segment, state.value) });
  if (state && area) crumbs.push({ label: area.area.name, href: locationPath(segment, state.value, area.slug) });

  const placeName = area ? `${area.area.name}, ${area.area.city}` : (state?.label ?? HOME_MARKET.name);
  const purposePhrase = purpose === "rent" ? "for rent" : "for sale";
  const what = purpose === "rent" ? "Flats and houses" : "Homes and land";

  return {
    purpose,
    segment,
    state,
    area,
    path: locationPath(segment, state?.value, area?.slug),
    crumbs,
    placeName,
    purposePhrase,
    heading: `${what} ${purposePhrase} in ${placeName}`,
  };
}

/** The next level down: states under /rent, areas under /rent/lagos. */
export function childLocations(location: Location): Option[] {
  const { segment, purpose, state, area } = location;
  if (area) return [];
  if (state) {
    return areasFor(state.value, purpose).map((a) => ({
      label: a.area.name,
      value: locationPath(segment, state.value, a.slug),
    }));
  }
  return statesFor(purpose).map((s) => ({ label: s.label, value: locationPath(segment, s.value) }));
}

const average = (list: Seed[]) =>
  list.length ? Math.round(list.reduce((sum, s) => sum + s.price, 0) / list.length) : null;

/** Listing counts and average prices for one area, calculated from the data. */
export function areaStats(areaKey: string) {
  const inArea = seeds.filter((s) => s.area === areaKey);
  const rentals = inArea.filter((s) => s.purpose === "rent");
  // Land is priced per plot, not per home, so it would skew the sale average.
  const homesForSale = inArea.filter((s) => s.purpose === "sale" && s.type !== "land");
  return {
    total: inArea.length,
    rent: { average: average(rentals), count: rentals.length },
    sale: { average: average(homesForSale), count: homesForSale.length },
    landCount: inArea.filter((s) => s.type === "land").length,
  };
}

/** All listings in an area, newest first. */
export function listingsInArea(areaKey: string) {
  return [...seeds]
    .filter((s) => s.area === areaKey)
    .sort((a, b) => b.listed.localeCompare(a.listed))
    .map((s) => getSampleListing(HOME_MARKET, String(s.id)))
    .filter((listing) => listing != null);
}

export function countListingsInState(state: string) {
  return seeds.filter((s) => HOME_MARKET.areas[s.area].region === state).length;
}

/** Home › Buy › Lagos › Lekki Phase 1 › title, for a property page. */
export function listingCrumbs(id: string, title: string): Crumb[] {
  const seed = seeds.find((s) => String(s.id) === id);
  const entry = seed && AREAS.find((a) => a.key === seed.area);
  if (!seed || !entry) return [{ label: "Home", href: "/" }, { label: title }];

  const segment = segmentFor(seed.purpose);
  const state = HOME_MARKET.regions.find((r) => r.value === entry.state);
  return [
    { label: "Home", href: "/" },
    { label: PURPOSE_LABELS[segment], href: locationPath(segment) },
    { label: state?.label ?? entry.area.city, href: locationPath(segment, entry.state) },
    { label: entry.area.name, href: locationPath(segment, entry.state, entry.slug) },
    { label: title },
  ];
}
