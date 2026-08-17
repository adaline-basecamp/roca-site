"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import rocaLogo from "../../../public/brand/derived/roca-lockup.png";
import DropLayers from "./DropLayers";
import { DROP_VIEWBOX } from "./dropLayerPaths";
import LiquidField, { type LiquidHandle } from "@/components/liquid/LiquidField";
import { prefersReducedMotion, hasPlayedOnce, markPlayedOnce } from "@/lib/motion";

const KEY = "roca-opener-played";

// Hard ceiling. Whatever happens to the timeline — an interrupted tween, a
// backgrounded tab mid-fall — the overlay is gone by here.
const MAX_MS = 4200;

/**
 * Branded opening reveal: a drop falls, lands, and ripples out into the
 * refined product.
 *
 * The brand guidelines name three construction concepts — drop icon,
 * layer-by-layer processing, liquid flowing. This sequences all three in
 * order, so the loader tells the refining story rather than filling time:
 *
 *   0.00  the drop falls from above, accelerating under gravity
 *   0.62  impact — it squashes, then settles
 *   0.70  rings ripple outward from the point of contact
 *   0.85  the liquid field blooms out of the impact, drop dissolving into it
 *   1.45  the wordmark wipes up
 *   2.35  the whole panel lifts away
 *
 * The fall uses a true gravity curve (power3.in) rather than an ease, so the
 * drop genuinely accelerates into the surface instead of gliding to it.
 *
 * Constraints from the client's motion spec, all enforced:
 *  - auto-exits, no interaction required
 *  - never blocks: a focusable Skip is live from the first frame
 *  - once per session, not once per navigation
 *  - skipped entirely under prefers-reduced-motion
 */
