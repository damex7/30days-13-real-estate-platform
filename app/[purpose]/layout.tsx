import { PURPOSE_SEGMENTS } from "@/lib/locations";

// [purpose] is a dynamic segment at the root, so it sits next to static routes
// like /properties and /international. Static folders always win a match, so
// only otherwise-unknown first segments reach it.
//
// generateStaticParams lives in this layout, not the page, so child segments
// get it too: Next.js runs the child [state] generateStaticParams once per
// purpose returned here, passing { purpose } in (top-down generation).
export function generateStaticParams() {
  return Object.keys(PURPOSE_SEGMENTS).map((purpose) => ({ purpose }));
}

// Only "buy" and "rent" are valid; anything else (/lease, /foo) is a 404.
export const dynamicParams = false;

export default function PurposeLayout({ children }: LayoutProps<"/[purpose]">) {
  return children;
}
