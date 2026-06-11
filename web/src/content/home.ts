import { homeContentSchema, type HomeContent } from "@/schemas/content.schema";

// Dado bruto do conteúdo. Validado no carregamento — se o formato divergir do schema,
// o erro aparece já no build/import, nunca silenciosamente.
const data = {
  hero: {
    titulo: "Laboratório 3D",
    subtitulo: "Fundação do site premium com Three.js",
    cta: "Explorar",
  },
};

export const homeContent: HomeContent = homeContentSchema.parse(data);
