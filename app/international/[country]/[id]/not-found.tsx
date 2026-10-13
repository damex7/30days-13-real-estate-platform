import { SearchX } from "lucide-react";

import { EmptyState } from "@/components/empty-state";

export default function ListingNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <EmptyState
        icon={SearchX}
        title="This listing isn't available"
        description="It may have been removed, or the link might be wrong. Have a look at what's on the market now."
        action={{ href: "/international", label: "Browse international listings" }}
      />
    </div>
  );
}
