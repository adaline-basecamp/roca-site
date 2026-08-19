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

      {/* Reading scrim.
          Two different problems, so two different gradients.

          From lg up the layout is side-by-side, so the scrim runs horizontally:
          it protects the headline column and clears by the mid-point, leaving
          the flow at full strength around the model where no text sits.

          Below lg the layout is stacked, and that same horizontal gradient was
          still 0.72 opaque at the halfway mark — across a 390px viewport that
          veils the entire width and the wave disappears. Mobile instead runs
          the scrim vertically, veiling the headline band at the top and the
          copy and CTAs at the bottom, and opening up through the middle where
          the model sits and there is no text to protect. */}
      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,253,255,0.9)_0%,rgba(250,253,255,0.82)_16%,rgba(250,253,255,0.38)_31%,rgba(250,253,255,0.1)_44%,rgba(250,253,255,0.26)_57%,rgba(250,253,255,0.68)_66%,rgba(250,253,255,0.94)_74%,rgba(250,253,255,0.96)_100%)] lg:bg-[linear-gradient(103deg,rgba(250,253,255,0.96)_0%,rgba(250,253,255,0.93)_28%,rgba(250,253,255,0.6)_43%,rgba(250,253,255,0.18)_58%,rgba(250,253,255,0)_76%)]" />

      {/* Softens the top edge into the header */}
      <span className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),transparent)]" />
      {/* …and the bottom into the highlights strip */}
      <span className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(0deg,rgba(234,243,248,0.9),transparent)]" />
    </span>
  );
}
