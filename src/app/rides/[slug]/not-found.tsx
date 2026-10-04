import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ROUTES } from "@/config/site";

export default function RideNotFound() {
  return (
    <section className="flex flex-1 items-center">
      <Container variant="narrow" className="py-28 text-center">
        <h1 className="font-medium">This ride is not on the map.</h1>
        <div className="mt-8 flex justify-center">
          <Button href={ROUTES.rides}>All rides</Button>
        </div>
      </Container>
    </section>
  );
}
