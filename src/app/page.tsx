import Link from "next/link";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import AmenityCard from "@/components/ui/AmenityCard";
import StationCard from "@/components/ui/StationCard";
import Faq from "@/components/ui/Faq";
import Reveal from "@/components/motion/Reveal";
import HomeHero from "@/components/motion/HomeHero";
import GradientRule from "@/components/motion/GradientRule";
import StationStage from "@/components/station3d/StationStage";
import HeroLiquid from "@/components/liquid/HeroLiquid";
import FleetForm from "@/components/form/FleetForm";
import FeedbackForm from "@/components/form/FeedbackForm";
import {
  ABOUT_POINTS,
  ACCENT_INK,
  ACCENT_VAR,
  AMENITIES,
  FAQS,
  FUELS,
  HIGHLIGHTS,
  JOURNEY_STEPS,
  QUALITY_POINTS,
  SITE,
  STATIONS,
} from "@/lib/constants";

export default function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section id="home" className="relative overflow-hidden bg-hero-surface">
        <HeroLiquid />
        {/* Mobile puts the model between the headline and the supporting copy,
            so the signature moment is on screen without scrolling. Stacked
            underneath it fell entirely below the fold on a 390x844 device —
            the one class of screen the brief prioritises. Desktop keeps the
            two-column split: the copy wrapper is `contents` on mobile so its
            two halves become orderable siblings, and a block in column one
            from lg up. */}
        <HomeHero className="relative mx-auto flex max-w-7xl flex-col px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-14 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-12 lg:px-12 lg:pb-28 lg:pt-20">
          <div className="contents lg:col-span-5 lg:block">
            <div className="order-1">
              {/* Duplicate of the utility bar on desktop, so it only renders
                  where that bar is hidden — one status statement per viewport. */}
              <span
                data-hero="structure"
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-navy-900 ring-1 ring-line lg:hidden"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amenity opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amenity" />
                </span>
                Open 24 Hours · Part of ROCA Holdings
              </span>

              <p data-hero="structure" className="eyebrow mt-6 text-navy-700">
                Roca Fuels
              </p>

              <h1 className="hero-display mt-4 text-navy-900">
                <span data-hero="line" className="block">
                  A Better Stop
                </span>
                <span data-hero="line" className="block">
                  for Every Journey.
                </span>
              </h1>

              <GradientRule
                data-hero="structure"
                className="mt-6 h-[3px] w-40 lg:mt-7"
              />
            </div>

            <div className="order-3">
              <p
                data-hero="subtitle"
                // Ink on mobile, muted from lg up. The mobile scrim is opened
                // so the liquid reads, and --muted is only ~4.6:1 on pure
                // white — no headroom for a tinted backdrop, measured at 3.9.
                // --ink is the palette's designated body-text colour, and the
                // client's own rule reserves muted for helper copy, never for
                // essential information. Desktop keeps muted: its scrim is
                // strong enough there that contrast was never at risk.
                className="mt-8 max-w-lg text-lg leading-relaxed text-ink lg:mt-7 lg:text-muted"
              >
                Convenient refuelling, useful station amenities and direct
                customer support — available around the clock in Pavangad.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-9">
                <Button
                  href={SITE.mapsUrl}
                  external
                  icon="arrow"
                  data-hero="cta"
                  className="sm:w-auto"
                >
                  Get Directions
                </Button>
                <Button href="#amenities" variant="secondary">
                  View Amenities
                </Button>
              </div>
            </div>
          </div>

          {/* Wider than the copy column and allowed to run past the page
              gutter: with no card around it the model can use the dead space
              on the right, and bleeding off the edge reads as intentional
              rather than as a shape floating in a box. On mobile it goes
              full-bleed for the same reason. */}
          <div className="order-2 -mx-5 mt-4 sm:-mx-8 lg:order-none lg:col-span-7 lg:mx-0 lg:mt-0 lg:-mr-6 xl:-mr-10">
            <StationStage />
          </div>
        </HomeHero>
      </section>

      {/* ── Quick highlights ─────────────────────────────────────────────── */}
      <Section tone="pale">
        <ul className="grid gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((h, i) => (
            <li key={h.n} className="bg-surface-pale">
              <Reveal delay={i * 0.07} className="h-full">
                <div className="group h-full bg-surface-pale p-6 transition-colors duration-500 hover:bg-white sm:p-7">
                  <span
                    className="tnum text-xs font-bold"
                    style={{ color: ACCENT_INK[h.accent] }}
                  >
                    {h.n}
                  </span>
                  <h2 className="font-display mt-3 text-lg font-semibold text-navy-900">
                    {h.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {h.description}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Customer journey ─────────────────────────────────────────────── */}
      <Section id="journey" tone="white">
        <SectionHeader
          index="01"
          eyebrow="From Search to Arrival"
          title="A simple journey from your screen to the station."
          support="Every important action is designed to help customers move forward without delay."
        />

        <ol className="mt-16 grid gap-6 lg:grid-cols-3">
          {JOURNEY_STEPS.map((step, i) => (
            <li key={step.n} className="relative">
              <Reveal delay={i * 0.1}>
                <div className="group h-full rounded-2xl bg-surface p-7 ring-1 ring-transparent transition-[background-color,box-shadow,transform] duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_60px_rgba(7,61,99,0.1)] hover:ring-line sm:p-8">
                  <span
                    className="tnum font-display block text-4xl font-semibold leading-none"
                    style={{ color: ACCENT_INK[step.accent] }}
                  >
                    {step.n}
                  </span>
                  <h3 className="font-display mt-6 text-xl font-semibold text-navy-900">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>
              </Reveal>

              {/* Connector — the route line advancing between steps */}
              {i < JOURNEY_STEPS.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute -right-3 top-1/2 hidden h-px w-6 bg-line lg:block"
                />
              ) : null}
            </li>
          ))}
        </ol>
      </Section>

      {/* ── Amenities ────────────────────────────────────────────────────── */}
      <Section id="amenities" tone="surface">
        <SectionHeader
          index="02"
          eyebrow="Everyday Convenience"
          title={
            <>
              More comfort.
              <br />
              Less interruption.
            </>
          }
          support="Roca Fuels is designed to support the practical needs of motorists, families, travellers and commercial drivers."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AMENITIES.map((a, i) => (
            <Reveal key={a.name} delay={(i % 3) * 0.08}>
              <AmenityCard {...a} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-10">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[26px] bg-gradient-corporate p-8 text-white sm:flex-row sm:items-center sm:p-10">
            <div>
              <p className="eyebrow text-white/50">At the Station</p>
              <h3 className="font-display mt-3 text-2xl font-semibold sm:text-3xl">
                Everything important, clearly presented.
              </h3>
              <p className="mt-2 text-white/70">
                Review the available station support before you arrive.
              </p>
            </div>
            <Button href="#stations" variant="onNavy" icon="arrow">
              Plan Your Stop
            </Button>
          </div>
        </Reveal>
      </Section>

      {/* ── Fuels & quality ──────────────────────────────────────────────── */}
      <Section id="fuels" tone="white">
        <SectionHeader
          index="03"
          eyebrow="Fuel for the Road Ahead"
          title="Ready for the journey ahead."
          support="Petrol and diesel are available at Roca Fuels in Pavangad."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {FUELS.map((f, i) => (
              <Reveal key={f.name} delay={i * 0.1}>
                <div className="flex items-center justify-between gap-6 rounded-2xl bg-surface p-7 ring-1 ring-line">
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-navy-900">
                      {f.name}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted">{f.description}</p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-xl"
                    style={{
                      background: `color-mix(in srgb, ${
                        i === 0 ? ACCENT_VAR.route : ACCENT_VAR.amenity
                      } 14%, white)`,
                      color: i === 0 ? ACCENT_INK.route : ACCENT_INK.amenity,
                    }}
                  >
                    <Icon name="water" className="h-6 w-6" />
                  </span>
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.2}>
              <div className="rounded-2xl border border-dashed border-line p-7">
                <p className="font-display text-lg font-semibold text-navy-900">
                  {SITE.tagline}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Roca Fuels is a premium dealer of MRPL, a subsidiary of ONGC —
                  one of India&rsquo;s established refining names stands behind
                  every litre sold here.
                </p>
                {/* No "read the full fuel story" link. It pointed at the old
                    standalone /fuels page, which the v2 content folded into
                    this very section — the full story is what this card is
                    sitting inside, so the link led away from the answer. */}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow text-muted/80">Why It Matters</p>
            </Reveal>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {QUALITY_POINTS.map((q, i) => (
                <Reveal key={q.title} delay={i * 0.06}>
                  <div className="group grid gap-1.5 py-6 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-8">
                    <dt className="font-display text-lg font-semibold text-navy-900">
                      {q.title}
                    </dt>
                    <dd className="text-[0.95rem] leading-relaxed text-muted">
                      {q.description}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      {/* ── Our stations ─────────────────────────────────────────────────── */}
      <Section id="stations" tone="surface">
        <SectionHeader
          index="04"
          eyebrow="Easy to Find"
          title="Find your nearest Roca Fuels."
          support="Open a confirmed station location, check what's on-site, and reach out or start navigating in one tap."
        />

        <div className="mt-16 space-y-6">
          {STATIONS.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.1}>
              <StationCard station={s} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted">
            More stations are on the way. As each one opens it joins this
            directory with the same details — hours, amenities, payments and
            one-tap directions.
          </p>
        </Reveal>
      </Section>

      {/* ── Navy CTA interlude ───────────────────────────────────────────── */}
      <Section tone="corporate">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal className="max-w-2xl">
            <p className="eyebrow text-open">Ready to Visit?</p>
            <h2 className="section-display mt-4 text-white">
              Open the route and continue your journey.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-3 sm:flex-row">
            <Button href={SITE.mapsUrl} external variant="onNavy" icon="arrow">
              Get Directions
            </Button>
            <Button href={SITE.phoneHref} variant="onNavyGhost" icon="phone">
              Call Station
            </Button>
          </Reveal>
        </div>
      </Section>

      {/* ── About ────────────────────────────────────────────────────────── */}
      <Section id="about" tone="white">
        <SectionHeader
          index="05"
          eyebrow="Roca Fuels"
          title="Local service, backed by a wider vision."
          support="Roca Fuels brings the long-term vision of ROCA Holdings into a modern station experience designed around motorists, travellers and businesses in Kozhikode."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {ABOUT_POINTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.09}>
              <div className="h-full rounded-2xl bg-surface p-7 sm:p-8">
                <span
                  aria-hidden="true"
                  className="block h-1 w-10 rounded-full"
                  style={{ background: ACCENT_VAR[p.accent] }}
                />
                <h3 className="font-display mt-5 text-xl font-semibold text-navy-900">
                  {p.title}
                </h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted">
                  {p.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl bg-navy-900 p-8 text-white sm:p-10 on-navy">
              <p className="eyebrow text-white/45">Mission</p>
              <p className="mt-5 text-lg leading-relaxed text-white/85">
                To deliver clean, precisely measured, consistently high-quality
                petrol and diesel to every customer, backed by the integrity of
                ONGC-MRPL sourcing and the daily operating discipline of the
                ROCA Holdings group.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl bg-surface p-8 ring-1 ring-line sm:p-10">
              <p className="eyebrow text-muted/80">Vision</p>
              <p className="mt-5 text-lg leading-relaxed text-ink/85">
                To become the most trusted fuel retail name in South India,
                growing into a dependable chain of stations known for quality
                and consistency alike.
              </p>
              <Link
                href="#about"
                className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-navy-900"
              >
                More about Roca Fuels
                <Icon
                  name="arrow"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Business & fleet ─────────────────────────────────────────────── */}
      <Section id="fleet" tone="surface">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow tnum text-muted/80">
                06 / Business &amp; Fleet Enquiries
              </p>
              <span
                aria-hidden="true"
                className="mt-4 block h-px w-16 bg-gradient-flow opacity-70"
              />
              <h2 className="section-display mt-7 text-navy-900">
                Practical support for business mobility.
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
                Speak with our team about regular vehicle requirements,
                commercial access and the support available for your business
                or fleet.
              </p>
              <span
                aria-hidden="true"
                className="mt-8 block h-1 w-12 rounded-full"
                style={{ background: ACCENT_VAR.business }}
              />
            </Reveal>
          </div>

          <Reveal delay={0.12} className="lg:col-span-7">
            <div className="rounded-[26px] bg-white p-7 ring-1 ring-line sm:p-9">
              <FleetForm />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Contact & feedback ───────────────────────────────────────────── */}
      <Section id="contact" tone="white">
        <SectionHeader
          index="07"
          eyebrow="Station Support"
          title="Need assistance? We're easy to reach."
          support="Call the station, open directions or send an enquiry for general station information and customer assistance."
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button href={SITE.mapsUrl} external icon="arrow" full>
                  Get Directions
                </Button>
                <Button href={SITE.phoneHref} variant="secondary" icon="phone" full>
                  Call Station
                </Button>
                <Button
                  href={SITE.whatsappUrl}
                  external
                  variant="secondary"
                  icon="whatsapp"
                  full
                >
                  WhatsApp
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="mt-10 space-y-6 border-t border-line pt-8 text-sm">
                <div>
                  <dt className="eyebrow text-muted/80">Email</dt>
                  <dd className="mt-2">
                    <a
                      href={`mailto:${SITE.email}`}
                      className="text-[0.95rem] font-medium text-ink underline decoration-route decoration-2 underline-offset-4"
                    >
                      {SITE.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-muted/80">Station Address</dt>
                  <dd className="mt-2 leading-relaxed text-muted">
                    {SITE.address.door}, {SITE.address.street}
                    <span className="block">
                      {SITE.address.line} · PIN {SITE.address.pincode}
                    </span>
                    <span className="mt-1 block">{SITE.address.landmark}</span>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-muted/80">Hours</dt>
                  <dd className="mt-2 text-[0.95rem] font-medium text-ink">
                    {SITE.hours}
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.14} className="lg:col-span-7">
            <div className="rounded-[26px] bg-surface p-7 ring-1 ring-line sm:p-9">
              <p className="eyebrow" style={{ color: ACCENT_INK.support }}>
                Feedback &amp; Complaints
              </p>
              <h3 className="font-display mt-3 text-2xl font-semibold text-navy-900">
                Your experience matters.
              </h3>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted">
                Share feedback or report a service, payment, fuel or safety
                concern through the dedicated form.
              </p>
              <div className="mt-8">
                <FeedbackForm />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <Section id="faq" tone="surface">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow tnum text-muted/80">08 / Information</p>
              <span
                aria-hidden="true"
                className="mt-4 block h-px w-16 bg-gradient-flow opacity-70"
              />
              <h2 className="section-display mt-7 text-navy-900">
                Quick answers before you arrive.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-8">
            <Faq items={FAQS} />
          </Reveal>
        </div>
      </Section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <Section tone="navy" className="overflow-hidden">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-0 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(10,166,202,0.2),transparent_65%)]"
        />
        <div className="relative">
          <Reveal>
            <p className="eyebrow text-open">Roca Fuels · Pavangad</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="hero-display mt-6 max-w-3xl text-white">
              Ready when the road calls.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/70">
              Find the station, review the amenities and start your route to
              Roca Fuels.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button href={SITE.mapsUrl} external variant="onNavy" icon="arrow">
                Get Directions
              </Button>
              <Button href="#amenities" variant="onNavyGhost">
                View Amenities
              </Button>
              <Button href={SITE.phoneHref} variant="onNavyGhost" icon="phone">
                Call Station
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
