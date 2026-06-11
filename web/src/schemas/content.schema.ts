import { z } from "zod";

/** Conteúdo do hero (primeira dobra). */
export const heroSchema = z.object({
  titulo: z.string().min(1),
  subtitulo: z.string().min(1),
  cta: z.string().min(1),
});

/** Conteúdo completo da home. */
export const homeContentSchema = z.object({
  hero: heroSchema,
});

export type Hero = z.infer<typeof heroSchema>;
export type HomeContent = z.infer<typeof homeContentSchema>;
