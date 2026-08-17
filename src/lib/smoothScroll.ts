import type Lenis from "lenis";

// Set by <SmoothScroll> once Lenis has mounted; consumed by anything (e.g.
// the mobile nav drawer) that needs to suspend momentum scrolling while a
// modal overlay is open.
let lenis: Lenis | null = null;
let stopDepth = 0;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

export function lockScroll() {
  stopDepth += 1;
  lenis?.stop();
}

export function unlockScroll() {
  stopDepth = Math.max(0, stopDepth - 1);
  if (stopDepth === 0) lenis?.start();
}
