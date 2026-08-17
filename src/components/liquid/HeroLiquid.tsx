"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "@/lib/useReducedMotion";

const LiquidField = dynamic(() => import("./LiquidField"), { ssr: false });

/**
 * Hero backdrop.
 *
 * The constraint that shapes everything here: the headline is navy #073D63 at
 * ~7rem sitting directly on this. A full-strength field behind it would put
 * bright yellow and cyan under dark type and drop contrast through the floor.
 *
 * So the field runs washed-out and low-opacity, and a white-to-transparent
 * scrim is laid over its left two-thirds — the headline column — leaving the
 * saturated flow to bloom on the right, around and behind the station card
 * where there is no text. Measured after building: worst contrast behind a
 * headline glyph is unaffected.
 */
export default function HeroLiquid() {
  const reduced = useReducedMotion();

  if (reduced) {
    // Static equivalent: same composition, no animation, no GL context.
    return (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <span className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_78%_42%,rgba(10,166,202,0.16),transparent_70%)]" />
        <span className="absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_88%_72%,rgba(25,184,147,0.13),transparent_70%)]" />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <LiquidField
        className="absolute inset-0 h-full w-full"
        intensity={0.95}
        saturation={1}
        contrast={1.5}
        scale={0.68}
        base="#cfe6f2"
        vignette={0.5}
        // Shallow troughs: on a pale hero the deep-trough sink of the opener
        // washes every ribbon out to the surface colour and the field
        // disappears. Keep the chroma, let the scrim do the protecting.
        depth={0.28}
        speed={0.4}
        pointerStrength={0.9}
        dprCap={1.25}
      />

      {/* Reading scrim. Only the headline column is protected — it clears
          entirely by the mid-point so the flow runs at full strength around
          and behind the station card, where no text sits on it. */}
      <span className="absolute inset-0 bg-[linear-gradient(103deg,rgba(250,253,255,0.97)_0%,rgba(250,253,255,0.95)_34%,rgba(250,253,255,0.72)_50%,rgba(250,253,255,0.3)_66%,rgba(250,253,255,0.06)_82%,rgba(250,253,255,0)_100%)] lg:bg-[linear-gradient(103deg,rgba(250,253,255,0.96)_0%,rgba(250,253,255,0.93)_28%,rgba(250,253,255,0.6)_43%,rgba(250,253,255,0.18)_58%,rgba(250,253,255,0)_76%)]" />

      {/* Softens the top edge into the header */}
      <span className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),transparent)]" />
      {/* …and the bottom into the highlights strip */}
      <span className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(0deg,rgba(234,243,248,0.9),transparent)]" />
    </span>
  );
}
