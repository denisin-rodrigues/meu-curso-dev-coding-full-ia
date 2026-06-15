"use client";

import dynamic from "next/dynamic";

// Canvas precisa de WebGL (browser-only) — SSR desabilitado.
const ShotExperience = dynamic(
  () => import("@/three/scene/ShotExperience").then((mod) => mod.ShotExperience),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-neutral-400">
        Carregando…
      </div>
    ),
  },
);

export function ShotScene({ trigger = "body" }: { readonly trigger?: string }) {
  return <ShotExperience trigger={trigger} />;
}
