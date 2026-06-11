"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import { createWireframeGlobe } from "@/three/primitives/wireframeGlobe";
import { RotatingBox } from "@/three/scene/RotatingBox";

/** Cena 3D mínima da fundação: R3F idiomático (RotatingBox) + escape hatch puro (globo). */
export function Experience() {
  // useMemo evita recriar o objeto Three.js puro a cada render.
  const globe = useMemo(() => createWireframeGlobe(2.4), []);

  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <directionalLight intensity={1.2} position={[5, 5, 5]} />
      <RotatingBox />
      <primitive object={globe} />
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}
