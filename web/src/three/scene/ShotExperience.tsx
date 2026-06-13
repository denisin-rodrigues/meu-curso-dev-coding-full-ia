"use client";

import { ContactShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Suspense, useRef } from "react";
import type { Group, Mesh } from "three";
import { Basketball } from "@/three/scene/Basketball";
import { Hoop } from "@/three/scene/Hoop";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Tamanho real: bola Ø24cm → raio 0.12 na escala em metros da cesta (aro Ø42cm interno).
const BALL_SCALE = 0.12;
// Centro do aro no mundo — destino final da bola.
const RIM: [number, number, number] = [0, -0.55, -0.3];

interface Waypoint {
  readonly p: number; // progresso do scroll (0..1)
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly s: number; // multiplicador de escala da bola
}

// Trajetória do arremesso: hero (grande, perto) → deriva → cai no aro → afunda na rede.
// y mantido dentro do campo visível da câmera (~[-0.83, 0.9]).
const TRACK: readonly Waypoint[] = [
  { p: 0.0, x: 0.35, y: 0.75, z: 0.6, s: 1.5 }, // hero (grande, alto à direita)
  { p: 0.35, x: -0.35, y: 0.2, z: 0.2, s: 1.2 }, // deriva à esquerda, descendo
  { p: 0.65, x: 0.25, y: -0.15, z: 0.0, s: 1.05 }, // serpenteia de volta
  { p: 0.82, x: 0, y: RIM[1] + 0.25, z: RIM[2], s: 1 }, // alinha sobre o aro
  { p: 0.92, x: 0, y: RIM[1], z: RIM[2], s: 1 }, // cruza o aro
  { p: 1.0, x: 0, y: RIM[1] - 0.28, z: RIM[2], s: 1 }, // afunda na rede
] as const;

const smooth = (t: number): number => t * t * (3 - 2 * t); // smoothstep
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Amostra a trajetória num progresso p (0..1), interpolando entre waypoints. */
function sampleTrack(p: number): Waypoint {
  const clamped = Math.min(Math.max(p, 0), 1);
  for (let i = 1; i < TRACK.length; i++) {
    const a = TRACK[i - 1]!;
    const b = TRACK[i]!;
    if (clamped <= b.p) {
      const t = smooth((clamped - a.p) / (b.p - a.p));
      return {
        p: clamped,
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t),
        z: lerp(a.z, b.z, t),
        s: lerp(a.s, b.s, t),
      };
    }
  }
  return TRACK[TRACK.length - 1]!;
}

// Pulso da rede: bump centrado em p≈0.92 (quando a bola cruza o aro).
function netStretch(p: number): number {
  const d = Math.abs(p - 0.92);
  return d < 0.07 ? 1 + (1 - d / 0.07) * 0.45 : 1;
}

/** Bola + cesta numa cena só; o scroll da página é a linha do tempo do arremesso. */
function ShotScene() {
  const ball = useRef<Group>(null);
  const net = useRef<Mesh>(null);

  useGSAP(() => {
    const b = ball.current;
    const n = net.current;
    if (!b || !n) return;

    const apply = (p: number): void => {
      const wp = sampleTrack(p);
      b.position.set(wp.x, wp.y, wp.z);
      b.scale.setScalar(BALL_SCALE * wp.s);
      n.scale.y = netStretch(p);
    };

    apply(0); // estado inicial = hero

    const state = { p: 0 };
    gsap.to(state, {
      p: 1,
      ease: "none",
      scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.2 },
      onUpdate: () => apply(state.p),
    });
  });

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 5, 4]} intensity={1.9} />
      <directionalLight position={[-5, 2, 1]} intensity={0.7} />
      <directionalLight position={[0, -3, -4]} intensity={0.5} />

      {/* Grupos controlados FORA do Suspense → refs montam de imediato (o useGSAP
          precisa deles). Só a Basketball (carrega texturas) suspende, internamente. */}
      <group ref={ball} scale={BALL_SCALE}>
        <Suspense fallback={null}>
          <Basketball />
        </Suspense>
      </group>
      <group position={RIM}>
        <Hoop autoSpin={false} netRef={net} />
      </group>
      <ContactShadows position={[0, -0.95, 0]} opacity={0.25} scale={2.6} blur={2.8} far={1.4} />
    </>
  );
}

export function ShotExperience() {
  return (
    <Canvas camera={{ position: [0, 0.15, 2.5], fov: 42 }} dpr={[1, 2]}>
      <ShotScene />
    </Canvas>
  );
}
