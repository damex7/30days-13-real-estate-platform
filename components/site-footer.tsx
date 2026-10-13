export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Hearthstone Realty</p>
        <p>
          Listing data from the{" "}
          <a
            href="https://simplyrets.com"
            className="underline underline-offset-2 hover:text-foreground"
            target="_blank"
            rel="noreferrer"
          >
            SimplyRETS
          </a>{" "}
          demo feed. These are sample listings, not real properties.
        </p>
      </div>
    </footer>
  );
}
