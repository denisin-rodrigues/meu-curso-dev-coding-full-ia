import { CanvasErrorBoundary } from "@/components/CanvasErrorBoundary";
import { ShotScene } from "@/components/ShotScene";
import { homeContent } from "@/content/home";
import { Hero } from "@/components/landing/Hero";
import { MethodSteps } from "@/components/landing/MethodSteps";
import { CtaEmBreve } from "@/components/landing/CtaEmBreve";

export default function Home() {
  return (
    <main className="w-full bg-paper font-inter text-ink">
      {/* ATO 1 — herói imersivo estilo Nike: título e painel azul atrás da bola */}
      <section id="ato1" className="relative overflow-x-clip">
        {/* BACKDROP (z-0): só na 1ª tela, atrás do canvas — painel azul + título */}
        <div className="absolute inset-x-0 top-0 z-0 flex h-screen items-center justify-center overflow-hidden">
          <div className="absolute h-[54vh] w-[clamp(220px,40vw,400px)] rounded-[2.5rem] bg-brand-blue" />
          <h1 className="relative max-w-5xl px-6 text-center font-anton text-[clamp(3rem,13vw,11rem)] uppercase leading-[0.82] text-ink">
            {homeContent.hero.titulo}
          </h1>
        </div>

        {/* CANVAS (z-10): gruda na tela; a bola renderiza por cima do título */}
        <div className="sticky top-0 z-10 h-screen w-full">
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

        {/* COPY (z-20): rótulos por cima de tudo */}
        <Hero />
      </section>

      {/* ATO 2 — prova do método + CTA */}
      <MethodSteps />
      <CtaEmBreve />
    </main>
  );
}
