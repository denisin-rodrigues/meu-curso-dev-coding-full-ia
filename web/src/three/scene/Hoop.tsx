"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import type { Group, Mesh } from "three";
import { hoopConfig } from "@/content/hoop";
import { buildNetGeometry } from "@/three/primitives/hoopNet";

interface HoopProps {
  /** Auto-giro lento (product viewer). Desligue em cenas com trajetória controlada. */
  readonly autoSpin?: boolean;
  /** Expõe a malha da rede para animação externa (ex: pulso quando a bola passa). */
  readonly netRef?: RefObject<Mesh | null>;
}

/**
 * A cesta clay: aro (torus), suporte e tabela (RoundedBox) + rede procedural.
 * Material único soft-touch em 3 cores (ver docs/MATERIAIS.md).
 */
export function Hoop({ autoSpin = true, netRef }: HoopProps = {}) {
  const ref = useRef<Group>(null);
  const { rim, bracket, board, net, material, spin } = hoopConfig;

  const netGeometry = useMemo(() => buildNetGeometry(net), [net]);
  useEffect(() => () => netGeometry.dispose(), [netGeometry]);

  useFrame((_, delta) => {
    if (autoSpin && ref.current) ref.current.rotation.y += delta * spin.idleSpeed * 0.2;
  });

  // Layout no eixo Z: aro na origem; suporte cola o aro à face frontal da tabela.
  const bracketZ = -(rim.radius + bracket.depth / 2 - 0.02);
  const boardZ = -(rim.radius + bracket.depth - 0.02 + board.depth / 2);

  const clay = { roughness: material.roughness, clearcoat: material.clearcoat, metalness: 0 };

  return (
    <group ref={ref}>
      {/* Aro: torus deitado (eixo Y) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[rim.radius, rim.tube, 24, 64]} />
        <meshPhysicalMaterial color={rim.color} {...clay} />
      </mesh>

      {/* Suporte aro→tabela */}
      <RoundedBox
        args={[bracket.width, bracket.height, bracket.depth]}
        radius={Math.min(bracket.height, bracket.width) * 0.3}
        position={[0, 0, bracketZ]}
      >
        <meshPhysicalMaterial color={bracket.color} {...clay} />
      </RoundedBox>

      {/* Tabela: placa de cantos arredondados, limpa */}
      <RoundedBox
        args={[board.width, board.height, board.depth]}
        radius={board.cornerRadius}
        position={[0, board.offsetY, boardZ]}
      >
        <meshPhysicalMaterial color={board.color} {...clay} />
      </RoundedBox>

      {/* Rede: treliça procedural de tubos lisos */}
      <mesh ref={netRef ?? null} geometry={netGeometry}>
        <meshPhysicalMaterial color={net.color} {...clay} />
      </mesh>
    </group>
  );
}
