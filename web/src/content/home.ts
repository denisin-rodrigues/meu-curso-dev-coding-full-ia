import { homeContentSchema, type HomeContent } from "@/schemas/content.schema";

// Conteúdo da landing do curso. Validado no carregamento — se o formato divergir
// do schema, o erro aparece já no build/import, nunca silenciosamente.
const data = {
  hero: {
    titulo: "JORDAN",
  },
  metodo: {
    titulo: "O método em 5 passos",
    passos: [
      { numero: "01", titulo: "Referência", descricao: "Escolher a imagem ou vídeo do que se quer criar." },
      { numero: "02", titulo: "Contexto", descricao: "Planejar tudo antes de escrever uma linha de código." },
      { numero: "03", titulo: "Prompt", descricao: "Pedir à IA com contexto, referência, regras e resultado." },
      { numero: "04", titulo: "Build", descricao: "Construir em pedaços, testando a cada passo." },
      { numero: "05", titulo: "Polish", descricao: "Lapidar animação, luz e detalhes até o nível premium." },
    ],
  },
  cta: { titulo: "O curso está chegando.", botao: "Em breve" },
};

export const homeContent: HomeContent = homeContentSchema.parse(data);
