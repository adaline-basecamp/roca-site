import { useId } from "react";
import { DROP_PATH, DROP_LAYERS } from "./dropLayerPaths";

type DropLayersProps = {
  /** Ref-friendly hook: called with the rendered <path> for each band key. */
  layerRef?: (key: string, el: SVGPathElement | null) => void;
  outlineClassName?: string;
  /**
   * Renders every band pre-hidden (matching the assembly animation's opening
   * GSAP state) so the first static paint — before hydration runs — never
   * flashes the composed mark before hiding it again.
   */
  initialHidden?: boolean;
};

// The one vector system: drop-outline clipPath + six organic wave-band
// paths, traced against the real lockup artwork. Meant to be dropped inside
// a parent <svg viewBox="0 0 100 100">. Every other drop-shaped element
// (nav indicator, list bullets, footer mark, header assembly) renders this
// same geometry rather than a bespoke shape.
export default function DropLayers({
  layerRef,
  outlineClassName,
  initialHidden,
}: DropLayersProps) {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9]/g, "");
  const clipId = `dropClip-${id}`;
  const gradId = `dropTealCyan-${id}`;

  return (
    <>
      <defs>
        <linearGradient
          id={gradId}
          x1="50%"
          y1="0%"
          x2="50%"
          y2="100%"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#009CC4" />
          <stop offset="45%" stopColor="#009CC4" />
          <stop offset="45%" stopColor="#15B98C" />
          <stop offset="100%" stopColor="#15B98C" />
        </linearGradient>
        <clipPath id={clipId}>
          <path d={DROP_PATH} />
        </clipPath>
      </defs>
      {outlineClassName && (
        <path d={DROP_PATH} fill="none" stroke="currentColor" strokeWidth="5" className={outlineClassName} />
      )}
      <g clipPath={`url(#${clipId})`}>
        {DROP_LAYERS.map((layer) => (
          <path
            key={layer.key}
            ref={(el) => layerRef?.(layer.key, el)}
            data-drop-layer={layer.key}
            d={layer.d}
            fill={layer.fill === "gradient" ? `url(#${gradId})` : layer.fill}
            style={
              initialHidden
                ? { opacity: 0, transform: "translateY(4px) scale(0.55)", transformOrigin: "50% 100%" }
                : undefined
            }
          />
        ))}
      </g>
    </>
  );
}
