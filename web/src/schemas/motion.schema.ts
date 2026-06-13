import { z } from "zod";

/**
 * Motion Spec — o PLANO de animação como dado tipado e validado.
 * Separa "o que anima" (este spec, declarativo) de "como renderiza" (o código R3F).
 * Diff-ável, testável, reutilizável e didático. Ver docs/ANIMACAO-3D.md.
 */

const p01 = z.number().min(0).max(1); // progresso do scroll (0..1)

// Easings nomeados → funções em src/three/motion/sampleMotion.ts.
// `gravityIn` (t²) é a queda física real (aceleração constante).
export const easeName = z.enum(["linear", "smooth", "gravityIn", "easeOut", "easeInOut"]);
export type EaseName = z.infer<typeof easeName>;

// Keyframe de transform: `ease` é a interpolação DESDE o keyframe anterior até este.
const transformKeyframe = z.object({
  p: p01,
  x: z.number(),
  y: z.number(),
  z: z.number(),
  scale: z.number().positive(),
  ease: easeName,
});

// Keyframe escalar (ex: só o y da câmera).
const scalarKeyframe = z.object({ p: p01, v: z.number(), ease: easeName });

// Keyframes devem começar em p=0, terminar em p=1 e ser crescentes em p.
const ascendingFromZeroToOne = <T extends { p: number }>(ks: readonly T[]): boolean =>
  ks.length >= 2 &&
  ks[0]!.p === 0 &&
  ks[ks.length - 1]!.p === 1 &&
  ks.every((k, i) => i === 0 || k.p > ks[i - 1]!.p);

const transformTrack = z
  .array(transformKeyframe)
  .refine(ascendingFromZeroToOne, "keyframes devem ir de p=0 a p=1, crescentes");

const scalarTrack = z
  .array(scalarKeyframe)
  .refine(ascendingFromZeroToOne, "keyframes devem ir de p=0 a p=1, crescentes");

// Evento pontual: pulso da rede (bump) centrado num progresso.
const pulseEvent = z.object({
  center: p01,
  width: z.number().positive(),
  intensity: z.number().positive(),
});

export const motionSpecSchema = z.object({
  cameraY: scalarTrack, // panorâmica vertical da câmera
  ball: transformTrack, // trajetória + escala da bola
  netPulse: pulseEvent, // rede abrindo quando a bola cruza o aro
});

export type MotionSpec = z.infer<typeof motionSpecSchema>;
export type TransformKeyframe = z.infer<typeof transformKeyframe>;
export type ScalarKeyframe = z.infer<typeof scalarKeyframe>;
export type PulseEvent = z.infer<typeof pulseEvent>;
