"use client";

import { useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { fragmentShader, vertexShader } from "./liquidShader";

export type LiquidHandle = {
  /** Ramp the field's master opacity — used by the opener's exit. */
  setIntensity: (v: number) => void;
  material: () => THREE.ShaderMaterial | null;
};

const STOPS = [
  "#1c59c5",
  "#009cc4",
  "#15b98c",
  "#8bba44",
  "#f5ca00",
  "#ff9f13",
  "#fd2c3a",
];

export default function LiquidField({
  className = "",
  intensity = 1,
  saturation = 1,
  contrast = 1,
  scale = 1.35,
  base = "#073d63",
  vignette = 1,
  depth = 0.62,
  speed = 1,
  pointerStrength = 1,
  dprCap = 1.5,
  ref,
  onReady,
}: {
  className?: string;
  intensity?: number;
  saturation?: number;
  contrast?: number;
  scale?: number;
  base?: string;
  vignette?: number;
  depth?: number;
  speed?: number;
  pointerStrength?: number;
  dprCap?: number;
  ref?: React.Ref<LiquidHandle>;
  onReady?: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const matRef = useRef<THREE.ShaderMaterial | null>(null);

  useImperativeHandle(ref, () => ({
    setIntensity: (v: number) => {
      if (matRef.current) matRef.current.uniforms.uIntensity.value = v;
    },
    material: () => matRef.current,
  }));

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let raf = 0;
    let destroyed = false;
    let inView = true;
    let tabVisible = true;
    const awake = () => inView && tabVisible && !destroyed;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const colors = STOPS.map((h) => new THREE.Color(h));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        uResolution: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uIntensity: { value: intensity },
        uSaturation: { value: saturation },
        uContrast: { value: contrast },
        uScale: { value: scale },
        uBase: { value: new THREE.Color(base) },
        uVignette: { value: vignette },
        uDepth: { value: depth },
        uC0: { value: colors[0] },
        uC1: { value: colors[1] },
        uC2: { value: colors[2] },
        uC3: { value: colors[3] },
        uC4: { value: colors[4] },
        uC5: { value: colors[5] },
        uC6: { value: colors[6] },
      },
    });
    matRef.current = material;

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const start = performance.now();

    function size() {
      if (!renderer) return;
      const w = host!.clientWidth;
      const h = host!.clientHeight;
      if (!w || !h) return;
      const mobile = window.innerWidth < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : dprCap);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      material.uniforms.uResolution.value.set(w * dpr, h * dpr);
    }

    function onPointer(e: PointerEvent) {
      target.x = ((e.clientX / window.innerWidth) * 2 - 1) * pointerStrength;
      target.y = -((e.clientY / window.innerHeight) * 2 - 1) * pointerStrength;
    }

    function loop(now: number) {
      raf = 0;
      if (!renderer || !awake()) return;
      current.x += (target.x - current.x) * 0.045;
      current.y += (target.y - current.y) * 0.045;
      material.uniforms.uPointer.value.set(current.x, current.y);
      material.uniforms.uTime.value = ((now - start) / 1000) * speed;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    }

    function wake() {
      if (!raf && awake()) raf = requestAnimationFrame(loop);
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

    // Deferred a frame so the GL context never competes with first paint.
    const initId = requestAnimationFrame(() => {
      if (destroyed) return;
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
      renderer.setClearColor(0x000000, 0);
      const el = renderer.domElement;
      el.style.width = "100%";
      el.style.height = "100%";
      el.style.display = "block";
      host.appendChild(el);
      size();
      window.addEventListener("resize", size);
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      onReady?.();
      wake();
    });

    return () => {
      destroyed = true;
      cancelAnimationFrame(initId);
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", size);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      mesh.geometry.dispose();
      material.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
      matRef.current = null;
    };
    // Uniform values are pushed imperatively after mount; re-creating the
    // context on every prop change would tear down the GL scene mid-animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
    />
  );
}
