import { z } from "zod";

/** Conteúdo do hero (primeira dobra). */
export const heroSchema = z.object({
  titulo: z.string().min(1),
  subtitulo: z.string().optional(),
  cta: z.string().optional(),
});

/** Um passo do método (Ato 2). */
export const metodoPassoSchema = z.object({
  numero: z.string().min(1),
  titulo: z.string().min(1),
  descricao: z.string().min(1),
  imagem: z.string().optional(),
});

/** Conteúdo do método (Ato 2) — título + lista de passos. */
export const metodoSchema = z.object({
  titulo: z.string().min(1),
  passos: z.array(metodoPassoSchema),
});

/** Conteúdo do CTA final (pré-lançamento, sem backend). */
export const ctaSchema = z.object({
  titulo: z.string().min(1),
  botao: z.string().min(1),
});

/** Conteúdo completo da home (vitrine do curso). */
export const homeContentSchema = z.object({
  hero: heroSchema,
  metodo: metodoSchema,
  cta: ctaSchema,
});

export type Hero = z.infer<typeof heroSchema>;
export type Metodo = z.infer<typeof metodoSchema>;
export type Cta = z.infer<typeof ctaSchema>;
export type HomeContent = z.infer<typeof homeContentSchema>;
