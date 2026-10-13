import { ArrowLeft, Bath, BedDouble, CalendarDays, Clock, ExternalLink, Mail, MapPin, Phone, Ruler } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { PhotoGallery } from "@/components/photo-gallery";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, formatNumber, formatPrice } from "@/lib/format";
import type { Listing } from "@/lib/listing";

export function listingMetadata(listing: Listing): Metadata {
  const title = `${listing.title} – ${listing.address}`;
  const stats = [
    formatPrice(listing),
    listing.beds != null && `${listing.beds} bd`,
    listing.baths != null && `${listing.baths} ba`,
  ].filter(Boolean);
  return {
    title,
    description: stats.join(" · "),
    openGraph: { title, images: listing.photos.slice(0, 1).map((p) => p.full) },
  };
}

export function ListingDetail({
  listing,
  backHref,
  breadcrumbs,
  agentHref,
}: {
  listing: Listing;
  backHref: string;
  /** Replaces the "Back to listings" link when set. */
  breadcrumbs?: ReactNode;
  /** Links the agent's name to their profile page. */
  agentHref?: string;
}) {
  const listed = formatDate(listing.listedAt);
  const mapHref = listing.coords
    ? `https://www.google.com/maps/search/?api=1&query=${listing.coords.lat},${listing.coords.lng}`
    : null;

  const areaLabel =
    listing.area?.kind === "land" ? "Plot size" : listing.area?.unit === "sqm" ? "Floor area" : "Sq ft";
  const stats = [
    { icon: BedDouble, label: "Beds", value: listing.beds },
    { icon: Bath, label: "Baths", value: listing.baths },
    {
      icon: Ruler,
      label: areaLabel,
      value: listing.area ? `${formatNumber(listing.area.value)}${listing.area.unit === "sqm" ? " sqm" : ""}` : null,
    },
    { icon: CalendarDays, label: "Built", value: listing.yearBuilt },
  ].filter((s) => s.value != null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {breadcrumbs ?? (
        <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden /> Back to listings
        </Link>
      )}

      <div className="mt-4">
        <PhotoGallery photos={listing.photos} alt={listing.title} />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <article className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={listing.status} />
            {listing.typeLabel && (
              <span className="rounded-full border border-line px-2.5 py-1 text-xs text-muted">{listing.typeLabel}</span>
            )}
            <span className="text-xs text-muted">{listing.reference}</span>
          </div>

          <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">{listing.title}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-muted">
            <MapPin className="size-4 shrink-0" aria-hidden />
            {[listing.address, listing.locality].filter(Boolean).join(", ")}
          </p>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-brand">{formatPrice(listing)}</p>

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

          {listing.description && (
            <Section title="About this property">
              <p className="leading-relaxed whitespace-pre-line text-foreground/85">{listing.description}</p>
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
                <p className="mt-2 text-lg font-semibold">
                  {agentHref ? (
                    <Link href={agentHref} className="hover:text-brand hover:underline">
                      {listing.agent.name}
                    </Link>
                  ) : (
                    listing.agent.name
                  )}
                </p>
                {listing.agent.company && <p className="text-sm text-muted">{listing.agent.company}</p>}
                <div className="mt-4 space-y-2">
                  {listing.agent.email && (
                    <a
                      href={`mailto:${listing.agent.email}?subject=${encodeURIComponent(`Inquiry about ${listing.title} (${listing.reference})`)}`}
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
                <MapPin className="size-4" aria-hidden /> View area on map
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
