"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextClipScrollProps {
  text: string;
  imageSrc: string;
}

/** 
 * Efeito TextClipScroll baseado no Awwwards Pack. 
 * Cria uma máscara de texto (clipPath) e anima o pan (xPercent) 
 * do texto e um leve parallax da imagem de fundo ao fazer o scroll.
 */
export function TextClipScroll({ text, imageSrc }: TextClipScrollProps) {
  const container = useRef<HTMLDivElement>(null);
  const clipPath = useRef<SVGClipPathElement>(null);
  const posterInner = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current || !clipPath.current || !posterInner.current) return;

    gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top top", // Inicia quando o container está no topo
        end: "bottom top", // Termina quando a base do container chega ao topo
        scrub: true,
      }
    })
    // Anima a máscara de texto na horizontal
    .fromTo(clipPath.current, {
        xPercent: 25
    }, {
        ease: 'none',
        xPercent: -25
    }, 0)
    // Parallax leve na imagem dentro da máscara
    .fromTo(posterInner.current, {
        xPercent: -5,
        yPercent: -5
    }, {
        xPercent: 5,
        yPercent: 5
    }, 0);
  }, { scope: container });

  return (
    <div ref={container} className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      
      {/* SVG invisível em termos de renderização normal, mas precisa ter tamanho real
          para que as porcentagens x="50%" e y="50%" funcionem corretamente na tela toda. */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full">
        <clipPath id="hero-clip" ref={clipPath}>
          <text 
            x="50%" 
            y="50%" 
            dominantBaseline="middle" 
            textAnchor="middle" 
            className="font-anton uppercase"
            style={{ fontSize: "clamp(5.46rem, 23.66vw, 20.02rem)", letterSpacing: "0.15em" }}
          >
            {text}
          </text>
        </clipPath>
      </svg>

      {/* O fundo em formato de máscara + imagem com parallax */}
      <div 
        className="pointer-events-none absolute inset-0 bg-brand-blue"
        style={{ clipPath: "url(#hero-clip)" }}
      >
        <div 
          ref={posterInner}
          className="absolute inset-[-10%] bg-cover bg-center opacity-60 mix-blend-multiply"
          style={{ backgroundImage: `url(${imageSrc})` }}
        />
      </div>

    </div>
  );
}
