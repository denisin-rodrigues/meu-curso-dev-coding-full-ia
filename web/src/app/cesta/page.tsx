import { CanvasErrorBoundary } from "@/components/CanvasErrorBoundary";
import { HoopExperience } from "@/three/scene/HoopExperience";

export const metadata = { title: "Cesta 3D — Laboratório" };

/** Rota isolada do ciclo da cesta (clay). A landing (/) segue intocada. */
export default function CestaPage() {
  return (
    <main className="h-dvh w-full bg-[#F4F6F8]">
      <CanvasErrorBoundary
        fallback={
          <p className="flex h-full items-center justify-center text-neutral-600">
            A cena 3D não pôde ser carregada.
          </p>
        }
      >
        <HoopExperience />
      </CanvasErrorBoundary>
    </main>
  );
}
