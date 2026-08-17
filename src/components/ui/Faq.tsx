"use client";

import { useRef, useState } from "react";
import Icon from "./Icon";

/**
 * Accordion built on height animation rather than a details/summary toggle so
 * the open/close has the house curve. Only one panel open at a time — the
 * questions are short and competing open panels would bury the last one.
 */
export default function Faq({
  items,
}: {
  items: readonly { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => (
        <FaqRow
          key={item.q}
          {...item}
          open={open === i}
          onToggle={() => setOpen(open === i ? null : i)}
        />
      ))}
    </div>
  );
}

function FaqRow({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);

  return (
    <div>
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span
            className={`font-display text-lg font-semibold transition-colors duration-300 sm:text-xl ${
              open ? "text-navy-900" : "text-navy-900/80 group-hover:text-navy-900"
            }`}
          >
            {q}
          </span>
          <span
            aria-hidden="true"
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ring-1 transition-all duration-500 ${
              open
                ? "rotate-180 bg-navy-900 text-white ring-navy-900"
                : "text-navy-900 ring-line group-hover:ring-navy-700/40"
            }`}
          >
            <Icon name="chevron" className="h-4 w-4" />
          </span>
        </button>
      </h3>

      <div
        ref={panel}
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        className="grid transition-[grid-template-rows] duration-500 ease-out"
      >
        <div className="overflow-hidden">
          <p
            className={`max-w-2xl pb-7 pr-12 text-base leading-relaxed text-muted transition-opacity duration-300 ${
              open ? "opacity-100" : "opacity-0"
            }`}
          >
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}
