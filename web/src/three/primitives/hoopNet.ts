import { BufferGeometry, CatmullRomCurve3, TubeGeometry, Vector3 } from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { NetLevel } from "@/schemas/hoop.schema";

export interface NetParams {
  readonly strands: number;
  readonly levels: readonly NetLevel[];
  readonly tubeRadius: number;
}

/**
 * Pontos de um fio da rede: desce nível a nível deslocando meio passo angular
 * por nível. Duas famílias (direction +1 e -1) se cruzam formando os losangos.
 */
function strandPoints(params: NetParams, startIndex: number, direction: 1 | -1): Vector3[] {
  const step = (Math.PI * 2) / params.strands;
  return params.levels.map((level, k) => {
    const angle = (startIndex + direction * k * 0.5) * step;
    return new Vector3(Math.cos(angle) * level.radius, level.y, Math.sin(angle) * level.radius);
  });
}

/**
 * Constrói a treliça de losangos da rede como uma única BufferGeometry:
 * 2 famílias × `strands` fios, cada fio = curva CatmullRom extrudada em tubo
 * liso (estilo clay: sem nós, sem trama de corda).
 *
 * O chamador é dono da geometria retornada e deve chamar `.dispose()` dela.
 */
export function buildNetGeometry(params: NetParams): BufferGeometry {
  const partes: BufferGeometry[] = [];

  for (let i = 0; i < params.strands; i++) {
    for (const direction of [1, -1] as const) {
      const curve = new CatmullRomCurve3(strandPoints(params, i, direction));
      partes.push(new TubeGeometry(curve, 24, params.tubeRadius, 8, false));
    }
  }

  const merged = mergeGeometries(partes);
  // As geometrias intermediárias não são mais necessárias após o merge.
  for (const parte of partes) parte.dispose();

  if (!merged) {
    throw new Error("hoopNet: falha ao mesclar as geometrias dos fios da rede");
  }
  return merged;
}
