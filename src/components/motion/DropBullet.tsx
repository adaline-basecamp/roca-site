"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DropGlyph from "./DropGlyph";
import { ensureExpoEase, prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type DropBulletProps = {
  className?: string;
  outlineClassName?: string;
  delay?: number;
};

// List/feature marker: an outlined drop that fills bottom-up with the
// banded gradient once it scrolls into view.
export default function DropBullet({
  className = "h-7 w-7 shrink-0",
  outlineClassName,
  delay = 0,
}: DropBulletProps) {
  const rectRef = useRef<SVGRectElement>(null);

  useLayoutEffect(() => {
    const rect = rectRef.current;
    if (!rect) return;

    if (prefersReducedMotion()) {
      gsap.set(rect, { y: 0 });
      return;
    }

    const ease = ensureExpoEase();
    const ctx = gsap.context(() => {
      gsap.to(rect, {
        y: 0,
        duration: 0.5,
        delay,
        ease,
        scrollTrigger: {
          trigger: rect,
          start: "top 88%",
          once: true,
        },
      });
    });

    return () => ctx.revert();
  }, [delay]);

  return (
    <DropGlyph ref={rectRef} className={className} outlineClassName={outlineClassName} />
  );
}
