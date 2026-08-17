import Link from "next/link";
import Icon, { type IconName } from "./Icon";

type Variant = "primary" | "secondary" | "ghost" | "onNavy" | "onNavyGhost";
type Size = "md" | "lg";

/**
 * Every CTA on the site resolves through here.
 *
 * Deliberately no gradient-filled variant: the brand gradient runs from
 * #1C59C5 to #FD2C3A, and dark text over its blue/teal end measures 2.6:1 —
 * it cannot carry a label. The gradient appears on these buttons only as the
 * hover underline, where nothing sits on top of it.
 */
const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-navy-900 text-white shadow-[0_10px_30px_rgba(7,61,99,0.22)] hover:bg-navy-800",
  secondary:
    "bg-white text-navy-900 ring-1 ring-line hover:ring-navy-700/30 shadow-[0_2px_10px_rgba(7,61,99,0.06)]",
  ghost: "text-navy-900 ring-1 ring-navy-900/15 hover:bg-navy-900/[0.04]",
  onNavy: "bg-white text-navy-900 shadow-[0_10px_30px_rgba(0,0,0,0.18)]",
  onNavyGhost: "text-white ring-1 ring-white/25 hover:bg-white/10",
};

const SIZES: Record<Size, string> = {
  md: "px-6 py-3 text-sm",
  lg: "px-7 py-3.5 text-[0.95rem]",
};

export type ButtonProps = {
  href?: string;
  type?: "button" | "submit";
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  external?: boolean;
  full?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button({
  href,
  type = "button",
  variant = "primary",
  size = "lg",
  icon,
  external,
  full,
  disabled,
  className = "",
  children,
  onClick,
}: ButtonProps) {
  const showsRule = variant === "onNavy" || variant === "secondary";

  const classes = [
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold",
    "transition-[transform,background-color,box-shadow,color] duration-300",
    "hover:-translate-y-0.5 active:translate-y-0",
    "disabled:pointer-events-none disabled:opacity-55",
    VARIANTS[variant],
    SIZES[size],
    full ? "w-full" : "",
    className,
  ].join(" ");

  const inner = (
    <>
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {icon ? (
          <Icon
            name={icon}
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
          />
        ) : null}
      </span>
      {showsRule ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 bottom-1.5 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-drop transition-transform duration-500 group-hover:scale-x-100"
        />
      ) : null}
    </>
  );

  if (href) {
    const externalProps = external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
    // Anchor jumps and off-site URLs skip the router; internal routes keep it.
    const isPlainAnchor = external || href.startsWith("#") || href.startsWith("http");

    return isPlainAnchor ? (
      <a href={href} className={classes} {...externalProps}>
        {inner}
      </a>
    ) : (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick}>
      {inner}
    </button>
  );
}
