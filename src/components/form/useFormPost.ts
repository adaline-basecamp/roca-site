"use client";

import { useEffect, useState } from "react";

export type Status = "idle" | "submitting" | "success" | "error";

const WEBHOOK_URL = process.env.NEXT_PUBLIC_LEAD_WEBHOOK;

// The success glyph needs a beat to play before the panel replaces it.
const SUCCESS_PANEL_DELAY_MS = 700;

/**
 * Shared submit behaviour for both forms. The lead endpoint isn't wired yet,
 * so a missing webhook fails loudly into the error state (which points at the
 * phone and email) rather than silently pretending to send — the client's
 * content rules explicitly prohibit inactive form actions going live.
 */
export function useFormPost(formName: string) {
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
    const payload = {
      form: formName,
      ...Object.fromEntries(new FormData(form).entries()),
    };

    if (!WEBHOOK_URL) {
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

  return { status, showPanel, submit };
}
