import { homeContent } from "@/content/home";

/** CTA final decorativo (pré-lançamento, sem backend). */
export function CtaEmBreve() {
  const { cta } = homeContent;
  return (
    <section className="flex flex-col items-center justify-center bg-paper px-8 py-32 text-center">
      <h2 className="font-anton text-5xl uppercase leading-none text-ink md:text-8xl">
        {cta.titulo}
      </h2>
      <span className="mt-8 rounded-md bg-brand-blue px-12 py-4 font-inter font-medium uppercase tracking-widest text-white">
        {cta.botao}
      </span>
    </section>
  );
}
