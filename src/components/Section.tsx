/**
 * Legacy section wrapper, kept for the deeper pages (/about, /fuels) that were
 * written against it. Tones now resolve to the new surface tokens so those
 * pages sit in the same system as the homepage.
 *
 * New work should use `@/components/ui/Section`, which carries the wider
 * container and the varied per-tone rhythm.
 */
type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tone?: "light" | "navy" | "tint";
};

const TONES: Record<NonNullable<SectionProps["tone"]>, string> = {
  light: "bg-white text-ink",
  navy: "bg-navy-900 text-white on-navy",
  tint: "bg-surface text-ink",
};

export default function Section({
  children,
  className = "",
  id,
  tone = "light",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${TONES[tone]} py-20 sm:py-28 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
}
