export const SITE = {
  name: "Roca Fuels",
  tagline: "Quality Fuel. Proven Trust.",
  domain: "https://rocafuels.com",
  email: "info@rocafuels.com",
  phone: "+91 80751 06110",
  phoneHref: "tel:+918075106110",
  whatsappUrl: "https://wa.me/918075106110",
  mapsUrl: "https://maps.app.goo.gl/dpzsKif83zu48yas7",
  instagramUrl: "https://www.instagram.com/rocafuels",
  address: {
    // Confirmed at the V1 review meeting (Project Notes, 27.07.26).
    door: "Door No. 3/1764",
    street: "Kannur Road, Puthoor",
    line: "Pavangad, Calicut, Kerala",
    full: "Door No. 3/1764, Kannur Road, Puthoor, Pavangad, Calicut, Kerala 673021",
    landmark: "On NH 66 (Calicut–Kannur Highway), ~6.5 km north of Calicut city",
    highway: "NH 66",
    pincode: "673021",
    locality: "Calicut",
    region: "Kerala",
    country: "IN",
  },
  hours: "Open 24 Hours, 7 Days a Week",
  hoursShort: "Open 24 Hours",
};

export const STATION_BADGE = "Largest MRPL Station in Calicut";

/* Nav is anchor-first: everything except Gallery jumps to a homepage
   section. Keeps the chain scalable without a redesign. */
/* Four destinations only. The homepage still carries the Amenities, Fuels and
   Our Stations sections — they're reached by scrolling and by the in-page CTAs
   rather than by their own nav entries, which keeps the bar uncluttered. */
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/#contact", label: "Contact" },
];

/* Section ids in scroll order — drives active-nav tracking. */
export const SECTION_IDS = [
  "home",
  "journey",
  "amenities",
  "fuels",
  "stations",
  "about",
  "fleet",
  "contact",
  "faq",
];

export const HIGHLIGHTS = [
  {
    n: "01",
    title: "Easy to Find",
    description: "Open directions in one tap.",
    accent: "route",
  },
  {
    n: "02",
    title: "Journey Essentials",
    description: "Practical station amenities.",
    accent: "amenity",
  },
  {
    n: "03",
    title: "Open 24 Hours",
    description: "Ready day and night.",
    accent: "open",
  },
  {
    n: "04",
    title: "Direct Support",
    description: "Call the station when needed.",
    accent: "business",
  },
] as const;

export const JOURNEY_STEPS = [
  {
    n: "01",
    title: "Find the station",
    description: "See the location and opening status immediately.",
    accent: "route",
  },
  {
    n: "02",
    title: "Check what's available",
    description: "Review the amenities that support your stop.",
    accent: "amenity",
  },
  {
    n: "03",
    title: "Start your route",
    description: "Open directions and continue in Google Maps.",
    accent: "open",
  },
] as const;

/* Confirmed by the client at the V1 review meeting — these replace the
   earlier placeholder amenity categories. */
export const AMENITIES = [
  {
    name: "Air",
    description: "Free air top-up for tyres.",
    accent: "route",
    icon: "air",
  },
  {
    name: "Drinking Water",
    description: "Free drinking water on-site.",
    accent: "amenity",
    icon: "water",
  },
  {
    name: "Restrooms",
    description: "Clean restrooms available to all visitors.",
    accent: "open",
    icon: "restroom",
  },
  {
    name: "Accessibility Support",
    description: "Station support for visitors with accessibility needs.",
    accent: "business",
    icon: "accessibility",
  },
  {
    name: "Telephone",
    description: "On-site telephone access when needed.",
    accent: "support",
    icon: "phone",
  },
  {
    name: "EV Charger",
    description: "EV charging point available at the station.",
    accent: "corporate",
    icon: "ev",
  },
] as const;

export const FUELS = [
  { name: "Petrol", description: "Available at the Pavangad station." },
  { name: "Diesel", description: "Available at the Pavangad station." },
] as const;

/* Commitment language, not lab claims — the client's content rules prohibit
   unsupported quality/calibration claims before launch. */
