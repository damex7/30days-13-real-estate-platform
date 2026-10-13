import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ListingDetail, listingMetadata } from "@/components/listing-detail";
import { INTERNATIONAL_MARKETS, getInternationalMarket } from "@/lib/markets/sample";
import { getSampleListing, getSampleListingIds } from "@/lib/markets/sample/listings";

type Props = PageProps<"/international/[country]/[id]">;

// Every sample listing is prerendered; unknown countries or ids 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return INTERNATIONAL_MARKETS.flatMap((market) =>
    getSampleListingIds(market).map((id) => ({ country: market.slug, id })),
  );
}

async function load(params: Props["params"]) {
  const { country, id } = await params;
  const market = getInternationalMarket(country);
  const listing = market && getSampleListing(market, id);
  if (!market || !listing) notFound();
  return { market, listing };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return listingMetadata((await load(params)).listing);
}

export default async function InternationalListingPage({ params }: Props) {
  const { market, listing } = await load(params);
  return <ListingDetail listing={listing} backHref={market.basePath} />;
}
