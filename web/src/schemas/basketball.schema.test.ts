import { describe, expect, it } from "vitest";
import { basketballConfigSchema } from "./basketball.schema";

const valido = {
  textures: { albedo: "/t/a.jpg", normal: "/t/n.jpg", roughness: "/t/r.jpg" },
  decal: { src: "/d/j.png", position: [0, 0, 1], rotation: [0, 0, 0], scale: 0.5, color: "#FFFAF4" },
  spin: { idleSpeed: 0.5, dampingFactor: 0.08 },
  colors: { base: "#56B4C3", accent: "#FFFAF4" },
};

describe("basketballConfigSchema", () => {
  it("aceita config válida", () => {
    expect(basketballConfigSchema.safeParse(valido).success).toBe(true);
  });
  it("rejeita cor fora do formato hex", () => {
    const bad = { ...valido, colors: { base: "azul", accent: "#FFFAF4" } };
    expect(basketballConfigSchema.safeParse(bad).success).toBe(false);
  });
});
