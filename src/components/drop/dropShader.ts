export const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uOffset;
  uniform vec2 uCenter;
  uniform float uScale;
  uniform float uBreath;
  uniform float uOpacity;
  uniform float uPresence;
  uniform vec3 uColor0;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  uniform vec3 uColor5;
  uniform vec3 uColor6;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  // Low-octave fbm: enough shape for organic drift, cheap enough to call
  // per band boundary without turning into busy churn.
  float fbm3(vec2 p) {
    float value = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 3; i++) {
      value += amp * noise(p);
      p *= 2.02;
      amp *= 0.52;
    }
    return value;
  }

  // Domain-warped noise (Iq-style): sample fbm through a coordinate that is
  // itself displaced by fbm, so the result drifts as one heavy mass instead
  // of many small ripples.
  float warpNoise(vec2 p) {
    vec2 q = vec2(fbm3(p), fbm3(p + vec2(5.2, 1.3)));
    return fbm3(p + 1.3 * q);
  }

  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  // iq's isosceles-triangle SDF: apex at origin, base corner at q.
  float sdTriIso(vec2 p, vec2 q) {
    p.x = abs(p.x);
    vec2 a = p - q * clamp(dot(p, q) / dot(q, q), 0.0, 1.0);
    vec2 b = p - q * vec2(clamp(p.x / q.x, 0.0, 1.0), 1.0);
    float s = -sign(q.y);
    vec2 d = min(
      vec2(dot(a, a), s * (p.x * q.y - p.y * q.x)),
      vec2(dot(b, b), s * (p.y - q.y))
    );
    return -sqrt(d.x) * sign(d.y);
  }

  // Teardrop SDF matching the logo: a rounded bulb base smooth-unioned with
  // a tapered point above it.
  float sdTeardrop(vec2 p, float r, float apexHeight) {
    float dCircle = length(p) - r;
    vec2 apex = vec2(0.0, apexHeight);
    vec2 q = vec2(r, -apexHeight);
    float dTri = sdTriIso(p - apex, q);
    return smin(dCircle, dTri, 0.05);
  }

  void main() {
    vec2 res = uResolution;
    vec2 uv = vUv - 0.5;
    uv.x *= res.x / max(res.y, 1.0);

    vec2 center = uCenter + uOffset;
    vec2 p = uv - center;

    float breathe = 1.0 + uBreath;
    p /= breathe * uScale;

    // Recenter the asymmetric bulb+point shape so uCenter lands on its
    // visual middle rather than its geometric bulb origin.
    float dropRadius = 0.15;
    float apexHeight = 0.32;
    p.y += (apexHeight - dropRadius) * 0.5;

    float d = sdTeardrop(p, dropRadius, apexHeight);

    // Crisp cut edge: feather scales with screen derivatives, never more
    // than ~2px regardless of DPR.
    float aa = fwidth(d);
    float mask = 1.0 - smoothstep(-aa, aa, d);

    vec3 fillColor = vec3(0.0);
    if (d < 0.06) {
      // Vertical position within the drop, 0 at the base, 1 at the tip.
      float yMin = -dropRadius;
      float yMax = apexHeight;
      float tY = clamp((p.y - yMin) / (yMax - yMin), 0.0, 1.0);

      // Logo order top-to-bottom is blue -> red, i.e. tip -> base.
      float scaled = (1.0 - tY) * 6.0;
      float bandAA = fwidth(scaled) * 1.5;

      // Each boundary drifts on its own slow, heavy-liquid phase — unrolled
      // rather than array-indexed for GLSL ES 1.0 (WebGL1) compatibility.
      fillColor = uColor0;
      for (int i = 1; i <= 6; i++) {
        float idx = float(i);
        vec2 warpCoord = vec2(p.x * 7.0 + idx * 4.1, uTime * 0.025 + idx * 2.3);
        float drift = warpNoise(warpCoord) - 0.5;
        float edgePos = idx + drift * 1.2;
        float m = smoothstep(edgePos - bandAA, edgePos + bandAA, scaled);
        if (i == 1) fillColor = mix(fillColor, uColor1, m);
        else if (i == 2) fillColor = mix(fillColor, uColor2, m);
        else if (i == 3) fillColor = mix(fillColor, uColor3, m);
        else if (i == 4) fillColor = mix(fillColor, uColor4, m);
        else if (i == 5) fillColor = mix(fillColor, uColor5, m);
        else fillColor = mix(fillColor, uColor6, m);
      }

      // Inner occlusion ring: darker just inside the rim for volume — kept
      // subtle so the mark still reads as confident flat graphic, not a
      // shaded 3D egg.
      float occlusion = smoothstep(-0.16, -0.01, d);
      fillColor *= mix(1.0, 0.85, occlusion);

      // Thin rim light on the upper-left edge only.
      vec2 lightDir = normalize(vec2(-0.6, 0.7));
      float edgeDist = -d;
      float rim = 1.0 - smoothstep(0.0, aa * 3.0, edgeDist);
      float facing = clamp(dot(normalize(p + 0.0001), lightDir) * 0.5 + 0.5, 0.0, 1.0);
      fillColor += vec3(1.0) * rim * pow(facing, 2.2) * 0.4;
    }

    // Soft, wide elliptical ground shadow beneath the drop — a cast shadow
    // on the navy, not a glow bleeding off the silhouette itself.
    vec2 sp = uv - (center + vec2(0.0, -dropRadius - 0.05));
    sp.y *= 2.4;
    float shadowDist = length(sp) - 0.14;
    float shadowGlow = exp(-max(shadowDist, 0.0) * 9.0) * 0.13;
    vec3 shadowColor = vec3(0.0, 0.02, 0.05);

    vec3 color = mix(shadowColor, fillColor, mask);
    float alpha = max(mask, shadowGlow * (1.0 - mask)) * uOpacity * uPresence;

    // uColor* uniforms arrive linear (three.js converts sRGB hex on upload);
    // encode back to sRGB before output or every band reads dark and muddy.
    vec3 lo = color * 12.92;
    vec3 hi = 1.055 * pow(clamp(color, 0.0, 1.0), vec3(1.0 / 2.4)) - 0.055;
    color = mix(lo, hi, step(vec3(0.0031308), color));

    gl_FragColor = vec4(color, alpha);
  }
`;
