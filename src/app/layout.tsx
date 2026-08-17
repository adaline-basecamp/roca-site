import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import SmoothScroll from "@/components/SmoothScroll";
import AnchorScroll from "@/components/AnchorScroll";
import BrandOpener from "@/components/motion/BrandOpener";
import { SITE } from "@/lib/constants";
import "./globals.css";

// Stand-in for the brand typeface (Nordique Pro, Bold/Light — licensed, not
// yet purchased). Nordique Pro is a geometric sans with single-storey a/g and
// circular bowls; Outfit is the closest free match and carries the display
// type. Manrope is humanist and holds up far better at body sizes, so the two
// split the work. Swap the display import once the licence is bought.
const display = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: "Roca Fuels — Quality Fuel. Proven Trust.",
    template: "%s — Roca Fuels",
  },
  description:
    "Roca Fuels is a premium dealer of MRPL, a subsidiary of ONGC, bringing dependable, quality-checked petrol and diesel to South India. Visit our station in Calicut, Kerala.",
  keywords: [
    "Roca Fuels",
    "MRPL dealer",
    "petrol pump Calicut",
    "diesel Calicut",
    "fuel station Kerala",
    "ONGC MRPL",
  ],
  openGraph: {
    title: "Roca Fuels — Quality Fuel. Proven Trust.",
    description:
      "Premium MRPL dealer bringing dependable, quality-checked petrol and diesel to South India.",
    url: SITE.domain,
    siteName: "Roca Fuels",
    locale: "en_IN",
    type: "website",
  },
};

const gasStationSchema = {
  "@context": "https://schema.org",
  "@type": "GasStation",
  name: "Roca Fuels",
  description:
    "Roca Fuels is a premium dealer of MRPL, a subsidiary of ONGC, supplying quality-checked petrol and diesel in Calicut, Kerala.",
  url: SITE.domain,
  telephone: SITE.phone,
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${SITE.address.line}, ${SITE.address.highway}`,
    addressLocality: SITE.address.locality,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.pincode,
    addressCountry: SITE.address.country,
  },
  hasMap: SITE.mapsUrl,
  brand: {
    "@type": "Brand",
    name: "Roca Fuels",
  },
  parentOrganization: {
    "@type": "Organization",
    name: "ROCA Holdings",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(gasStationSchema) }}
        />
        <SmoothScroll />
        <AnchorScroll />
        <BrandOpener />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBar />
      </body>
    </html>
  );
}
