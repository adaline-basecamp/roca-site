"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import rocaLogo from "../../public/brand/derived/roca-lockup.png";
import DropLayers from "./motion/DropLayers";
import { DROP_LAYER_BUILD_ORDER } from "./motion/dropLayerPaths";
import {
  DUR,
  STAGGER,
  SETTLE_EASE,
  ensureExpoEase,
  prefersReducedMotion,
  hasPlayedOnce,
  markPlayedOnce,
} from "@/lib/motion";

type DropLogoProps = {
  variant?: "light" | "dark";
  className?: string;
  showWordmark?: boolean;
  /**
   * "assembly": header treatment — first-load-per-session layer build +
   * liquid-flow hover drift.
   * "pulse": footer treatment — bands brighten once, sequentially
   * bottom-up, when the mark enters the viewport.
   * "none": static flattened lockup, no overlay.
   */
  dropAnimation?: "none" | "assembly" | "pulse";
};

// Percent bbox of the drop inside the 900x385 lockup artwork (traced by
// isolating its saturated pixels) — positions the animated layered mark
// exactly where the flattened PNG's drop sits, so the overlay reads as part
// of the same logo rather than a sticker on top of it.
const DROP_BBOX = { left: 21.889, top: 9.091, width: 13, height: 39.221 };

const ASSEMBLY_KEY = "roca-header-assembly-played";

export default function DropLogo({
  variant = "light",
  className = "",
  showWordmark = true,
  dropAnimation = "none",
}: DropLogoProps) {
  const subColor = variant === "light" ? "text-white/70" : "text-muted";
  const showDrop = dropAnimation !== "none";
  const startsHidden = dropAnimation === "assembly";

  const imageWrapRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const layerRefs = useRef(new Map<string, SVGPathElement>());
  const hoverTweens = useRef(new Map<string, gsap.core.Tween>());

  useLayoutEffect(() => {
    if (dropAnimation !== "assembly") return;
    const layers = layerRefs.current;
    if (!layers.size) return;

    const image = imageWrapRef.current;
    const subtitle = subtitleRef.current;
    const skip = prefersReducedMotion() || hasPlayedOnce(ASSEMBLY_KEY);

    if (skip) {
      gsap.set([...layers.values()], { opacity: 1, scale: 1, y: 0 });
      if (image) gsap.set(image, { opacity: 1 });
      if (subtitle) gsap.set(subtitle, { opacity: 1, y: 0 });
      return;
    }

    const ease = ensureExpoEase();
    gsap.set([...layers.values()], {
      opacity: 0,
      scale: 0.55,
      transformOrigin: "50% 100%",
      y: 4,
    });
    gsap.set(image, { opacity: 0 });
    gsap.set(subtitle, { opacity: 0, y: 8 });

    const tl = gsap.timeline({
      onComplete: () => markPlayedOnce(ASSEMBLY_KEY),
    });
    DROP_LAYER_BUILD_ORDER.forEach((key, i) => {
      const el = layers.get(key);
      if (!el) return;
      tl.to(
        el,
        { opacity: 1, scale: 1, y: 0, duration: DUR.slow, ease: SETTLE_EASE },
        i * STAGGER
      );
    });
    tl.to(image, { opacity: 1, duration: DUR.base, ease }, "-=0.35");
    tl.to(subtitle, { opacity: 1, y: 0, duration: DUR.base, ease }, "-=0.3");

    return () => {
      tl.kill();
    };
  }, [dropAnimation]);

  useEffect(() => {
    if (dropAnimation !== "pulse") return;
    if (prefersReducedMotion()) return;
    const target = imageWrapRef.current?.parentElement;
    if (!target) return;
    const layers = layerRefs.current;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();
        const tl = gsap.timeline();
        DROP_LAYER_BUILD_ORDER.forEach((key, i) => {
          const el = layers.get(key);
          if (!el) return;
          tl.to(
            el,
            { filter: "brightness(1.55) saturate(1.15)", duration: 0.3, ease: "sine.out" },
            i * 0.09
          ).to(
            el,
            { filter: "brightness(1) saturate(1)", duration: 0.45, ease: "sine.inOut" },
            i * 0.09 + 0.3
          );
        });
      },
      { threshold: 0.4 }
    );
    io.observe(target);
    return () => io.disconnect();
  }, [dropAnimation]);

  const handleHoverStart = () => {
    if (dropAnimation !== "assembly" || prefersReducedMotion()) return;
    layerRefs.current.forEach((el, key) => {
      const i = DROP_LAYER_BUILD_ORDER.indexOf(
        key as (typeof DROP_LAYER_BUILD_ORDER)[number]
      );
      const dir = i % 2 === 0 ? 1 : -1;
      const tween = gsap.to(el, {
        x: dir * (1.6 + (i % 3) * 0.6),
        duration: 1.7 + i * 0.18,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      hoverTweens.current.set(key, tween);
    });
  };

  const handleHoverEnd = () => {
    hoverTweens.current.forEach((tween) => tween.kill());
    hoverTweens.current.clear();
    layerRefs.current.forEach((el) => {
      gsap.to(el, { x: 0, duration: DUR.slow, ease: ensureExpoEase() });
    });
  };

  return (
    <span
      className={`inline-flex flex-col items-start ${className}`}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      <span className="relative inline-block h-9 shrink-0 self-start" style={{ aspectRatio: "900 / 385" }}>
        <span
          ref={imageWrapRef}
          className="relative block h-full w-full"
          style={startsHidden ? { opacity: 0 } : undefined}
        >
          <Image
            src={rocaLogo}
            alt="Roca Fuels"
            fill
            className={`object-contain ${variant === "light" ? "brightness-0 invert" : ""}`}
            priority
          />
        </span>
        {showDrop && (
          <svg
            viewBox="0 0 100 100"
            aria-hidden="true"
            className="pointer-events-none absolute"
            style={{
              left: `${DROP_BBOX.left}%`,
              top: `${DROP_BBOX.top}%`,
              width: `${DROP_BBOX.width}%`,
              height: `${DROP_BBOX.height}%`,
            }}
          >
            <DropLayers
              initialHidden={startsHidden}
              layerRef={(key, el) => {
                if (el) layerRefs.current.set(key, el);
                else layerRefs.current.delete(key);
              }}
            />
          </svg>
        )}
      </span>
      {showWordmark && (
        <span
          ref={subtitleRef}
          className={`mt-1 block text-[10px] uppercase tracking-[0.2em] ${subColor}`}
          style={startsHidden ? { opacity: 0, transform: "translateY(8px)" } : undefined}
        >
          A Roca Holdings Company
        </span>
      )}
    </span>
  );
}
