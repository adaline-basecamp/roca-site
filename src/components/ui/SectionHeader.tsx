import Reveal from "@/components/motion/Reveal";

type SectionHeaderProps = {
  /** Two-digit chapter number, e.g. "02". Rendered with the section label. */
  index?: string;
  eyebrow: string;
  title: React.ReactNode;
  support?: React.ReactNode;
  /** Navy sections invert the whole header. */
  tone?: "light" | "navy";
  className?: string;
};

/**
 * The site's one section-header composition: a numbered chapter label pinned
 * left, the headline claiming the middle, and the supporting line held to a
 * narrow measure on the right. On mobile it collapses to a single stack.
 *
 * The asymmetry is the point — the headline starts at the second column, so
 * the eye lands on type rather than on a centred axis.
 */
export default function SectionHeader({
  index,
  eyebrow,
  title,
  support,
  tone = "light",
  className = "",
}: SectionHeaderProps) {
  const isNavy = tone === "navy";

  return (
    <div
      className={`grid gap-x-10 gap-y-6 lg:grid-cols-12 lg:items-end ${className}`}
    >
      <Reveal className="lg:col-span-3">
        <p
          className={`eyebrow tnum ${
            isNavy ? "text-white/45" : "text-muted/80"
          }`}
        >
          {index ? `${index} / ` : ""}
          {eyebrow}
        </p>
        <span
          aria-hidden="true"
          className="mt-4 block h-px w-16 bg-gradient-flow opacity-70"
        />
      </Reveal>

      <Reveal
        delay={0.08}
        className="lg:col-span-6 lg:-ml-2"
      >
        <h2
          className={`section-display ${isNavy ? "text-white" : "text-navy-900"}`}
        >
          {title}
        </h2>
      </Reveal>

      {support ? (
        <Reveal delay={0.16} className="lg:col-span-3">
          <p
            className={`max-w-xs text-base leading-relaxed ${
              isNavy ? "text-white/70" : "text-muted"
            }`}
          >
            {support}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
