// Fechamento da landing — 3 painéis que empilham via `sticky top-0` (CSS puro,
// SEM Lenis/smooth-scroll: o ScrollTrigger com scrub da bola 3D não tolera smooth
// scroll global — ver docs/ANIMACAO-3D.md, Armadilha 4). A narrativa reenquadra
// tudo que o usuário rolou como prova do que o curso entrega.

// Grade técnica sutil reaproveitada do componente de origem (linhas finas + máscara
// radial no topo). Neutra, casa com os dois fundos.
const GRID_OVERLAY =
  'absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'

export function FechamentoScroll() {
  return (
    <article aria-label="O convite do curso">
      {/* Painel 1 — gancho (escuro) */}
      <section className="sticky top-0 grid h-screen w-full place-content-center overflow-hidden bg-ink text-white">
        <div className={GRID_OVERLAY} />
        <h2 className="relative px-8 text-center font-anton text-[clamp(2.5rem,7vw,5.5rem)] uppercase leading-[1.05] tracking-tight">
          Tudo que você rolou
          <br /> até aqui
          <span className="mt-6 block text-body-lg font-hanken normal-case tracking-normal text-white/60">
            role para baixo 👇
          </span>
        </h2>
      </section>

      {/* Painel 2 — revelação (claro) */}
      <section className="sticky top-0 grid h-screen w-full place-content-center overflow-hidden rounded-t-3xl bg-surface-container text-ink">
        <div className={GRID_OVERLAY} />
        <h2 className="relative px-8 text-center font-anton text-[clamp(2.25rem,6vw,5rem)] uppercase leading-[1.05] tracking-tight">
          foi construído
          <br /> com IA
          <span className="mt-6 block text-body-lg font-hanken normal-case tracking-normal text-muted">
            do zero ao nível premium.
          </span>
        </h2>
      </section>

      {/* Painel 3 — fechamento / CTA (escuro, brand-blue) */}
      <section className="sticky top-0 grid h-screen w-full place-content-center overflow-hidden rounded-t-3xl bg-ink text-white">
        <div className={GRID_OVERLAY} />
        <h2 className="relative px-8 text-center font-anton text-[clamp(2.5rem,7vw,5.5rem)] uppercase leading-[1.05] tracking-tight">
          isso é o
          <br />
          <span className="text-brand-blue">DEV CODING FULL IA</span>
          <span className="mt-6 block text-body-lg font-hanken normal-case tracking-normal text-white/60">
            em breve 🏀
          </span>
        </h2>
      </section>
    </article>
  )
}
