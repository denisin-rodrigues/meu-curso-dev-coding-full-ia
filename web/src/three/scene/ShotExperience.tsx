"use client";

import { ContactShadows } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Suspense, useRef } from "react";
import type { Group, Mesh } from "three";
import { shotMotion } from "@/content/shotMotion";
import { sampleMotion } from "@/three/motion/sampleMotion";
import { Basketball } from "@/three/scene/Basketball";
import { Hoop } from "@/three/scene/Hoop";

gsap.registerPlugin(ScrollTrigger);

// Modelo "quadra vertical": a bola começa no topo (y=0) e a cesta fica FIXA no
// fim do mundo (y = HOOP_Y). O scroll desce a câmera por esse espaço até a cesta.
// A trajetória vem do Motion Spec (dado tipado): src/content/shotMotion.ts.
const BALL_SCALE = 0.12; // bola Ø24cm em escala real (aro Ø42cm interno → passa com folga)
const HOOP_Y = -3.2; // posição fixa da cesta = "o fim da página"
const CAM_Z = 2.5;

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
      const m = sampleMotion(shotMotion, p);
      camera.position.y = m.cameraY;
      b.position.set(m.ball.x, m.ball.y, m.ball.z);
      b.scale.setScalar(BALL_SCALE * m.ball.scale);
      n.scale.y = m.netScaleY;
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
