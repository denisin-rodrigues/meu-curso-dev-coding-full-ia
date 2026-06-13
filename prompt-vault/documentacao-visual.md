# Prompt Vault — Documentação Visual (Reference Sheets)

Template mestre para gerar **folhas de referência técnica** de objetos 3D em
ferramentas de imagem (Nano Banana, Midjourney, etc.). As folhas alimentam a
Etapa 1b do START (`web/docs/START.md`) e o Protocolo de Documentação Visual
(`web/docs/MATERIAIS.md`).

> Validado no Projeto 01 (bola Jordan): referência visual estruturada > descrição
> textual para objetos dependentes de superfície.

---

## ⚠️ A regra de ouro: imagem mostra, texto mede

Modelos de imagem **alucinam números** ("Ø 17230", "30.5m", "SCALE SCALE" — erros
reais das folhas do Projeto 01). Por isso:

- **NUNCA** peça cotas, medidas ou números na imagem — peça explicitamente para NÃO ter
- As **medidas reais** ficam no markdown (`MATERIAIS.md` / spec do objeto), escritas por você
- A imagem carrega o que ela faz bem: forma, proporção, textura, ângulos, luz
- Rótulos curtos de texto (FRONT, TOP) são ok — confira se não saíram corrompidos

**Checklist de aceitação da folha gerada** (antes de usar como referência):
- [ ] O objeto é IDÊNTICO em todas as vistas? (cor, proporção, detalhes no mesmo lugar)
- [ ] A escala do grão/textura é uniforme entre as vistas?
- [ ] Sem números/cotas inventados poluindo a folha?
- [ ] Os close-ups mostram o material certo (não "parecido")?
Reprovou em algum? Regenerar — folha ambígua produz textura ambígua.

---

## FOLHA 1 — Forma e ângulos (template mestre)

Preencha os `[CAMPOS]` e cole na ferramenta de imagem (inglês rende melhor):

```
Technical reference sheet of [OBJECT — ex: a basketball], engineering blueprint
style, product design documentation. Clean white background with subtle gray grid.

Layout:
- Row 1: orthographic views FRONT, BACK, LEFT, RIGHT — same object, same scale,
  perfectly consistent across views, centered, no perspective distortion.
- Row 2: orthographic views TOP, BOTTOM, plus two 45-degree three-quarter views.

Object description (must be identical in every view):
[FORMA E PROPORÇÕES — ex: perfect sphere, 8 panels separated by thin seams]
[CORES NOMEADAS — ex: ice-blue leather body, white seams, white Jumpman logo
 centered on upper front panel]
[ACABAMENTO — ex: semi-matte finish, soft sheen, no glossy highlights]

Lighting: soft neutral studio lighting, true colors, no colored light, no dramatic
shadows, no reflections of environment.

Labels: only short view names (FRONT, BACK, LEFT, RIGHT, TOP, BOTTOM). Absolutely
NO dimension numbers, NO measurement callouts, NO scale bars, NO annotation arrows.

Style: photorealistic object rendered on a technical drawing sheet, sharp focus,
high detail, 4k.
```

---

## FOLHA 2 — Material e superfície (template mestre)

Uma folha separada SÓ do material — é dela que a textura nasce:

```
Material study sheet of [MATERIAL — ex: pebbled basketball leather, ice-blue],
engineering documentation style. Clean white background with subtle gray grid.

Panels, arranged in a grid, each clearly separated:
1. Flat texture swatch, viewed perfectly straight-on (orthogonal), even flat
   lighting, seamless pattern — large panel.
2. Macro close-up of the surface grain at medium magnification.
3. Extreme macro close-up showing the microstructure of [GRÃO/PADRÃO — ex: small
   rounded pebbles, isotropic, no directional flow].
4. Material cross-section showing internal layers [CAMADAS — ex: grained leather
   surface, foam backing, rubber core].
5. Close-up of [DETALHE CONSTRUTIVO — ex: seam channel between panels, slightly
   recessed, smoother than the grain].
6. Light behavior study: the material on a curved surface showing how light falls
   off — [COMPORTAMENTO — ex: semi-matte, soft diffuse highlight, never glossy].

Material truth (apply to every panel):
[O QUE O MATERIAL É — física: rugosidade, relevo baixo/alto, denso/esparso]
[O QUE O MATERIAL NÃO É — anti-referências: ex: NOT reptile scales, NOT gravel,
 NOT plastic, NOT fabric]

Labels: short panel captions only. NO dimension numbers, NO measurements.
Style: photorealistic macro photography on a technical sheet, sharp focus, 4k.
```

---

## Como usar no fluxo (Etapa 1b do START)

1. Peça à IA de código: *"preenche os templates do `prompt-vault/documentacao-visual.md`
   para o objeto [X]"* — ela gera os dois prompts prontos com a física do material
   (consultando o MATERIAIS.md se o material já for conhecido).
2. Gere as folhas no Nano Banana. Rode o **checklist de aceitação**.
3. Salve em `reference/[objeto]/` do projeto (folha-forma.png, folha-material.png).
4. Escreva as **medidas reais** na spec/MATERIAIS.md (diâmetro, tamanho do grão em mm).
5. Só então comece a Etapa 2 (prompt de geração de textura), anexando as folhas.

### Dicas de geração
- **Uma folha por preocupação** (forma ≠ material) — folha lotada perde resolução nos close-ups.
- Gere as vistas **numa imagem só** (consistência entre vistas vem de graça); vistas geradas separadamente divergem em cor e proporção.
- O painel 1 da Folha 2 (swatch plano ortogonal) pode servir de base/comparação direta para o albedo procedural.
- Anti-referências no prompt da folha também! O gerador de imagem comete os MESMOS erros do gerador de textura (escamas, pedras).
