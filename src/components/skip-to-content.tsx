export function SkipToContent() {
  return (
    <a
      href="#content"
      className="
        sr-only focus:not-sr-only
        fixed left-4 top-4 z-100
        rounded-xl border bg-background px-3 py-2 text-sm font-semibold shadow-sm
        focus:outline-none focus:ring-2 focus:ring-ring/50
      "
    >
      Skip to content
    </a>
  );
}