"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PresentationControls } from "@react-three/drei";
import type { Mesh } from "three";
import { basketballConfig } from "@/content/basketball";
import { useBasketballTextures } from "@/three/materials/basketballTextures";

/** A bola: esfera com material PBR gerado. Os 2 logos Jumpman vêm assados na
 * textura (painéis de cima e de baixo). Gira sozinha devagar. */
export function Basketball() {
  const ref = useRef<Mesh>(null);
  const { map, normalMap, roughnessMap } = useBasketballTextures(basketballConfig.textures);
  const { idleSpeed } = basketballConfig.spin;

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * idleSpeed * 0.2;
  });

  return (
    <PresentationControls
      global={false}
      cursor={true}
      snap={false}
      speed={2}
      zoom={1}
      polar={[-Math.PI, Math.PI]}
      azimuth={[-Infinity, Infinity]}
    >
      <mesh ref={ref}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={map}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
          metalness={0}
        />
      </mesh>
    </PresentationControls>
  );
}
