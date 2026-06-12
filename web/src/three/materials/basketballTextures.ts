"use client";

import { useTexture } from "@react-three/drei";
import { useEffect } from "react";
import { RepeatWrapping, SRGBColorSpace, type Texture } from "three";
import type { BasketballConfig } from "@/schemas/basketball.schema";

export interface BasketballMaps {
  readonly map: Texture;
  readonly normalMap: Texture;
  readonly roughnessMap: Texture;
}

/** Carrega os mapas e aplica color space correto: albedo sRGB, normal/roughness lineares. */
export function useBasketballTextures(textures: BasketballConfig["textures"]): BasketballMaps {
  const texs = useTexture([
    textures.albedo,
    textures.normal,
    textures.roughness,
  ]);

  // drei garante que dentro de Suspense as texturas existem
  const map = texs[0]!;
  const normalMap = texs[1]!;
  const roughnessMap = texs[2]!;

  useEffect(() => {
    map.colorSpace = SRGBColorSpace; // cor em sRGB
    for (const t of [map, normalMap, roughnessMap]) {
      t.wrapS = RepeatWrapping;
      t.wrapT = RepeatWrapping;
      t.needsUpdate = true;
    }
  }, [map, normalMap, roughnessMap]);

  return { map, normalMap, roughnessMap };
}

