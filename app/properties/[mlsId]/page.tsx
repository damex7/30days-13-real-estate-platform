import { ArrowLeft, Bath, BedDouble, CalendarDays, Clock, ExternalLink, Mail, MapPin, Phone, Ruler } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache, type ReactNode } from "react";

import { PhotoGallery } from "@/components/photo-gallery";
import { StatusBadge } from "@/components/status-badge";
import { formatBaths, formatDate, formatNumber, formatPrice, formatPropertyType } from "@/lib/format";
import { getListing } from "@/lib/simplyrets";

type Props = PageProps<"/properties/[mlsId]">;

// Shared by generateMetadata and the page so the listing is fetched once.
const loadListing = cache(async (mlsId: string) => {
  if (!/^\d{1,12}$/.test(mlsId)) notFound();
  const listing = await getListing(Number(mlsId));
  if (!listing) notFound();
  return listing;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = await loadListing((await params).mlsId);
  const title = `${listing.address}${listing.city ? `, ${listing.city}` : ""}`;
  return {
    title,
    description: `${formatPrice(listing.price)} · ${listing.beds ?? "–"} bd · ${formatBaths(listing.bathsFull, listing.bathsHalf) ?? "–"} ba`,
    openGraph: { title, images: listing.photos.slice(0, 1) },
  };
}

export default async function ListingPage({ params }: Props) {
  const listing = await loadListing((await params).mlsId);
  const baths = formatBaths(listing.bathsFull, listing.bathsHalf);
  const listed = formatDate(listing.listDate);
  const locality = [listing.city, [listing.state, listing.zip].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
  const mapHref =
    listing.lat != null && listing.lng != null
      ? `https://www.google.com/maps/search/?api=1&query=${listing.lat},${listing.lng}`
      : null;

  const stats = [
    { icon: BedDouble, label: "Beds", value: listing.beds },
    { icon: Bath, label: "Baths", value: baths },
    { icon: Ruler, label: "Sq ft", value: listing.sqft != null ? formatNumber(listing.sqft) : null },
    { icon: CalendarDays, label: "Built", value: listing.yearBuilt },
  ].filter((s) => s.value != null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/properties" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden /> Back to listings
      </Link>

      <div className="mt-4">
        <PhotoGallery photos={listing.photos} alt={listing.address} />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <article className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={listing.status} />
            {formatPropertyType(listing.type) && (
              <span className="rounded-full border border-line px-2.5 py-1 text-xs text-muted">
                {formatPropertyType(listing.type)}
              </span>
            )}
            <span className="text-xs text-muted">MLS #{listing.id}</span>
          </div>

          <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">{listing.address}</h1>
          {locality && (
            <p className="mt-1 flex items-center gap-1.5 text-muted">
              <MapPin className="size-4 shrink-0" aria-hidden /> {locality}
            </p>
          )}
          <p className="mt-4 text-3xl font-semibold tracking-tight text-brand">{formatPrice(listing.price)}</p>

          {stats.length > 0 && (
            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-xl border border-line bg-surface p-4">
                  <dt className="flex items-center gap-1.5 text-xs text-muted">
                    <Icon className="size-4" aria-hidden /> {label}
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {listing.remarks && (
            <Section title="About this home">
              <p className="leading-relaxed whitespace-pre-line text-foreground/85">{listing.remarks}</p>
            </Section>
          )}

          {listing.details.length > 0 && (
            <Section title="Property details">
              <dl className="grid gap-x-8 sm:grid-cols-2">
                {listing.details.map((d) => (
                  <div key={d.label} className="flex justify-between gap-4 border-b border-line py-2.5 text-sm">
                    <dt className="text-muted">{d.label}</dt>
                    <dd className="text-right font-medium">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </Section>
          )}

          {listing.features.length > 0 && (
            <Section title="Features">
              <ul className="flex flex-wrap gap-2">
                {listing.features.map((f) => (
                  <li key={f} className="rounded-full bg-brand-soft px-3 py-1 text-sm text-foreground">
                    {f}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {listing.schools.length > 0 && (
            <Section title="Schools">
              <dl className="grid gap-3 sm:grid-cols-2">
                {listing.schools.map((s) => (
                  <div key={s.label} className="rounded-xl border border-line bg-surface p-4">
                    <dt className="text-xs text-muted">{s.label}</dt>
                    <dd className="mt-0.5 font-medium">{s.name}</dd>
                  </div>
                ))}
              </dl>
            </Section>
          )}

          {listing.disclaimer && <p className="mt-10 text-xs text-muted">{listing.disclaimer}</p>}
        </article>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-line bg-surface p-5">
            <p className="text-xs font-medium tracking-wide text-muted uppercase">Listed by</p>
            {listing.agent ? (
              <>
                <p className="mt-2 text-lg font-semibold">{listing.agent.name}</p>
                {listing.officeName && <p className="text-sm text-muted">{listing.officeName}</p>}
                <div className="mt-4 space-y-2">
                  {listing.agent.email && (
                    <a
                      href={`mailto:${listing.agent.email}?subject=${encodeURIComponent(`Inquiry about ${listing.address} (MLS #${listing.id})`)}`}
                      className="flex h-10 items-center justify-center gap-2 rounded-lg bg-brand text-sm font-medium text-brand-foreground transition hover:bg-brand-hover"
                    >
                      <Mail className="size-4" aria-hidden /> Email agent
                    </a>
                  )}
                  {listing.agent.phone && (
                    <a
                      href={`tel:${listing.agent.phone.replace(/[^\d+]/g, "")}`}
                      className="flex h-10 items-center justify-center gap-2 rounded-lg border border-line text-sm font-medium transition hover:border-brand hover:text-brand"
                    >
                      <Phone className="size-4" aria-hidden /> {listing.agent.phone}
                    </a>
                  )}
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted">Agent details aren&apos;t available for this listing.</p>
            )}
          </div>

          <div className="space-y-3 rounded-xl border border-line bg-surface p-5 text-sm">
            {listed && (
              <p className="flex items-center gap-2">
                <CalendarDays className="size-4 text-muted" aria-hidden /> Listed {listed}
              </p>
            )}
            {listing.daysOnMarket != null && (
              <p className="flex items-center gap-2">
                <Clock className="size-4 text-muted" aria-hidden /> {formatNumber(listing.daysOnMarket)} days on market
              </p>
            )}
            {mapHref && (
              <a
                href={mapHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 font-medium text-brand hover:underline"
              >
                <MapPin className="size-4" aria-hidden /> View on map
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}
