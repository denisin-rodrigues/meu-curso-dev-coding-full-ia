// ESCAPE HATCH — Three.js puro (sem R3F). Construído na mão e montado na cena R3F
// via <primitive object={...} />. Demonstra a fronteira híbrida do laboratório.
import {
  EdgesGeometry,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
} from "three";

/** Cria um globo de arame (wireframe) usando a API crua do Three.js. */
export function createWireframeGlobe(radius = 1): LineSegments {
  const source = new IcosahedronGeometry(radius, 2);
  const edges = new EdgesGeometry(source);
  source.dispose(); // EdgesGeometry já copiou os dados; libera o buffer da GPU intermediário
  const material = new LineBasicMaterial({ color: 0x22d3ee });
  return new LineSegments(edges, material);
}