export const QUALITY_POINTS = [
  {
    title: "Sourced Right",
    description:
      "Supplied through MRPL, meeting national fuel-quality standards.",
  },
  {
    title: "Checked, Not Assumed",
    description:
      "Fuel and equipment reviewed on a routine schedule, not left to chance.",
  },
  {
    title: "Honest at the Pump",
    description:
      "Dispensing equipment maintained so customers get what they pay for.",
  },
  {
    title: "Part of ROCA Holdings",
    description:
      "Operating standards drawn from an established, multi-market group.",
  },
  {
    title: "Built to Grow",
    description:
      "Calicut is the first station, not the only one; the same standard is meant to travel with every station that follows.",
  },
] as const;

export const ABOUT_POINTS = [
  {
    title: "Local relevance",
    description: "Created around the everyday needs of motorists in Kozhikode.",
    accent: "route",
  },
  {
    title: "Practical convenience",
    description: "Clear access, useful amenities and direct support.",
    accent: "amenity",
  },
  {
    title: "Long-term vision",
    description:
      "Supported by the wider experience and ambition of ROCA Holdings.",
    accent: "corporate",
  },
] as const;

export const PAYMENT_METHODS = [
  { name: "Cash", description: "Pay at the pump, no card or app needed." },
  { name: "Card", description: "All major debit and credit cards accepted." },
  { name: "UPI", description: "Scan and pay with any UPI app." },
] as const;

export const VALUES = [
  {
    name: "Quality",
    description: "MRPL-sourced fuel, checked and verified daily.",
  },
  {
    name: "Trust",
    description: "Transparent measurement, honest pricing, no shortcuts.",
  },
  {
    name: "Consistency",
    description: "Every station, every pump, every day.",
  },
  {
    name: "Community",
    description: "Built to serve the roads and the people of the region first.",
  },
] as const;

export const FAQS = [
  {
    q: "Is Roca Fuels open 24 hours?",
    a: "Yes. Roca Fuels in Pavangad is open 24 hours.",
  },
  {
    q: "Which fuels are available?",
    a: "Petrol and diesel are available at the Pavangad station.",
  },
  {
    q: "How do I get directions?",
    a: "Use the Get Directions button to open the confirmed station location in Google Maps.",
  },
  {
    q: "Which amenities are available?",
    a: "Available station amenities are listed in the Amenities section. Contact the station for additional assistance before your visit.",
  },
  {
    q: "Can businesses submit a fuel enquiry?",
    a: "Yes. Businesses and fleet operators can submit their requirements through the fleet-enquiry form. Our team will review the requirement and follow up on the support available.",
  },
] as const;

/* One entry per branch. The directory is built to grow — a second station
   is a new object here, not a redesign. */
export const STATIONS = [
  {
    slug: "pavangad",
    name: "Roca Fuels — Pavangad, Calicut",
    address: SITE.address,
    hours: SITE.hours,
    mapsUrl: SITE.mapsUrl,
    phone: SITE.phone,
    phoneHref: SITE.phoneHref,
    whatsappUrl: SITE.whatsappUrl,
    amenities: AMENITIES.map((a) => a.name),
    payments: PAYMENT_METHODS.map((p) => p.name),
    status: "open" as const,
  },
];

/** Signal tier — fills, rules, dots, icon chips. Never type. */
export const ACCENT_VAR: Record<string, string> = {
  route: "var(--color-route)",
  amenity: "var(--color-amenity)",
  open: "var(--color-open)",
  business: "var(--color-business)",
  support: "var(--color-support)",
  corporate: "var(--color-corporate)",
};

/** Text tier — same hues, darkened to clear 4.5:1 on every light surface. */
export const ACCENT_INK: Record<string, string> = {
  route: "var(--color-route-ink)",
  amenity: "var(--color-amenity-ink)",
  open: "var(--color-open-ink)",
  business: "var(--color-business-ink)",
  support: "var(--color-support-ink)",
  corporate: "var(--color-corporate-ink)",
};
