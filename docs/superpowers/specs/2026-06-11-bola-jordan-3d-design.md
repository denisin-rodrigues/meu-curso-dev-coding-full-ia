# Projeto 01 — Bola Jordan 3D (Three.js) — Design

> Spec de design do **primeiro estudo de caso** do laboratório `web/`: uma bola de
> basquete Jordan 3D, fotorrealista e interativa, replicando uma foto de referência.
> Cobre **apenas a bola** (hero interativo). O site em volta é fase posterior.

- **Data:** 2026-06-11
- **Status:** Aprovado (aguardando revisão do spec escrito)
- **Referência:** `web/public/reference/jordan-ball.png`
- **Fundação:** `docs/superpowers/specs/2026-06-10-fundacao-lab-three-js-design.md`

---

## 1. Objetivo

Construir, no laboratório `web/`, uma **bola de basquete Jordan 3D** que bata visualmente
com a foto de referência: base azul, estampa *elephant print*, couro granulado (*pebbled*),
gomos brancos e o logo Jumpman. A bola gira sozinha e pode ser arrastada com inércia
(*product viewer*). O **processo** de construção é registrado (`DEV-LOG.md`, `PROMPTS.md`)
para virar material didático do curso.

### Decisões travadas (do brainstorming)
- **Escopo:** só a bola (hero). Site em volta = projeto futuro.
- **Técnica de superfície:** PBR com texturas (WebGL) — caminho mais seguro e compatível.
- **Origem das texturas:** base PBR escaneada **CC0** (normal/roughness/AO) + **albedo
  custom** (recolorido a partir do albedo CC0 para alinhar gomos↔normal).
- **Interação:** auto-giro + arrastar com inércia (`OrbitControls` `autoRotate` + `enableDamping`).
- **Realismo:** dominado por texturas escaneadas + iluminação de estúdio + pós-processamento
  + color management — não por geometria. Profundidade de gomos (displacement) só no polish.

### Paleta (calibrada pela referência)
- **Base da bola:** `#56B4C3`
- **Logo Jumpman e gomos:** `#FFFAF4`
- Estampa *elephant print*: células claras (derivadas do `#56B4C3` clareado) sobre a base.

### Critérios de sucesso
1. A bola renderiza fotorrealista e **reconhecível como a referência** (azul `#56B4C3`,
   elephant print, granulado, gomos `#FFFAF4`, Jumpman `#FFFAF4`).
2. Gira sozinha; arrastar gira com inércia; zoom limitado; sem pan.
3. Iluminação de estúdio (HDRI) + sombra de contato + fundo claro como na foto.
4. `npx tsc --noEmit` zero erros; teste do schema de config passando.
5. Processo registrado no `DEV-LOG.md`.

---

## 2. Arquitetura e arquivos

Substitui a **cena-prova da fundação** (cubo + globo wireframe), cujo papel de validar a
stack já foi cumprido e está registrado no git/DEV-LOG. Os arquivos
`three/scene/RotatingBox.tsx`, `three/primitives/wireframeGlobe.ts` e
`three/scene/Experience.tsx` são **removidos**.

```
web/
├── public/
│   ├── reference/jordan-ball.png            # foto-alvo (calibração; não renderizada)
│   ├── decals/jumpman.png                   # silhueta preta transparente (origem)
│   ├── decals/jumpman-white.png             # GERADO no build: RGB → #FFFAF4, alpha preservado
│   └── textures/basketball/                 # set PBR (CC0 + albedo custom)
│       ├── albedo.jpg  normal.jpg  roughness.jpg  ao.jpg
└── src/
    ├── schemas/basketball.schema.ts          # Zod: config da bola (tipo + validação)
    ├── content/basketball.ts                 # config concreta, validada no import
    ├── types/scene.ts                        # (já existe) contratos da cena
    ├── three/
    │   ├── materials/basketballTextures.ts   # carrega mapas + ajusta color space
    │   ├── scene/Basketball.tsx              # esfera + material PBR + <Decal> do logo
    │   └── scene/BasketballExperience.tsx    # <Canvas> + luz + sombra + pós + controles
    └── app/page.tsx                          # (modificado) renderiza BasketballExperience
```

**Fronteiras:** `basketballTextures.ts` só carrega/configura mapas (sem JSX);
`Basketball.tsx` é o objeto (geometria + material + decal); `BasketballExperience.tsx` é o
palco (câmera, luz, pós, controles). Cada um com uma responsabilidade.

---

## 3. Config tipada (reusa a espinha de tipagem)

