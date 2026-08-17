import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import Reveal from "@/components/motion/Reveal";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions governing the use of the Roca Fuels website and station services in Calicut, Kerala.",
};

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing or using this website or Roca Fuels' station services, you agree to be bound by these Terms & Conditions. If you do not agree, please discontinue use of the website and station services.",
  },
  {
    title: "2. Fuel Pricing & Quality",
    body: "Roca Fuels is a premium dealer of MRPL (Mangalore Refinery and Petrochemicals Limited), a subsidiary of the Oil and Natural Gas Corporation (ONGC). Fuel is dispensed through calibrated pumps and is subject to routine quality verification. Fuel pricing and quality are governed by applicable Indian regulatory guidelines and are subject to change without prior notice.",
  },
  {
    title: "3. Payment Methods",
    body: "Cash, major debit/credit cards and UPI are accepted at the station. Card and UPI transactions are processed by third-party payment providers; Roca Fuels is not liable for delays, failures or errors originating from those providers' systems.",
  },
  {
    title: "4. Station Operations",
    body: "Station hours, services and availability are accurate at the time of publishing but may change without notice due to maintenance, supply or regulatory requirements. Please call ahead to confirm if your visit is time-sensitive.",
  },
  {
    title: "5. Website Information",
    body: "Content on this website — including copy, imagery and figures — is provided for general informational purposes. While we take care to keep it accurate and current, Roca Fuels makes no warranty as to completeness and reserves the right to correct or update it at any time.",
  },
  {
    title: "6. Limitation of Liability",
    body: "To the extent permitted by law, Roca Fuels is not liable for any indirect, incidental or consequential loss arising from use of this website or reliance on the information it contains.",
  },
  {
    title: "7. Governing Law",
    body: "These Terms & Conditions are governed by the laws of India, and any disputes are subject to the exclusive jurisdiction of the courts of Kozhikode (Calicut), Kerala.",
  },
  {
    title: "8. Contact",
    body: `Questions about these Terms & Conditions can be sent to ${SITE.email} or ${SITE.phone}.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms & Conditions" />

      <Section tone="light">
        <Reveal className="mx-auto max-w-3xl">
          <p className="text-sm text-muted">Last updated: July 2026</p>
          <div className="mt-8 space-y-8">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <h2 className="text-lg font-bold text-navy-900">
                  {section.title}
                </h2>
                <p className="mt-2 text-base leading-relaxed text-muted">
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>
    </>
  );
}
