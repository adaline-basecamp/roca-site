import HeroStagger from "@/components/motion/HeroStagger";

type PageHeroProps = {
  index?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
};

/**
 * Sub-page hero. Deliberately left-aligned and light rather than the centred
 * navy band it replaced — the homepage owns the navy moments, and the deeper
 * pages should read as continuous with the scroll, not as separate sites.
 */
export default function PageHero({
  index,
  eyebrow,
  title,
  subtitle,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-hero-surface">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-40 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(10,166,202,0.12),transparent_65%)]"
      />
      <HeroStagger className="relative mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-20 lg:px-12 lg:pb-24 lg:pt-24">
        <p data-hero="structure" className="eyebrow tnum text-navy-700">
          {index ? `${index} / ` : ""}
          {eyebrow}
        </p>
        <span
          data-hero="structure"
          aria-hidden="true"
          className="mt-5 block h-px w-16 bg-gradient-flow opacity-70"
        />
        <h1 data-hero="line" className="hero-display mt-7 max-w-4xl text-navy-900">
          {title}
        </h1>
        {subtitle && (
          <p
            data-hero="subtitle"
            className="mt-7 max-w-2xl text-lg leading-relaxed text-muted"
          >
            {subtitle}
          </p>
        )}
      </HeroStagger>
    </section>
  );
}
