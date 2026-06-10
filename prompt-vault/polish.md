# Prompt Vault — Polish

Prompts template para a etapa de **POLISH** — refinar o motion até o nível premium (easings, durações, stagger, timing).

> Estrutura de todo prompt: **[contexto + referência visual + regras técnicas + output esperado]**

---

## Template base

```
CONTEXTO:
A seção [nome] já funciona, mas a animação está "amadora". Quero refinar.

REFERÊNCIA VISUAL:
A sensação de [site premium de referência].

REGRAS TÉCNICAS (premium):
- Easing: [ex: power3.out / custom cubic-bezier], nada de linear
- Duração: [ex: 0.6-1.2s], consistente
- Stagger: [ex: 0.05-0.12s entre elementos]
- Respeitar prefers-reduced-motion

OUTPUT ESPERADO:
Ajustes finos no código, com antes/depois explicado.
```

---

## Padrões de polish extraídos dos projetos

`[A EXTRAIR: regras de motion implícitas no código dos 4 projetos]`

- [ ] Curvas de easing usadas
- [ ] Faixas de duração por tipo de animação
- [ ] Valores de stagger
- [ ] Acessibilidade (reduced motion)
