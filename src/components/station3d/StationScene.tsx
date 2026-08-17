"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { buildStation } from "./buildStation";

/**
 * The draggable forecourt.
 *
 * Performance discipline, in order of impact:
 *  - DPR capped at 1.5 (1.0 under 768px) — the scene is flat-shaded, so extra
 *    device pixels buy nothing visible but cost fill rate linearly.
 *  - The rAF loop stops entirely when the canvas leaves the viewport or the
 *    tab is hidden, and idles out when nothing is moving: once the drag has
 *    settled and auto-rotation is off, there is no frame to draw.
 *  - Init is deferred a frame past mount so the WebGL context never competes
 *    with LCP.
 *  - No shadow maps; contact shadow is a textured plane.
 */

const YAW_LIMIT = 0.72; // radians either side of front-on
const DRAG_SENSITIVITY = 0.0062;
const IDLE_SPIN = 0.055; // rad/s, resumes after the user stops dragging
// Peak scroll tilt. onScroll's ratio spans -1..1, so p spans 0..2 and the
// tilt reaches twice its coefficient — the camera fit samples against this.
const TILT_COEFF = 0.055;
const TILT_MAX = TILT_COEFF * 2;

export default function StationScene({
  className = "",
  onReady,
}: {
  className?: string;
  onReady?: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let raf = 0;
    let destroyed = false;
    // Two independent gates — collapsing them into one flag means a tab-hide
    // permanently latches the scene off even after it scrolls back into view.
    let inView = true;
    let tabVisible = true;
    const awake = () => inView && tabVisible && !destroyed;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    const rig = new THREE.Group();
    scene.add(rig);

    const station = buildStation();
    rig.add(station);

    /* Light: a cool sky/ground bounce plus one warm key, so the flat faces
       separate by hue rather than by shadow. */
    scene.add(new THREE.HemisphereLight(0xdcefff, 0x8fa6b5, 2.15));
    const key = new THREE.DirectionalLight(0xfff2d8, 1.55);
    key.position.set(4.2, 7.5, 5.4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x9fd8ff, 0.75);
    rim.position.set(-6, 3.4, -4.5);
    scene.add(rim);

    let yaw = -0.34;
    let targetYaw = -0.34;
    let autoSpin = true;
    let pointerId: number | null = null;
    let lastX = 0;
    let lastT = performance.now();
    let scrollTilt = 0;

    // Measured once from the built geometry rather than hand-tuned, so the
    // model always frames itself — including as the station gains detail.
    const bounds = new THREE.Box3();
    station.traverse((o) => {
      if (o.name === "contactShadow") return;
      const m = o as THREE.Mesh;
      if (m.isMesh) bounds.expandByObject(m);
    });
    const extent = bounds.getSize(new THREE.Vector3());
    const focus = bounds.getCenter(new THREE.Vector3());
    // The model rotates on Y, so the worst-case silhouette width is the
    // diagonal of its footprint, not whichever side happens to face us now.
    const spanX = Math.hypot(extent.x, extent.z);
    const spanY = extent.y;

    /* The eight corners of the bounding box, padded for the idle bob so the
       fit below is solving for the model's real travel, not its rest pose. */
    const BOB = 0.05;
    const corners: THREE.Vector3[] = [];
    for (const x of [bounds.min.x, bounds.max.x])
      for (const y of [bounds.min.y - BOB, bounds.max.y + BOB])
        for (const z of [bounds.min.z, bounds.max.z])
          corners.push(new THREE.Vector3(x, y, z));

    /* Poses the model actually reaches: both yaw extremes and the rest angle,
       each at both ends of the scroll tilt. A fit derived from spans alone
       assumes an axis-aligned box sitting still — but this rig rotates ±0.72
       rad, tilts on scroll and bobs, and a perspective camera projects the
       far corners of a rotated box well outside the naive envelope. That gap
       is what clipped the slab's corner at some widths. */
    const POSES: THREE.Matrix4[] = [];
    // Tilt runs 0..TILT_MAX, not 0..0.055 — onScroll's ratio term spans two
    // full units, so the scroll tilt reaches double the coefficient. Sampling
    // only half of it left the column bases clipped at the bottom edge on
    // narrow screens.
    for (const yaw of [-YAW_LIMIT, -0.34, 0, YAW_LIMIT])
      for (const tilt of [0, TILT_MAX / 2, TILT_MAX]) {
        POSES.push(
          new THREE.Matrix4()
            .makeRotationX(tilt)
            .multiply(new THREE.Matrix4().makeRotationY(yaw))
        );
      }

    // Breathing room between the silhouette and the frame edge.
    const FIT_MARGIN = 1.06;
    const probe = new THREE.Vector3();

    function size() {
      if (!renderer) return;
      const w = host!.clientWidth;
      const h = host!.clientHeight;
      if (!w || !h) return;
      const mobile = window.innerWidth < 768;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5));
      renderer.setSize(w, h, false);

      const aspect = w / h;
      camera.aspect = aspect;

      // Opening guess from the spans, then solved exactly below.
      const vFov = (camera.fov * Math.PI) / 180;
      const distV = spanY / 2 / Math.tan(vFov / 2);
      const distH = spanX / 2 / Math.tan(vFov / 2) / aspect;
      let dist = Math.max(distV, distH);

      /* Solve for a distance that contains every corner of every pose.
         Each pass measures the worst projected overshoot in normalised device
         coords and pushes the camera back by exactly that factor; perspective
         projection is close enough to linear in distance that this converges
         in two or three passes. Solving it beats padding a guess, because the
         required margin changes with aspect ratio — which is precisely why it
         clipped on some screen widths and not others. */
      for (let pass = 0; pass < 8; pass++) {
        camera.position.set(0, focus.y + spanY * 0.7, dist);
        camera.lookAt(0, focus.y + spanY * 0.06, 0);
        camera.near = Math.max(dist - spanX * 2, 0.1);
        camera.far = dist + spanX * 3;
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld(true);

        let worst = 0;
        for (const pose of POSES) {
          for (const corner of corners) {
            probe.copy(corner).applyMatrix4(pose).project(camera);
            worst = Math.max(worst, Math.abs(probe.x), Math.abs(probe.y));
          }
        }

        const overshoot = worst * FIT_MARGIN;
        if (overshoot <= 1) break;
        dist *= overshoot;
      }

      // Lifted well above centre for a three-quarter view: level-on reads as
      // a flat elevation drawing and loses the canopy depth entirely.
      camera.position.set(0, focus.y + spanY * 0.7, dist);
      camera.lookAt(0, focus.y + spanY * 0.06, 0);
      camera.near = Math.max(dist - spanX * 2, 0.1);
      camera.far = dist + spanX * 3;
      camera.updateProjectionMatrix();
    }

    function onPointerDown(e: PointerEvent) {
      pointerId = e.pointerId;
      lastX = e.clientX;
      autoSpin = false;
      setDragging(true);
      setHasDragged(true);
      host!.setPointerCapture(e.pointerId);
      wake();
    }

    function onPointerMove(e: PointerEvent) {
      if (pointerId !== e.pointerId) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      targetYaw = THREE.MathUtils.clamp(
        targetYaw + dx * DRAG_SENSITIVITY,
        -YAW_LIMIT,
        YAW_LIMIT
      );
      wake();
    }

    function onPointerUp(e: PointerEvent) {
      if (pointerId !== e.pointerId) return;
      pointerId = null;
      setDragging(false);
      // Resume the idle drift after a beat, so releasing mid-drag doesn't
      // immediately fight the user's chosen angle.
      window.setTimeout(() => {
        if (destroyed) return;
        autoSpin = true;
        wake();
      }, 2600);
    }

    function onScroll() {
      const r = host!.getBoundingClientRect();
      const p = 1 - Math.min(Math.max(r.top / window.innerHeight, -1), 1);
      scrollTilt = p * TILT_COEFF;
      wake();
    }

    function wake() {
      if (!raf && awake()) {
        lastT = performance.now();
        raf = requestAnimationFrame(loop);
      }
    }

    function loop(now: number) {
      raf = 0;
      if (!renderer || !awake()) return;
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;

      if (autoSpin && pointerId === null) {
        targetYaw += IDLE_SPIN * dt;
        if (targetYaw > YAW_LIMIT || targetYaw < -YAW_LIMIT) {
          targetYaw = THREE.MathUtils.clamp(targetYaw, -YAW_LIMIT, YAW_LIMIT);
        }
      }

      // Critically-damped-ish follow: reads as weight, not lag.
      yaw += (targetYaw - yaw) * Math.min(1, dt * 7.5);
      rig.rotation.y = yaw;
      rig.rotation.x = scrollTilt;
      rig.position.y = Math.sin(now / 1900) * 0.045;

      renderer.render(scene, camera);

      const settled =
        Math.abs(targetYaw - yaw) < 0.0004 && !autoSpin && pointerId === null;
      if (!settled) raf = requestAnimationFrame(loop);
    }

    function init() {
      if (destroyed) return;
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      const el = renderer.domElement;
      el.style.width = "100%";
      el.style.height = "100%";
      el.style.display = "block";
      el.style.touchAction = "pan-y";
      host!.appendChild(el);
      size();

      host!.addEventListener("pointerdown", onPointerDown);
      host!.addEventListener("pointermove", onPointerMove);
      host!.addEventListener("pointerup", onPointerUp);
      host!.addEventListener("pointercancel", onPointerUp);
      window.addEventListener("resize", size);
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);

      onReady?.();
      wake();
    }

    function onVisibility() {
      tabVisible = !document.hidden;
      wake();
    }

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
        wake();
      },
      { threshold: 0 }
    );
    io.observe(host);

    const initId = requestAnimationFrame(() => init());

    return () => {
      destroyed = true;
      cancelAnimationFrame(initId);
      cancelAnimationFrame(raf);
      io.disconnect();
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerup", onPointerUp);
      host.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("resize", size);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);

      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, [onReady]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={hostRef}
        role="img"
        aria-label="Interactive 3D model of the Roca Fuels station in Pavangad — drag to rotate."
        className={`h-full w-full ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      />
      <span
        aria-hidden="true"
        // Sits under the model, not over it. Centred it landed on the
        // forecourt slab once the model grew to fill the frame.
        className={`pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-white/92 px-4 py-2 text-xs font-bold text-navy-900 shadow-[0_8px_24px_rgba(7,61,99,0.16)] backdrop-blur transition-opacity duration-500 sm:bottom-4 ${
          hasDragged ? "opacity-0" : "opacity-100"
        }`}
      >
        Drag to explore
      </span>
    </div>
  );
}
