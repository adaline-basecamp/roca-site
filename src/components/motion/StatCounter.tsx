"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureExpoEase, prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type StatCounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

export default function StatCounter({
  value,
  prefix = "",
  suffix = "",
  label,
}: StatCounterProps) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const numberEl = numberRef.current;
    const wrapEl = wrapRef.current;
    if (!numberEl || !wrapEl) return;

    if (prefersReducedMotion()) {
      numberEl.textContent = `${prefix}${value}${suffix}`;
      return;
    }

    const ease = ensureExpoEase();
    const counter = { n: 0 };
    const ctx = gsap.context(() => {
      gsap.to(counter, {
        n: value,
        duration: 1.6,
        ease,
        scrollTrigger: {
          trigger: wrapEl,
          start: "top 90%",
          once: true,
        },
        onUpdate: () => {
          numberEl.textContent = `${prefix}${Math.round(counter.n)}${suffix}`;
        },
      });
    }, wrapEl);

    return () => ctx.revert();
  }, [value, prefix, suffix]);

  return (
    <div ref={wrapRef} className="text-center sm:text-left">
      <span
        ref={numberRef}
        className="text-4xl font-extrabold tabular-nums text-white sm:text-5xl"
      >
        {prefix}0{suffix}
      </span>
      <span className="bg-gradient-drop mx-auto mt-2 block h-0.5 w-8 rounded-full sm:mx-0" />
      <p className="mt-2 text-sm font-medium text-white/70">{label}</p>
    </div>
  );
}
