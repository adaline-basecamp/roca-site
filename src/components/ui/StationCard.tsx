import Button from "./Button";
import Icon from "./Icon";
import { ACCENT_VAR, type STATIONS } from "@/lib/constants";

type Station = (typeof STATIONS)[number];

/**
 * One card per branch. Everything a driver needs to decide and depart lives
 * here: status, address, hours, what's on site, how to pay, how to leave.
 */
export default function StationCard({ station }: { station: Station }) {
  return (
    <div className="overflow-hidden rounded-[26px] bg-white ring-1 ring-line shadow-[0_2px_4px_rgba(7,61,99,0.04),0_20px_50px_rgba(7,61,99,0.07)]">
      <div className="grid lg:grid-cols-[1.05fr_1fr]">
        {/* Identity + status */}
        <div className="border-b border-line p-7 sm:p-9 lg:border-b-0 lg:border-r">
          <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 ring-1 ring-line">
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                style={{ background: ACCENT_VAR.amenity }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ background: ACCENT_VAR.amenity }}
              />
            </span>
            <span className="text-xs font-bold text-navy-900">
              {station.hours}
            </span>
          </span>

          <h3 className="font-display mt-5 text-2xl font-semibold leading-tight text-navy-900 sm:text-[1.75rem]">
            {station.name}
          </h3>

          <dl className="mt-7 space-y-5 text-sm">
            <div className="flex gap-3.5">
              <Icon
                name="route"
                className="mt-0.5 h-5 w-5 shrink-0"
                // route cyan reads as "this is the location/navigation info"
              />
              <div>
                <dt className="sr-only">Address</dt>
                <dd className="text-[0.95rem] font-medium text-ink">
                  {station.address.door}, {station.address.street}
                  <span className="block font-normal text-muted">
                    {station.address.line} · PIN {station.address.pincode}
                  </span>
                  <span className="mt-1 block font-normal text-muted">
                    {station.address.landmark}
                  </span>
                </dd>
              </div>
            </div>

            {/* Hours deliberately not repeated here — the status chip above
                already states them, and twice in one card reads as an error. */}

            <div className="flex gap-3.5">
              <Icon name="phone" className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <dt className="sr-only">Phone</dt>
                <dd>
                  <a
                    href={station.phoneHref}
                    className="text-[0.95rem] font-medium text-ink underline decoration-route decoration-2 underline-offset-4 hover:text-navy-900"
                  >
                    {station.phone}
                  </a>
                </dd>
              </div>
            </div>
          </dl>
        </div>

        {/* On-site + actions */}
        <div className="flex flex-col justify-between p-7 sm:p-9">
          <div>
            <p className="eyebrow text-muted/80">On Site</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {station.amenities.map((a) => (
                <li
                  key={a}
                  className="rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-navy-900 ring-1 ring-line"
                >
                  {a}
                </li>
              ))}
            </ul>

            <p className="eyebrow mt-7 text-muted/80">Payments Accepted</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {station.payments.map((p) => (
                <li
                  key={p}
                  className="rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-navy-900 ring-1 ring-line"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            <Button
              href={station.mapsUrl}
              external
              icon="arrow"
              variant="primary"
              className="sm:flex-1"
            >
              Get Directions
            </Button>
            <Button href={station.phoneHref} variant="secondary" icon="phone">
              Call
            </Button>
            <Button
              href={station.whatsappUrl}
              external
              variant="secondary"
              icon="whatsapp"
            >
              WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
