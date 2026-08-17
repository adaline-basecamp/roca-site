"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import DropLayers from "@/components/motion/DropLayers";
import { DROP_VIEWBOX } from "@/components/motion/dropLayerPaths";
import { useReducedMotion } from "@/lib/useReducedMotion";

// ssr:false keeps three.js out of the static-export HTML and off the critical
// path — the card renders its frame immediately and the canvas fills in.
const StationScene = dynamic(() => import("./StationScene"), { ssr: false });

/**
 * The hero's right-hand card: the station model framed by the two status
 * chips a driver checks first. Chips sit outside the canvas so they stay
 * readable while the model rotates behind them.
 */
export default function StationStage({ className = "" }: { className?: string }) {
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();

  return (
    /* No card. The station reads as a place you can turn around in, and a
       bordered panel framed it like a product photo — it also cut a hard
       rectangle through the liquid field running behind the whole hero. */
    <div className={`relative ${className}`}>
      {/* Warm floor glow — the forecourt light pooling under the canopy, and
          the only thing grounding the model now the panel is gone. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 bottom-8 h-1/4 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(245,202,0,0.16),transparent_72%)] blur-2xl"
      />

      {/* No status chips here. They repeated the opening hours and the
          location that the utility bar and hero eyebrow already state — three
          "Open 24 Hours" in one viewport. The model is self-evidently the
          station, and its own canopy and totem now carry the branding. */}

      {reduced ? (
        <StationPoster />
      ) : (
        <>
          <StationScene
            className="h-[270px] w-full sm:h-[400px] lg:h-[560px]"
            onReady={() => setReady(true)}
          />
          {/* Holds the card's shape until the first frame lands, so there's
              no collapse-then-pop while the canvas boots. */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-700 ${
              ready ? "opacity-0" : "opacity-100"
            }`}
          >
            <svg viewBox={DROP_VIEWBOX} className="h-20 w-[3.6rem] animate-pulse">
              <DropLayers />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}

/** Static stand-in under prefers-reduced-motion — same framing, no canvas. */
function StationPoster() {
  return (
    <div className="grid h-[270px] w-full place-items-center sm:h-[400px] lg:h-[560px]">
      <svg viewBox="0 0 240 150" className="h-4/5 w-4/5" aria-hidden="true">
        <rect x="18" y="112" width="204" height="10" rx="3" fill="#16324a" />
        <rect x="34" y="46" width="8" height="66" fill="#dfe8ee" />
        <rect x="198" y="46" width="8" height="66" fill="#dfe8ee" />
        <rect x="26" y="30" width="188" height="16" rx="3" fill="#073d63" />
        <rect x="26" y="46" width="188" height="4" fill="url(#stationFascia)" />
        <rect x="86" y="70" width="18" height="42" rx="3" fill="#f2f6f9" />
        <rect x="136" y="70" width="18" height="42" rx="3" fill="#f2f6f9" />
        <rect x="90" y="76" width="10" height="9" rx="1.5" fill="#0aa6ca" />
        <rect x="140" y="76" width="10" height="9" rx="1.5" fill="#19b893" />
        <defs>
          <linearGradient id="stationFascia" x1="0" x2="1">
            <stop offset="0" stopColor="#1C59C5" />
            <stop offset="0.28" stopColor="#009CC4" />
            <stop offset="0.48" stopColor="#15B98C" />
            <stop offset="0.66" stopColor="#F5CA00" />
            <stop offset="0.84" stopColor="#FF9F13" />
            <stop offset="1" stopColor="#FD2C3A" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
