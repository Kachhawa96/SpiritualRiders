import type { FrameTone } from "@/data/home";
import { cn } from "@/lib/utils";

interface ChapterFrameProps {
  tone: FrameTone;
  label: string;
  title: string;
  className?: string;
}

const GLOW: Record<FrameTone, string> = {
  highway: "50% 12%",
  machine: "72% 38%",
  crew: "30% 20%",
  dawn: "50% 78%",
  salt: "50% 70%",
  rain: "40% 10%",
};

export function ChapterFrame({ tone, label, title, className }: ChapterFrameProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-obsidian-900", className)} aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${GLOW[tone]}, oklch(67% 0.14 75 / 0.2), transparent 46%)`,
        }}
      />
      <FrameArt tone={tone} />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-obsidian-950 to-transparent" />
      <div className="absolute right-6 bottom-6 left-6">
        <p className="max-w-none text-[0.62rem] uppercase tracking-[0.34em] text-gold-400">
          {label}
        </p>
        <p className="mt-2 max-w-none font-display text-3xl font-medium text-ivory-100 md:text-4xl">
          {title}
        </p>
      </div>
    </div>
  );
}

function FrameArt({ tone }: { tone: FrameTone }) {
  if (tone === "machine") return <BikeArt />;
  if (tone === "rain") return <RainArt />;
  if (tone === "crew") return <CrewArt />;
  if (tone === "dawn" || tone === "salt") return <HorizonArt low={tone === "salt"} />;
  return <RoadArt />;
}

function RoadArt() {
  return (
    <svg className="absolute inset-x-0 bottom-0 h-[78%] w-full" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax slice" fill="none">
      <path d="M400 20 L590 900" stroke="oklch(75% 0.13 80)" strokeOpacity="0.7" strokeWidth="1.25" />
      <path d="M400 20 L210 900" stroke="oklch(75% 0.13 80)" strokeOpacity="0.7" strokeWidth="1.25" />
      <path d="M372 250 H428" stroke="oklch(96% 0.01 90)" strokeOpacity="0.35" />
      <path d="M330 460 H470" stroke="oklch(96% 0.01 90)" strokeOpacity="0.22" />
      <path d="M270 700 H530" stroke="oklch(96% 0.01 90)" strokeOpacity="0.14" />
    </svg>
  );
}

function HorizonArt({ low }: { low: boolean }) {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice" fill="none">
      <path d={low ? "M0 720 H800" : "M0 640 H800"} stroke="oklch(75% 0.13 80)" strokeOpacity="0.55" />
      <path d="M80 780 H240" stroke="oklch(96% 0.01 90)" strokeOpacity="0.2" />
      <path d="M520 800 H700" stroke="oklch(96% 0.01 90)" strokeOpacity="0.16" />
    </svg>
  );
}

function RainArt() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice" fill="none">
      {Array.from({ length: 14 }, (_, index) => (
        <path
          key={index}
          d={`M${40 + index * 56} 40 L${20 + index * 56} 960`}
          stroke="oklch(96% 0.01 90)"
          strokeOpacity={index % 3 === 0 ? 0.2 : 0.08}
        />
      ))}
    </svg>
  );
}

function CrewArt() {
  return (
    <svg className="absolute inset-x-0 bottom-8 h-[70%] w-full" viewBox="0 0 800 700" preserveAspectRatio="xMidYMax meet" fill="none">
      <path d="M250 80 V620" stroke="oklch(75% 0.13 80)" strokeOpacity="0.55" />
      <path d="M400 140 V620" stroke="oklch(96% 0.01 90)" strokeOpacity="0.28" />
      <path d="M550 80 V620" stroke="oklch(75% 0.13 80)" strokeOpacity="0.55" />
      <path d="M180 620 H620" stroke="oklch(96% 0.01 90)" strokeOpacity="0.2" />
    </svg>
  );
}

function BikeArt() {
  return (
    <svg className="absolute inset-x-0 bottom-16 h-[46%] w-full" viewBox="0 0 800 360" preserveAspectRatio="xMidYMax meet" fill="none">
      <circle cx="210" cy="250" r="78" stroke="oklch(75% 0.13 80)" strokeOpacity="0.75" strokeWidth="1.4" />
      <circle cx="590" cy="250" r="78" stroke="oklch(75% 0.13 80)" strokeOpacity="0.75" strokeWidth="1.4" />
      <path d="M210 250 L340 250 L430 150 L520 170 L590 250" stroke="oklch(96% 0.01 90)" strokeOpacity="0.55" strokeWidth="1.4" />
      <path d="M430 150 L470 110 H560" stroke="oklch(75% 0.13 80)" strokeOpacity="0.8" strokeWidth="1.4" />
      <path d="M360 168 H470" stroke="oklch(96% 0.01 90)" strokeOpacity="0.35" />
    </svg>
  );
}
