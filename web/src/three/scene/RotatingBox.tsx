"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

/** Cubo que gira continuamente — prova viva de que o loop de render R3F funciona. */
export function RotatingBox() {
  const ref = useRef<Mesh>(null);

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    mesh.rotation.x += delta * 0.4;
    mesh.rotation.y += delta * 0.6;
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#6366f1" metalness={0.1} roughness={0.3} />
    </mesh>
  );
}
