export function RiderDirectoryFallback() {
  return (
    <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14" aria-hidden="true">
      <div className="h-40 border border-border-subtle bg-obsidian-900" />
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <li key={index} className="aspect-[3/4] border border-border-subtle bg-obsidian-900" />
        ))}
      </ul>
    </div>
  );
}
