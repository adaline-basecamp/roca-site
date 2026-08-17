"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/constants";
import SubmitDrop from "@/components/motion/SubmitDrop";

const ENQUIRY_TYPES = ["General", "Partnership", "Feedback"] as const;

const WEBHOOK_URL = process.env.NEXT_PUBLIC_LEAD_WEBHOOK;

// Time the success glyph (fill + check) gets to play before the form
// swaps out for the thank-you panel.
const SUCCESS_PANEL_DELAY_MS = 700;

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [showSuccessPanel, setShowSuccessPanel] = useState(false);

  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(() => setShowSuccessPanel(true), SUCCESS_PANEL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [status]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    if (!WEBHOOK_URL) {
      // Enquiry routing endpoint isn't configured yet (client to confirm
      // NEXT_PUBLIC_LEAD_WEBHOOK) — fail gracefully instead of posting nowhere.
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success" && showSuccessPanel) {
    return (
      <div className="rounded-2xl bg-surface p-8 text-center ring-1 ring-line">
        <span className="bg-gradient-drop mx-auto block h-2 w-10 rounded-full" />
        <h3 className="mt-4 text-lg font-bold text-navy-900">
          Thank you — message sent.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          We&rsquo;ve received your enquiry and will get back to you soon. For
          anything urgent, call us at{" "}
          <a href={SITE.phoneHref} className="font-semibold text-navy-900">
            {SITE.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="text-sm font-semibold text-navy-900">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-navy-900 outline-none transition-colors focus:border-navy-700"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="text-sm font-semibold text-navy-900">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-navy-900 outline-none transition-colors focus:border-navy-700"
          />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-semibold text-navy-900">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-navy-900 outline-none transition-colors focus:border-navy-700"
          />
        </div>
      </div>

      <div>
        <label htmlFor="enquiryType" className="text-sm font-semibold text-navy-900">
          Enquiry type
        </label>
        <select
          id="enquiryType"
          name="enquiryType"
          required
          defaultValue=""
          className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-navy-900 outline-none transition-colors focus:border-navy-700"
        >
          <option value="" disabled>
            Select an enquiry type
          </option>
          {ENQUIRY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-semibold text-navy-900">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-navy-900 outline-none transition-colors focus:border-navy-700"
        />
      </div>

      {status === "error" && (
        <p className="text-sm font-medium text-support">
          Something went wrong sending your message. Please email us directly
          at{" "}
          <a href={`mailto:${SITE.email}`} className="underline">
            {SITE.email}
          </a>{" "}
          or call {SITE.phone}.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting" || status === "success"}
        className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-navy-900 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-90 sm:w-auto"
      >
        <SubmitDrop status={status} className="h-5 w-5" />
        {status === "submitting"
          ? "Sending…"
          : status === "success"
            ? "Sent"
            : "Send Message"}
      </button>
    </form>
  );
}
