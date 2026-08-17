import * as THREE from "three";

/**
 * The forecourt, built procedurally — no model file to download, no loader to
 * block first paint, and the palette stays bound to the design tokens.
 *
 * Proportions are drawn from the client's own station photography: a wide
 * shallow canopy on four slim columns, twin dispensers beneath, and the brand
 * fascia band running the full length of the roof edge.
 */

const NAVY = 0x073d63;
const NAVY_DARK = 0x04283f;
const CONCRETE = 0xdfe8ee;
const CONCRETE_DARK = 0xc3d2dc;

export const BRAND_STOPS = [
  0x1c59c5, 0x009cc4, 0x15b98c, 0x8bba44, 0xf5ca00, 0xff9f13, 0xfd2c3a,
];

function flat(color: number, opts: THREE.MeshStandardMaterialParameters = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    flatShading: true,
    roughness: 0.82,
    metalness: 0.02,
    ...opts,
  });
}

/** Horizontal strip of the brand spectrum, used on the canopy fascia. */
function fasciaTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 8;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, c.width, 0);
  BRAND_STOPS.forEach((hex, i) => {
    g.addColorStop(
      i / (BRAND_STOPS.length - 1),
      "#" + hex.toString(16).padStart(6, "0")
    );
  });
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, c.width, c.height);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * The lockup, drawn to a canvas so it can be tinted white for navy signage
 * without shipping a second asset. Returns immediately with a blank texture
 * and repaints once the PNG decodes — the model must never wait on an image.
 */
function lockupTexture(invert: boolean) {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 438;
  const ctx = c.getContext("2d")!;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;

  const img = new window.Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, c.width, c.height);
    if (invert) {
      // Keep the alpha, force every opaque pixel white — the delivered lockup
      // is navy artwork and would disappear on a navy sign.
      const d = ctx.getImageData(0, 0, c.width, c.height);
      for (let i = 0; i < d.data.length; i += 4) {
        d.data[i] = 255;
        d.data[i + 1] = 255;
        d.data[i + 2] = 255;
      }
      ctx.putImageData(d, 0, 0);
    }
    tex.needsUpdate = true;
  };
  img.src = "/brand/derived/roca-lockup.png";
  return tex;
}

/** The drop mark alone, for the dispenser faces. */
function dropMarkTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;

  // Teardrop path: circular bulb, tapered apex — the guidelines' construction.
  const path = new Path2D();
  path.moveTo(128, 34);
  path.bezierCurveTo(128, 34, 208, 132, 208, 168);
  path.arc(128, 168, 80, 0, Math.PI, false);
  path.bezierCurveTo(48, 132, 128, 34, 128, 34);
  path.closePath();

  ctx.save();
  ctx.clip(path);
  // Brand spectrum banded across the drop, in logo order.
  const g = ctx.createLinearGradient(0, 34, 0, 248);
  BRAND_STOPS.forEach((hex, i) => {
    g.addColorStop(
      i / (BRAND_STOPS.length - 1),
      "#" + hex.toString(16).padStart(6, "0")
    );
  });
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  ctx.restore();

  tex.needsUpdate = true;
  return tex;
}

/** Soft radial contact shadow — cheaper and softer than a shadow map. */
function contactShadow() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 126);
  g.addColorStop(0, "rgba(7,61,99,0.34)");
  g.addColorStop(0.55, "rgba(7,61,99,0.14)");
  g.addColorStop(1, "rgba(7,61,99,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(9.5, 6.4),
    new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
    })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.004;
  // Excluded from the camera fit — it extends well past the structure and
  // would push the framing back for no visible gain.
  mesh.name = "contactShadow";
  return mesh;
}

function pump(faceColor: number) {
  const g = new THREE.Group();

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1.5, 0.44), flat(0xf2f6f9));
  body.position.y = 0.75;
  g.add(body);

  // Screen face, tinted with a functional accent so each dispenser reads
  // as a distinct unit rather than a duplicated box.
  const face = new THREE.Mesh(
    new THREE.BoxGeometry(0.44, 0.42, 0.02),
    flat(faceColor, { roughness: 0.45 })
  );
  face.position.set(0, 1.16, 0.23);
  g.add(face);

  // Drop mark on the dispenser shoulder — the brand at the point of contact.
  const mark = new THREE.Mesh(
    new THREE.PlaneGeometry(0.2, 0.2),
    new THREE.MeshBasicMaterial({
      map: dropMarkTexture(),
      transparent: true,
    })
  );
  mark.position.set(0, 0.74, 0.222);
  g.add(mark);

  const band = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.1, 0.46), flat(NAVY));
  band.position.y = 0.36;
  g.add(band);

  const base = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.12, 0.66), flat(CONCRETE_DARK));
  base.position.y = 0.06;
  g.add(base);

  // Nozzle arm
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.34), flat(CONCRETE_DARK));
  arm.position.set(0.3, 1.02, 0.16);
  g.add(arm);

  return g;
}

