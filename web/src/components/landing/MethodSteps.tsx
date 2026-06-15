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
          <article key={passo.numero} className="rounded-xl border border-black/10 bg-white p-6">
            <span className="font-anton text-5xl text-brand-cyan">{passo.numero}</span>
            <h3 className="mt-2 font-anton text-2xl uppercase text-ink">{passo.titulo}</h3>
            <p className="mt-2 font-inter text-muted">{passo.descricao}</p>
            <div className="mt-4 flex h-40 items-center justify-center rounded-md border border-dashed border-black/20 font-inter text-sm text-muted">
              [imagem aqui]
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
