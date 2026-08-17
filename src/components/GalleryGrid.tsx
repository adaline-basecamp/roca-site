"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type GalleryImage = { src: string; width: number; height: number };
type GalleryCategory = {
  slug: string;
  label: string;
  count: number;
  images: GalleryImage[];
};

const CATEGORY_ORDER = [
  "opening",
  "mrpl-partnership",
  "station",
  "our-team",
  "community-safety",
  "milestones",
];

export default function GalleryGrid({
  categories,
}: {
  categories: GalleryCategory[];
}) {
  const ordered = useMemo(
    () =>
      [...categories].sort(
        (a, b) => CATEGORY_ORDER.indexOf(a.slug) - CATEGORY_ORDER.indexOf(b.slug)
      ),
    [categories]
  );

  const [active, setActive] = useState<string>("all");

  const visible =
    active === "all" ? ordered : ordered.filter((c) => c.slug === active);

  // In the "All" view four identical dashed empty-states stacked in a row read
  // as a broken page rather than a growing one. Show the shot categories, then
  // name the pending ones once in a single line.
  const shown = active === "all" ? visible.filter((c) => c.count > 0) : visible;
  const pending = active === "all" ? visible.filter((c) => c.count === 0) : [];

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setActive("all")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            active === "all"
              ? "bg-navy-900 text-white"
              : "bg-surface text-muted hover:bg-navy-100"
          }`}
        >
          All
        </button>
        {ordered.map((category) => (
          <button
            key={category.slug}
            type="button"
            onClick={() => setActive(category.slug)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active === category.slug
                ? "bg-navy-900 text-white"
                : "bg-surface text-muted hover:bg-navy-100"
            }`}
          >
            {category.label}
            {category.count === 0 && (
              <span className="ml-1.5 text-xs font-normal text-muted">
                soon
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-12 space-y-16">
        {shown.map((category) => (
          <div key={category.slug}>
            {active === "all" && (
              <h2 className="mb-6 text-xl font-bold text-navy-900">
                {category.label}
              </h2>
            )}

            {category.count > 0 ? (
              <div className="columns-2 gap-4 sm:columns-3 [&>*]:mb-4">
                {category.images.map((image) => (
                  <div
                    key={image.src}
                    className="group relative overflow-hidden rounded-xl bg-surface ring-1 ring-line"
                  >
                    <Image
                      src={image.src}
                      alt={`Roca Fuels — ${category.label}`}
                      width={image.width}
                      height={image.height}
                      className="w-full transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/70 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="text-xs font-medium text-white">
                        {category.label} — Calicut, Kerala
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-surface px-8 py-16 text-center">
                <span className="bg-gradient-drop h-2 w-10 rounded-full" />
                <p className="mt-4 text-sm font-semibold text-muted">
                  {category.label} — Coming Soon
                </p>
                <p className="mt-1.5 max-w-sm text-sm text-muted">
                  This gallery is growing. Check back soon for photos from
                  this category.
                </p>
              </div>
            )}
          </div>
        ))}

        {pending.length > 0 && (
          <div className="rounded-2xl border border-dashed border-line bg-surface px-6 py-8 text-center sm:px-10">
            <span className="bg-gradient-drop mx-auto block h-1.5 w-10 rounded-full" />
            <p className="mt-4 text-sm font-semibold text-muted">
              Still being shot
            </p>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted">
              {pending.map((c) => c.label).join(" · ")} — this gallery is
              growing. Check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