export function buildStation() {
  const root = new THREE.Group();

  /* Forecourt slab. Kept pale — a dark asphalt plate reads as a heavy black
     bar inside the light hero card and drags the whole composition down. */
  const slab = new THREE.Mesh(
    new THREE.BoxGeometry(9.4, 0.16, 6.2),
    flat(0xcdd9e2, { roughness: 0.95 })
  );
  slab.position.y = -0.08;
  root.add(slab);

  const apron = new THREE.Mesh(
    new THREE.BoxGeometry(9.0, 0.02, 5.8),
    flat(0xdde7ee, { roughness: 0.98 })
  );
  apron.position.y = 0.011;
  root.add(apron);

  root.add(contactShadow());

  /* Columns */
  const colGeo = new THREE.BoxGeometry(0.3, 3.05, 0.3);
  const colMat = flat(CONCRETE);
  [
    [-3.1, -1.5],
    [3.1, -1.5],
    [-3.1, 1.5],
    [3.1, 1.5],
  ].forEach(([x, z]) => {
    const c = new THREE.Mesh(colGeo, colMat);
    c.position.set(x, 1.53, z);
    root.add(c);
  });

  /* Canopy */
  const canopy = new THREE.Group();
  canopy.position.y = 3.05;

  // Deep fascia — real forecourt canopies carry a tall branded band, and a
  // thin slab leaves the lockup nowhere to sit.
  const ROOF_H = 0.62;
  const roof = new THREE.Mesh(new THREE.BoxGeometry(7.8, ROOF_H, 4.5), flat(NAVY));
  roof.position.y = ROOF_H / 2 + 0.06;
  canopy.add(roof);

  // Lockup on the canopy face, both sides — the sign a driver reads from the
  // road. Sized to the fascia (not the roof) so it can never overhang.
  const lockupMat = new THREE.MeshBasicMaterial({
    map: lockupTexture(true),
    transparent: true,
  });
  const LOCK_H = ROOF_H * 0.52;
  const lockupFront = new THREE.Mesh(
    // Source lockup is 900x385, so height drives width.
    new THREE.PlaneGeometry(LOCK_H * (900 / 385), LOCK_H),
    lockupMat
  );
  lockupFront.position.set(0, roof.position.y + 0.03, 2.256);
  canopy.add(lockupFront);

  const lockupBack = lockupFront.clone();
  lockupBack.position.z = -2.256;
  lockupBack.rotation.y = Math.PI;
  canopy.add(lockupBack);

  const underside = new THREE.Mesh(
    new THREE.BoxGeometry(7.5, 0.08, 4.2),
    flat(0xf7fafc, { roughness: 0.6 })
  );
  underside.position.y = 0.14;
  canopy.add(underside);

  // Brand fascia — the refining spectrum, running the roof edge. This is the
  // one place the full gradient appears in the 3D scene.
  const fasciaMat = new THREE.MeshBasicMaterial({ map: fasciaTexture() });
  const fasciaFront = new THREE.Mesh(new THREE.PlaneGeometry(7.8, 0.1), fasciaMat);
  fasciaFront.position.set(0, 0.115, 2.256);
  canopy.add(fasciaFront);

  const fasciaBack = fasciaFront.clone();
  fasciaBack.position.z = -2.256;
  fasciaBack.rotation.y = Math.PI;
  canopy.add(fasciaBack);

  // Downlights
  const lightGeo = new THREE.BoxGeometry(0.5, 0.03, 0.5);
  const lightMat = new THREE.MeshBasicMaterial({ color: 0xfff6d8 });
  [-2.2, 0, 2.2].forEach((x) => {
    [-1.1, 1.1].forEach((z) => {
      const l = new THREE.Mesh(lightGeo, lightMat);
      l.position.set(x, 0.095, z);
      canopy.add(l);
    });
  });

  root.add(canopy);

  /* Dispensers */
  const p1 = pump(0x0aa6ca);
  p1.position.set(-1.5, 0, 0);
  root.add(p1);

  const p2 = pump(0x19b893);
  p2.position.set(1.5, 0, 0);
  root.add(p2);

  /* Price/brand totem at the edge of the plot */
  const totem = new THREE.Group();
  const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.3, 0.16), flat(CONCRETE_DARK));
  post.position.y = 1.15;
  totem.add(post);
  const sign = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.85, 0.12), flat(NAVY_DARK));
  sign.position.y = 2.55;
  totem.add(sign);

  // Roadside totem carries the lockup on both faces plus the spectrum rule.
  const totemMat = new THREE.MeshBasicMaterial({
    map: lockupTexture(true),
    transparent: true,
  });
  const totemFront = new THREE.Mesh(new THREE.PlaneGeometry(1.02, 0.44), totemMat);
  totemFront.position.set(0, 2.62, 0.062);
  totem.add(totemFront);

  const totemBack = totemFront.clone();
  totemBack.position.z = -0.062;
  totemBack.rotation.y = Math.PI;
  totem.add(totemBack);

  const signStripe = new THREE.Mesh(
    new THREE.PlaneGeometry(1.05, 0.07),
    new THREE.MeshBasicMaterial({ map: fasciaTexture() })
  );
  signStripe.position.set(0, 2.28, 0.062);
  totem.add(signStripe);
  totem.position.set(-4.05, 0, 1.9);
  totem.rotation.y = 0.32;
  root.add(totem);

  root.position.y = -0.9;
  return root;
}
