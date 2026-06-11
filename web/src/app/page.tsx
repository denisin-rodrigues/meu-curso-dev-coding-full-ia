import { Suspense } from "react";
import { CanvasErrorBoundary } from "@/components/CanvasErrorBoundary";
import { Experience } from "@/three/scene/Experience";

function SceneFallback({ message }: { readonly message: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-black text-zinc-400">
      {message}
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col">
      <div className="h-screen w-full bg-black">
        <CanvasErrorBoundary fallback={<SceneFallback message="A cena 3D falhou ao carregar." />}>
          <Suspense fallback={<SceneFallback message="Carregando cena 3D…" />}>
            <Experience />
          </Suspense>
        </CanvasErrorBoundary>
      </div>
    </main>
  );
}
