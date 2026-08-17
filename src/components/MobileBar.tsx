"use client";

import { useEffect, useState } from "react";
import Icon from "./ui/Icon";
import { SITE } from "@/lib/constants";

/**
 * Persistent conversion bar — the client's spec names Directions, Call and
 * WhatsApp as the three mobile actions.
 *
 * It stays hidden over the hero (the hero already carries both CTAs, and a bar
 * on first paint would cover the headline on short devices) and slides up once
 * the user has committed to scrolling. Safe-area padding keeps it clear of the
 * iOS home indicator.
 */
export default function MobileBar() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6);
    const id = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-500 lg:hidden ${
        shown ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-3 mb-3 grid grid-cols-3 gap-1.5 rounded-2xl border border-line bg-white/95 p-1.5 shadow-[0_-4px_30px_rgba(7,61,99,0.14)] backdrop-blur-xl">
        <a
          href={SITE.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 rounded-xl bg-navy-900 px-2 py-2.5 text-[0.7rem] font-bold text-white"
        >
          <Icon name="route" className="h-5 w-5" />
          Directions
        </a>
        <a
          href={SITE.phoneHref}
          className="flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-[0.7rem] font-bold text-navy-900 transition-colors active:bg-surface"
        >
          <Icon name="phone" className="h-5 w-5" />
          Call
        </a>
        <a
          href={SITE.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-[0.7rem] font-bold text-navy-900 transition-colors active:bg-surface"
        >
          <Icon name="whatsapp" className="h-5 w-5" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
