import { describe, expect, it } from "vitest";
import { homeContentSchema } from "./content.schema";

describe("homeContentSchema", () => {
  it("aceita conteúdo válido", () => {
    const result = homeContentSchema.safeParse({
      hero: { titulo: "Olá", subtitulo: "Mundo", cta: "Começar" },
    });
    expect(result.success).toBe(true);
  });

  it("rejeita título vazio", () => {
    const result = homeContentSchema.safeParse({
      hero: { titulo: "", subtitulo: "Mundo", cta: "Começar" },
    });
    expect(result.success).toBe(false);
  });
});
