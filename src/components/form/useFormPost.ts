"use client";

import { useEffect, useState } from "react";

export type Status = "idle" | "submitting" | "success" | "error";

/**
 * Endpoint and access key, with committed defaults.
 *
 * Both are NEXT_PUBLIC_, so they are compiled into the client bundle and are
 * readable by anyone loading the site — that is inherent to any browser-side
 * form service, not a leak. A Web3Forms access key only identifies the
 * destination inbox; it grants no account access and can be rotated from the
 * Web3Forms dashboard at any time.
 *
 * They are committed rather than left to build variables because this Worker
 * serves static assets only, and Cloudflare does not expose variables on such
 * a project — the deploy would silently ship a build with no endpoint and both
 * forms would fall back to "call us" without anything looking broken.
 *
 * The env vars still win when set, so a different provider or a rotated key
 * needs no code change if a build-variable path becomes available.
 */
const WEBHOOK_URL =
  process.env.NEXT_PUBLIC_LEAD_WEBHOOK ?? "https://api.web3forms.com/submit";
const ACCESS_KEY =
  process.env.NEXT_PUBLIC_LEAD_ACCESS_KEY ??
  "b0cff82c-23a5-4b73-b9ef-00a42b363ddd";

// The success glyph needs a beat to play before the panel replaces it.
const SUCCESS_PANEL_DELAY_MS = 700;

// Honeypot. Bots fill every field they find; humans never see this one, so a
// non-empty value means the submission is automated. Web3Forms rejects it
// server-side too when the field is named `botcheck`, but bailing here saves
// a request and keeps the UI honest.
export const HONEYPOT_NAME = "botcheck";

/**
 * Shared submit behaviour for both forms.
 *
 * A missing endpoint fails loudly into the error state (which points at the
 * phone and email) rather than silently pretending to send — the client's
 * content rules explicitly prohibit inactive form actions going live.
 */
export function useFormPost(formName: string, subject: string) {
  const [status, setStatus] = useState<Status>("idle");
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    if (status !== "success") return;
    const t = setTimeout(() => setShowPanel(true), SUCCESS_PANEL_DELAY_MS);
    return () => clearTimeout(t);
  }, [status]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = Object.fromEntries(new FormData(form).entries());

    // Silently succeed for bots: telling them they were caught just invites
    // a retry with the field cleared.
    if (String(fields[HONEYPOT_NAME] ?? "").trim() !== "") {
      setStatus("success");
      form.reset();
      return;
    }

    if (!WEBHOOK_URL) {
      setStatus("error");
      return;
    }

    const payload: Record<string, string> = {
      form: formName,
      // Without a subject every notification arrives titled the same, and the
      // two forms become indistinguishable in an inbox.
      subject,
      from_name: "Roca Fuels website",
      ...(fields as Record<string, string>),
    };
    if (ACCESS_KEY) payload.access_key = ACCESS_KEY;

    // Sent as FormData, not JSON.
    //
    // A JSON body sets Content-Type: application/json, which is not a
    // CORS-safelisted value, so the browser fires an OPTIONS preflight before
    // the POST. That preflight is one more thing that can fail between the
    // visitor and the inbox, and it did fail in testing. multipart/form-data
    // is safelisted, so this goes straight out as a simple request — the same
    // shape a plain HTML form would send, which is the best-supported path
    // through every form service.
    const formBody = new FormData();
    for (const [k, v] of Object.entries(payload)) formBody.append(k, v);

    setStatus("submitting");
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        // Ask for a JSON body back. Without it some providers answer with a
        // redirect to their own thank-you page, which fetch follows — the
        // response then looks like a success even when the send failed.
        // Accept is CORS-safelisted, so it does not reintroduce a preflight.
        headers: { Accept: "application/json" },
        body: formBody,
      });

      // Web3Forms can answer 200 with { success: false } for a rejected key or
      // a spam verdict, so the status code alone is not proof of delivery.
      const result = await res.json().catch(() => null);
      if (!res.ok || (result && result.success === false)) {
        throw new Error("Request failed");
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return { status, showPanel, submit };
}
