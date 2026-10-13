import { ghana } from "@/lib/markets/sample/data/ghana";
import { kenya } from "@/lib/markets/sample/data/kenya";
import { nigeria } from "@/lib/markets/sample/data/nigeria";
import { southAfrica } from "@/lib/markets/sample/data/south-africa";
import { uae } from "@/lib/markets/sample/data/uae";
import { uk } from "@/lib/markets/sample/data/uk";

/** The site's main market, served at /properties. */
export const HOME_MARKET = nigeria;

/** Sample markets served at /international/[slug]. */
export const INTERNATIONAL_MARKETS = [uk, uae, ghana, kenya, southAfrica];

export function getInternationalMarket(slug: string) {
  return INTERNATIONAL_MARKETS.find((m) => m.slug === slug) ?? null;
}
