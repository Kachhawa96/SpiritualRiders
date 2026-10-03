"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RiderFilters } from "@/components/riders/RiderFilters";
import { RiderGrid } from "@/components/riders/RiderGrid";
import { RiderSearch } from "@/components/riders/RiderSearch";
import { Button } from "@/components/ui/Button";
import {
  filterDirectoryRiders,
  STYLE_LABEL,
  uniqueSorted,
  type DirectoryQuery,
} from "@/lib/directory";
import type { DirectoryRider, RidingStyle } from "@/types/rider";

interface RiderDirectoryProps {
  riders: DirectoryRider[];
}

export function RiderDirectory({ riders }: RiderDirectoryProps) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query: DirectoryQuery = {
    q: params.get("q") ?? "",
    style: params.get("style") ?? "",
    brand: params.get("brand") ?? "",
    position: params.get("position") ?? "",
  };

  const results = filterDirectoryRiders(riders, query);

  const styles = uniqueSorted(riders.flatMap((rider) => rider.riding_style));
  const brands = uniqueSorted(riders.map((rider) => rider.bike_brand));
  const positions = uniqueSorted(riders.map((rider) => rider.position_label));
  const narrowed = Boolean(query.q || query.style || query.brand || query.position);

  function update(key: keyof DirectoryQuery, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const search = next.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  }

  function clear() {
    router.replace(pathname, { scroll: false });
  }

  function renderFilters() {
    return (
      <RiderFilters
        styles={styles}
        brands={brands}
        positions={positions}
        style={query.style}
        brand={query.brand}
        position={query.position}
        onStyle={(value) => update("style", value)}
        onBrand={(value) => update("brand", value)}
        onPosition={(value) => update("position", value)}
        styleLabel={(value) => STYLE_LABEL[value as RidingStyle] ?? value}
      />
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:items-start lg:gap-14">
      <div className="flex flex-col gap-8">
        <RiderSearch value={query.q} onChange={(value) => update("q", value)} />
        <details className="lg:hidden" open={narrowed ? true : undefined}>
          <summary className="flex h-12 cursor-pointer items-center text-[0.68rem] uppercase tracking-[0.28em] text-ivory-100">
            Narrow the line
          </summary>
          <div className="mt-6">
            {renderFilters()}
          </div>
        </details>
        <div className="hidden lg:block">{renderFilters()}</div>
        {narrowed ? (
          <Button variant="ghost" onClick={clear}>
            Clear the line
          </Button>
        ) : null}
      </div>

      <div>
        <p className="mb-6 text-[0.68rem] uppercase tracking-[0.28em] text-graphite-300">
          {results.length} {results.length === 1 ? "rider" : "riders"}
        </p>
        {results.length > 0 ? (
          <RiderGrid riders={results} />
        ) : (
          <EmptyDirectory onClear={clear} />
        )}
      </div>
    </div>
  );
}

function EmptyDirectory({ onClear }: { onClear: () => void }) {
  return (
    <div className="border border-border-subtle px-6 py-16 text-center md:px-10">
      <h2 className="font-medium">No one on this road.</h2>
      <p className="mx-auto mt-4 max-w-md">
        That search does not match the crew. Clear it and the full line returns.
      </p>
      <div className="mt-8 flex justify-center">
        <Button variant="outline" onClick={onClear}>
          Clear the line
        </Button>
      </div>
    </div>
  );
}
