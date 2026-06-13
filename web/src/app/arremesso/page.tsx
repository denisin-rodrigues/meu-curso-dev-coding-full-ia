import { CanvasErrorBoundary } from "@/components/CanvasErrorBoundary";
import { ShotScene } from "@/components/ShotScene";

export const metadata = { title: "O Arremesso — Laboratório" };

/**
 * Protótipo do scroll storytelling: a bola é heroína no topo e o scroll inteiro
 * da página é a trajetória dela caindo dentro da cesta no rodapé. Rota isolada —
 * a landing (/) segue intocada até validação.
 */
export default function ArremessoPage() {
  return (
    <main className="relative w-full bg-[#F4F6F8] text-neutral-900">
      {/* Canvas fixo cobrindo a viewport */}
      <div className="fixed inset-0 z-0">
        <CanvasErrorBoundary
          fallback={
            <div className="flex h-full w-full items-center justify-center">
              A cena 3D falhou ao carregar.
            </div>
          }
        >
          <ShotScene />
        </CanvasErrorBoundary>
      </div>

      {/* Conteúdo HTML por cima — define a altura de scroll (4 telas) */}
      <div className="relative z-10 w-full pointer-events-none">
        <section className="flex h-screen w-full flex-col justify-center px-8 md:px-24">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-[0.3em] text-[#E8432E]">
            Court Elite
          </h2>
          <h1 className="text-7xl font-black uppercase leading-none tracking-tighter md:text-[9rem]">
            Baller
          </h1>
          <p className="mt-6 max-w-md text-lg text-neutral-600">
            Role a página e leve a bola até a cesta.
          </p>
        </section>

        <section className="flex h-screen w-full items-center justify-end px-8 md:px-24">
          <p className="max-w-xs text-right text-xl font-medium text-neutral-500">
            Cada rolagem é parte do arremesso.
          </p>
        </section>

        <section className="flex h-screen w-full items-center px-8 md:px-24">
          <p className="max-w-xs text-xl font-medium text-neutral-500">
            A trajetória inteira é controlada por você.
          </p>
        </section>

        <section className="flex h-screen w-full flex-col items-center justify-end pb-24">
          <h2 className="text-center text-4xl font-black uppercase md:text-6xl">Swish.</h2>
        </section>
      </div>
    </main>
  );
}
