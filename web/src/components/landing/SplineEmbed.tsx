'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Embed da cena Spline (iframe) com montagem preguiçosa (lazy).
 *
 * PORQUÊ: a página já roda um canvas WebGL (o herói 3D `ShotScene`/R3F). O Spline
 * cria um SEGUNDO contexto WebGL pesado. Quando os dois coexistem desde o load, o
 * GPU pode despejar o contexto do herói — e como as animações de scroll (GSAP
 * ScrollTrigger) dependem dele, isso "apaga" visualmente o resto do site.
 *
 * Solução: só montamos o iframe quando a seção entra no viewport (IntersectionObserver).
 * Assim as duas cenas 3D nunca disputam contexto no carregamento inicial.
 */
export function SplineEmbed({ src, title }: { readonly src: string; readonly title: string }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      // Começa a carregar um pouco antes de aparecer, pra não pegar a cena em branco.
      { rootMargin: '200px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={sectionRef} className='spline-container absolute top-0 left-0 h-full w-full z-0'>
      {visible && (
        <iframe
          src={src}
          title={title}
          frameBorder='0'
          width='100%'
          height='100%'
          id='aura-spline'
          // pointer-events-none: o iframe não captura wheel/touch, então o scroll
          // atravessa para a página (sem "travar" na última seção). Custo: a cena
          // vira decorativa (sem interação). Ideal para uso como aura de fundo.
          className='pointer-events-none'
        />
      )}
    </div>
  )
}
