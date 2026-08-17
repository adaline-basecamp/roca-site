"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

type ShimmerDropProps = {
  className?: string;
};

export default function ShimmerDrop({ className = "" }: ShimmerDropProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    const tween = gsap.to(el, {
      backgroundPosition: "100% 50%",
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`gradient-shimmer pointer-events-none absolute rounded-full opacity-30 blur-3xl ${className}`}
      style={{ backgroundPosition: "0% 50%" }}
    />
  );
}
