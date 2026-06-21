'use client'

import { useEffect, useRef, useState, type ComponentType } from 'react'
import dynamic from 'next/dynamic'
import { CanvasErrorBoundary } from '@/components/CanvasErrorBoundary'

// O Lanyard é um 3º contexto WebGL (além do herói e do Spline). Carregamos o
// componente só no cliente (ssr: false) e montamos o <Canvas> apenas quando o
// rodapé entra na tela — evita disputa de contexto WebGL no carregamento.
const Lanyard = dynamic(() => import('@/components/landing/Lanyard'), {
  ssr: false,
  // DIAGNÓSTICO: visível enquanto o chunk do componente carrega. Se ficar preso
  // aqui, o problema é o carregamento do código; se piscar e sumir, o código OK.
  loading: () => (
    <div className='flex h-full w-full items-center justify-center text-sm text-white/40'>
      carregando crachá…
    </div>
  ),
}) as ComponentType<{
  position?: [number, number, number]
  gravity?: [number, number, number]
  fov?: number
  frontImage?: string
  backImage?: string
  imageFit?: 'cover' | 'contain'
}>

// Foto do crachá (frente). Espaços no nome do arquivo precisam vir codificados.
const CRACHA_FRENTE = '/images/rosto%20eu%20frente.jpg'
// Verso: logo Jumpman branco no preto — amarra o crachá ao tema Jordan da landing.
const CRACHA_VERSO = '/images/jordan-logo-white.jpg'

// Ícones oficiais (paths das marcas — Simple Icons). currentColor herda a cor do link.
function InstagramIcon() {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden className='h-6 w-6'>
      <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden className='h-6 w-6'>
      <path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' />
    </svg>
  )
}

export function AuthorFooter() {
  const ref = useRef<HTMLElement>(null)
  const [showLanyard, setShowLanyard] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShowLanyard(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <footer ref={ref} className='relative min-h-screen w-full overflow-hidden bg-black text-white'>
      {/* Crachá 3D pendurado — arraste para balançar */}
      <div className='absolute inset-0 z-0'>
        {showLanyard && (
          <CanvasErrorBoundary
            fallback={
              <div className='flex h-full w-full items-center justify-center text-sm text-white/40'>
                Crachá 3D indisponível.
              </div>
            }
          >
            <Lanyard
              position={[0, 0, 20]}
              gravity={[0, -40, 0]}
              frontImage={CRACHA_FRENTE}
              backImage={CRACHA_VERSO}
              imageFit='cover'
            />
          </CanvasErrorBoundary>
        )}
      </div>

      {/* Autoria + redes (sobre o crachá, ancorado embaixo) */}
      <div className='pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-5 px-6 pb-10 text-center'>
        <p className='font-anton text-[clamp(1.5rem,4vw,2.75rem)] uppercase leading-none tracking-tight'>
          Denilson Rodrigues
        </p>
        <div className='pointer-events-auto flex items-center gap-6'>
          <a
            href='https://www.instagram.com/denisin.dev/'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Instagram de Denilson Rodrigues'
            className='text-white/70 transition-colors hover:text-white'
          >
            <InstagramIcon />
          </a>
          <a
            href='https://github.com/denisin-rodrigues'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='GitHub de Denilson Rodrigues'
            className='text-white/70 transition-colors hover:text-white'
          >
            <GithubIcon />
          </a>
        </div>
      </div>
    </footer>
  )
}
