/** Builds the readable URLs used across the home market. */

/** "Lekki Phase 1" → "lekki-phase-1", "Chevron, Lekki" → "chevron-lekki". */
export function slugify(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Readable property URL that ends in the listing id, e.g.
 * /properties/4-bedroom-semi-detached-duplex-lekki-phase-1-1006. Only the id is
 * used for the lookup; the words before it are for people and search engines.
 */
export function propertyPath(headline: string, areaName: string, id: string) {
  return `/properties/${slugify(`${headline} ${areaName}`)}-${id}`;
}

/** The trailing id of a property slug, so "…-lekki-phase-1-1006" and a bare "1006" both give "1006". */
export function idFromPropertySlug(slug: string) {
  return /(?:^|-)(\d+)$/.exec(slug)?.[1] ?? null;
}
