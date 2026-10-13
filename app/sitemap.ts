import type { MetadataRoute } from "next";

import { getAgents } from "@/lib/agents";
import { PURPOSE_SEGMENTS, areasFor, purposeFromSegment, statesFor, type PurposeSegment } from "@/lib/locations";
import { HOME_MARKET } from "@/lib/markets/sample";
import { getSampleListings } from "@/lib/markets/sample/listings";
import { SITE_URL } from "@/lib/site";
import { agentPath, areaGuidePath, locationPath } from "@/lib/urls";

/** Every URL generated from the dynamic routes, served at /sitemap.xml. */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${SITE_URL}${path}`;

  const pages = ["/", "/properties", "/international", "/areas", "/agents"].map((path) => ({ url: url(path) }));

  const properties = getSampleListings(HOME_MARKET).map((listing) => ({
    url: url(listing.href),
    lastModified: listing.listedAt ?? undefined,
  }));

  const locations = (Object.keys(PURPOSE_SEGMENTS) as PurposeSegment[]).flatMap((segment) => {
    const purpose = purposeFromSegment(segment)!;
    return [
      locationPath(segment),
      ...statesFor(purpose).flatMap((state) => [
        locationPath(segment, state.value),
        ...areasFor(state.value, purpose).map((area) => locationPath(segment, state.value, area.slug)),
      ]),
    ];
  });

  const areaGuides = statesFor().flatMap((state) => [
    areaGuidePath(state.value),
    ...areasFor(state.value).map((area) => areaGuidePath(state.value, area.slug)),
  ]);

  const agents = getAgents().map((agent) => agentPath(agent.name));

  return [...pages, ...properties, ...[...locations, ...areaGuides, ...agents].map((path) => ({ url: url(path) }))];
}
