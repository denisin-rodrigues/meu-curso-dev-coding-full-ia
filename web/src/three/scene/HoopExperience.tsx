"use client";

import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Hoop } from "@/three/scene/Hoop";

/**
 * Palco da cesta clay: product-viewer com câmera inicial em contra-plongée
 * leve (de baixo pra cima — essência travada no Portão 0 do ciclo).
 */
export function HoopExperience() {
  return (
    <Canvas camera={{ position: [0.55, -0.5, 1.45], fov: 38 }} dpr={[1, 2]}>
      {/* Luz de estúdio suave e neutra — clay vive de luz macia, sem dureza */}
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 5, 4]} intensity={1.9} />
      <directionalLight position={[-5, 2, 1]} intensity={0.7} />
      <directionalLight position={[0, -3, -4]} intensity={0.5} />

      <Suspense fallback={null}>
        <Hoop />
        <ContactShadows position={[0, -0.55, 0]} opacity={0.3} scale={2.2} blur={2.6} far={1.2} />
      </Suspense>

      <OrbitControls
        makeDefault
        target={[0, 0, 0]}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        autoRotate
        autoRotateSpeed={0.7}
        minDistance={0.9}
        maxDistance={3}
      />
    </Canvas>
  );
}
