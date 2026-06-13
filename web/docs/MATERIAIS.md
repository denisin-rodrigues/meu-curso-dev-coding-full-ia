# MATERIAIS.md — Inteligência de Materiais do Laboratório

> Base de conhecimento sobre materiais físicos e como reproduzi-los em 3D/texturas.
> **Toda sessão que for gerar ou refinar material/textura DEVE ler este arquivo antes**
> (regra no AGENTS.md). Após validar um material novo com o usuário, registre o
> aprendizado aqui. **Append-only por material** — refine a entrada do material, mas
> nunca apague aprendizados validados.

---

## 📐 Protocolo de Documentação Visual (meta-aprendizado, vale para TODO material)

Validado no Projeto 01 (bola Jordan): para objetos que dependem de **detalhe de
superfície**, referência visual estruturada supera descrição textual. Aumentar a
quantidade de prompts de texto **não** melhora o resultado; documentação visual sim.

Antes de gerar textura de um material novo, produza/peça **imagens de apoio**:

1. **Vistas ortográficas** do objeto (frente, lado, topo)
2. **Medidas e proporções** (tamanho real do objeto e dos detalhes)
3. **Ampliações da superfície** (close-up do grão/relevo em escala conhecida)
4. **Estudo do material** (como ele reage à luz: brilho, fosco, specular)
5. **Padrões visuais/geométricos** (repetição, direção, irregularidade do padrão)

Essas imagens funcionam como "DESIGN.md visual" do material e devem ficar em
`public/reference/` do projeto.

**Como gerar as folhas:** use os templates mestres do
`../../prompt-vault/documentacao-visual.md` (Folha 1 = forma/ângulos, Folha 2 =
material/superfície) — inclui a regra "imagem mostra, texto mede" (nunca pedir
números na imagem; medidas reais ficam aqui no markdown) e o checklist de
aceitação da folha gerada.

### Checklist de prompt para material novo

Ao pedir geração de textura, sempre especificar:
- [ ] **Física da superfície:** rugosidade (faixa de roughness), specular, dureza
- [ ] **Escala dos detalhes em unidades reais** (ex: "grão de 1–2 mm numa bola de 24 cm")
- [ ] **O que o material NÃO é** (anti-referências — ver erros comuns por material)
- [ ] **Imagens de apoio anexadas** (protocolo acima)

---

## Couro esportivo granulado (pebbled leather) — bola de basquete

**Status:** ✅ validado no Projeto 01 (bola Jordan, 2026-06)
**Onde está o código:** `scripts/gen-textures.mjs` (albedo/normal/roughness procedurais)

### Física do material
- Couro com **grão arredondado fino** (pebble), relevo baixo e denso
- Grãos de ~1–2 mm num objeto de ~24 cm de diâmetro — **a escala relativa é crítica**
- Semi-fosco: roughness alta e **variável** (não uniforme), specular discreto
- Gomos separados por ranhuras (channels) mais escuras e mais lisas que o grão

### ⚠️ Erros comuns do gerador (anti-referências)
O sistema tende a interpretar "couro granulado" como:
- **Escamas** (réptil) — quando as células do ruído Worley/Voronoi ficam grandes
  demais ou com contraste alto demais
- **Pedras/cascalho** — quando o relevo (normal) fica profundo demais
- **Estruturas orgânicas** — quando o padrão ganha direção/fluxo (couro pebble é
  isotrópico: sem direção preferencial)
- **Material sintético/plástico** — quando a roughness fica uniforme e baixa

**Correção que funcionou:** reduzir a escala das células do padrão, achatar o relevo,
manter roughness alta com variação sutil, e ancorar tudo com imagens de ampliação da
superfície real (protocolo visual acima).

### Parâmetros validados (Projeto 01)
- Albedo: base de cor + elephant print via **Worley** + gomos em cor de contraste
- Normal: granulado via **fBm** + ranhuras dos gomos; relevo baixo
- Roughness: alta, com variação por região (grão vs. ranhura)
- Oclusão **assada no albedo** (sem aoMap separado — evita pegadinha uv2→uv1 do three r151+)

---

## Clay / soft-touch (estilizado) — cesta de basquete

**Status:** ✅ validado no ciclo da cesta (2026-06-12, aprovação do autor)
**Onde está o código:** `src/three/scene/Hoop.tsx` (meshPhysicalMaterial) + `src/content/hoop.ts`

### Física do material
- Plástico macio/argila de brinquedo: fosco aveludado com brilho sutil de superfície
- **Zero textura** — nenhum mapa de imagem; a materialidade vem inteira de
  3 parâmetros + luz suave (contraexemplo perfeito do couro da bola)
- Formas sempre arredondadas e "fofas": cantos generosos, tubos grossos, nada anguloso

### ⚠️ Erros comuns (anti-referências)
- **Plástico duro/brilhante** — roughness baixa demais lê como brinquedo barato injetado
- **Borracha morta** — roughness 1.0 sem clearcoat perde a vida do render de ícone 3D
- **Luz dura** — sombras duras quebram o aconchego; clay vive de luz macia multidirecional

### Parâmetros validados (ciclo da cesta)
- `meshPhysicalMaterial`: `roughness 0.5` · `clearcoat 0.15` · `metalness 0`
- Luz: ambient forte (0.85) + 3 direcionais suaves sem sombra dura + ContactShadows leve
- Paleta do ciclo: vermelho `#E8432E` · branco `#F4F2EE` · cinza-claro `#D9DDE3`
- Geometria carrega o estilo: torus de tubo grosso, RoundedBox de raio generoso,
  rede = tubos lisos sem nós (treliça procedural, `primitives/hoopNet.ts`)

## Materiais a estudar (próximos)

| Material | Status | Projeto |
|----------|--------|---------|
| Couro esportivo (pebbled) | ✅ Validado | Projeto 01 — bola Jordan |
| Clay / soft-touch | ✅ Validado | Ciclo da cesta (estilizada) |
| Borracha (sola/quadra) | ⬜ | — |
| Tecido/mesh esportivo | ⬜ | — |
| Metal (aro da cesta) | ⬜ | adiado — direção do ciclo virou clay |
| Nylon (rede da cesta) | ⬜ | adiado — direção do ciclo virou clay |
| Madeira (quadra) | ⬜ | — |
| Pele humana | ⬜ | — |

> Ao validar cada um, criar a seção do material neste arquivo com: física, erros
> comuns observados, correções que funcionaram e parâmetros finais.
