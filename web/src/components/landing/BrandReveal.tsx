'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

/**
 * Texto de marca revelado letra por letra (stagger suave), disparado quando o bloco
 * entra na tela via ScrollTrigger — o padrão de animação do projeto (ver
 * docs/ANIMACAO-3D.md). Cada caractere é um <span> que começa invisível e sobe um
 * pouco; o `stagger` espaça o início de cada um, dando o efeito "letra por letra".
 *
 * `linhas[0]` é o título (display grande); as demais são subtítulos menores.
 */
export function BrandReveal({ linhas }: { readonly linhas: readonly string[] }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger)

      const chars = rootRef.current?.querySelectorAll<HTMLElement>('[data-char]')
      if (!chars || chars.length === 0) return

      gsap.from(chars, {
        opacity: 0,
        yPercent: 60,
        // duração por letra + stagger pequeno = revelação fluida, não "datilografada".
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.07,
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 80%',
        },
      })
    },
    { scope: rootRef },
  )

  // Quebra cada linha em caracteres. Espaço vira um span "largo" sem data-char
  // (não anima, só mantém o espaçamento) pra não animar o vazio entre palavras.
  return (
    <div ref={rootRef}>
      {linhas.map((linha, i) => {
        const isTitulo = i === 0
        return (
          <p
            key={i}
            className={
              isTitulo
                ? 'font-anton text-[clamp(3rem,8vw,7rem)] uppercase leading-[0.9] tracking-tight text-white'
                : 'mt-5 font-hanken text-[clamp(1rem,2.2vw,1.5rem)] font-light tracking-wide text-white/65'
            }
            aria-label={linha}
          >
            {Array.from(linha).map((char, j) =>
              char === ' ' ? (
                <span key={j} aria-hidden> </span>
              ) : (
                <span
                  key={j}
                  data-char
                  aria-hidden
                  className='inline-block will-change-transform'
                >
                  {char}
                </span>
              ),
            )}
          </p>
        )
      })}
    </div>
  )
}
