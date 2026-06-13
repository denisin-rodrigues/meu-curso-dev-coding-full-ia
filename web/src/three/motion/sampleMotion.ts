import type {
  EaseName,
  MotionSpec,
  PulseEvent,
  ScalarKeyframe,
  TransformKeyframe,
} from "@/schemas/motion.schema";

/** Funções de easing nomeadas. `gravityIn` (t²) é a queda física real. */
const EASINGS: Record<EaseName, (t: number) => number> = {
  linear: (t) => t,
  smooth: (t) => t * t * (3 - 2 * t),
  gravityIn: (t) => t * t, // y ∝ t² — aceleração constante (gravidade)
  easeOut: (t) => 1 - (1 - t) * (1 - t),
  easeInOut: (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2),
};

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const clamp01 = (p: number): number => Math.min(Math.max(p, 0), 1);

/** Encontra o par de keyframes que cerca `p` e devolve o fator eased [0..1]. */
function segment<T extends { p: number; ease: EaseName }>(
  keys: readonly T[],
  p: number,
): { a: T; b: T; t: number } {
  const clamped = clamp01(p);
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1]!;
    const b = keys[i]!;
    if (clamped <= b.p) {
      const raw = (clamped - a.p) / (b.p - a.p);
      return { a, b, t: EASINGS[b.ease](raw) };
    }
  }
  const last = keys[keys.length - 1]!;
  return { a: last, b: last, t: 1 };
}

export interface Transform {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly scale: number;
}

/** Amostra a trajetória da bola (x, y, z, scale) num progresso p. */
export function sampleTransform(track: readonly TransformKeyframe[], p: number): Transform {
  const { a, b, t } = segment(track, p);
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    z: lerp(a.z, b.z, t),
    scale: lerp(a.scale, b.scale, t),
  };
}

/** Amostra um track escalar (ex: y da câmera) num progresso p. */
export function sampleScalar(track: readonly ScalarKeyframe[], p: number): number {
  const { a, b, t } = segment(track, p);
  return lerp(a.v, b.v, t);
}

/** Bump do pulso da rede: 1 fora da janela, cresce até 1+intensity no centro. */
export function samplePulse(pulse: PulseEvent, p: number): number {
  const d = Math.abs(clamp01(p) - pulse.center);
  return d < pulse.width ? 1 + (1 - d / pulse.width) * pulse.intensity : 1;
}

/** Estado completo da cena num progresso p, derivado do Motion Spec. */
export function sampleMotion(spec: MotionSpec, p: number) {
  return {
    cameraY: sampleScalar(spec.cameraY, p),
    ball: sampleTransform(spec.ball, p),
    netScaleY: samplePulse(spec.netPulse, p),
  };
}
