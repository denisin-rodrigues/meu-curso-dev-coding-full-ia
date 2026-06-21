"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { homeContent } from "@/content/home";

/** Copy do curso (z-20) sobre a cena do Ato 1. O título vive no backdrop (atrás
 * da bola); aqui ficam só os rótulos nas bordas, estilo editorial. */
export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"]
  });

  // Mapeamento perfeito com a física da bola (p):
  // p=0.45 a 0.50: Anéis aparecem
  // p=0.75: Bola começa a diminuir para entrar na cesta -> Anéis começam a sumir
  // p=0.85: Anéis totalmente invisíveis ANTES de chegar na cesta
  const ringOpacity = useTransform(scrollYProgress, [0.45, 0.5, 0.75, 0.85], [0, 1, 1, 0]);

  return (
    <div ref={heroRef} className="relative z-20 -mt-[100vh] pointer-events-none">
      {/* 1º scroll: Herói inicial (vazio, só o título ao fundo) */}
      <section className="flex h-screen w-full flex-col justify-between px-8 pb-10 pt-10 md:px-16" />
      
      {/* 2º scroll: Textos ao redor da bola */}
      <section className="relative h-screen w-full">
         <div className="absolute top-[25%] left-[15%] md:left-[20%]">
            <motion.div
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, ease: "easeOut" }}
               viewport={{ once: false, margin: "-100px" }}
            >
               <p className="font-monument text-xl md:text-2xl text-ink leading-tight font-black uppercase tracking-wider">Legado em<br/>cada detalhe</p>
            </motion.div>
         </div>
         
         <div className="absolute top-[45%] right-[15%] md:right-[20%] text-right">
            <motion.div
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
               viewport={{ once: false, margin: "-100px" }}
            >
               <p className="font-monument text-xl md:text-2xl text-ink leading-tight font-black uppercase tracking-wider">Desafie a<br/>gravidade</p>
            </motion.div>
         </div>
         
         <div className="absolute bottom-[25%] left-[25%] md:left-[30%] -translate-x-[50%]">
            <motion.div
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
               viewport={{ once: false, margin: "-100px" }}
            >
               <p className="font-monument text-xl md:text-2xl text-ink leading-tight font-black uppercase tracking-wider">Símbolo de<br/>grandeza</p>
            </motion.div>
         </div>
      </section>

      {/* 3º e 4º scrolls: Espaço para a bola descer. Aqui mostramos o anel rotacional. */}
      <section className="relative h-[200vh] w-full">
         <div className="sticky top-0 flex h-screen w-full items-center justify-center pointer-events-none overflow-hidden">
            <motion.div style={{ opacity: ringOpacity }} className="absolute inset-0 flex items-center justify-center">
               <motion.div
                  className="relative flex items-center justify-center"
               >
                  {/* Anel tracejado girando num sentido */}
                  <motion.div
                     animate={{ rotate: 360 }}
                     transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
                     className="absolute w-[45vw] h-[45vw] max-w-[450px] max-h-[450px] min-w-[280px] min-h-[280px] rounded-full border-[2px] border-dashed border-ink/40"
                  />
                  
                  {/* Anel contínuo girando no sentido oposto */}
                  <motion.div
                     animate={{ rotate: -360 }}
                     transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
                     className="absolute w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] min-w-[310px] min-h-[310px] rounded-full border border-ink/10"
                  />
               </motion.div>
            </motion.div>
         </div>
      </section>
    </div>
  );
}
