"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import SubmitDrop from "@/components/motion/SubmitDrop";
import { FormScope, Field, SelectField, TextareaField, ConsentField } from "./Field";
import { HONEYPOT_NAME, useFormPost } from "./useFormPost";
import FormResult from "./FormResult";

const ENQUIRY_TYPES = ["General enquiry", "Feedback", "Complaint"] as const;

const ISSUE_CATEGORIES = [
  "Service",
  "Payment",
  "Fuel concern",
  "Quantity concern",
  "Safety concern",
  "Other",
] as const;

export default function FeedbackForm() {
  const { status, showPanel, submit } = useFormPost(
    "contact-feedback",
    "New enquiry / feedback — Roca Fuels website"
  );
  const [enquiryType, setEnquiryType] = useState("");

  // Visit date/time, issue category and pump reference only matter for an
  // actual complaint — asking a general enquirer for them is friction.
  const isComplaint = enquiryType === "Complaint";

  if (status === "success" && showPanel) {
    return (
      <FormResult
        title="Message sent."
        body="We've received it and someone from the station team will be in touch."
      />
    );
  }

  return (
    <FormScope prefix="feedback">
      <form onSubmit={submit} className="relative space-y-5">
        {/* Honeypot — unlabelled and untabbable, so only an automated filler
            will ever put a value in it. Clipped rather than display:none or
            shoved off-screen: display:none is trivial for a bot to detect, and
            a large negative offset can widen the document. */}
        <input
          type="text"
          name={HONEYPOT_NAME}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            border: 0,
            overflow: "hidden",
            clipPath: "inset(50%)",
            whiteSpace: "nowrap",
          }}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="name" label="Name" required autoComplete="name" />
          <Field
            id="contact"
            label="Contact"
            required
            placeholder="Phone or email"
          />
        </div>

        <SelectField
          id="enquiryType"
          label="Enquiry type"
          options={ENQUIRY_TYPES}
          required
          onChange={setEnquiryType}
        />

        <div
          style={{ gridTemplateRows: isComplaint ? "1fr" : "0fr" }}
          className="grid transition-[grid-template-rows] duration-500 ease-out"
        >
          <div className="overflow-hidden">
            <div className="space-y-5 pt-1">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="visitDate" label="Date of visit" type="date" />
                <Field id="visitTime" label="Approximate time" type="time" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField
                  id="issueCategory"
                  label="Issue category"
                  options={ISSUE_CATEGORIES}
                  placeholder="Select a category"
                />
                <Field
                  id="reference"
                  label="Pump or payment reference"
                  placeholder="If you have one"
                />
              </div>
            </div>
          </div>
        </div>

        <TextareaField id="message" label="Message" rows={5} required />

        <ConsentField id="consent">
          I agree to the{" "}
          <Link
            href="/terms"
            className="font-semibold text-navy-900 underline decoration-route decoration-2 underline-offset-4"
          >
            privacy notice
          </Link>
          .
        </ConsentField>

        {status === "error" ? (
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
        ) : null}

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
              : "Send Message →"}
        </button>
      </form>
    </FormScope>
  );
}
