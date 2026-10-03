import { RiderCard } from "@/components/riders/RiderCard";
import type { DirectoryRider } from "@/types/rider";

interface RiderGridProps {
  riders: DirectoryRider[];
}

export function RiderGrid({ riders }: RiderGridProps) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {riders.map((rider) => (
        <li key={rider.id} className="h-full">
          <RiderCard rider={rider} />
        </li>
      ))}
    </ul>
  );
}
