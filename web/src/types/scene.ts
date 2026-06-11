import type { Vector3Tuple } from "three";

/** Configuração declarativa de um objeto na cena 3D. */
export interface SceneObjectConfig {
  readonly id: string;
  readonly position: Vector3Tuple;
  readonly rotationSpeed: number;
}

/** Configuração da câmera da experiência 3D. */
export interface CameraConfig {
  readonly position: Vector3Tuple;
  readonly fov: number;
}
