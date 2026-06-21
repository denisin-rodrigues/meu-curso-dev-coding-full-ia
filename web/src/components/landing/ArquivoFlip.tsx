'use client'

import { FlipCard, FlipCardFront, FlipCardBack } from '@/components/ui/flip-card'

// Trio Air Jordan IV — frente: foto; verso: ficha "DNA Archive" estilizada nos
// tokens do design system. As imagens são locais (public/images). `flipDirection`
// alterna horizontal/vertical para o virar não ficar mecânico entre as cartas.
type CartaArquivo = {
  src: string
  alt: string
  modelo: string
  colorway: string
  ano: string
  preco: string
  flip: 'horizontal' | 'vertical'
}

const cartas: CartaArquivo[] = [
  {
    src: '/images/gallery/media__1781557822884.jpg',
    alt: 'Air Jordan IV Fire Red',
    modelo: 'Air Jordan IV',
    colorway: 'Fire Red',
    ano: '1989',
    preco: 'R$ 1.499,00',
    flip: 'horizontal',
  },
  {
    src: '/images/7cd786696ae167d31f48359d6014360b.jpg',
    alt: 'Air Jordan IV Toro Bravo',
    modelo: 'Air Jordan IV',
    colorway: 'Toro Bravo',
    ano: '2017',
    preco: 'R$ 1.699,00',
    flip: 'vertical',
  },
  {
    src: '/images/568bd4359dbb1f3740de135c8aafbf58.jpg',
    alt: 'Air Jordan IV laranja',
    modelo: 'Air Jordan IV',
    colorway: 'Orange Suede',
    ano: 'Custom',
    preco: 'R$ 2.199,00',
    flip: 'horizontal',
  },
]

export function ArquivoFlip() {
  return (
    <section
      id='arquivo'
      aria-label='Arquivo Air Jordan IV'
      className='bg-paper px-6 py-24 text-ink md:py-32'
    >
      <div className='mx-auto max-w-6xl'>
        {/* Cabeçalho */}
        <div className='mb-14 text-center'>
          <p className='font-mono text-label-caps uppercase text-muted'>
            DNA Archive
          </p>
          <h2 className='mt-3 font-anton text-[clamp(2.5rem,7vw,5rem)] uppercase leading-[0.9] tracking-tight'>
            Anatomia do ícone
          </h2>
          <p className='mt-4 text-body-lg text-muted'>
            Passe o mouse (ou toque) para virar a carta e ver a ficha.
          </p>
        </div>

        {/* Trio de cartas */}
        <div className='flex flex-wrap justify-center gap-6'>
          {cartas.map((carta) => (
            <FlipCard
              key={carta.colorway}
              flipDirection={carta.flip}
              className='h-96 w-full max-w-sm sm:w-2/5 lg:w-[30%]'
            >
              <FlipCardFront className='rounded-2xl shadow-hard'>
                <img
                  src={carta.src}
                  alt={carta.alt}
                  loading='lazy'
                  decoding='async'
                  draggable={false}
                  className='size-full rounded-2xl object-cover'
                />
              </FlipCardFront>

              <FlipCardBack className='flex flex-col justify-between rounded-2xl bg-brand-blue p-8 text-left text-white shadow-hard'>
                <div>
                  <p className='font-mono text-label-caps uppercase text-white/70'>
                    {carta.ano}
                  </p>
                  <h3 className='mt-2 font-anton text-3xl uppercase leading-none'>
                    {carta.modelo}
                  </h3>
                </div>
                <div className='flex items-end justify-between gap-4'>
                  <div>
                    <p className='text-label-caps uppercase tracking-wide text-white/70'>
                      Colorway
                    </p>
                    <p className='font-anton text-4xl uppercase leading-none'>
                      {carta.colorway}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-label-caps uppercase tracking-wide text-white/70'>
                      Preço
                    </p>
                    <p className='font-anton text-2xl leading-none'>
                      {carta.preco}
                    </p>
                  </div>
                </div>
              </FlipCardBack>
            </FlipCard>
          ))}
        </div>
      </div>
    </section>
  )
}
