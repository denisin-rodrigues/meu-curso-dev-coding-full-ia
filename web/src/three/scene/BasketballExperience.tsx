"use client";

import { useTexture, PresentationControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, Suspense, useEffect } from "react";
import * as THREE from "three";
import { SRGBColorSpace } from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

function Ball() {
  const gsapRef = useRef<THREE.Group>(null);

  // Carrega as texturas
  const [albedo, normalTex, roughTex] = useTexture([
    "/textures/basketball/albedo.jpg",
    "/textures/basketball/normal.jpg",
    "/textures/basketball/roughness.jpg",
  ]);

  // Aplica filtro anisotrópico e cor sRGB para máxima qualidade
  useEffect(() => {
    if (albedo) {
      albedo.colorSpace = SRGBColorSpace;
      albedo.needsUpdate = true;
    }
  }, [albedo]);

  // Macro-animação: GSAP acoplada ao Scroll
  useGSAP(() => {
    if (!gsapRef.current) return;

    // Timeline global que percorre todo o scroll da página
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5, // Scrub com inércia para super suavidade
      },
    });

    // O GSAP agora controla o GRUPO (pai), e não mais a malha (filho)
    tl.to(gsapRef.current.position, { x: 1.5, y: 0.6, z: 0, ease: "power2.inOut" }, 0)
      .to(gsapRef.current.scale, { x: 0.55, y: 0.55, z: 0.55, ease: "power2.inOut" }, 0);

    tl.to(gsapRef.current.position, { x: -1.4, y: -0.4, z: 0, ease: "power2.inOut" }, 1)
      .to(gsapRef.current.scale, { x: 0.75, y: 0.75, z: 0.75, ease: "power2.inOut" }, 1)
      .to(gsapRef.current.rotation, { z: Math.PI / 6, x: Math.PI / 8, ease: "power2.inOut" }, 1);

    tl.to(gsapRef.current.position, { x: 0, y: 0, z: 0, ease: "power2.inOut" }, 2)
      .to(gsapRef.current.scale, { x: 1.1, y: 1.1, z: 1.1, ease: "power2.inOut" }, 2)
      .to(gsapRef.current.rotation, { z: 0, x: 0, ease: "power2.inOut" }, 2);

  }); // Sem { scope: ref } para o ScrollTrigger conseguir achar o "body" no DOM real

  return (
    <group ref={gsapRef}>
      {/* PresentationControls permite "agarrar" e girar a bola sem quebrar o GSAP */}
      <PresentationControls
        global={true} // Interação ocorre em qualquer área vazia da tela!
        cursor={true} // Troca o cursor para a "mãozinha"
        snap={false} // Não volta pro centro, permite deixar a bola na posição que preferir
        speed={2} // Velocidade da rotação
        polar={[-Math.PI, Math.PI]} // Limite vertical (pode girar 360)
        azimuth={[-Infinity, Infinity]} // Limite horizontal infinito
        damping={0.15} // Amortecimento (inércia suave)
      >
        <mesh>
          <sphereGeometry args={[1, 128, 128]} />
          <meshStandardMaterial
            map={albedo || null}
            normalMap={normalTex || null}
            roughnessMap={roughTex || null}
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>
      </PresentationControls>
    </group>
  );
}

export function BasketballExperience() {
  return (
    // FOV 10 (Lente Teleobjetiva) afasta a câmera para z=15. Isso ACHATA a perspectiva,
    // garantindo que a bola NUNCA fique distorcida (oval) quando for para os cantos da tela.
    <Canvas camera={{ position: [0, 0, 15], fov: 10 }} dpr={[1, 2]}>
      {/* Background nulo no R3F para ficar transparente e mostrar o fundo do DOM HTML */}

      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={2.5} castShadow />
      <directionalLight position={[-5, 3, 2]} intensity={1.2} color="#47C1E8" />
      <directionalLight position={[0, -5, -5]} intensity={2.0} color="#FFFFFF" />
      <directionalLight position={[0, 5, 0]} intensity={0.8} />

      <Suspense fallback={null}>
        <Ball />
      </Suspense>
      
      {/* OrbitControls Removido para dar controle ao GSAP Scroll */}
    </Canvas>
  );
}
