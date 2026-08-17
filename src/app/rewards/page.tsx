import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/motion/Reveal";
import { ACCENT_INK, ACCENT_VAR, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Roca Rewards",
  description:
    "Roca Rewards is on the way — a customer programme built around the everyday stop at Roca Fuels in Pavangad, Kozhikode.",
};

/**
 * Placeholder programme name, per the client's V1 review notes. Nothing here
 * states a benefit as confirmed — the content rules prohibit publishing
 * unverified offers — so every line is framed as intent ("designed to",
 * "planned") until the programme is signed off.
 */
const BENEFITS = [
  {
    title: "Earn on every fill",
    description:
      "A simple balance that grows with the stops you already make — no tiers to decode.",
    accent: "route",
    icon: "water" as const,
  },
  {
    title: "Faster at the pump",
    description:
      "Saved payment preferences designed to shorten the stop, not lengthen it.",
    accent: "amenity",
    icon: "check" as const,
  },
  {
    title: "Fleet-ready accounts",
    description:
      "Planned support for business vehicles, with consolidated statements.",
    accent: "business",
    icon: "share" as const,
  },
  {
    title: "Station updates",
    description:
      "Hours, amenities and new station openings, sent only when they change.",
    accent: "corporate",
    icon: "clock" as const,
  },
];

export default function RewardsPage() {
  return (
    <>
      <PageHero
        eyebrow="Coming Soon"
        title="Roca Rewards."
        subtitle="A customer programme built around the everyday stop — currently in development with the Roca Fuels team."
      />

      <Section tone="white">
        <Reveal>
          <div className="inline-flex items-center gap-2.5 rounded-full bg-surface px-4 py-2 ring-1 ring-line">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: ACCENT_VAR.open }}
            />
            <span className="text-xs font-bold text-navy-900">
              In development · name not final
            </span>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={(i % 2) * 0.08}>
              <div className="group h-full overflow-hidden rounded-2xl bg-white p-7 ring-1 ring-line transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(7,61,99,0.1)] sm:p-8">
                <span
                  aria-hidden="true"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{
                    background: `color-mix(in srgb, ${ACCENT_VAR[b.accent]} 14%, white)`,
                    color: ACCENT_INK[b.accent],
                  }}
                >
                  <Icon name={b.icon} className="h-6 w-6" />
                </span>
                <h2 className="font-display mt-5 text-xl font-semibold text-navy-900">
                  {b.title}
                </h2>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted">
                  {b.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted">
            Details above describe the programme being designed and are not yet
            confirmed offers. Final benefits, terms and the programme name will
            be published here once approved.
          </p>
        </Reveal>
      </Section>

      <Section tone="corporate">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <Reveal className="max-w-xl">
            <p className="eyebrow text-open">Until Then</p>
            <h2 className="section-display mt-4 text-white">
              The station is open around the clock.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-3 sm:flex-row">
            <Button href={SITE.mapsUrl} external variant="onNavy" icon="arrow">
              Get Directions
            </Button>
            <Button href="/#amenities" variant="onNavyGhost">
              View Amenities
            </Button>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
