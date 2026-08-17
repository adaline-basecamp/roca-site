// Layered drop geometry — traced against public/brand/derived/roca-lockup.png
// (pixel-sampled band boundaries, converted into the shared 100x100 viewBox
// used by every drop-shaped element on the site). Six wave-band paths, each
// extending from its own organic top edge down past the silhouette's base,
// so a single drop-outline clipPath turns them into the real logo interior —
// no straight stripes, matching the brand's actual wave geometry.

/**
 * Render this geometry inside `viewBox={DROP_VIEWBOX}`, not "0 0 100 100".
 *
 * The silhouette's bulb is an r=38 arc centred at y=72, so the shape actually
 * runs to y=110 — a square 0..100 box crops the base flat. At bullet size
 * that's invisible; at the opener's 80px it reads as a chopped logo.
 */
export const DROP_VIEWBOX = "0 0 100 112";

export const DROP_PATH =
  "M50,6 C24,40 12,58 12,72 a38,38 0 1 0 76,0 C88,58 76,40 50,6 Z";

type Layer = {
  key: string;
  /** Fill for solid bands; "gradient" bands render the two-tone teal/cyan split. */
  fill: string | "gradient";
  d: string;
};

// Paint order, back to front — the crown (blue) sits at the bottom of the
// stack and each later band covers less area, so earlier bands peek through
// above each wavy edge exactly as they do in the source artwork.
export const DROP_LAYERS: Layer[] = [
  { key: "blue", fill: "#1C59C5", d: DROP_PATH },
  {
    key: "tealCyan",
    fill: "gradient",
    d: "M-5,33.0 C0.2,33.0 19.2,35.5 26.0,33.0 C32.8,30.5 32.0,19.7 36.0,18.0 C40.0,16.3 46.0,20.8 50.0,23.0 C54.0,25.2 57.0,29.2 60.0,31.0 C63.0,32.8 60.5,33.5 68.0,34.0 C75.5,34.5 98.8,34.0 105.0,34.0 L105,116 L-5,116 Z",
  },
  {
    key: "green",
    fill: "#8BBA44",
    d: "M-5,47.0 C-1.2,47.0 13.2,48.5 18.0,47.0 C22.8,45.5 20.8,39.2 24.0,38.0 C27.2,36.8 32.7,38.5 37.0,40.0 C41.3,41.5 45.8,44.5 50.0,47.0 C54.2,49.5 57.8,53.5 62.0,55.0 C66.2,56.5 71.5,56.5 75.0,56.0 C78.5,55.5 81.2,51.7 83.0,52.0 C84.8,52.3 82.3,57.0 86.0,58.0 C89.7,59.0 101.8,58.0 105.0,58.0 L105,116 L-5,116 Z",
  },
  {
    key: "yellow",
    fill: "#F5CA00",
    d: "M-5,60.0 C-1.8,60.0 10.5,61.2 14.0,60.0 C17.5,58.8 13.3,53.0 16.0,53.0 C18.7,53.0 25.2,58.2 30.0,60.0 C34.8,61.8 40.8,63.3 45.0,64.0 C49.2,64.7 51.7,64.5 55.0,64.0 C58.3,63.5 61.7,61.7 65.0,61.0 C68.3,60.3 71.5,60.2 75.0,60.0 C78.5,59.8 81.0,60.0 86.0,60.0 C91.0,60.0 101.8,60.0 105.0,60.0 L105,116 L-5,116 Z",
  },
  {
    key: "orange",
    fill: "#FF9F13",
    d: "M-5,62.5 C-1.9,62.5 8.9,62.7 13.3,62.5 C17.7,62.3 18.1,61.2 21.1,61.1 C24.1,61.0 27.2,60.6 31.5,61.8 C35.8,62.9 42.8,65.7 47.1,68.0 C51.4,70.3 53.6,73.4 57.5,75.6 C61.4,77.8 62.6,80.2 70.5,81.1 C78.4,82.0 99.2,81.1 105.0,81.1 L105,116 L-5,116 Z",
  },
  {
    key: "red",
    fill: "#FD2C3A",
    d: "M-5,84.0 C-1.1,84.0 14.1,84.0 18.5,84.0 C22.9,84.0 19.4,84.0 21.1,83.8 C22.8,83.6 26.3,82.8 28.9,83.1 C31.5,83.4 34.0,85.1 36.7,85.9 C39.4,86.7 42.0,87.7 45.0,88.0 C48.0,88.3 51.7,88.5 55.0,88.0 C58.3,87.5 62.4,86.0 65.0,85.0 C67.6,84.0 63.8,82.5 70.5,82.0 C77.2,81.5 99.2,82.0 105.0,82.0 L105,116 L-5,116 Z",
  },
];

// Temporal build order for the assembly animation — base to crown, the
// narrative direction of the refining process ("checked daily" / "the flow
// of colors conveys progress").
export const DROP_LAYER_BUILD_ORDER = [
  "red",
  "orange",
  "yellow",
  "green",
  "tealCyan",
  "blue",
] as const;

export const DROP_LAYER_HEX: Record<string, string> = {
  blue: "#1C59C5",
  tealCyan: "#009CC4",
  green: "#8BBA44",
  yellow: "#F5CA00",
  orange: "#FF9F13",
  red: "#FD2C3A",
};