export default function BrandOpener() {
  const [mounted, setMounted] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const dropInnerRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);
  const fieldWrapRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const liquidRef = useRef<LiquidHandle>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (prefersReducedMotion() || hasPlayedOnce(KEY)) return;
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useLayoutEffect(() => {
    if (!mounted) return;
    const root = rootRef.current;
    if (!root) return;

    const rings = ringsRef.current
      ? Array.from(ringsRef.current.children)
      : [];

    document.documentElement.style.setProperty("overflow", "hidden");

    const tl = gsap.timeline({
      onComplete: () => {
        markPlayedOnce(KEY);
        document.documentElement.style.removeProperty("overflow");
        setMounted(false);
      },
    });
    tlRef.current = tl;

    const flow = { v: 0 };

    // Fall distance is measured from the viewport, not the element: yPercent
    // is relative to the drop's own 80px box, so it started clipped at the top
    // edge on tall screens instead of entering from off-screen.
    const fallFrom = -(window.innerHeight / 2 + 140);
    gsap.set(dropRef.current, { y: fallFrom, opacity: 1 });
    gsap.set(dropInnerRef.current, { scaleX: 0.82, scaleY: 1.22 });
    gsap.set(rings, { scale: 0, opacity: 0 });
    gsap.set(fieldWrapRef.current, { opacity: 0 });
    gsap.set(logoRef.current, { yPercent: 115 });
    gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });

    tl
      // ── Fall. power3.in is a genuine acceleration curve; an ease-out here
      //    would read as the drop being lowered rather than falling.
      .to(dropRef.current, {
        y: 0,
        duration: 0.62,
        ease: "power3.in",
      })
      // Stretch on the way down, squash on contact.
      .to(
        dropInnerRef.current,
        { scaleX: 0.74, scaleY: 1.34, duration: 0.4, ease: "power2.in" },
        0.2
      )
      .to(dropInnerRef.current, {
        scaleX: 1.5,
        scaleY: 0.44,
        duration: 0.11,
        ease: "power2.out",
      })
      .to(dropInnerRef.current, {
        scaleX: 1,
        scaleY: 1,
        duration: 0.34,
        ease: "elastic.out(1, 0.45)",
      })

      // ── Ripples out of the impact point.
      .to(
        rings,
        {
          scale: 1,
          opacity: 0.5,
          duration: 0.1,
          stagger: 0.16,
          ease: "none",
        },
        0.63
      )
      .to(
        rings,
        {
          scale: 9,
          opacity: 0,
          duration: 1.5,
          stagger: 0.16,
          ease: "power2.out",
        },
        0.68
      )

      // ── The drop dissolves into the liquid it became.
      .to(
        flow,
        {
          v: 1,
          duration: 1.25,
          ease: "power2.out",
          onUpdate: () => liquidRef.current?.setIntensity(flow.v),
        },
        0.82
      )
      .to(fieldWrapRef.current, { opacity: 1, duration: 1.1, ease: "power2.out" }, 0.82)
      .to(
        dropRef.current,
        { scale: 2.4, opacity: 0, duration: 0.85, ease: "power2.in" },
        0.86
      )

      // ── Brand resolves.
      .to(logoRef.current, { yPercent: 0, duration: 0.85, ease: "expo.out" }, 1.42)
      .to(lineRef.current, { scaleX: 1, duration: 0.75, ease: "expo.out" }, 1.6)

      // ── Exit as one panel.
      .to({}, { duration: 0.3 })
      .to(fieldWrapRef.current, { opacity: 0.5, duration: 0.5, ease: "power2.in" }, "out")
      .to(
        lineRef.current,
        { scaleX: 0, transformOrigin: "right center", duration: 0.4, ease: "power2.in" },
        "out"
      )
      .to(logoRef.current, { yPercent: -115, duration: 0.6, ease: "expo.in" }, "out+=0.08")
      .to(root, { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "out+=0.3");

    const bail = window.setTimeout(() => tl.progress(1), MAX_MS);

    return () => {
      clearTimeout(bail);
      tl.kill();
      document.documentElement.style.removeProperty("overflow");
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] overflow-hidden bg-navy-950"
      role="status"
      aria-label="Roca Fuels"
    >
      <div ref={fieldWrapRef} className="absolute inset-0">
        <LiquidField
          ref={liquidRef}
          className="h-full w-full"
          intensity={0}
          saturation={1}
          contrast={1.15}
          scale={1.15}
          base="#062f4e"
          vignette={0.85}
          depth={0.62}
          speed={1.15}
          pointerStrength={0.6}
        />
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_32%_at_50%_50%,rgba(4,40,63,0.6),transparent_70%)]"
      />

      {/* Impact point — drop and ripples share this centre */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative grid place-items-center">
          {/* Ripples: flattened ellipses, as a ring on a liquid surface reads
              in perspective rather than as a flat circle. */}
          <div ref={ringsRef} className="pointer-events-none absolute" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 block h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/45"
                style={{ height: "3.5rem", width: "7rem" }}
              />
            ))}
          </div>

          <div ref={dropRef} className="relative">
            <div ref={dropInnerRef} style={{ transformOrigin: "50% 100%" }}>
              <svg viewBox={DROP_VIEWBOX} className="h-24 w-[6.4rem] sm:h-28 sm:w-[7.5rem]">
                <DropLayers />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Wordmark sits below the impact */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[26%] grid place-items-center px-8">
        <div className="flex flex-col items-center">
          <div className="overflow-hidden">
            <div ref={logoRef} className="relative h-10 w-[12.5rem] sm:h-12 sm:w-[15rem]">
              <Image
                src={rocaLogo}
                alt=""
                fill
                priority
                className="object-contain brightness-0 invert"
              />
            </div>
          </div>
          <span
            ref={lineRef}
            aria-hidden="true"
            className="mt-5 block h-px w-36 bg-white/40 sm:w-48"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => tlRef.current?.progress(1)}
        className="absolute bottom-7 right-7 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-white/50 transition-colors hover:text-white focus-visible:text-white"
      >
        Skip
      </button>
    </div>
  );
}
