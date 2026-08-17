import Link from "next/link";
import DropLogo from "./DropLogo";
import Icon from "./ui/Icon";
import { SITE } from "@/lib/constants";

const COLUMNS = [
  {
    title: "Station",
    links: [
      { label: "Amenities", href: "/#amenities" },
      { label: "Fuels", href: "/#fuels" },
      { label: "Our Stations", href: "/#stations" },
      { label: "Fleet Enquiry", href: "/#fleet" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    title: "Governance",
    links: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/terms#privacy" },
      { label: "Accessibility", href: "/terms#accessibility" },
      { label: "Feedback & Complaints", href: "/#contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="on-navy relative overflow-hidden bg-navy-950 text-white">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 block h-px bg-gradient-flow opacity-60"
      />

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <DropLogo variant="light" dropAnimation="pulse" showWordmark={false} />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/65">
              A modern 24-hour fuel and convenience stop in Pavangad,
              Kozhikode. Part of ROCA Holdings.
            </p>
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Roca Fuels on Instagram"
              className="mt-7 inline-grid h-11 w-11 place-items-center rounded-full ring-1 ring-white/20 transition-colors hover:bg-white/10"
            >
              <Icon name="instagram" className="h-5 w-5" />
            </a>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <p className="eyebrow text-white/40">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/75 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-4">
            <p className="eyebrow text-white/40">Customer Support</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={SITE.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/75 transition-colors hover:text-white"
                >
                  <Icon name="route" className="h-4 w-4" />
                  Get Directions
                </a>
              </li>
              <li>
                <a
                  href={SITE.phoneHref}
                  className="inline-flex items-center gap-2 text-white/75 transition-colors hover:text-white"
                >
                  <Icon name="phone" className="h-4 w-4" />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={SITE.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/75 transition-colors hover:text-white"
                >
                  <Icon name="whatsapp" className="h-4 w-4" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-white/75 transition-colors hover:text-white"
                >
                  {SITE.email}
                </a>
              </li>
            </ul>

            <address className="mt-6 text-sm not-italic leading-relaxed text-white/55">
              {SITE.address.door}, {SITE.address.street}
              <br />
              {SITE.address.line} · PIN {SITE.address.pincode}
            </address>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="max-w-4xl text-xs leading-relaxed text-white/40">
            Roca Fuels is a premium dealer of MRPL (Mangalore Refinery and
            Petrochemicals Limited), a subsidiary of Oil and Natural Gas
            Corporation (ONGC). Fuel quality and pricing subject to standard
            regulatory guidelines.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-white/40">
            <p>© {new Date().getFullYear()} Roca Fuels. All rights reserved.</p>
            <p>ROCA Holdings · Kerala, India</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
