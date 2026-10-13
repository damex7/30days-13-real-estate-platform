import { purposeFromSegment, statesFor } from "@/lib/locations";

// Nested dynamic segment. This runs once for each { purpose } the parent
// layout generated, and returns only the states that have listings for that
// purpose, so /buy/oyo exists only if something in Oyo is for sale.
// The params argument is plain (not a Promise) and holds only parent params.
export function generateStaticParams({ params }: { params: Awaited<LayoutProps<"/[purpose]">["params"]> }) {
  const purpose = purposeFromSegment(params.purpose);
  return purpose ? statesFor(purpose).map((state) => ({ state: state.value })) : [];
}

// States not returned above (/rent/kano) are a 404.
export const dynamicParams = false;

export default function StateLayout({ children }: LayoutProps<"/[purpose]/[state]">) {
  return children;
}
