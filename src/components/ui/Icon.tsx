/**
 * Custom icon set drawn on a 24-unit grid with a single 1.6 stroke weight, so
 * the family reads as one hand rather than a borrowed library. Geometric
 * construction (circles, straight runs, 45° joins) to echo the brand's
 * geometric type and the drop's engineered curves.
 */

export type IconName =
  | "air"
  | "water"
  | "restroom"
  | "accessibility"
  | "phone"
  | "ev"
  | "route"
  | "clock"
  | "whatsapp"
  | "arrow"
  | "share"
  | "chevron"
  | "check"
  | "instagram";

const P = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const PATHS: Record<IconName, React.ReactNode> = {
  // Tyre + pressure waves
  air: (
    <>
      <circle cx="10" cy="14" r="6" {...P} />
      <circle cx="10" cy="14" r="2.2" {...P} />
      <path d="M17.5 8.5c1.2-1.2 1.2-3 0-4.2M20.2 9.6c2-2 2-5.2 0-7.2" {...P} />
    </>
  ),
  // Drop with a level line
  water: (
    <>
      <path d="M12 3.5c3.4 4 5.2 6.6 5.2 9.1a5.2 5.2 0 0 1-10.4 0c0-2.5 1.8-5.1 5.2-9.1Z" {...P} />
      <path d="M7.6 14.4c1.3.9 2.2.9 3.5 0s2.2-.9 3.5 0" {...P} />
    </>
  ),
  // Door with handle
  restroom: (
    <>
      <path d="M6 3.5h12v17H6z" {...P} />
      <path d="M6 20.5h12" {...P} />
      <circle cx="14.6" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  // Universal access mark
  accessibility: (
    <>
      <circle cx="12" cy="4.6" r="1.9" {...P} />
      <path d="M6.6 8.4h10.8M12 8.4v5.2h4.2l2 6M12 13.6H9.4l-1.8 6" {...P} />
    </>
  ),
  // Handset
  phone: (
    <path
      d="M5.2 4.4h3.2l1.6 4-2 1.4a11.4 11.4 0 0 0 6.2 6.2l1.4-2 4 1.6v3.2a1.6 1.6 0 0 1-1.7 1.6C11.3 20 4 12.7 3.6 6.1A1.6 1.6 0 0 1 5.2 4.4Z"
      {...P}
    />
  ),
  // Charging plug + bolt
  ev: (
    <>
      <path d="M5 9.5h8v8a4 4 0 0 1-8 0z" {...P} />
      <path d="M7.4 9.5V4.8M10.6 9.5V4.8" {...P} />
      <path d="M16.4 12.6h3.4l-2.6 4.2h3.2" {...P} />
    </>
  ),
  // Route pin + path
  route: (
    <>
      <path d="M12 21c4-5 6-8.2 6-11a6 6 0 1 0-12 0c0 2.8 2 6 6 11Z" {...P} />
      <circle cx="12" cy="10" r="2.2" {...P} />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.4" {...P} />
      <path d="M12 7.2V12l3.2 2" {...P} />
    </>
  ),
  whatsapp: (
    <path
      d="M20 11.6a8 8 0 0 1-11.9 7L4 20l1.5-4a8 8 0 1 1 14.5-4.4Z M9.2 9.1c.3-.7.5-.7.8-.7h.6c.2 0 .5 0 .7.6l.8 1.9c.1.2.1.4 0 .6l-.5.7c-.1.2-.2.3 0 .6a7 7 0 0 0 3 2.5c.3.1.5.1.7-.1l.7-.8c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.3.4.5v.6c-.1.4-.6 1-1.4 1.1a8.6 8.6 0 0 1-6-3.3c-1-1.3-1.8-2.6-1.8-3.7 0-.7.3-1.2.6-1.3Z"
      {...P}
    />
  ),
  arrow: <path d="M5 12h13M12.5 5.8 18.8 12l-6.3 6.2" {...P} />,
  share: (
    <>
      <circle cx="17.5" cy="5.8" r="2.6" {...P} />
      <circle cx="6.5" cy="12" r="2.6" {...P} />
      <circle cx="17.5" cy="18.2" r="2.6" {...P} />
      <path d="m8.9 10.8 6.2-3.6M8.9 13.2l6.2 3.6" {...P} />
    </>
  ),
  chevron: <path d="m6.5 9.5 5.5 5.5 5.5-5.5" {...P} />,
  check: <path d="m5.5 12.6 4.2 4.2 8.8-9.6" {...P} />,
  instagram: (
    <>
      <rect x="3.6" y="3.6" width="16.8" height="16.8" rx="5" {...P} />
      <circle cx="12" cy="12" r="4" {...P} />
      <circle cx="17.1" cy="6.9" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
};

export default function Icon({
  name,
  className = "h-6 w-6",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
