"use client";

import { createContext, useContext } from "react";

/**
 * Namespaces DOM ids per form.
 *
 * Both forms live on the same page and both had fields called name, contact
 * and consent, so their ids collided. A duplicate id is not just invalid HTML:
 * `label[for]` resolves to the FIRST match in the document, so tapping "Name"
 * in the contact form focused the fleet form's input far up the page. That is
 * worst on mobile, where the label is the tap target.
 *
 * The id gets the prefix; the `name` stays raw, so payload keys are unchanged.
 */
const FormScopeCtx = createContext<string | null>(null);

export function FormScope({
  prefix,
  children,
}: {
  prefix: string;
  children: React.ReactNode;
}) {
  return <FormScopeCtx.Provider value={prefix}>{children}</FormScopeCtx.Provider>;
}

function useDomId(id: string) {
  const prefix = useContext(FormScopeCtx);
  return prefix ? `${prefix}-${id}` : id;
}

const CONTROL =
  "mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-[0.95rem] text-ink outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-muted/60 focus:border-navy-700 focus:shadow-[0_0_0_4px_rgba(10,166,202,0.12)]";

const LABEL = "text-sm font-semibold text-navy-900";

export function Field({
  id,
  label,
  type = "text",
  required,
  placeholder,
  autoComplete,
  className = "",
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
}) {
  const domId = useDomId(id);
  return (
    <div className={className}>
      <label htmlFor={domId} className={LABEL}>
        {label}
        {!required ? (
          <span className="ml-1.5 font-normal text-muted">(optional)</span>
        ) : null}
      </label>
      <input
        id={domId}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={CONTROL}
      />
    </div>
  );
}

export function SelectField({
  id,
  label,
  options,
  required,
  placeholder = "Select an option",
  onChange,
  className = "",
}: {
  id: string;
  label: string;
  options: readonly string[];
  required?: boolean;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
}) {
  const domId = useDomId(id);
  return (
    <div className={className}>
      <label htmlFor={domId} className={LABEL}>
        {label}
      </label>
      <div className="relative">
        <select
          id={domId}
          name={id}
          required={required}
          defaultValue=""
          onChange={(e) => onChange?.(e.target.value)}
          className={`${CONTROL} appearance-none pr-11`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        >
          <path
            d="m6.5 9.5 5.5 5.5 5.5-5.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

export function TextareaField({
  id,
  label,
  rows = 5,
  required,
  placeholder,
  className = "",
}: {
  id: string;
  label: string;
  rows?: number;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const domId = useDomId(id);
  return (
    <div className={className}>
      <label htmlFor={domId} className={LABEL}>
        {label}
      </label>
      <textarea
        id={domId}
        name={id}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className={`${CONTROL} resize-y`}
      />
    </div>
  );
}

export function ConsentField({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const domId = useDomId(id);
  return (
    <label
      htmlFor={domId}
      className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted"
    >
      <input
        id={domId}
        name={id}
        type="checkbox"
        required
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border border-line bg-white transition-colors duration-200 peer-checked:border-navy-900 peer-checked:bg-navy-900 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-route"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white">
          <path
            d="m5.5 12.6 4.2 4.2 8.8-9.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>{children}</span>
    </label>
  );
}

export { CONTROL, LABEL };
