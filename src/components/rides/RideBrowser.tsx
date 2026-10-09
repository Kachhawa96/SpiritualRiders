"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RideCard } from "@/components/rides/RideCard";
import { Button } from "@/components/ui/Button";
import { RIDE_STATUS_LABEL, RIDE_TYPE_LABEL } from "@/lib/ride-labels";
import type { RideSummary } from "@/lib/community";

interface RideBrowserProps {
  rides: RideSummary[];
}

export function RideBrowser({ rides }: RideBrowserProps) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const q = params.get("q") ?? "";
  const type = params.get("type") ?? "";
  const status = params.get("status") ?? "";

  const results = rides.filter((ride) => {
    if (type && ride.ride_type !== type) return false;
    if (status && ride.status !== status) return false;
    if (!q.trim()) return true;
    const needle = q.trim().toLowerCase();
    return [ride.title, ride.route_summary ?? "", ride.short_description]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });

  const types = [...new Set(rides.map((ride) => ride.ride_type))];
  const statuses = [...new Set(rides.map((ride) => ride.status))];
  const narrowed = Boolean(q || type || status);

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const search = next.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:items-start lg:gap-14">
      <div className="flex flex-col gap-8">
        <label className="block">
          <span className="text-[0.68rem] uppercase tracking-[0.28em] text-gold-500">
            Search the rides
          </span>
          <input
            type="search"
            value={q}
            onChange={(event) => update("q", event.target.value)}
            placeholder="Name or road"
            autoComplete="off"
            className="mt-3 h-12 w-full border border-border bg-obsidian-900 px-4 text-sm text-ivory-100 outline-none placeholder:text-graphite-400 transition-all duration-200 focus-visible:border-gold-500 focus-visible:shadow-[0_0_15px_oklch(67%_0.14_75/0.12)]"
          />
        </label>
        <ChipGroup
          legend="Kind"
          value={type}
          options={types.map((item) => ({ id: item, label: RIDE_TYPE_LABEL[item] }))}
          onChange={(value) => update("type", value)}
        />
        <ChipGroup
          legend="When"
          value={status}
          options={statuses.map((item) => ({ id: item, label: RIDE_STATUS_LABEL[item] }))}
          onChange={(value) => update("status", value)}
        />
        {narrowed ? (
          <Button variant="ghost" onClick={() => router.replace(pathname, { scroll: false })}>
            Clear
          </Button>
        ) : null}
      </div>
      <div>
        <p className="mb-6 text-[0.68rem] uppercase tracking-[0.28em] text-graphite-300">
          {results.length} {results.length === 1 ? "ride" : "rides"}
        </p>
        {results.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2">
            {results.map((ride) => (
              <li key={ride.id}>
                <RideCard ride={ride} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="border border-border-subtle px-6 py-16 text-center">
            <h2 className="font-medium">No ride on this road.</h2>
            <p className="mx-auto mt-4 max-w-md">That search does not match the chapter rides.</p>
            <div className="mt-8 flex justify-center">
              <Button variant="outline" onClick={() => router.replace(pathname, { scroll: false })}>
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChipGroup({
  legend,
  value,
  options,
  onChange,
}: {
  legend: string;
  value: string;
  options: { id: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-[0.68rem] uppercase tracking-[0.28em] text-graphite-300">
        {legend}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        <Chip pressed={value === ""} onClick={() => onChange("")}>
          All
        </Chip>
        {options.map((option) => (
          <Chip
            key={option.id}
            pressed={value === option.id}
            onClick={() => onChange(value === option.id ? "" : option.id)}
          >
            {option.label}
          </Chip>
        ))}
      </div>
    </fieldset>
  );
}

function Chip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={
        pressed
          ? "h-10 cursor-pointer border border-gold-500 bg-gold-500 px-3 text-[0.68rem] uppercase tracking-[0.16em] text-obsidian-950 transition-all duration-200 active:scale-[0.98] motion-reduce:transform-none"
          : "h-10 cursor-pointer border border-border bg-transparent px-3 text-[0.68rem] uppercase tracking-[0.16em] text-ivory-100 transition-all duration-200 hover:border-gold-500/50 hover:text-gold-300 active:scale-[0.98] motion-reduce:transform-none"
      }
    >
      {children}
    </button>
  );
}
