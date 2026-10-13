import { MessageCircle, Phone } from "lucide-react";

import type { Listing } from "@/lib/listing";
import { SITE_URL } from "@/lib/site";

// Placeholder for the demo: the agents are fictional, so every listing uses
// this obviously fake number. Replace it with each agent's real line.
const DEMO_PHONE = { display: "+234 800 000 0000", digits: "2348000000000" };

const BUTTON =
  "flex h-10 items-center justify-center gap-2 rounded-lg border border-line text-sm font-medium transition hover:border-brand hover:text-brand";

/** WhatsApp and call buttons for the agent card on a property page. */
export function ContactActions({ listing }: { listing: Pick<Listing, "title" | "reference" | "href"> }) {
  const message = `Hello, I'm interested in ${listing.title} (${listing.reference}): ${SITE_URL}${listing.href}`;

  return (
    <>
      <a
        href={`https://wa.me/${DEMO_PHONE.digits}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noreferrer"
        className={BUTTON}
      >
        <MessageCircle className="size-4" aria-hidden /> Chat on WhatsApp
      </a>
      <a href={`tel:+${DEMO_PHONE.digits}`} className={BUTTON}>
        <Phone className="size-4" aria-hidden /> Call {DEMO_PHONE.display}
      </a>
      <p className="text-center text-xs text-muted">Demo number, not a real line.</p>
    </>
  );
}
