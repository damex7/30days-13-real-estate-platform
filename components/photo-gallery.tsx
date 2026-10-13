"use client";

import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import Image from "next/image";
import { useState, type KeyboardEvent } from "react";

import { cn } from "@/lib/utils";

const ARROW =
  "absolute top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none";

export function PhotoGallery({ photos, alt }: { photos: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const count = photos.length;

  if (count === 0) {
    return (
      <div className="grid aspect-[16/9] place-items-center rounded-2xl bg-line text-muted">
        <div className="flex flex-col items-center gap-2 text-sm">
          <ImageOff className="size-8" aria-hidden />
          No photos available
        </div>
      </div>
    );
  }

  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") go(-1);
    if (event.key === "ArrowRight") go(1);
  }

  return (
    <section aria-roledescription="carousel" aria-label="Property photos" onKeyDown={onKeyDown}>
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-line">
        <Image
          key={photos[index]}
          src={photos[index]}
          alt={`${alt}, photo ${index + 1} of ${count}`}
          fill
          loading="eager"
          sizes="(min-width: 1280px) 1216px, 100vw"
          className="object-cover"
        />
        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} className={cn(ARROW, "left-3")} aria-label="Previous photo">
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button type="button" onClick={() => go(1)} className={cn(ARROW, "right-3")} aria-label="Next photo">
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </>
        )}
        <span className="absolute right-3 bottom-3 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white" aria-live="polite">
          {index + 1} / {count}
        </span>
      </div>

      {count > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, i) => (
            <li key={photo} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "relative block h-16 w-24 overflow-hidden rounded-lg ring-2 ring-transparent transition",
                  i === index ? "ring-brand" : "opacity-70 hover:opacity-100",
                )}
              >
                <Image src={photo} alt="" fill sizes="96px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
