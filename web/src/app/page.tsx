import { CanvasErrorBoundary } from '@/components/CanvasErrorBoundary'
import { ShotScene } from '@/components/ShotScene'
import { homeContent } from '@/content/home'
import { Hero } from '@/components/landing/Hero'
import { ArquivoFlip } from '@/components/landing/ArquivoFlip'
import { FechamentoScroll } from '@/components/landing/FechamentoScroll'
import { SplineEmbed } from '@/components/landing/SplineEmbed'
import { BrandReveal } from '@/components/landing/BrandReveal'
import { AuthorFooter } from '@/components/landing/AuthorFooter'
import { ParallaxComponent } from '@/components/ui/parallax-scrolling'
import { Preloader } from '@/components/Preloader'
import {
  ScrollPortraitWall,
  type Speaker,
} from '@/components/ui/scroll-portrait-wall'

// Arquivo Jumpman — pares icônicos Air Jordan exibidos no mural de retratos.
// `name` vira o alt da imagem (acessibilidade); `role` só apareceria com captions.
const arquivoJordan: Speaker[] = [
  { name: 'Air Jordan VI Infrared (1991)', role: 'Arquivo', src: '/images/gallery/media__1781557824401.jpg' },
  { name: 'Par Air Jordan', role: 'Arquivo', src: '/images/gallery/media__1781557824256.jpg' },
  { name: 'Par Air Jordan', role: 'Arquivo', src: '/images/gallery/media__1781557824209.jpg' },
  { name: 'Par Air Jordan', role: 'Arquivo', src: '/images/gallery/media__1781557822884.jpg' },
  { name: 'Air Jordan IV Fire Red', role: 'Arquivo', src: '/images/7cd786696ae167d31f48359d6014360b.jpg' },
  { name: 'Par Air Jordan', role: 'Arquivo', src: '/images/568bd4359dbb1f3740de135c8aafbf58.jpg' },
]

export default function Home() {
  return (
    <main className='w-full bg-paper font-hanken text-ink'>
      {/* Preloader: cobre a home ao abrir e some quando a página carrega */}
      <Preloader />

      {/* ATO 1 — herói imersivo estilo Nike: título e painel azul atrás da bola */}
      <section id='ato1' className='relative overflow-x-clip'>
        {/* Tênis Esquerdo Pendurado (Animação de Pêndulo) */}
        <div className='absolute top-[80px] left-[2%] md:left-[8%] z-30 origin-top animate-swing pointer-events-none'>
          <img
            src='/images/SAPATOS%20ANIMADO.png'
            alt='Jordan Shoe Left'
            className='w-[160px] md:w-[260px] object-contain'
          />
        </div>

        {/* Tênis Direito Pendurado (Animação de Pêndulo espelhada e com delay) */}
        <div
          className='absolute top-[80px] right-[2%] md:right-[8%] z-30 origin-top animate-swing pointer-events-none'
          style={{ animationDelay: '-2s' }}
        >
          <img
            src='/images/SAPATOS%20ANIMADO.png'
            alt='Jordan Shoe Right'
            className='w-[160px] md:w-[260px] object-contain -scale-x-100'
          />
        </div>

        {/* BACKDROP (z-0): só na 1ª tela, atrás do canvas — painel azul + título */}
        <div className='absolute inset-x-0 top-0 z-0 flex h-screen items-center justify-center overflow-hidden'>
          {/* Imagem do 'R' vazado no fundo azul, substituindo o painel sólido */}
          <img
            src='/images/backdrop-r.png'
            alt='R Backdrop'
            className='absolute h-[70vh] w-[clamp(286px,52vw,520px)] object-contain object-center'
          />
          <h1 className='relative max-w-5xl px-6 text-center font-anton text-[clamp(5.46rem,23.66vw,20.02rem)] uppercase leading-[0.82] tracking-[0.15em] text-ink'>
            {homeContent.hero.titulo.split('').map((char, index) => (
              <span
                key={index}
                className={char === 'R' ? 'text-transparent' : ''}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* CANVAS (z-10): gruda na tela; a bola renderiza por cima do título */}
        <div className='sticky top-0 z-10 h-screen w-full'>
          <CanvasErrorBoundary
            fallback={
              <div className='flex h-full w-full items-center justify-center text-muted'>
                A cena 3D não pôde ser carregada.
              </div>
            }
          >
            <ShotScene trigger='#ato1' />
          </CanvasErrorBoundary>
        </div>

        {/* COPY (z-20): rótulos por cima de tudo */}
        <Hero />
      </section>

      {/* SEÇÃO 2: Mural Jumpman — entra depois que a bola cai na cesta.
          Cada par Air Jordan cresce do canto, atinge o pico no centro e some,
          com o título fixo invertendo (mix-blend-exclusion) sobre a imagem que
          passa atrás. As fotos vêm de `arquivoJordan` (imagens locais). */}
      <ScrollPortraitWall
        title='LEGADO'
        hint='role pelo arquivo Jumpman'
        date='Air Jordan · Arquivo'
        speakers={arquivoJordan}
        showCaptions={false}
      />

      {/* SEÇÃO 3: Arquivo flip — cartas Air Jordan IV que viram no hover/foco,
          revelando a ficha (modelo, colorway, ano) no verso. */}
      <ArquivoFlip />

      {/* SEÇÃO 4: Fechamento — 3 painéis que empilham (sticky) reenquadrando a
          página como prova do curso. CSS puro, sem Lenis (ver FechamentoScroll). */}
      <FechamentoScroll />

      {/* SEÇÃO 5: Parallax de camadas (GSAP ScrollTrigger). Título "denisin.dev".
          Sem Lenis e com cleanup escopado — ver ParallaxComponent. */}
      <ParallaxComponent />

      {/* SEÇÃO 6: Aura Spline — texto de marca à esquerda, objeto 3D à direita.
          Grid de 2 colunas (empilha no mobile): cada um no seu espaço, então o
          texto nunca cobre o objeto. O iframe é montado preguiçosamente. */}
      <section className='relative grid min-h-screen w-full grid-rows-[auto_1fr] overflow-hidden bg-black md:grid-cols-2 md:grid-rows-1'>
        {/* Coluna do texto — revelado letra por letra ao entrar na tela */}
        <div className='z-10 flex flex-col justify-center px-8 py-16 md:px-16'>
          <BrandReveal linhas={['JORDAN', 'DEV CODING FULL IA']} />
        </div>

        {/* Coluna do objeto — a cena Spline preenche este espaço */}
        <div className='relative min-h-[45vh] md:min-h-0'>
          <SplineEmbed
            src='https://my.spline.design/unchained-d3hHCgdWho7a8ATGzKtB11TU'
            title='Aura Spline'
          />
        </div>
      </section>

      {/* SEÇÃO 7 / RODAPÉ: autoria + crachá 3D (Lanyard) com a foto do autor. */}
      <AuthorFooter />
    </main>
  )
}
