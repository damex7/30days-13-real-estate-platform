export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Hearthstone Realty</p>
        <p>
          Listings for Nigeria, the UK, UAE, Ghana, Kenya and South Africa are sample data for demonstration:
          prices are illustrative, agents are fictional and
          photos are from{" "}
          <a href="https://unsplash.com" className="underline underline-offset-2 hover:text-foreground" target="_blank" rel="noreferrer">
            Unsplash
          </a>
          . US listings come from the{" "}
          <a href="https://simplyrets.com" className="underline underline-offset-2 hover:text-foreground" target="_blank" rel="noreferrer">
            SimplyRETS
          </a>{" "}
          demo feed.
        </p>
      </div>
    </footer>
  );
}
