export default function ListingLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" role="status" aria-label="Loading listing">
      <div className="h-5 w-32 animate-pulse rounded bg-line" />
      <div className="mt-4 aspect-[16/9] animate-pulse rounded-2xl bg-line" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse rounded bg-line" />
          <div className="h-5 w-1/3 animate-pulse rounded bg-line" />
          <div className="h-9 w-40 animate-pulse rounded bg-line" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-line" />
            ))}
          </div>
        </div>
        <div className="h-48 animate-pulse rounded-xl bg-line" />
      </div>
    </div>
  );
}
