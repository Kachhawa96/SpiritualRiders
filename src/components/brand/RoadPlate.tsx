/**
 * Decorative chapter mark for the temporary shell.
 * Replaced by photography in later phases. Hidden from assistive tech.
 */

export function RoadPlate() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-obsidian-900" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,oklch(67%_0.14_75/0.18),transparent_46%)]" />
      <svg
        className="absolute inset-x-0 bottom-0 h-[78%] w-full"
        viewBox="0 0 800 900"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
      >
        <path
          d="M400 36 L568 900"
          stroke="oklch(75% 0.13 80)"
          strokeOpacity="0.55"
          strokeWidth="1.25"
        />
        <path
          d="M400 36 L232 900"
          stroke="oklch(75% 0.13 80)"
          strokeOpacity="0.55"
          strokeWidth="1.25"
        />
        <path
          d="M372 270 H428"
          stroke="oklch(96% 0.01 90)"
          strokeOpacity="0.3"
          strokeWidth="1"
        />
        <path
          d="M338 470 H462"
          stroke="oklch(96% 0.01 90)"
          strokeOpacity="0.2"
          strokeWidth="1"
        />
        <path
          d="M286 700 H514"
          stroke="oklch(96% 0.01 90)"
          strokeOpacity="0.14"
          strokeWidth="1"
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-obsidian-950 to-transparent" />
      <div className="absolute bottom-8 left-8 right-8">
        <p className="max-w-none text-[0.65rem] uppercase tracking-[0.36em] text-gold-400">
          Chapter mark
        </p>
        <p className="mt-3 max-w-none font-display text-4xl font-medium text-ivory-100">
          The long road
        </p>
      </div>
    </div>
  );
}
