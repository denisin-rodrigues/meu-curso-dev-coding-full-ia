"use client";

import { ContactShadows } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Suspense, useRef } from "react";
import type { Group, Mesh } from "three";
import { Basketball } from "@/three/scene/Basketball";
import { Hoop } from "@/three/scene/Hoop";

gsap.registerPlugin(ScrollTrigger);

// Modelo "quadra vertical": a bola começa no topo (y=0) e a cesta fica FIXA no
// fim do mundo (y = HOOP_Y). O scroll desce a câmera por esse espaço até a cesta.
const BALL_SCALE = 0.12; // bola Ø24cm em escala real (aro Ø42cm interno → passa com folga)
const HOOP_Y = -3.2; // posição fixa da cesta = "o fim da página"
const CAM_Z = 2.5;

const smooth = (t: number): number => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

// Pulso da rede centrado em p≈0.96 (quando a bola cruza o aro). Clay = squash exagerado.
function netStretch(p: number): number {
  const d = Math.abs(p - 0.96);
  return d < 0.06 ? 1 + (1 - d / 0.06) * 0.45 : 1;
}

/** A bola cai pela quadra vertical até a cesta enquanto a câmera desce com o scroll. */
function ShotScene() {
  const { camera } = useThree();
  const ball = useRef<Group>(null);
  const net = useRef<Mesh>(null);

  useGSAP(() => {
    const b = ball.current;
    const n = net.current;
    if (!b || !n) return;

    const apply = (p: number): void => {
      // Câmera desce (pan) de enquadrar a bola (topo) até a cesta (fim).
      camera.position.y = lerp(0.1, HOOP_Y + 0.05, smooth(p));

      // Bola: queda com gravidade (y ∝ p^1.8 ≈ ½gt²) + leve zigue-zague que zera no aro.
      const fall = Math.pow(p, 1.8);
      b.position.set(
        Math.sin(p * Math.PI * 2) * 0.28 * (1 - p),
        lerp(0, HOOP_Y - 0.18, fall),
        0,
      );
      b.scale.setScalar(BALL_SCALE * lerp(1.45, 1, smooth(Math.min(p * 1.4, 1))));

      n.scale.y = netStretch(p);
    };

    apply(0);

    const state = { p: 0 };
    gsap.to(state, {
      p: 1,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
      },
      onUpdate: () => apply(state.p),
    });

    // Garante medidas corretas após o canvas/conteúdo assentarem.
    ScrollTrigger.refresh();
  });

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 5, 4]} intensity={1.9} />
      <directionalLight position={[-5, 2, 1]} intensity={0.7} />
      <directionalLight position={[0, HOOP_Y - 3, -4]} intensity={0.5} />

      {/* Bola controlada FORA do Suspense (ref monta de imediato); só a Basketball suspende. */}
      <group ref={ball} scale={BALL_SCALE}>
        <Suspense fallback={null}>
          <Basketball />
        </Suspense>
      </group>

      {/* Cesta FIXA no fim do mundo vertical. */}
      <group position={[0, HOOP_Y, 0]}>
        <Hoop autoSpin={false} netRef={net} />
      </group>

      <ContactShadows
        position={[0, HOOP_Y - 0.45, 0]}
        opacity={0.25}
        scale={2.6}
        blur={2.8}
        far={1.4}
      />
    </>
  );
}

export function ShotExperience() {
  return (
    <Canvas camera={{ position: [0, 0.1, CAM_Z], fov: 42 }} dpr={[1, 2]}>
      <ShotScene />
    </Canvas>
  );
}
