import { z } from "zod";

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "cor hex #RRGGBB");
const metros = z.number().positive();

const netLevelSchema = z.object({
  radius: metros,
  y: z.number(),
});

export const hoopConfigSchema = z.object({
  rim: z.object({ radius: metros, tube: metros, color: hex }),
  bracket: z.object({ width: metros, height: metros, depth: metros, color: hex }),
  board: z.object({
    width: metros,
    height: metros,
    depth: metros,
    cornerRadius: metros,
    offsetY: z.number(),
    color: hex,
  }),
  net: z.object({
    strands: z.number().int().min(4).max(24),
    levels: z
      .array(netLevelSchema)
      .min(2)
      .refine(
        (ls) => ls.every((l, i) => i === 0 || l.y < (ls[i - 1]?.y ?? Number.POSITIVE_INFINITY)),
        "níveis da rede devem descer em y (do aro para a boca inferior)",
      ),
    tubeRadius: metros,
    color: hex,
  }),
  material: z.object({
    roughness: z.number().min(0).max(1),
    clearcoat: z.number().min(0).max(1),
  }),
  spin: z.object({ idleSpeed: z.number() }),
});

export type HoopConfig = z.infer<typeof hoopConfigSchema>;
export type NetLevel = z.infer<typeof netLevelSchema>;
