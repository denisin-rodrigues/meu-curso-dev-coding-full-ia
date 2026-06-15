import { homeContent } from "@/content/home";

/** Copy do curso (z-20) sobre a cena do Ato 1. O título vive no backdrop (atrás
 * da bola); aqui ficam só os rótulos nas bordas, estilo editorial. */
export function Hero() {
  const { hero, beats } = homeContent;
  return (
    <div className="relative z-20 -mt-[100vh]">
      {/* 1ª tela: rótulo no topo, subtítulo + botão no rodapé (no branco, livres do painel) */}
      <section className="pointer-events-none flex h-screen w-full flex-col justify-between px-8 pb-10 pt-10 md:px-16">
        <p className="font-inter text-sm font-medium uppercase tracking-[0.3em] text-brand-blue">
          VibeCoding Premium
        </p>
        <div className="max-w-xs">
          <p className="font-inter text-base text-muted">{hero.subtitulo}</p>
          <span className="pointer-events-auto mt-4 inline-block rounded-md bg-brand-blue px-8 py-3 font-inter font-medium text-white">
            {hero.cta}
          </span>
        </div>
      </section>

      {beats.map((frase) => (
        <section key={frase} className="flex h-screen w-full items-center justify-center px-8">
          <p className="max-w-lg text-center font-anton text-3xl uppercase leading-tight text-ink md:text-5xl">
            {frase}
          </p>
        </section>
      ))}
    </div>
  );
}
