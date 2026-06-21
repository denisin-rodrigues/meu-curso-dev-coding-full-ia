import { motionSpecSchema, type MotionSpec } from "@/schemas/motion.schema";

// Plano de animação do arremesso (modelo "quadra vertical"): a câmera desce do
// hero (topo) até a cesta fixa no fim; a bola cai com física de projétil e
// serpenteia de leve, zerando no aro. Pulso da rede ao cruzar o aro.
// Valores em metros (mundo). Ver docs/ANIMACAO-3D.md.
const data = {
  // Câmera panorâmica vertical: enquadra a bola (0.1) → enquadra a cesta (-3.15).
  cameraY: [
    { p: 0, v: 0.1, ease: "linear" },
    { p: 1, v: -3.15, ease: "smooth" },
  ],
  // Câmera panorâmica horizontal: move a câmera pra esquerda no primeiro scroll
  // → a bola aparece à DIREITA sem distorção de perspectiva.
  cameraX: [
    { p: 0.0, v: 0.0, ease: "linear" },
    { p: 0.12, v: -0.55, ease: "smooth" },
    { p: 0.28, v: -0.45, ease: "smooth" },
    { p: 0.50, v: 0.0, ease: "smooth" },
    { p: 1.0, v: 0.0, ease: "smooth" },
  ],
  // Bola: escala quase constante para NÃO distorcer a forma esférica.
  // Y desce junto com a câmera para manter visibilidade central.
  // Bola: escala constante (1.8 e z 0.7) mantida durante toda a queda (até p=0.75)
  // Só diminui a escala e o zoom na reta final (p=0.90+) quando vai entrar na cesta.
  ball: [
    { p: 0.0,  x: 0.0, y: 0.1,   z: 0.7, scale: 1.8, ease: "linear" },
    { p: 0.12, x: 0.0, y: -0.3,  z: 0.7, scale: 1.8, ease: "smooth" },
    { p: 0.28, x: 0.0, y: -0.8,  z: 0.7, scale: 1.8, ease: "smooth" },
    { p: 0.50, x: 0.0, y: -0.845, z: 0.7, scale: 1.8, ease: "smooth" }, // Mantém o zoom (scroll 3)
    { p: 0.75, x: -0.07, y: -1.901, z: 0.7, scale: 1.8, ease: "smooth" }, // Mantém até perto da cesta
    { p: 0.90, x: -0.03, y: -2.600, z: 0, scale: 1.0, ease: "smooth" }, // Diminui pra caber na cesta
    { p: 1.0,  x: 0.0, y: -3.38, z: 0,  scale: 1.0, ease: "smooth" },
  ],
  netPulse: { center: 0.96, width: 0.06, intensity: 0.45 },
};

export const shotMotion: MotionSpec = motionSpecSchema.parse(data);
