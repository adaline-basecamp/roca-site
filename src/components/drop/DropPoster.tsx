import DropLayers from "@/components/motion/DropLayers";

type DropPosterProps = {
  className?: string;
};

// Static stand-in for the WebGL drop — used when prefers-reduced-motion is
// set, so the hero still gets its signature shape without any animation.
// Same layered vector system as the header mark and bullets, just static.
export default function DropPoster({ className = "" }: DropPosterProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none flex items-center justify-center sm:justify-end ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="h-[46vw] max-h-[380px] w-[46vw] max-w-[380px] opacity-80 sm:mr-[8vw] sm:opacity-90"
      >
        <DropLayers />
      </svg>
    </div>
  );
}
