"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ensureExpoEase, prefersReducedMotion } from "@/lib/motion";

type HeroStaggerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function HeroStagger({
  children,
  className = "",
}: HeroStaggerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) return;

    const ease = ensureExpoEase();
    const items = Array.from(el.children);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease,
          stagger: 0.12,
          delay: 0.15,
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
