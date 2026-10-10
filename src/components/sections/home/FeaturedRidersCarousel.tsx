"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { motion, useReducedMotion } from "motion/react";
import { ChapterFrame } from "@/components/visuals/ChapterFrame";
import { Button } from "@/components/ui/Button";
import { isLiveRoute, ROUTES } from "@/config/site";
import type { HomeRider } from "@/data/home";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO } from "@/lib/motion";

interface FeaturedRidersCarouselProps {
  riders: HomeRider[];
  totalFeaturedCount?: number;
}

export function FeaturedRidersCarousel({
  riders,
  totalFeaturedCount = riders.length,
}: FeaturedRidersCarouselProps) {
  const shouldReduceMotion = useReducedMotion();

  // Maximum 6 featured riders in carousel
  const displayedRiders = riders.slice(0, 6);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    loop: false,
    skipSnaps: false,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const syncState = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    const rafId = requestAnimationFrame(syncState);
    emblaApi.on("select", syncState);
    emblaApi.on("reInit", syncState);

    return () => {
      cancelAnimationFrame(rafId);
      emblaApi.off("select", syncState);
      emblaApi.off("reInit", syncState);
    };
  }, [emblaApi]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  return (
    <div className="relative mt-12 space-y-8">
      {/* Carousel Controls Bar (Arrows + Counter) */}
      <div className="flex items-center justify-between border-b border-border-subtle/80 pb-4">
        {/* Visual status cue */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs tracking-[0.2em] text-gold-400">
            {String(selectedIndex + 1).padStart(2, "0")} / {String(displayedRiders.length).padStart(2, "0")}
          </span>
          <span className="hidden text-xs text-graphite-400 sm:inline">
            · Swipe or use arrows to explore
          </span>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous rider"
            className={cn(
              "group flex size-9 cursor-pointer items-center justify-center rounded-xs border transition-all duration-200",
              canScrollPrev
                ? "border-charcoal-500 bg-obsidian-950/80 text-ivory-100 hover:border-gold-500 hover:bg-gold-500/10 hover:text-gold-400 active:scale-95"
                : "cursor-not-allowed border-charcoal-700/60 bg-obsidian-950/40 text-graphite-600 opacity-40"
            )}
          >
            <svg
              className="size-4 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Next rider"
            className={cn(
              "group flex size-9 cursor-pointer items-center justify-center rounded-xs border transition-all duration-200",
              canScrollNext
                ? "border-charcoal-500 bg-obsidian-950/80 text-ivory-100 hover:border-gold-500 hover:bg-gold-500/10 hover:text-gold-400 active:scale-95"
                : "cursor-not-allowed border-charcoal-700/60 bg-obsidian-950/40 text-graphite-600 opacity-40"
            )}
          >
            <svg
              className="size-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Embla Viewport */}
      <div
        className="overflow-hidden focus-visible:ring-1 focus-visible:ring-gold-500/50 focus-visible:outline-none"
        ref={emblaRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-roledescription="carousel"
        aria-label="Featured Riders Carousel"
      >
        <div className="flex -ml-4 sm:-ml-6 touch-pan-y select-none">
          {displayedRiders.map((rider, index) => (
            <div
              key={rider.slug}
              className="min-w-0 flex-[0_0_47%] sm:flex-[0_0_42%] md:flex-[0_0_33.333%] lg:flex-[0_0_31.5%] pl-4 sm:pl-6"
            >
              <motion.article
                className="card-interactive group flex h-full flex-col justify-between rounded-sm border border-border-subtle bg-obsidian-900/60 p-3.5 sm:p-4 lg:p-5 transition-colors duration-300 hover:border-gold-500/40 hover:bg-obsidian-900/90"
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
              >
                <div>
                  {/* Image / Emblem Frame */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xs border border-border-subtle bg-obsidian-950">
                    {rider.profile_image_url ? (
                      <Image
                        src={rider.profile_image_url}
                        alt={rider.displayName}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
                        sizes="(min-width: 1024px) 32vw, (min-width: 640px) 45vw, 48vw"
                      />
                    ) : (
                      <ChapterFrame tone={rider.tone} label={rider.mark} title={rider.position} />
                    )}
                  </div>

                  {/* Meta & Position */}
                  <div className="mt-5 flex items-center justify-between gap-2">
                    <p className="text-[0.62rem] sm:text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-gold-500">
                      {rider.position}
                    </p>
                    <span className="font-mono text-[0.62rem] tracking-wider text-graphite-500">
                      #{String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Rider Display Name */}
                  <h3 className="mt-2 font-display text-base font-medium sm:text-lg lg:text-xl text-ivory-100">
                    <Link
                      href={ROUTES.rider(rider.slug)}
                      prefetch={isLiveRoute(ROUTES.rider(rider.slug))}
                      className="hover:text-gold-400 focus:text-gold-400 focus:outline-none transition-colors"
                    >
                      {rider.displayName}
                    </Link>
                  </h3>

                  {/* Short Bio */}
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-graphite-300 sm:text-sm">
                    {rider.shortBio}
                  </p>
                </div>

                {/* Footer Machine & Location */}
                <div className="mt-6 border-t border-border-subtle/60 pt-3">
                  <p className="truncate text-xs font-medium text-ivory-100 sm:text-sm">
                    {rider.bike}
                  </p>
                  {rider.city ? (
                    <p className="mt-0.5 text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.22em] text-graphite-400">
                      {rider.city}
                    </p>
                  ) : null}
                </div>
              </motion.article>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Dots Track */}
      {scrollSnaps.length > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                "h-1.5 cursor-pointer rounded-full transition-all duration-300",
                selectedIndex === index
                  ? "w-6 bg-gold-400 shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                  : "w-2 bg-charcoal-600 hover:bg-graphite-400"
              )}
            />
          ))}
        </div>
      )}

      {/* Elegant Bottom Section CTA */}
      <div className="mt-12 flex flex-col items-center justify-center gap-3 border-t border-border-subtle/60 pt-10 text-center">
        <Button href={ROUTES.riders} variant="outline">
          View All Riders {totalFeaturedCount > 6 ? `(${totalFeaturedCount} in Roster)` : ""} →
        </Button>
        <p className="text-[0.68rem] tracking-[0.24em] text-graphite-400 uppercase">
          Explore the complete brotherhood line, machines, and routes
        </p>
      </div>
    </div>
  );
}
