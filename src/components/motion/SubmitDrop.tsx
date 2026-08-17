"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import DropGlyph from "./DropGlyph";
import { ensureExpoEase, prefersReducedMotion } from "@/lib/motion";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

type SubmitDropProps = {
  status: SubmitStatus;
  className?: string;
};

// Submit-button glyph: empty outline at rest, fills bottom-up on a loading
// loop while in flight, settles full with a check on success, empties on error.
export default function SubmitDrop({ status, className = "h-5 w-5" }: SubmitDropProps) {
  const rectRef = useRef<SVGRectElement>(null);
  const checkRef = useRef<SVGPathElement>(null);
  const activeTween = useRef<gsap.core.Tween | gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const rect = rectRef.current;
    const check = checkRef.current;
    if (!rect || !check) return;

    activeTween.current?.kill();

    if (prefersReducedMotion()) {
      if (status === "submitting") {
        gsap.set(rect, { y: 40 });
        gsap.set(check, { opacity: 0, scale: 0.5 });
      } else if (status === "success") {
        gsap.set(rect, { y: 0 });
        gsap.set(check, { opacity: 1, scale: 1 });
      } else {
        gsap.set(rect, { y: 100 });
        gsap.set(check, { opacity: 0, scale: 0.5 });
      }
      return;
    }

    const ease = ensureExpoEase();

    if (status === "submitting") {
      gsap.set(check, { opacity: 0, scale: 0.5 });
      gsap.set(rect, { y: 100 });
      activeTween.current = gsap.to(rect, {
        y: 0,
        duration: 0.8,
        ease: "power1.inOut",
        repeat: -1,
        repeatDelay: 0.15,
      });
    } else if (status === "success") {
      const tl = gsap.timeline();
      tl.to(rect, { y: 0, duration: 0.3, ease }).to(
        check,
        { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" },
        "-=0.05"
      );
      activeTween.current = tl;
    } else if (status === "error") {
      gsap.to(check, { opacity: 0, scale: 0.5, duration: 0.2, ease });
      activeTween.current = gsap.to(rect, { y: 100, duration: 0.4, ease });
    } else {
      gsap.set(check, { opacity: 0, scale: 0.5 });
      activeTween.current = gsap.to(rect, { y: 100, duration: 0.35, ease });
    }

    return () => {
      activeTween.current?.kill();
    };
  }, [status]);

  return (
    <span className={`relative inline-block shrink-0 ${className}`}>
      <DropGlyph
        ref={rectRef}
        className="h-full w-full"
        outlineClassName="text-white/50"
        startY={100}
      />
      <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full">
        <path
          ref={checkRef}
          d="M28 52 L44 68 L74 32"
          fill="none"
          stroke="#ffffff"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transformOrigin: "50% 50%", transform: "scale(0.5)", opacity: 0 }}
        />
      </svg>
    </span>
  );
}
