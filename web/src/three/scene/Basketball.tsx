"use client";

import { Decal, useTexture } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import { basketballConfig } from "@/content/basketball";
import { useBasketballTextures } from "@/three/materials/basketballTextures";

/** A bola: esfera com material PBR gerado + decal do Jumpman. Gira sozinha devagar. */
export function Basketball() {
  const ref = useRef<Mesh>(null);
  const { map, normalMap, roughnessMap } = useBasketballTextures(basketballConfig.textures);
  const decalMap = useTexture(basketballConfig.decal.src);
  const { idleSpeed } = basketballConfig.spin;

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * idleSpeed * 0.2;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={map}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        metalness={0}
      />
      <Decal
        position={basketballConfig.decal.position}
        rotation={basketballConfig.decal.rotation}
        scale={basketballConfig.decal.scale}
      >
        <meshStandardMaterial
          map={decalMap}
          transparent
          polygonOffset
          polygonOffsetFactor={-1}
          color={basketballConfig.decal.color}
          roughness={0.5}
          metalness={0}
        />
      </Decal>
    </mesh>
  );
}
