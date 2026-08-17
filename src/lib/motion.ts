import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

// Single house curve for the whole site — expo-out. No default/linear easing
// anywhere: CSS transitions pick it up via the --ease-* overrides in
// globals.css, GSAP tweens reference the "expoOut" id registered below.
export const EXPO_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
export const EXPO_OUT_ID = "expoOut";

let registered = false;

export function ensureExpoEase() {
  if (registered || typeof window === "undefined") return EXPO_OUT_ID;
  registered = true;
  gsap.registerPlugin(CustomEase);
  CustomEase.create(EXPO_OUT_ID, "0.16, 1, 0.3, 1");
  return EXPO_OUT_ID;
}

// Two-sided curve for pinned/scroll-linked moves that ease in AND out.
export const EASE_INOUT = "cubic-bezier(0.87, 0, 0.13, 1)";

// House timing scale (seconds) — reach for these instead of one-off numbers.
export const DUR = { fast: 0.15, base: 0.5, slow: 0.9, hero: 1.2 };

// Default stagger between siblings in a build/reveal sequence.
export const STAGGER = 0.08;

// Soft-overshoot "settle" ease — layers landing, fills completing. Never
// use on exits, only on something arriving at rest.
export const SETTLE_EASE = "back.out(1.6)";

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Once-per-session gate for load moments (e.g. the header logo assembly)
// so repeat visits within a tab session don't replay the build.
export function hasPlayedOnce(key: string) {
  if (typeof window === "undefined") return true;
  try {
    return window.sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

export function markPlayedOnce(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, "1");
  } catch {
    // sessionStorage unavailable (private mode, etc.) — animation just replays.
  }
}
