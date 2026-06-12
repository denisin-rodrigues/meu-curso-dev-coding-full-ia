import { CanvasErrorBoundary } from "@/components/CanvasErrorBoundary";
import { BasketballScene } from "@/components/BasketballScene";

export default function Home() {
  return (
    <main className="relative w-full text-deep-shadow overflow-x-hidden">
      
      {/* --- CAMADA 1: BACKGROUNDS QUE ROLAM (z-0) --- */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        {/* Fundo da Section 1 (Hero) */}
        <div 
          className="relative h-screen w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/images/court-bg.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-deep-shadow/90 via-deep-shadow/60 to-transparent"></div>
        </div>
        {/* O fundo das outras seções é transparente, mostrando a cor base do site */}
      </div>

      {/* --- CAMADA 2: 3D CANVAS FIXO (z-10) --- */}
      <div className="fixed inset-0 z-10 pointer-events-auto">
        <CanvasErrorBoundary
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-surface-bright text-deep-shadow">
              A bola 3D falhou ao carregar.
            </div>
          }
        >
          <BasketballScene />
        </CanvasErrorBoundary>
      </div>

      {/* --- CAMADA 3: TEXTO E CONTEÚDO HTML (z-20) --- */}
      <div className="relative z-20 w-full pointer-events-none">
        
        {/* Section 1: Hero */}
        <section className="h-screen w-full flex flex-col justify-center px-8 md:px-24">
          <div className="pointer-events-auto">
            <h2 className="text-cyan-primary font-anybody font-bold text-xl md:text-2xl tracking-widest uppercase mb-2">Court Elite</h2>
            <h1 className="text-surface-bright font-anybody font-black text-7xl md:text-[10rem] leading-none uppercase tracking-tighter">Baller</h1>
            <p className="mt-6 text-surface-bright/90 font-hanken text-lg max-w-md">The standard of excellence. Witness greatness with our official game ball, meticulously crafted for professional performance.</p>
          </div>
        </section>

        {/* Section 2: Feature Grid */}
        <section className="h-screen w-full flex items-center justify-end px-8 md:px-24">
          <div className="w-full md:w-1/3 flex flex-col gap-8 pointer-events-auto">
            <div className="border-l-4 border-cyan-primary pl-6">
              <h3 className="font-anybody font-bold text-2xl uppercase">Tactile Grip</h3>
              <p className="font-hanken mt-2 text-deep-shadow/80">Biomimetic pebbled microstructure ensuring absolute control in extreme conditions.</p>
            </div>
            <div className="border-l-4 border-cyan-primary pl-6">
              <h3 className="font-anybody font-bold text-2xl uppercase">Precision Channels</h3>
              <p className="font-hanken mt-2 text-deep-shadow/80">Deep, perfectly aligned seams for unmatched shooting consistency and rotation dynamics.</p>
            </div>
            <div className="border-l-4 border-cyan-primary pl-6">
              <h3 className="font-anybody font-bold text-2xl uppercase">Air Retention</h3>
              <p className="font-hanken mt-2 text-deep-shadow/80">Advanced inner core engineering for sustained pressure throughout the season.</p>
            </div>
          </div>
        </section>

        {/* Section 3: Heritage */}
        <section className="h-screen w-full flex items-center px-8 md:px-24">
          <div className="w-full md:w-1/2 pointer-events-auto">
            <h2 className="font-anybody font-black text-5xl md:text-7xl uppercase leading-tight">From the<br/><span className="text-cyan-primary">Concrete</span><br/>To the Cosmos</h2>
            <p className="mt-8 font-hanken text-lg">Inspired by the legacy of legends. Every micro-cell of luxury leather is a testament to the pursuit of perfection. This isn't just a ball; it's an icon.</p>
          </div>
        </section>

        {/* Section 4: Shop */}
        <section className="h-screen w-full flex flex-col items-center justify-end pb-32">
          <div className="pointer-events-auto flex flex-col items-center">
            <h2 className="font-anybody font-black text-4xl md:text-6xl uppercase text-center">Own The Court</h2>
            <button className="mt-8 px-12 py-4 bg-deep-shadow text-surface-bright font-anybody font-bold uppercase tracking-widest hover:bg-cyan-primary transition-colors duration-300">
              Shop Collection
            </button>
          </div>
        </section>

      </div>
    </main>
  );
}
