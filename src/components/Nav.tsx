"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import DropLogo from "./DropLogo";
import Icon from "./ui/Icon";
import { NAV_LINKS, SECTION_IDS, SITE } from "@/lib/constants";
import { getLenis } from "@/lib/smoothScroll";
import { prefersReducedMotion } from "@/lib/motion";

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("home");

  const drawerRef = useRef<HTMLDivElement>(null);

  /* Condense the header once the hero is behind us. The initial read is
     deferred a frame rather than run in the effect body, so a page loaded
     mid-scroll still corrects without cascading a render. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const id = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* Active-section tracking. rootMargin pins the "current" band to the upper
     third of the viewport so a section counts as active once its heading has
     arrived, not when its last pixel leaves. */
  useEffect(() => {
    if (!isHome) return;
    const targets = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [isHome]);

  /* The drawer must stop Lenis, or the page scrolls behind the overlay. */
  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [open]);

  /* Close the drawer whenever the route changes — including on browser
     back/forward, which never fires a link's onClick. Adjusted during render
     (React's documented pattern for derived state) rather than in an effect,
     which would paint the stale open drawer for a frame first. */
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  /* Stagger the drawer links in. */
  useEffect(() => {
    if (!open || prefersReducedMotion()) return;
    const links = drawerRef.current?.querySelectorAll("[data-drawer-link]");
    if (!links?.length) return;
    const tw = gsap.fromTo(
      links,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "expo.out", delay: 0.08 }
    );
    return () => {
      tw.kill();
    };
  }, [open]);

  const isActive = (href: string) => {
    if (!isHome) return false;
    // "Home" has no hash, so it owns the hero and anything above the first
    // tracked section rather than matching a section id.
    if (href === "/") return active === "home";
    return href.startsWith("/#") && href.slice(2) === active;
  };

  return (
    <>
      <ScrollProgress />

      {/* Utility strip — the three things a driver checks before anything else */}
      <div className="relative z-50 hidden bg-navy-950 text-white lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-7 px-5 py-2.5 text-xs sm:px-8 lg:px-12">
          <span className="inline-flex items-center gap-2 font-semibold">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amenity opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amenity" />
            </span>
            {SITE.hoursShort}
          </span>
          <a
            href={SITE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 font-semibold text-white/85 transition-colors hover:text-white"
          >
            Get Directions
            <Icon
              name="arrow"
              className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </a>
          <span className="ml-auto text-white/45">Part of ROCA Holdings</span>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-500 ${
          scrolled
            ? "border-line bg-white/92 shadow-[0_1px_0_rgba(7,61,99,0.04),0_12px_40px_rgba(7,61,99,0.07)] backdrop-blur-xl"
            : "border-transparent bg-white/70 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3.5 sm:px-8 lg:px-12">
          <Link
            href="/"
            aria-label="Roca Fuels — home"
            className="shrink-0 rounded-lg"
          >
            <DropLogo variant="dark" dropAnimation="assembly" showWordmark={false} />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const activeLink = isActive(link.href) || pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={activeLink ? "page" : undefined}
                  className={`group relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-300 ${
                    activeLink
                      ? "text-navy-900"
                      : "text-ink/65 hover:text-navy-900"
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-x-3.5 -bottom-px h-[2px] rounded-full bg-gradient-flow transition-transform duration-500 ${
                      activeLink
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                    style={{ transformOrigin: "left" }}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group hidden items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(7,61,99,0.22)] transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-navy-800 sm:inline-flex"
            >
              Get Directions
              <Icon
                name="arrow"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-drawer"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-line transition-colors hover:bg-surface lg:hidden"
            >
              <span className="relative block h-3.5 w-5">
                <span
                  className={`absolute left-0 block h-[2px] w-5 rounded-full bg-navy-900 transition-transform duration-400 ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 block h-[2px] w-5 rounded-full bg-navy-900 transition-opacity duration-200 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-[2px] w-5 rounded-full bg-navy-900 transition-transform duration-400 ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        <span
          aria-hidden="true"
          className="block h-px w-full bg-gradient-flow opacity-70"
        />
      </header>

      {/* Drawer is a sibling of <header>, never a child: the header's
          backdrop-blur creates a containing block, which would resolve the
          drawer's inset-0 against the header box instead of the viewport. */}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        aria-hidden={!open}
        className={`fixed inset-0 z-40 bg-white transition-opacity duration-400 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-32 pt-28">
          <nav aria-label="Mobile" className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-drawer-link
                onClick={() => setOpen(false)}
                className="font-display border-b border-line py-4 text-2xl font-semibold text-navy-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 space-y-3" data-drawer-link>
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-navy-900 px-6 py-4 text-[0.95rem] font-semibold text-white"
            >
              Get Directions
              <Icon name="arrow" className="h-4 w-4" />
            </a>
            <p className="pt-2 text-sm leading-relaxed text-muted">
              {SITE.address.door}, {SITE.address.street}
              <span className="block">
                {SITE.address.line} · PIN {SITE.address.pincode}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/** Hairline progress bar in the functional accent flow. */
function ScrollProgress() {
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      el.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
    >
      <span
        ref={barRef}
        className="block h-full w-full origin-left scale-x-0 bg-gradient-flow"
      />
    </div>
  );
}
