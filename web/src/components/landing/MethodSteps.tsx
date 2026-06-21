import { homeContent } from "@/content/home";

/** Ato 2 — prova do método em 5 passos, fundo branco e legível. */
export function MethodSteps() {
  const { metodo } = homeContent;
  return (
    <section className="bg-paper px-8 py-24 md:px-24">
      <h2 className="mb-12 font-anton text-4xl uppercase leading-none text-ink md:text-7xl">
        {metodo.titulo}
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {metodo.passos.map((passo) => (
          // Card "Flat-Stack": área de imagem (cinza-aço) em cima + bloco de texto branco
          // embaixo, sem borda, cantos sharp 0 e hard-drop shadow (vibe atlética).
          <article key={passo.numero} className="bg-white shadow-hard">
            <div className="flex h-40 items-center justify-center bg-surface-container-high font-mono text-label-caps uppercase text-muted">
              [imagem aqui]
            </div>
            <div className="p-6">
              <span className="font-anton text-5xl text-kinetic-gold">{passo.numero}</span>
              <h3 className="mt-2 font-anton text-2xl uppercase text-ink">{passo.titulo}</h3>
              <p className="mt-2 font-hanken text-body-lg text-muted">{passo.descricao}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
