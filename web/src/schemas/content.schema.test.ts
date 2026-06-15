import { describe, expect, it } from "vitest";
import { homeContentSchema } from "./content.schema";

const valido = {
  hero: { titulo: "DEV CODING FULL IA", subtitulo: "Crie sites premium com IA", cta: "Em breve" },
  beats: ["Role a página.", "Cada rolagem é parte do arremesso."],
  metodo: {
    titulo: "O método em 5 passos",
    passos: [
      { numero: "01", titulo: "Referência", descricao: "Escolher o alvo." },
      { numero: "02", titulo: "Contexto", descricao: "Planejar antes." },
      { numero: "03", titulo: "Prompt", descricao: "Pedir com método." },
      { numero: "04", titulo: "Build", descricao: "Construir testando." },
      { numero: "05", titulo: "Polish", descricao: "Lapidar." },
    ],
  },
  cta: { titulo: "O curso está chegando.", botao: "Em breve" },
};

describe("homeContentSchema", () => {
  it("aceita conteúdo válido", () => {
    expect(homeContentSchema.safeParse(valido).success).toBe(true);
  });
  it("exige exatamente 5 passos no método", () => {
    const bad = { ...valido, metodo: { ...valido.metodo, passos: valido.metodo.passos.slice(0, 4) } };
    expect(homeContentSchema.safeParse(bad).success).toBe(false);
  });
});
