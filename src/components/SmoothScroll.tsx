"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/lib/smoothScroll";
import { prefersReducedMotion } from "@/lib/motion";

// Expo-out shaped duration/decay: matches the site's cubic-bezier(0.16,1,0.3,1)
// house curve (Lenis takes a plain easing function, not a CSS string).
const expoOut = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.15,
      easing: expoOut,
      smoothWheel: true,
      touchMultiplier: 1.2,
    });

    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
