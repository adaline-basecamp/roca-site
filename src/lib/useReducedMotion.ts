"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;

// The server can't know the preference, so it reports "motion allowed" and the
// client corrects on hydration.
const getServerSnapshot = () => false;

/**
 * Reads the motion preference as an external store.
 *
 * Reading matchMedia during render makes the first client render disagree with
 * the server HTML and React throws away the tree with a hydration error;
 * reading it in an effect and calling setState triggers a cascading render.
 * useSyncExternalStore is the primitive built for exactly this, and it also
 * picks up the user flipping the OS setting mid-session.
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
