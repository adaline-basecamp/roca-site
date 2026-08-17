"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ensureExpoEase, prefersReducedMotion } from "@/lib/motion";

type GradientRuleProps = {
  className?: string;
  "data-hero"?: string;
};

// The thin gradient rule under the hero eyebrow: one slow background-position
// sweep on load, then it rests — no loop.
export default function GradientRule({ className = "", ...rest }: GradientRuleProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) return;

    const ease = ensureExpoEase();
    const tween = gsap.fromTo(
      el,
      { backgroundPosition: "0% 50%" },
      { backgroundPosition: "100% 50%", duration: 1.2, delay: 0.2, ease }
    );

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <span
      ref={ref}
      {...rest}
      className={`gradient-rule-shimmer block rounded-full ${className}`}
    />
  );
}
