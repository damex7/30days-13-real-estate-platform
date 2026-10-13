import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ListingDetail, listingMetadata } from "@/components/listing-detail";
import { listingCrumbs } from "@/lib/locations";
import { HOME_MARKET } from "@/lib/markets/sample";
import { getSampleListing, getSampleListings } from "@/lib/markets/sample/listings";
import { idFromPropertySlug } from "@/lib/urls";

// [slug] is a dynamic segment: the bracketed folder name captures one URL
// segment and passes it to the page as params.slug.
type Props = PageProps<"/properties/[slug]">;

// generateStaticParams prerenders every listing's canonical slug at build time.
// dynamicParams stays at its default (true) on purpose: any other slug, such as
// an old /properties/1006 link or a slug whose title has changed, still reaches
// this page at request time so it can be redirected instead of 404ing.
export function generateStaticParams() {
  return getSampleListings(HOME_MARKET).map((listing) => ({ slug: listing.href.split("/").pop()! }));
}

async function loadListing(params: Props["params"]) {
  // params is a Promise in current Next.js, so it has to be awaited.
  const { slug } = await params;
  const id = idFromPropertySlug(slug);
  const listing = id && getSampleListing(HOME_MARKET, id);
  if (!listing) notFound();

  // Only the trailing id identifies the listing. If the words before it are
  // missing or out of date, a permanent (308) redirect moves visitors and
  // search engines to the one canonical URL.
  if (`${HOME_MARKET.basePath}/${slug}` !== listing.href) permanentRedirect(listing.href);
  return listing;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return listingMetadata(await loadListing(params));
}

export default async function ListingPage({ params }: Props) {
  const listing = await loadListing(params);
  return (
    <ListingDetail
      listing={listing}
      backHref={HOME_MARKET.basePath}
      breadcrumbs={<Breadcrumbs items={listingCrumbs(listing.id, listing.title)} />}
    />
  );
}
