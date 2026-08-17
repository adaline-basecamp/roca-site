"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { fragmentShader, vertexShader } from "./dropShader";
import DropPoster from "./DropPoster";

type DropHeroProps = {
  className?: string;
};

const GRADIENT_HEX = [
  "#1C59C5",
  "#009CC4",
  "#15B98C",
  "#8BBA44",
  "#F5CA00",
  "#FF9F13",
  "#FD2C3A",
];

const MAX_PARALLAX_PX = 20;
const MOBILE_BREAKPOINT = 768;

// Desktop/tablet: right-of-center, vertically centered, clear of the
// left-aligned headline column. Mobile: the column is full-bleed, so there is
// no clear lane beside the type — the drop sits low and right, below the
// headline's last line and behind the CTAs, dimmed further so it reads as
// atmosphere. Measured: with the old centre, ~16% of headline glyph pixels
// sat over the drop's bright olive/gold bands at 3.3:1.
const CENTER_DESKTOP = { x: 0.32, y: -0.05 };
const CENTER_MOBILE = { x: 0.22, y: -0.42 };
const SCALE_MOBILE = 0.52;
const PRESENCE_MOBILE = 0.42;

export default function DropHero({ className = "" }: DropHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let material: THREE.ShaderMaterial | null = null;
    let mesh: THREE.Mesh | null = null;
    let io: IntersectionObserver | null = null;
    let raf = 0;
    let destroyed = false;
    let visible = true;
    const start = performance.now();

    const targetOffset = { x: 0, y: 0 };
    const currentOffset = { x: 0, y: 0 };
    let scrollFade = 1;

    function sizeRenderer() {
      if (!renderer || !material) return;
      const width = container!.clientWidth;
      const height = container!.clientHeight;
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      const dpr =
        Math.min(window.devicePixelRatio || 1, 1.5) * (isMobile ? 0.5 : 1);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      material.uniforms.uResolution.value.set(width * dpr, height * dpr);
      const centerTarget = isMobile ? CENTER_MOBILE : CENTER_DESKTOP;
      material.uniforms.uCenter.value.set(centerTarget.x, centerTarget.y);
      material.uniforms.uScale.value = isMobile ? SCALE_MOBILE : 1.0;
      material.uniforms.uPresence.value = isMobile ? PRESENCE_MOBILE : 1.0;
    }

    function onMouseMove(e: MouseEvent) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetOffset.x = (nx * MAX_PARALLAX_PX) / window.innerWidth;
      targetOffset.y = (-ny * MAX_PARALLAX_PX) / window.innerHeight;
    }

    function onScroll() {
      const rect = container!.getBoundingClientRect();
      const progress = Math.min(
        Math.max(-rect.top / (rect.height || 1), 0),
        1
      );
      scrollFade = 1 - progress;
    }

    function loop(now: number) {
      if (!visible || !renderer || !material || !mesh) {
        raf = 0;
        return;
      }
      const t = (now - start) / 1000;
      currentOffset.x += (targetOffset.x - currentOffset.x) * 0.06;
      currentOffset.y += (targetOffset.y - currentOffset.y) * 0.06;
      material.uniforms.uTime.value = t;
      material.uniforms.uOffset.value.set(currentOffset.x, currentOffset.y);
      material.uniforms.uBreath.value = Math.sin(t * 0.6) * 0.015;
      material.uniforms.uOpacity.value = scrollFade;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    }

    let camera: THREE.OrthographicCamera;
    let scene: THREE.Scene;

    function init() {
      if (destroyed || !container) return;

      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const geometry = new THREE.PlaneGeometry(2, 2);
      const colors = GRADIENT_HEX.map((hex) => new THREE.Color(hex));
      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uOffset: { value: new THREE.Vector2(0, 0) },
          uCenter: { value: new THREE.Vector2(CENTER_DESKTOP.x, CENTER_DESKTOP.y) },
          uScale: { value: 1 },
          uBreath: { value: 0 },
          uOpacity: { value: 1 },
          uPresence: { value: 1 },
          uColor0: { value: colors[0] },
          uColor1: { value: colors[1] },
          uColor2: { value: colors[2] },
          uColor3: { value: colors[3] },
          uColor4: { value: colors[4] },
          uColor5: { value: colors[5] },
          uColor6: { value: colors[6] },
        },
      });
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      container.appendChild(renderer.domElement);
      sizeRenderer();

      window.addEventListener("resize", sizeRenderer);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("scroll", onScroll, { passive: true });

      io = new IntersectionObserver(
        (entries) => {
          visible = entries[0]?.isIntersecting ?? true;
          if (visible && !raf) raf = requestAnimationFrame(loop);
        },
        { threshold: 0 }
      );
      io.observe(container);

      raf = requestAnimationFrame(loop);
    }

    // Lazy-init after first paint so the WebGL context never blocks LCP.
    const initId = requestAnimationFrame(() => {
      if (!destroyed) init();
    });

    return () => {
      destroyed = true;
      cancelAnimationFrame(initId);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", sizeRenderer);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
      material?.dispose();
      mesh?.geometry.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return <DropPoster className={className} />;
  }

  return (
    <div ref={containerRef} aria-hidden="true" className={`pointer-events-none ${className}`} />
  );
}
