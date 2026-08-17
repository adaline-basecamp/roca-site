"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getLenis } from "@/lib/smoothScroll";
import { prefersReducedMotion } from "@/lib/motion";

// Clears the sticky header + utility strip so a section's eyebrow doesn't
// land underneath them.
const HEADER_OFFSET = -104;

/**
 * Smooth anchor navigation.
 *
 * Every nav item except Gallery is a `/#section` link. Next's router treats
 * those as navigations and hard-jumps to the hash, which lands you in the
 * middle of a section with no sense of having travelled — and skips right
 * past the scroll-triggered reveals, so sections appear already-resolved.
 *
 * This intercepts the click and hands it to Lenis instead: one eased glide
 * that fires every ScrollTrigger on the way through. The URL hash is still
 * written, so links remain shareable and Back still works.
 *
 * Delegated from the document rather than wired per-link, so footer links,
 * in-copy links and CTA buttons all get the same behaviour for free.
 */
export default function AnchorScroll() {
  const pathname = usePathname();

  useEffect(() => {
    function scrollToId(id: string, push: boolean) {
      const el = document.getElementById(id);
      if (!el) return false;

      // Resolve the target ourselves and hand Lenis a number, not the element.
      // Given an element it also applies the document's scroll-padding-top,
      // which stacks with this offset and drops the section 120px too low.
      const top = el.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET;

      const lenis = getLenis();
      if (!lenis || prefersReducedMotion()) {
        window.scrollTo({ top, behavior: "auto" });
      } else {
        lenis.scrollTo(top, {
          // Long enough to read as travel, short enough not to feel held up.
          duration: 1.25,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
        });
      }

      if (push) history.pushState(null, "", `#${id}`);
      return true;
    }

    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Same-page anchor, either "#id" or "/#id" while already on "/".
      let id: string | null = null;
      if (href.startsWith("#")) id = href.slice(1);
      else if (href.startsWith("/#") && pathname === "/") id = href.slice(2);
      if (!id) return;

      if (scrollToId(id, true)) {
        e.preventDefault();
        // Stops next/link's own click handler running at all. Without this,
        // React's root listener fires first, router.push() has already
        // scrolled to the hash, and preventDefault arrives too late — the
        // page hard-jumps and the eased scroll never gets a chance.
        e.stopPropagation();
      }
    }

    // Capture phase, for the same reason.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  /* Reloads start at the top.
     Browsers restore the previous scroll offset on reload, which is right for
     a long document but wrong for a single-scroll page: you come back mid-way
     with the hero skipped and the reveals already resolved. Taking manual
     control puts every fresh load at the start — unless the URL names a
     section, which the effect below then handles, so shared #links still work.
     Back/forward is unaffected: popstate is handled separately. */
  useEffect(() => {
    if (!("scrollRestoration" in history)) return;
    const previous = history.scrollRestoration;
    history.scrollRestoration = "manual";

    if (!window.location.hash) window.scrollTo(0, 0);

    // Back/forward between hash entries should still land on the section.
    function onPopState() {
      const id = window.location.hash.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (!el) {
        window.scrollTo(0, 0);
        return;
      }
      const top = el.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET;
      const lenis = getLenis();
      if (lenis && !prefersReducedMotion()) lenis.scrollTo(top, { duration: 0.9 });
      else window.scrollTo({ top });
    }

    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      history.scrollRestoration = previous;
    };
  }, []);

  /* Landing on /#section from another page: the element only exists after
     this page renders, so the browser's own hash handling has already run. */
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;

    const t = window.setTimeout(() => {
      const top = el.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET;
      const lenis = getLenis();
      if (lenis && !prefersReducedMotion()) {
        lenis.scrollTo(top, { duration: 1 });
      } else {
        window.scrollTo({ top });
      }
    }, 260);

    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
