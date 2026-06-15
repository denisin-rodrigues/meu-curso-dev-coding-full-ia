import { motionSpecSchema, type MotionSpec } from "@/schemas/motion.schema";

// Plano de animação do arremesso (modelo "quadra vertical"): a câmera desce do
// hero (topo) até a cesta fixa no fim; a bola cai com física de projétil e
// serpenteia de leve, zerando no aro. Pulso da rede ao cruzar o aro.
// Valores em metros (mundo). Ver docs/ANIMACAO-3D.md.
const data = {
  // Câmera panorâmica: enquadra a bola (0.1) → enquadra a cesta (-3.15).
  cameraY: [
    { p: 0, v: 0.1, ease: "linear" },
    { p: 1, v: -3.15, ease: "smooth" },
  ],
  // Bola: y segue a parábola da gravidade (amostrada); x serpenteia e zera no aro;
  // escala recua do hero (1.45×) ao tamanho real (1×).
  ball: [
    { p: 0.0, x: 0.0, y: 0.1, z: 0.7, scale: 1.8, ease: "linear" }, // hero centralizado + zoom
    { p: 0.25, x: 0.16, y: -0.2, z: 0.35, scale: 1.35, ease: "smooth" },
    { p: 0.5, x: 0.0, y: -0.845, z: 0.1, scale: 1.1, ease: "smooth" },
    { p: 0.75, x: -0.07, y: -1.901, z: 0, scale: 1.0, ease: "smooth" },
    { p: 1.0, x: 0.0, y: -3.38, z: 0, scale: 1.0, ease: "smooth" },
  ],
  netPulse: { center: 0.96, width: 0.06, intensity: 0.45 },
};

export const shotMotion: MotionSpec = motionSpecSchema.parse(data);
