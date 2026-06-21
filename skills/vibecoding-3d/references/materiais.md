# Inteligência de Materiais

Conhecimento pago com iterações. Antes de gerar/alterar textura ou material, leia a
seção do material. Após validar um material novo com o usuário, **adicione a seção
dele aqui** (física + anti-referências + parâmetros). Append-only por material.

## Protocolo de Documentação Visual (vale para TODO material novo)

Para objetos que dependem de **detalhe de superfície**, referência visual
estruturada supera descrição textual. Mais prompts de texto **não** melhoram o
resultado; documentação visual sim. Antes de gerar a textura, produza/peça:

1. Vistas ortográficas (frente, lado, topo)
2. Medidas e proporções (tamanho real do objeto e dos detalhes)
3. Ampliações da superfície (close-up do grão/relevo em escala conhecida)
4. Estudo do material (como reage à luz: brilho, fosco, specular)
5. Padrões visuais/geométricos (repetição, direção, irregularidade)

Checklist de prompt de material: física da superfície (rugosidade, specular),
escala dos detalhes em unidades reais, o que o material **NÃO** é (anti-referências),
imagens de apoio anexadas. (Ver `documentacao-visual.md`.)

## Couro esportivo granulado (pebbled) — ✅ validado

- **Física:** grão arredondado fino (~1–2 mm num objeto de ~24 cm — escala relativa
  é crítica), semi-fosco, roughness alta e **variável**, gomos/ranhuras mais escuros
  e lisos que o grão; isotrópico (sem direção preferencial).
- **Anti-referências (erros recorrentes do gerador):** escamas de réptil (células
  grandes/contraste alto), pedras/cascalho (relevo profundo), estrutura orgânica
  (padrão ganha direção/fluxo), plástico (roughness uniforme e baixa).
- **Correção que funcionou:** escala de célula menor, relevo achatado, roughness alta
  com variação sutil, ancorado em ampliações reais da superfície.
- **Parâmetros:** albedo base + padrão via Worley + gomos em cor de contraste; normal
  via fBm + ranhuras; oclusão assada no albedo (evita pegadinha uv2→uv1 do three r151+).

## Clay / soft-touch (estilizado) — ✅ validado

- **Física:** plástico macio/argila de brinquedo, fosco aveludado com brilho sutil.
  **Zero textura** — a materialidade vem de 3 parâmetros + luz suave. Formas sempre
  arredondadas (cantos generosos, tubos grossos).
- **Anti-referências:** plástico duro/brilhante (roughness baixa demais), borracha
  morta (roughness 1.0 sem clearcoat), luz dura (sombras duras quebram o aconchego).
- **Parâmetros:** `meshPhysicalMaterial` roughness ~0.5, clearcoat ~0.15, metalness 0;
  luz ambiente forte + 2–3 direcionais suaves sem sombra dura + ContactShadows leve.

## Materiais a estudar (próximos)

Borracha · tecido/mesh esportivo · metal pintado · nylon trançado · madeira · pele.
Ao validar cada um, criar a seção aqui com física, anti-referências, correções e parâmetros.
