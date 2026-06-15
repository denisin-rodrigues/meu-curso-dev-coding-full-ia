import { z } from "zod";

/** Conteúdo do hero (primeira dobra). */
export const heroSchema = z.object({
  titulo: z.string().min(1),
  subtitulo: z.string().min(1),
  cta: z.string().min(1),
});

/** Um passo do método (Ato 2). */
export const metodoPassoSchema = z.object({
  numero: z.string().min(1),
  titulo: z.string().min(1),
  descricao: z.string().min(1),
  imagem: z.string().optional(),
});

/** Conteúdo completo da home (vitrine do curso). */
export const homeContentSchema = z.object({
  hero: heroSchema,
  beats: z.array(z.string().min(1)).min(1),
  metodo: z.object({
    titulo: z.string().min(1),
    passos: z.array(metodoPassoSchema).length(5),
  }),
  cta: z.object({ titulo: z.string().min(1), botao: z.string().min(1) }),
});

export type Hero = z.infer<typeof heroSchema>;
export type MetodoPasso = z.infer<typeof metodoPassoSchema>;
export type HomeContent = z.infer<typeof homeContentSchema>;
