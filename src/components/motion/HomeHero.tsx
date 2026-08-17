"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ensureExpoEase, prefersReducedMotion } from "@/lib/motion";

type HomeHeroProps = {
  children: React.ReactNode;
  className?: string;
};

// Load-in choreography, timed to spec: structure 0-200ms, headline lines
// 200-600ms, subtitle 400-800ms, CTAs 600-900ms. Elements opt in via
// data-hero="structure|line|subtitle|cta".
export default function HomeHero({ children, className = "" }: HomeHeroProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ease = ensureExpoEase();
    const structure = el.querySelectorAll('[data-hero="structure"]');
    const lines = el.querySelectorAll('[data-hero="line"]');
    const subtitle = el.querySelectorAll('[data-hero="subtitle"]');
    const ctas = el.querySelectorAll('[data-hero="cta"]');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease } });
      tl.fromTo(
        structure,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.2 },
        0
      )
        .fromTo(
          lines,
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, duration: 0.65, stagger: 0.12 },
          0.2
        )
        .fromTo(
          subtitle,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          0.4
        )
        .fromTo(
          ctas,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
          0.6
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
