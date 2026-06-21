// Loader de 3 bolinhas "gooey" (metaball) — CSS puro, sem JS.
//
// As 3 bolinhas nascem sobrepostas no centro e se espalham em triângulo a cada
// ciclo; o filtro SVG `#goo` (definido abaixo) borra e "religa" o alpha delas,
// fazendo-as se fundirem como líquido quando se encostam. O movimento e as cores
// vivem em globals.css (.dots-loader*), seguindo o padrão do projeto (parallax,
// scroll-reel) de manter CSS de componente no globals com classes nomeadas.
//
// ADAPTAÇÕES vs. o snippet de origem:
//  • `class` → `className` e remoção do `useState` ocioso (era React inválido).
//  • Não precisa de 'use client': é 100% declarativo (sem hooks/eventos).
//  • Acessível: role="status" + texto sr-only; o visual é aria-hidden.
export function ThreeDotsLoader() {
  return (
    <section className="dots-loader-section" role="status" aria-label="Carregando">
      <div className="dots-loader" aria-hidden="true">
        <span className="dots-loader__dot dots-loader__dot--1" />
        <span className="dots-loader__dot dots-loader__dot--2" />
        <span className="dots-loader__dot dots-loader__dot--3" />
      </div>
      <span className="sr-only">Carregando…</span>

      {/* Filtro goo: feGaussianBlur borra os dots; feColorMatrix corta o alpha
          num limiar duro (21 -7), fundindo borrões que se tocam num só blob. */}
      <svg className="dots-loader__goo" aria-hidden="true" focusable="false">
        <defs>
          {/* Região grande (x/y/width/height): as bolinhas viajam ~90px para
              fora da caixa do container; sem isso o filtro recorta o movimento. */}
          <filter
            id="goo"
            x="-200%"
            y="-200%"
            width="500%"
            height="500%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"
              result="goo"
            />
          </filter>
        </defs>
      </svg>
    </section>
  )
}
