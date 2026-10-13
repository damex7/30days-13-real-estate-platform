import { MapPin } from "lucide-react";

import { EmptyState } from "@/components/empty-state";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <EmptyState
        icon={MapPin}
        title="Page not found"
        description="We couldn't find the page you were looking for."
        action={{ href: "/", label: "Go home" }}
      />
    </div>
  );
}
