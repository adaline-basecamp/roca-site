import { SITE } from "@/lib/constants";
import Icon from "@/components/ui/Icon";

export default function FormResult({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-8 ring-1 ring-line">
      <span
        className="grid h-11 w-11 place-items-center rounded-full text-white"
        style={{ background: "var(--color-amenity)" }}
      >
        <Icon name="check" className="h-5 w-5" />
      </span>
      <h3 className="font-display mt-5 text-xl font-semibold text-navy-900">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-muted">
        {body} For anything urgent, call{" "}
        <a
          href={SITE.phoneHref}
          className="font-semibold text-navy-900 underline decoration-route decoration-2 underline-offset-4"
        >
          {SITE.phone}
        </a>
        .
      </p>
    </div>
  );
}
