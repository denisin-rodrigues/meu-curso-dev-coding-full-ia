"use client";

import dynamic from "next/dynamic";

// Dynamic import com SSR desabilitado — Canvas precisa de WebGL (browser-only)
const BasketballExperience = dynamic(
  () =>
    import("@/three/scene/BasketballExperience").then(
      (mod) => mod.BasketballExperience,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-black text-zinc-400">
        Carregando a bola…
      </div>
    ),
  },
);

export function BasketballScene() {
  return <BasketballExperience />;
}
