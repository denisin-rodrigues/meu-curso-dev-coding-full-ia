import { z } from "zod";

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "cor hex #RRGGBB");
const vec3 = z.tuple([z.number(), z.number(), z.number()]);

export const basketballConfigSchema = z.object({
  textures: z.object({
    albedo: z.string().min(1),
    normal: z.string().min(1),
    roughness: z.string().min(1),
  }),
  decal: z.object({
    src: z.string().min(1),
    position: vec3,
    rotation: vec3,
    scale: z.number().positive(),
    color: hex,
  }),
  spin: z.object({
    idleSpeed: z.number(),
    dampingFactor: z.number().positive(),
  }),
  colors: z.object({ base: hex, accent: hex }),
});

export type BasketballConfig = z.infer<typeof basketballConfigSchema>;