`schemas/basketball.schema.ts` — schema Zod (fonte única de tipo + validação):
- `textures`: `{ albedo, normal, roughness, ao }` (strings de caminho).
- `decal`: `{ src, position: [x,y,z], rotation: [x,y,z], scale, color }` (`color` = `#FFFAF4`).
- `spin`: `{ idleSpeed, dampingFactor }`.
- `colors`: `{ base: '#56B4C3', accent: '#FFFAF4' }`.

`content/basketball.ts` valida a config concreta com `.parse()` no import (falha cedo se um
caminho/valor divergir). Um teste unitário cobre válido/ inválido.

---

## 4. Pipeline de assets

1. **Texturas CC0:** obter um set PBR de bola de basquete (PolyHaven/ambientCG, licença CC0)
   → salvar `normal.jpg`, `roughness.jpg`, `ao.jpg` em `public/textures/basketball/`.
2. **Albedo custom:** derivar do albedo CC0 (mesma UV) → recolorir base para `#56B4C3`,
   aplicar elephant print nos painéis, manter gomos `#FFFAF4` → `albedo.jpg`. (Garante que a
   cor dos gomos cai sobre as ranhuras do normal map.)
3. **Decal do logo:** gerar `public/decals/jumpman-white.png` a partir de `jumpman.png`,
   recolorindo o RGB para `#FFFAF4` e **preservando o alpha** (via `sharp`, já disponível).
   Necessário porque o original é preto — não dá para tingir preto por multiplicação.

> O `jumpman.png` foi verificado: PNG RGBA, ~88% transparente, shape opaco — alpha correto
> para decal.

---

## 5. Material e color management

`Basketball.tsx`: `<sphereGeometry args={[1, 128, 128]}>` (subdivisão alta = silhueta limpa)
com `meshStandardMaterial`:
- `map` = albedo (**SRGBColorSpace**).
- `normalMap` = normal (**NoColorSpace/linear**), `normalScale` calibrado.
- `roughnessMap` = roughness (linear).
- `aoMap` = ao (linear). **Requer `uv2`**: duplicar o atributo `uv` da esfera em `uv2`,
  senão a oclusão não aparece.
- Jumpman via **`<Decal>` do drei** usando `jumpman-white.png` (`transparent`,
  `polygonOffset`), posicionado/rotacionado/escalado conforme a config.

Color management global do R3F ligado (default): texturas de cor em sRGB, resto linear,
tone mapping **ACES Filmic**.

---

## 6. Palco: iluminação, sombra, pós-processamento

`BasketballExperience.tsx` (`"use client"`):
- `<Canvas>` com `antialias`, câmera frontal como na foto, fundo claro de estúdio.
- **Iluminação:** drei `<Environment>` (HDRI de estúdio) para reflexos + uma luz de área
  suave frontal (key) + leve preenchimento — espelhando a luz difusa da foto.
- **Sombra:** drei `<ContactShadows>` sob a bola.
- **Pós-processamento** (`@react-three/postprocessing` `<EffectComposer>`): **GTAO** (sombra
  nas frestas do granulado/gomos), **Bloom** sutil (realces), **SMAA** (bordas limpas).
- **Controles:** `<OrbitControls>` `enableDamping` (inércia ao arrastar), `autoRotate`
  (giro ocioso), `enablePan={false}`, `min/maxDistance` (zoom limitado).

---

## 7. Tratamento de erros

- Carregamento de texturas/decal via `useTexture` → suspende; `<Suspense>` com fallback
  (padrão já existente na home) dentro do `CanvasErrorBoundary` (já existente).
- Config inválida → `Zod` `.parse()` falha no import, com erro explícito.
- Asset ausente (textura/decal não encontrado) → falha visível, nunca silenciosa.

---

## 8. Testes

Proporcional (site visual). Conforme a fundação:
- **`tsc --noEmit`** é o portão principal.
- **Teste unitário do schema** de config da bola (entrada válida/ inválida) no Vitest.
- **Validação visual** contra `jordan-ball.png` no `npm run dev` (sem teste de pixel).

---

## 9. Fora de escopo (YAGNI)

- Site/landing em volta da bola (seções, copy, scroll) — projeto futuro.
- Displacement real nos gomos — só entra no **polish**, se o normal map não convencer.
- Hook custom de inércia — `OrbitControls` já cobre; só se quisermos curva de retomada própria.
- WebGPU/TSL procedural — caminho descartado a favor de PBR/WebGL.

## 10. Nota legal

O logo **Jumpman** é marca registrada da Nike/Jordan. Uso aqui é **laboratório privado de
estudo**. Se o resultado for publicado, substituir por uma marca original.
