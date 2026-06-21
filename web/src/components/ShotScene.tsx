"use client";

import dynamic from "next/dynamic";

import LoadingSpinner from "@/components/ui/snow-ball-loading-spinner";

// Canvas precisa de WebGL (browser-only) — SSR desabilitado.
const ShotExperience = dynamic(
  () => import("@/three/scene/ShotExperience").then((mod) => mod.ShotExperience),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    ),
  },
);

export function ShotScene({ trigger = "body" }: { readonly trigger?: string }) {
  return <ShotExperience trigger={trigger} />;
}
