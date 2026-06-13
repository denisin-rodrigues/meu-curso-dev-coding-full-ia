import { hoopConfigSchema, type HoopConfig } from "@/schemas/hoop.schema";

// Medidas em metros (referência: web/public/reference/hoop.jpg — estilo clay).
// Proporções canônicas da hoop.jpg; a folha técnica (hoop-sheet.jpeg) cobre os
// ângulos laterais/traseiros. Escala ancorada em aro real ~Ø46cm p/ o ciclo 2.
const data = {
  rim: { radius: 0.21, tube: 0.035, color: "#E8432E" },
  bracket: { width: 0.12, height: 0.07, depth: 0.14, color: "#E8432E" },
  board: {
    width: 0.64,
    height: 0.47,
    depth: 0.055,
    cornerRadius: 0.06,
    offsetY: 0.12,
    color: "#D9DDE3",
  },
  net: {
    strands: 8,
    levels: [
      { radius: 0.185, y: -0.02 },
      { radius: 0.16, y: -0.12 },
      { radius: 0.135, y: -0.22 },
      { radius: 0.115, y: -0.31 },
      { radius: 0.105, y: -0.38 },
    ],
    tubeRadius: 0.012,
    color: "#F4F2EE",
  },
  material: { roughness: 0.5, clearcoat: 0.15 },
  spin: { idleSpeed: 0.4 },
};

export const hoopConfig: HoopConfig = hoopConfigSchema.parse(data);
