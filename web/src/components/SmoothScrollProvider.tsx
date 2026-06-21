'use client'

import { ReactLenis, type LenisRef } from 'lenis/react'
import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Smooth-scroll global (Lenis) integrado ao GSAP ScrollTrigger — a forma OFICIAL
 * de combinar inércia de scroll com scrub, sem quebrar o herói 3D:
 *  • `autoRaf: false` desliga o loop interno do Lenis; quem dirige o `raf` é o
 *    ticker do GSAP (uma fonte de tempo só → sincronia perfeita).
 *  • `lenis.on('scroll', ScrollTrigger.update)` atualiza o ScrollTrigger a cada
 *    frame de scroll, então todos os scrubs (bola do herói, parallax) seguem o
 *    scroll suavizado.
 *  • `lagSmoothing(0)` evita que o GSAP "pule" tempo em quedas de FPS.
 *
 * Lenis v1 usa o scroll nativo da janela (não translada o conteúdo), então
 * `position: sticky` e `window.scrollY` continuam válidos — por isso NÃO recai na
 * Armadilha 4 (que é sobre `scroll-behavior: smooth` do CSS).
 */
export function SmoothScrollProvider({
  children,
}: {
  readonly children: ReactNode
}) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000)
    }
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    const lenis = lenisRef.current?.lenis
    lenis?.on('scroll', ScrollTrigger.update)

    return () => {
      gsap.ticker.remove(update)
      lenis?.off('scroll', ScrollTrigger.update)
    }
  }, [])

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      {children}
    </ReactLenis>
  )
}
