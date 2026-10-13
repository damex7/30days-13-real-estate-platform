import { Building2, Mail } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ListingGrid } from "@/components/listing-grid";
import { findAgent, getAgents } from "@/lib/agents";

// [agentSlug] is a dynamic segment; the folder name sets the params key, so
// /agents/adaeze-okafor gives params.agentSlug === "adaeze-okafor".
type Props = PageProps<"/agents/[agentSlug]">;

// One static page per agent, built from the data at build time.
export function generateStaticParams() {
  return getAgents().map((agent) => ({ agentSlug: agent.slug }));
}

// Slugs not returned above are a 404 without running the page.
export const dynamicParams = false;

async function loadAgent(params: Props["params"]) {
  return findAgent((await params).agentSlug) ?? notFound();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const agent = await loadAgent(params);
  return {
    title: `${agent.name}, ${agent.company}`,
    description: `Homes for sale and rent listed by ${agent.name} of ${agent.company}.`,
  };
}

export default async function AgentPage({ params }: Props) {
  const agent = await loadAgent(params);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Agents", href: "/agents" }, { label: agent.name }]} />

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{agent.name}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-muted">
            <Building2 className="size-4" aria-hidden /> {agent.company}
          </p>
          <p className="mt-2 text-sm">
            {agent.forSale} for sale · {agent.toRent} to rent
          </p>
        </div>
        {agent.email && (
          <a
            href={`mailto:${agent.email}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand px-4 text-sm font-medium text-brand-foreground transition hover:bg-brand-hover"
          >
            <Mail className="size-4" aria-hidden /> Email {agent.name.split(" ")[0]}
          </a>
        )}
      </div>

      <h2 className="mt-10 text-xl font-semibold tracking-tight">Listings by {agent.name}</h2>
      <div className="mt-6">
        <ListingGrid listings={agent.listings} />
      </div>
    </div>
  );
}
