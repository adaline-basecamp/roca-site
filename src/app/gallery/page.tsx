import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";
import GalleryGrid from "@/components/GalleryGrid";
import galleryData from "@/data/gallery.json";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Moments that define Roca Fuels — from our grand opening to daily life at the station in Calicut, Kerala.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Moments That Define Roca Fuels"
        title="Gallery."
        subtitle="Real photography from the station in Pavangad — the opening, the forecourt and the people behind it."
      />

      <Section tone="white">
        <GalleryGrid categories={galleryData} />
      </Section>

      <Section tone="corporate">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <Reveal className="max-w-xl">
            <p className="eyebrow text-open">More Moments, Daily</p>
            <h2 className="section-display mt-4 text-white">
              Follow our journey.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/70">
              New photos from the station, the team and the road ahead.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Button
              href={SITE.instagramUrl}
              external
              variant="onNavy"
              icon="instagram"
            >
              Follow @rocafuels
            </Button>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
