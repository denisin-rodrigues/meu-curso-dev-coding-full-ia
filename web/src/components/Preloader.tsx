'use client'

import { useEffect, useState } from 'react'
import LoaderProgressiveBar from '@/components/ui/loader-progressive-bar'

// Preloader da home: cobre a tela ao abrir e some quando a página termina de
// carregar. É client porque depende do ciclo de vida do browser (evento `load`)
// e de estado de saída (fade-out). Renderiza no SSR já visível (estado inicial),
// então não há "flash" do conteúdo antes do loader aparecer.

// ── DECISÃO DE UX (ajuste à vontade) ───────────────────────────────────────
// Quando o preloader some? Aqui: espera o `load` da página, mas garante um
// tempo MÍNIMO visível para a barra "encher" (senão, em cache, ele pisca e some).
const MIN_VISIBLE_MS = 1400 // tempo mínimo que o loader fica na tela
const FADE_MS = 600 // duração do fade-out
// ────────────────────────────────────────────────────────────────────────────

export function Preloader() {
  const [leaving, setLeaving] = useState(false) // dispara o fade-out
  const [done, setDone] = useState(false) // desmonta após o fade

  useEffect(() => {
    const start = performance.now()

    const dismiss = () => {
      const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - start))
      window.setTimeout(() => setLeaving(true), wait)
    }

    if (document.readyState === 'complete') {
      dismiss()
      return
    }
    window.addEventListener('load', dismiss, { once: true })
    return () => window.removeEventListener('load', dismiss)
  }, [])

  if (done) return null

  return (
    <div
      aria-hidden={leaving}
      onTransitionEnd={() => leaving && setDone(true)}
      className={`fixed inset-0 z-[9999] grid place-items-center bg-paper transition-opacity ease-out ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <LoaderProgressiveBar />
    </div>
  )
}
