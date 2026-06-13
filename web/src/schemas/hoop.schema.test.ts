import { describe, expect, it } from "vitest";
import { hoopConfigSchema } from "./hoop.schema";

const valido = {
  rim: { radius: 0.21, tube: 0.035, color: "#E8432E" },
  bracket: { width: 0.12, height: 0.07, depth: 0.14, color: "#E8432E" },
  board: { width: 0.64, height: 0.47, depth: 0.055, cornerRadius: 0.06, offsetY: 0.12, color: "#D9DDE3" },
  net: {
    strands: 8,
    levels: [
      { radius: 0.185, y: -0.02 },
      { radius: 0.16, y: -0.12 },
      { radius: 0.115, y: -0.31 },
    ],
    tubeRadius: 0.012,
    color: "#F4F2EE",
  },
  material: { roughness: 0.5, clearcoat: 0.15 },
  spin: { idleSpeed: 0.4 },
};

describe("hoopConfigSchema", () => {
  it("aceita config válida", () => {
    expect(hoopConfigSchema.safeParse(valido).success).toBe(true);
  });

  it("rejeita cor fora do formato hex", () => {
    const bad = { ...valido, rim: { ...valido.rim, color: "vermelho" } };
    expect(hoopConfigSchema.safeParse(bad).success).toBe(false);
  });

  it("rejeita níveis da rede que não descem em y", () => {
    const bad = {
      ...valido,
      net: {
        ...valido.net,
        levels: [
          { radius: 0.185, y: -0.02 },
          { radius: 0.16, y: 0.05 },
        ],
      },
    };
    expect(hoopConfigSchema.safeParse(bad).success).toBe(false);
  });
});
