import { homeContent } from "@/content/home";

/** Copy do curso sobreposta à cena 3D do Ato 1 (4 telas de scroll). */
export function Hero() {
  const { hero, beats } = homeContent;
  return (
    <div className="relative z-10 -mt-[100vh]">
      <section className="flex h-screen w-full flex-col justify-center px-8 md:px-24">
        <p className="mb-3 font-inter text-sm font-medium uppercase tracking-[0.3em] text-brand-blue">
          VibeCoding Premium
        </p>
        <h1 className="font-anton text-6xl uppercase leading-[0.95] text-ink md:text-[8rem]">
          {hero.titulo}
        </h1>
        <p className="mt-6 max-w-md font-inter text-lg text-muted">{hero.subtitulo}</p>
        <span className="mt-8 w-fit rounded-md bg-brand-blue px-8 py-3 font-inter font-medium text-white">
          {hero.cta}
        </span>
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
