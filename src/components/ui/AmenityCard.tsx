"use client";

import { useRef } from "react";
import Icon, { type IconName } from "./Icon";
import { ACCENT_INK, ACCENT_VAR } from "@/lib/constants";

/**
 * White card, one functional accent, icon, title, one line — the component
 * the client's documentation specifies.
 *
 * The accent appears three times at three strengths (icon chip tint, icon
 * colour, base rule) so the card reads as belonging to one category without
 * ever putting coloured ink under body copy.
 *
 * The rule under the card fills left-to-right on hover: the "liquid flowing"
 * construction concept from the brand guidelines, applied at component scale.
 */
export default function AmenityCard({
  name,
  description,
  accent,
  icon,
}: {
  name: string;
  description: string;
  accent: string;
  icon: IconName;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Chip tint and base rule take the signal tone; the 1.6-stroke glyph drawn
  // on that tint needs the darker twin or the yellow one all but vanishes.
  const color = ACCENT_VAR[accent] ?? "var(--color-route)";
  const glyph = ACCENT_INK[accent] ?? "var(--color-route-ink)";

  return (
    <div
      ref={ref}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-line transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(7,61,99,0.12)] sm:p-7"
    >
      <span
        aria-hidden="true"
        className="inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-500 group-hover:scale-[1.06]"
        style={{
          background: `color-mix(in srgb, ${color} 14%, white)`,
          color: glyph,
        }}
      >
        <Icon name={icon} className="h-6 w-6" />
      </span>

      <h3 className="font-display mt-5 text-lg font-semibold text-navy-900">
        {name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>

      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 transition-transform duration-[600ms] group-hover:scale-x-100"
        style={{ background: color }}
      />
    </div>
  );
}
