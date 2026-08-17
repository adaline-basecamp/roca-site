import { SITE } from "@/lib/constants";

type CallWhatsAppButtonsProps = {
  className?: string;
  /** "onNavy": solid-white primary + outline secondary, for navy surfaces.
   *  "onLight": solid-navy primary + outline secondary, for white/tint surfaces. */
  tone?: "onNavy" | "onLight";
};

export default function CallWhatsAppButtons({
  className = "",
  tone = "onNavy",
}: CallWhatsAppButtonsProps) {
  const primary =
    tone === "onNavy"
      ? "bg-white text-navy-900 hover:scale-[1.03]"
      : "bg-navy-900 text-white hover:bg-navy-800";
  const secondary =
    tone === "onNavy"
      ? "border border-white/25 text-white hover:bg-white/10"
      : "border border-line text-navy-900 hover:bg-navy-900/5";

  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      <a
        href={SITE.phoneHref}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-sm transition-transform ${primary}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
          <path d="M4.5 3.5h3.2l1.4 4.2-2 1.6a12.5 12.5 0 0 0 5.6 5.6l1.6-2 4.2 1.4v3.2a2 2 0 0 1-2.2 2C9.8 19 5 14.2 4.5 5.7a2 2 0 0 1 2-2.2Z" />
        </svg>
        Call Station
      </a>
      <a
        href={SITE.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors ${secondary}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
          <path d="M20 12a8 8 0 1 1-3.6-6.7" />
          <path d="M20 12a8 8 0 0 1-11.4 7.2L4 20l0.9-4.4A8 8 0 0 1 20 12Z" />
          <path d="M9.3 9.8c.2-.6.9-.5 1.3.1.4.6.9 1.2.7 1.6-.2.4-.9.7-.6 1.2.3.5 1.4 1.5 2.3 1.8.5.2.7-.4 1.2-.6.5-.2 1.1.3 1.6.7.5.4.3 1-.2 1.3-.8.5-1.9.5-3-.1-1.6-.8-2.9-2.1-3.7-3.7-.5-1-.5-2 0-2.3Z" fill="currentColor" stroke="none" />
        </svg>
        WhatsApp
      </a>
    </div>
  );
}
