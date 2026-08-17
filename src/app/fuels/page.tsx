import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import Reveal from "@/components/motion/Reveal";
import DropBullet from "@/components/motion/DropBullet";

export const metadata: Metadata = {
  title: "Our Fuels",
  description:
    "High-quality petrol and reliable diesel, sourced through MRPL and dispensed through calibrated, regularly verified pumps.",
};

const FUELS = [
  {
    name: "Petrol",
    description:
      "High-quality petrol sourced through MRPL, delivering clean, consistent performance for everyday driving.",
  },
  {
    name: "Diesel",
    description:
      "Reliable, quality-checked diesel suited for personal and commercial vehicles alike, sourced through the same trusted MRPL supply chain.",
  },
];

const QUALITY_CHECKS = [
  {
    name: "MRPL-Sourced Fuel",
    description:
      "Petrol and diesel supplied through MRPL, a subsidiary of ONGC, meeting established national fuel-quality standards.",
  },
  {
    name: "Daily Quality Checks",
    description: "Fuel purity and density verified before it reaches the pump.",
  },
  {
    name: "Calibrated Dispensing",
    description:
      "Regularly tested pumps to ensure customers receive exactly what they pay for.",
  },
  {
    name: "Transparent Pricing",
    description: "Clear, honest pricing with no hidden variance.",
  },
  {
    name: "Trained Staff",
    description:
      "Station attendants trained on safety, accuracy and customer care.",
  },
];

export default function FuelsPage() {
  return (
    <>
      <PageHero
        eyebrow="Petrol & Diesel, Sourced Right"
        title="Our Fuels"
      />

      <Section tone="light">
        <div className="grid gap-6 sm:grid-cols-2">
          {FUELS.map((fuel, i) => (
            <Reveal key={fuel.name} delay={i * 0.1}>
              <div className="h-full rounded-2xl bg-surface p-8 ring-1 ring-line">
                <span className="bg-gradient-drop inline-block h-2 w-2 rounded-full" />
                <h2 className="mt-4 text-2xl font-display font-semibold tracking-tight text-navy-900">
                  {fuel.name}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-muted">
                  {fuel.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.15} className="mt-8">
          <p className="text-sm leading-relaxed text-muted">
            Both fuels are dispensed through calibrated pumps and undergo
            routine quality verification before sale.
          </p>
        </Reveal>
      </Section>

      <Section tone="navy">
        <Reveal className="text-center">
          <p className="eyebrow text-open">
            Checked Daily. Never Assumed.
          </p>
          <h2 className="mt-4 section-display text-white">
            Quality You Can Verify
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {QUALITY_CHECKS.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.08}>
              <div className="h-full rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                <DropBullet
                  className="h-7 w-7"
                  outlineClassName="text-white/25"
                  delay={i * 0.08}
                />
                <h3 className="mt-3 text-lg font-bold text-white">{item.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
