/**
 * "Liquid flowing" — the third construction concept in the brand guidelines,
 * alongside the drop icon and layer-by-layer processing.
 *
 * The look: long ribbons of refined fuel catching light, banding through the
 * brand spectrum with iridescent highlights where they fold over each other.
 * Built from domain-warped fbm so the flow reads as heavy and slow rather
 * than turbulent — this is refined product moving through a pipe, not water.
 *
 * One shader, two uses:
 *  - the opener, at full strength on navy
 *  - the hero backdrop, dialled far down behind the headline
 */

export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform vec2  uResolution;
  uniform float uTime;
  uniform vec2  uPointer;     // -1..1, eased in JS
  uniform float uIntensity;   // master opacity
  uniform float uSaturation;  // 1.0 = full brand chroma, lower = washed
  uniform float uContrast;    // ribbon edge hardness
  uniform float uScale;       // world scale of the flow
  uniform vec3  uBase;        // surface the ribbons sit on
  uniform float uVignette;    // edge falloff strength
  uniform float uDepth;       // how far troughs sink toward uBase (0 = none)

  uniform vec3 uC0; uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3;
  uniform vec3 uC4; uniform vec3 uC5; uniform vec3 uC6;

  // ── noise ──────────────────────────────────────────────────────────────
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.02;
      a *= 0.5;
    }
    return v;
  }

  // Iq-style domain warp: the flow field is itself distorted by a slower
  // field, which is what turns straight bands into folding ribbons.
  float flowField(vec2 p, float t, out vec2 warp) {
    vec2 q = vec2(fbm(p + vec2(0.0, t * 0.09)),
                  fbm(p + vec2(4.7, 1.3 - t * 0.06)));
    vec2 r = vec2(fbm(p + 3.4 * q + vec2(1.7, 9.2) + t * 0.05),
                  fbm(p + 3.4 * q + vec2(8.3, 2.8) - t * 0.04));
    warp = r;
    return fbm(p + 2.6 * r);
  }

  // Brand spectrum, sampled continuously.
  vec3 spectrum(float t) {
    t = clamp(t, 0.0, 1.0) * 6.0;
    if (t < 1.0) return mix(uC0, uC1, t);
    if (t < 2.0) return mix(uC1, uC2, t - 1.0);
    if (t < 3.0) return mix(uC2, uC3, t - 2.0);
    if (t < 4.0) return mix(uC3, uC4, t - 3.0);
    if (t < 5.0) return mix(uC4, uC5, t - 4.0);
    return mix(uC5, uC6, t - 5.0);
  }

  // sRGB encode — three.js hands us a linear target, and writing straight to
  // it desaturates every brand hex toward its linear-decoded twin.
  vec3 toSRGB(vec3 c) {
    return mix(c * 12.92,
               1.055 * pow(max(c, vec3(0.0031308)), vec3(1.0 / 2.4)) - 0.055,
               step(vec3(0.0031308), c));
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);

    // Pointer nudges the field rather than moving a highlight around: the
    // whole body of liquid leans, which feels like mass.
    p += uPointer * 0.12;
    p *= uScale;

    float t = uTime;

    // Laminar, not turbulent. Sampling the noise on a strongly anisotropic
    // grid (wide in x, tight in y) stretches every feature into a long ribbon
    // travelling one way, which is what separates "refined product moving
    // through a pipe" from "paint poured in water". Isotropic fbm here reads
    // as marbling and fights the brand.
    vec2 q = vec2(p.x * 0.42, p.y * 2.1);
    q += vec2(t * 0.035, 0.0);

    vec2 warp;
    float f = flowField(q, t, warp);

    // A single smooth sinusoidal stack — no fract(), so there are no hard
    // repeat seams anywhere in the field.
    float phase = p.y * 2.4 + f * 2.6 + warp.x * 0.9 - t * 0.16;
    float ribbon = sin(phase);
    float crest = ribbon * 0.5 + 0.5;

    // Contrast shapes how tightly the ribbons pinch, without ever going hard.
    crest = pow(crest, mix(1.0, 2.6, clamp(uContrast, 0.0, 2.0) * 0.5));

    // Two hue registers, not one sweep. The body of the liquid stays in the
    // cool end of the brand spectrum (blue through cyan), and only the
    // brightest crests climb into the warm end. That split is what produces
    // deep blue product with coral light riding the folds, instead of a flat
    // rainbow where every hue competes for the same attention.
    float drift = 0.5 + 0.5 * sin(t * 0.09 + warp.y * 1.1);
    float bodyHue = mix(0.02, 0.22, clamp(f * 0.8 + 0.45, 0.0, 1.0)) + drift * 0.05;
    float warmHue = mix(0.80, 0.99, clamp(warp.x * 0.5 + 0.5, 0.0, 1.0));

    // Only the top of the crest goes warm, and it ramps hard so the warm
    // areas read as light on the liquid rather than as their own ribbons.
    float warmth = smoothstep(0.62, 0.99, crest);

    vec3 col = mix(spectrum(bodyHue), spectrum(warmHue), warmth * 0.92);

    // Glossy specular along the very tip of each crest — tight and bright,
    // the highlight rolling off a curved liquid surface.
    float sheen = pow(crest, 14.0);
    col += sheen * 0.55;

    // Thin-film shift in the troughs gives the oil-slick iridescence.
    vec3 shift = spectrum(clamp(bodyHue + 0.16, 0.0, 1.0));
    col = mix(col, shift, smoothstep(0.5, 0.0, crest) * 0.45);

    // Depth: troughs sink toward the base surface so the ribbons read as
    // overlapping layers rather than a flat pattern.
    col = mix(uBase, col, mix(1.0 - uDepth, 1.0, smoothstep(0.02, 0.8, crest)));

    // Desaturate toward the base surface.
    float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
    col = mix(vec3(l), col, uSaturation);

    // Radial falloff so the field never hits the panel edge hard.
    float d = length((uv - 0.5) * vec2(1.25, 1.0));
    float vig = 1.0 - smoothstep(0.34, 0.85, d) * uVignette;

    gl_FragColor = vec4(toSRGB(col), uIntensity * vig);
  }
`;
