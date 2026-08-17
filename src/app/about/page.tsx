import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import Reveal from "@/components/motion/Reveal";
import { VALUES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Roca Fuels is the energy and fuel business of ROCA Holdings, a diversified group operating across Saudi Arabia, the UAE, Qatar and India.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Who We Are"
        title="A Trusted Name, Backed by a Trusted Source"
      />

      <Section tone="light">
        <Reveal className="mx-auto max-w-3xl">
          <div className="space-y-5 text-base leading-relaxed text-ink/85 sm:text-lg">
            <p>
              Roca Fuels is the energy and fuel business of ROCA Holdings, a
              diversified group operating across Saudi Arabia, the UAE, Qatar
              and India.
            </p>
            <p>
              As a premium dealer of MRPL (Mangalore Refinery and
              Petrochemicals Limited) — a subsidiary of ONGC — Roca Fuels
              supplies high-quality petrol and diesel with the backing of one
              of India&rsquo;s most established refining names.
            </p>
            <p>
              Our first station opened its doors in Calicut, Kerala, marking
              the beginning of a broader mission: to build a chain of fuel
              stations across the region, each one committed to the same
              standard of quality, accuracy and honesty at the pump.
            </p>
            <p>
              We don&rsquo;t see fuel retail as a transaction. We see it as a
              daily promise — to give every customer exactly what they&rsquo;re
              paying for, checked and verified, every single time.
            </p>
          </div>
        </Reveal>
      </Section>

      <Section tone="navy">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-open">
            What Guides Us
          </p>
          <h2 className="mt-4 section-display text-white">
            Mission &amp; Vision
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl bg-white/5 p-8 ring-1 ring-white/10">
              <span className="bg-gradient-drop block h-1.5 w-10 rounded-full" />
              <h3 className="mt-5 text-lg font-bold text-white">Mission</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/75 sm:text-base">
                To deliver clean, precisely measured, consistently
                high-quality petrol and diesel to every customer, backed by
                the integrity of ONGC-MRPL sourcing and the daily operating
                discipline of the ROCA Holdings Group, while treating every
                visit to the pump as a moment to earn trust, not just
                complete a transaction.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-2xl bg-white/5 p-8 ring-1 ring-white/10">
              <span className="bg-gradient-drop block h-1.5 w-10 rounded-full" />
              <h3 className="mt-5 text-lg font-bold text-white">Vision</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/75 sm:text-base">
                To become the most trusted fuel retail name in South India,
                growing into a dependable chain of stations known as much
                for the quality of their fuel as for the transparency and
                consistency of their service.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="tint">
        <Reveal className="text-center">
          <p className="eyebrow text-navy-700">
            What Drives Us
          </p>
          <h2 className="mt-4 section-display text-navy-900">
            Our Values
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, i) => (
            <Reveal key={value.name} delay={i * 0.08}>
              <div className="h-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-line">
                <span className="bg-gradient-drop block h-1.5 w-10 rounded-full" />
                <h3 className="mt-4 text-lg font-bold text-navy-900">
                  {value.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {value.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
