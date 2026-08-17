"use client";

import dynamic from "next/dynamic";

const DropHero = dynamic(() => import("./DropHero"), { ssr: false });

type DropHeroLoaderProps = {
  className?: string;
};

export default function DropHeroLoader({ className = "" }: DropHeroLoaderProps) {
  return <DropHero className={className} />;
}
