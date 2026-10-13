import { Building2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { getAgents } from "@/lib/agents";
import { agentPath } from "@/lib/urls";

export const metadata: Metadata = {
  title: "Agents",
  description: "Meet the agents listing homes on Hearthstone Realty across Lagos, Abuja, Port Harcourt and Ibadan.",
};

export default function AgentsPage() {
  const agents = getAgents();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Agents" }]} />
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Agents</h1>
      <p className="mt-1 text-sm text-muted">Sample agents and agencies; names are fictional.</p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <li key={agent.slug}>
            <Link
              href={agentPath(agent.name)}
              className="flex h-full items-start gap-4 rounded-xl border border-line bg-surface p-5 transition hover:border-brand"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-soft font-semibold text-brand">
                {agent.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </span>
              <span>
                <span className="block text-lg font-semibold">{agent.name}</span>
                <span className="flex items-center gap-1.5 text-sm text-muted">
                  <Building2 className="size-4" aria-hidden /> {agent.company}
                </span>
                <span className="mt-2 block text-sm">
                  {agent.forSale} for sale · {agent.toRent} to rent
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
