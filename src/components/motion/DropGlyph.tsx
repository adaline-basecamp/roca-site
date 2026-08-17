import { forwardRef, useId } from "react";
import DropLayers from "./DropLayers";
import { DROP_PATH } from "./dropLayerPaths";

type DropGlyphProps = {
  className?: string;
  outlineClassName?: string;
  /** Vertical offset (viewBox units) the fill mask starts translated by. 100 = fully empty. */
  startY?: number;
};

// Fill state is owned by the caller: they animate the forwarded rect's
// translateY via GSAP (100 = empty, 0 = full). The rect drives a mask over
// the real layered drop artwork, so as it rises the actual organic wave
// bands reveal bottom-up — same vector system as the header mark, not a
// stand-in flat gradient.
const DropGlyph = forwardRef<SVGRectElement, DropGlyphProps>(function DropGlyph(
  { className = "", outlineClassName = "text-current opacity-20", startY = 100 },
  ref
) {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9]/g, "");
  const maskId = `dropFillMask-${id}`;

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect
            ref={ref}
            x="0"
            y="0"
            width="100"
            height="100"
            fill="white"
            style={{ transform: `translateY(${startY}px)` }}
          />
        </mask>
      </defs>
      <path
        d={DROP_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        className={outlineClassName}
      />
      <g mask={`url(#${maskId})`}>
        <DropLayers />
      </g>
    </svg>
  );
});

export default DropGlyph;
