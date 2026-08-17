type Tone = "white" | "surface" | "pale" | "navy" | "corporate";

const TONES: Record<Tone, string> = {
  white: "bg-white",
  surface: "bg-surface",
  pale: "bg-surface-pale",
  navy: "bg-navy-900 on-navy",
  corporate: "bg-gradient-corporate on-navy",
};

/**
 * Section rhythm is deliberately uneven: `py` varies by tone so the page
 * alternates dense utility bands with breathing brand moments rather than
 * marching down a uniform grid.
 */
const PADDING: Record<Tone, string> = {
  white: "py-20 sm:py-28 lg:py-32",
  surface: "py-20 sm:py-28 lg:py-32",
  pale: "py-16 sm:py-20",
  navy: "py-24 sm:py-32 lg:py-40",
  corporate: "py-20 sm:py-24",
};

export default function Section({
  id,
  tone = "white",
  className = "",
  containerClassName = "",
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative ${TONES[tone]} ${PADDING[tone]} ${className}`}
    >
      <div
        className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 ${containerClassName}`}
      >
        {children}
      </div>
    </section>
  );
}
