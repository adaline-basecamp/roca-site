"use client";

import { SITE } from "@/lib/constants";
import SubmitDrop from "@/components/motion/SubmitDrop";
import { Field, SelectField, TextareaField, ConsentField } from "./Field";
import { useFormPost } from "./useFormPost";
import FormResult from "./FormResult";

const FLEET_SIZES = [
  "1–5 vehicles",
  "6–20 vehicles",
  "21–50 vehicles",
  "50+ vehicles",
] as const;

export default function FleetForm() {
  const { status, showPanel, submit } = useFormPost("fleet-enquiry");

  if (status === "success" && showPanel) {
    return (
      <FormResult
        title="Request received."
        body="Our team will review your requirement and follow up on the support available."
      />
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Name" required autoComplete="name" />
        <Field id="company" label="Company" required autoComplete="organization" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="phone" label="Phone" type="tel" required autoComplete="tel" />
        <SelectField
          id="fleetSize"
          label="Fleet size"
          options={FLEET_SIZES}
          required
          placeholder="Select fleet size"
        />
      </div>

      <TextareaField
        id="requirement"
        label="Requirement"
        rows={4}
        required
        placeholder="Tell us about your regular vehicle requirements."
      />

      <ConsentField id="consent">
        I agree to be contacted about this enquiry.
      </ConsentField>

      {status === "error" ? <ErrorNote /> : null}

      <button
        type="submit"
        disabled={status === "submitting" || status === "success"}
        className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-navy-900 px-7 py-3.5 text-[0.95rem] font-semibold text-white transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-navy-800 disabled:pointer-events-none disabled:opacity-90 sm:w-auto"
      >
        <SubmitDrop status={status} className="h-5 w-5" />
        {status === "submitting"
          ? "Sending…"
          : status === "success"
            ? "Sent"
            : "Request a Business Call →"}
      </button>
    </form>
  );
}

function ErrorNote() {
  return (
    <p className="rounded-xl bg-support/10 px-4 py-3 text-sm leading-relaxed text-ink ring-1 ring-support/25">
      We couldn&rsquo;t send that just now. Please call{" "}
      <a href={SITE.phoneHref} className="font-semibold underline">
        {SITE.phone}
      </a>{" "}
      or email{" "}
      <a href={`mailto:${SITE.email}`} className="font-semibold underline">
        {SITE.email}
      </a>
      .
    </p>
  );
}
