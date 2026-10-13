import "server-only";

import type { Listing } from "@/lib/listing";
import { HOME_MARKET } from "@/lib/markets/sample";
import { getSampleListing } from "@/lib/markets/sample/listings";
import { slugify } from "@/lib/urls";

export type AgentProfile = {
  slug: string;
  name: string;
  company: string;
  email: string | null;
  listings: Listing[];
  forSale: number;
  toRent: number;
};

/** Home-market agents with their listings, newest first. */
export function getAgents(): AgentProfile[] {
  return Object.entries(HOME_MARKET.agents).map(([key, agent]) => {
    const seeds = HOME_MARKET.seeds
      .filter((s) => s.agent === key)
      .sort((a, b) => b.listed.localeCompare(a.listed));
    const listings = seeds
      .map((s) => getSampleListing(HOME_MARKET, String(s.id)))
      .filter((listing) => listing != null);
    return {
      slug: slugify(agent.name),
      name: agent.name,
      company: agent.company,
      email: listings[0]?.agent?.email ?? null,
      listings,
      forSale: seeds.filter((s) => s.purpose === "sale").length,
      toRent: seeds.filter((s) => s.purpose === "rent").length,
    };
  });
}

export function findAgent(slug: string) {
  return getAgents().find((agent) => agent.slug === slug) ?? null;
}
