import { describe, expect, it } from "vitest";
import { motionSpecSchema } from "./motion.schema";
import { sampleMotion, samplePulse } from "@/three/motion/sampleMotion";

const valido = {
  cameraY: [
    { p: 0, v: 0.1, ease: "linear" as const },
    { p: 1, v: -3.15, ease: "smooth" as const },
  ],
  ball: [
    { p: 0, x: 0.25, y: 0, z: 0, scale: 1.45, ease: "linear" as const },
    { p: 1, x: 0, y: -3.38, z: 0, scale: 1, ease: "gravityIn" as const },
  ],
  netPulse: { center: 0.96, width: 0.06, intensity: 0.45 },
};

describe("motionSpecSchema", () => {
  it("aceita um spec válido", () => {
    expect(motionSpecSchema.safeParse(valido).success).toBe(true);
  });

  it("rejeita track que não começa em p=0", () => {
    const bad = { ...valido, cameraY: [{ p: 0.2, v: 0, ease: "linear" as const }, { p: 1, v: -3, ease: "smooth" as const }] };
    expect(motionSpecSchema.safeParse(bad).success).toBe(false);
  });
});

describe("sampleMotion", () => {
  it("nos extremos entrega os keyframes inicial e final", () => {
    const spec = motionSpecSchema.parse(valido);
    const ini = sampleMotion(spec, 0);
    const fim = sampleMotion(spec, 1);
    expect(ini.ball.y).toBeCloseTo(0);
    expect(fim.ball.y).toBeCloseTo(-3.38);
    expect(fim.cameraY).toBeCloseTo(-3.15);
  });

  it("gravityIn (t²) cai mais devagar no início que linear", () => {
    const spec = motionSpecSchema.parse(valido);
    // em p=0.5, gravityIn dá t=0.25 → y = -3.38*0.25 ≈ -0.845
    expect(sampleMotion(spec, 0.5).ball.y).toBeCloseTo(-0.845, 2);
  });

  it("pulso da rede: 1 fora da janela, pico no centro", () => {
    expect(samplePulse(valido.netPulse, 0)).toBe(1);
    expect(samplePulse(valido.netPulse, 0.96)).toBeCloseTo(1.45);
  });
});
