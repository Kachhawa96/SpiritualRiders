"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChapterFrame } from "@/components/visuals/ChapterFrame";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useEscapeKey } from "@/lib/accessibility";
import type { GalleryFrame } from "@/lib/community";
import { isLiveRoute, ROUTES } from "@/config/site";
import { formatDate } from "@/lib/utils";

interface GalleryBrowserProps {
  frames: GalleryFrame[];
}

export function GalleryBrowser({ frames }: GalleryBrowserProps) {
  const [ride, setRide] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const rides = [...new Map(frames.filter((frame) => frame.ride_slug).map((frame) => [frame.ride_slug, frame.ride_title])).entries()];
  const visible = frames.filter((frame) => !ride || frame.ride_slug === ride);
  const open = frames.find((frame) => frame.id === openId) ?? null;

  return (
    <div>
      <fieldset>
        <legend className="text-[0.68rem] uppercase tracking-[0.28em] text-graphite-300">
          Ride
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          <FilterChip pressed={ride === ""} onClick={() => setRide("")}>
            All
          </FilterChip>
          {rides.map(([slug, title]) => (
            <FilterChip
              key={slug}
              pressed={ride === slug}
              onClick={() => setRide(ride === slug ? "" : slug ?? "")}
            >
              {title ?? slug ?? ""}
            </FilterChip>
          ))}
        </div>
      </fieldset>

      <p className="mt-8 mb-6 text-[0.68rem] uppercase tracking-[0.28em] text-graphite-300">
        {visible.length} {visible.length === 1 ? "frame" : "frames"}
      </p>

      {visible.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {visible.map((frame) => (
            <li key={frame.id}>
              <button
                type="button"
                onClick={() => setOpenId(frame.id)}
                className="block w-full cursor-pointer border border-border-subtle text-left"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ChapterFrame tone={frame.tone} label={frame.ride_title ?? "The road"} title={frame.title} />
                </div>
                <span className="block px-4 py-4">
                  <span className="block font-display text-2xl text-ivory-100">{frame.title}</span>
                  <span className="mt-2 block text-sm text-graphite-300">{frame.caption}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="border border-border-subtle px-6 py-16 text-center">No frames for that ride.</p>
      )}

      {open ? <Lightbox frame={open} onClose={() => setOpenId(null)} /> : null}
    </div>
  );
}

function Lightbox({ frame, onClose }: { frame: GalleryFrame; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(true, ref);
  useBodyScrollLock(true);
  useEscapeKey(onClose);

  return (
    <div className="fixed inset-0 z-50 bg-obsidian-950/80">
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-frame-title"
        className="flex h-full items-end justify-center p-4 sm:items-center"
      >
        <button
          type="button"
          aria-label="Close frame"
          tabIndex={-1}
          className="absolute inset-0 cursor-pointer"
          onClick={onClose}
        />
        <div className="relative z-10 grid w-full max-w-4xl overflow-hidden border border-border-subtle bg-obsidian-950 md:grid-cols-2">
          <div className="relative min-h-72">
            <ChapterFrame tone={frame.tone} label={frame.ride_title ?? "The road"} title={frame.title} />
          </div>
          <div className="flex flex-col p-6 md:p-8">
            <button
              type="button"
              onClick={onClose}
              className="mb-6 h-11 cursor-pointer self-end border border-border px-4 text-[0.68rem] uppercase tracking-[0.18em]"
            >
              Close
            </button>
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-gold-500">
              {frame.taken_on ? formatDate(`${frame.taken_on}T12:00:00`) : "The road"}
            </p>
            <h2 id="gallery-frame-title" className="mt-4 font-medium">
              {frame.title}
            </h2>
            <p className="mt-4">{frame.caption}</p>
            <div className="mt-auto flex flex-col gap-3 pt-8 text-sm">
              {frame.ride_slug && frame.ride_title ? (
                <Link
                  href={ROUTES.ride(frame.ride_slug)}
                  prefetch={isLiveRoute(ROUTES.ride(frame.ride_slug))}
                  className="text-gold-400"
                >
                  Ride · {frame.ride_title}
                </Link>
              ) : null}
              {frame.rider_slug && frame.rider_name ? (
                <Link
                  href={ROUTES.rider(frame.rider_slug)}
                  prefetch={isLiveRoute(ROUTES.rider(frame.rider_slug))}
                  className="text-ivory-100"
                >
                  Rider · {frame.rider_name}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterChip({
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
          ? "h-10 cursor-pointer border border-gold-500 bg-gold-500 px-3 text-[0.68rem] uppercase tracking-[0.16em] text-obsidian-950"
          : "h-10 cursor-pointer border border-border bg-transparent px-3 text-[0.68rem] uppercase tracking-[0.16em] text-ivory-100"
      }
    >
      {children}
    </button>
  );
}
