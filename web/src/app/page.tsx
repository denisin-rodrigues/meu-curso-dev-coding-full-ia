import { CanvasErrorBoundary } from "@/components/CanvasErrorBoundary";
import { ShotScene } from "@/components/ShotScene";
import { Hero } from "@/components/landing/Hero";
import { MethodSteps } from "@/components/landing/MethodSteps";
import { CtaEmBreve } from "@/components/landing/CtaEmBreve";

export default function Home() {
  return (
    <main className="w-full bg-paper font-inter text-ink">
      {/* ATO 1 — herói imersivo: canvas gruda enquanto a copy rola por cima */}
      <section id="ato1" className="relative">
        <div className="sticky top-0 h-screen w-full">
          <CanvasErrorBoundary
            fallback={
              <div className="flex h-full w-full items-center justify-center text-muted">
                A cena 3D não pôde ser carregada.
              </div>
            }
          >
            <ShotScene trigger="#ato1" />
          </CanvasErrorBoundary>
        </div>
        <Hero />
      </section>

      {/* ATO 2 — prova do método + CTA */}
      <MethodSteps />
      <CtaEmBreve />
    </main>
  );
}
