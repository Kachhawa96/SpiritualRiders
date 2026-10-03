// Phase 0 placeholder — will be replaced in Phase 2 with the full homepage.
export default function HomePage() {
  return (
    <section
      className="flex flex-1 flex-col items-center justify-center min-h-dvh text-center container-site"
      aria-label="Coming soon"
    >
      <p
        className="text-xs tracking-[0.4em] uppercase mb-6"
        style={{ color: "var(--color-accent)" }}
      >
        Spiritual Riders
      </p>
      <h1
        className="font-display text-5xl md:text-7xl font-light mb-6"
        style={{ color: "var(--color-foreground)" }}
      >
        Ride Beyond Roads.
      </h1>
      <p
        className="text-lg max-w-xl mx-auto"
        style={{ color: "var(--color-foreground-muted)" }}
      >
        Foundation is set. The cinematic experience is coming in Phase 2.
      </p>
    </section>
  );
}
