# DEV-LOG — `Laboratório 3D (web/)`

> Memória de desenvolvimento deste projeto. Mantida automaticamente pela IA
> (regra no AGENTS.md). **Append-only** — novas entradas sempre no fim.
>
> | Campo | Valor |
> |-------|-------|
> | Projeto | Laboratório 3D — site premium do curso |
> | Referência visual | `a definir (etapa 0 do playbook)` |
> | Stack | Next.js 16 + React + TypeScript (estrito) + Three.js (R3F + drei) + GSAP + Zod |
> | Início | 2026-06-11 |

---

<!-- TEMPLATE DE ENTRADA (a IA copia este bloco a cada marco):

## AAAA-MM-DD — [título curto do marco]

**Pedido:** [intenção do usuário em 1-2 linhas]

**O que foi feito:** [abordagem, arquivos criados/alterados, bibliotecas]

**Decisões e porquês:** [por que esse caminho]

**Iterações:** [se houve tentativas, o que mudou — ou "primeira tentativa funcionou"]

**Prompt reutilizável:** [sim → ver PROMPTS.md#categoria | não]

-->

## Entradas

## 2026-06-11 — Fundação do laboratório montada

**Pedido:** Antes de construir o site, montar todo o contexto: tipagem forte em
TypeScript, stack 3D com Three.js, e um workflow de subagents (um de cada vez).

**O que foi feito:** Instalada a stack 3D híbrida (`three`, `@react-three/fiber`,
`@react-three/drei`, `@react-three/postprocessing`, `gsap`, `zod`, `leva`) + `vitest`.
Reforçado o `tsconfig` (modo estrito real: `noUncheckedIndexedAccess`,
`noImplicitOverride`, `exactOptionalPropertyTypes`). Criada a espinha de tipagem: schema
Zod do conteúdo (`src/schemas/`) com tipos inferidos via TDD, tipos puros da cena
(`src/types/`) e conteúdo validado em runtime (`src/content/`). Montada a cena 3D mínima
de prova (`src/three/`): cubo girando em R3F + globo wireframe em Three.js puro (escape
hatch), com Suspense e error boundary na home. Kit Memória de Dev mesclado às regras do
Next 16. Escrito o `docs/AGENT-PLAYBOOK.md`.

**Decisões e porquês:** R3F + Three.js puro (híbrido) para ter o idiomático e o motor por
baixo lado a lado (melhor material didático). Zod como fonte única de tipo+validação para
a tipagem nunca divergir do dado real. `@types/three` descartado: a doc oficial confirmou
que os tipos já vêm no pacote `three` (o pacote DefinitelyTyped foi descontinuado).

**Iterações:** processo via subagents (um por etapa) com revisão dupla (spec + qualidade)
nas tasks de código. A revisão de qualidade da cena 3D pegou um vazamento de geometria
intermediária (`IcosahedronGeometry` órfã sem `dispose()`), um `componentDidCatch` ausente
no error boundary e um `lang="en"` indevido num projeto pt-BR — os três corrigidos.

**Prompt reutilizável:** não (setup de fundação, não prompt de geração visual).

## 2026-06-11 — Bola Jordan 3D (build inicial)

**Pedido:** Construir uma bola de basquete Jordan 3D fotorrealista e interativa, com
texturas PBR geradas por código (albedo, normal, roughness), decal do Jumpman, palco de
estúdio com iluminação HDRI e pós-processamento.

**O que foi feito:** (1) Gerador procedural de texturas (`scripts/gen-textures.mjs`) usando
sharp — albedo com base `#56B4C3` + elephant print (Worley) + gomos `#FFFAF4`, normal com
granulado (fBm) + ranhuras dos gomos, roughness variável. (2) Script de recolor do decal
(`scripts/gen-decal.mjs`) — silhueta do Jumpman recolorida para `#FFFAF4` preservando
alpha. (3) Config tipada Zod (`src/schemas/basketball.schema.ts`) com testes TDD e conteúdo
validado em runtime (`src/content/basketball.ts`). (4) Hook de carregamento de texturas com
color space correto (`src/three/materials/basketballTextures.ts`). (5) Componente da bola
(`src/three/scene/Basketball.tsx`) — esfera 128-seg com material PBR + `<Decal>` do Jumpman
+ auto-giro. (6) Palco de estúdio (`src/three/scene/BasketballExperience.tsx`) — Canvas
R3F, `<Environment preset="studio">`, `<ContactShadows>`, `<OrbitControls>` com auto-rotate
e inércia, Bloom + SMAA via `<EffectComposer>`. (7) Home apontada para
`BasketballExperience`; cena-prova da fundação removida (Experience, RotatingBox,
wireframeGlobe).

**Decisões e porquês:** Texturas geradas proceduralmente em vez de download CC0+recolor
para controle total de alinhamento gomo↔normal e reprodutibilidade determinística. Sem
`aoMap` separado (oclusão assada diretamente no albedo) para evitar a pegadinha
`uv2`→`uv1` do three r151+. Pós-processamento: Bloom+SMAA (SSAO fica como polish futuro).
Non-null assertions (`!`) no hook de texturas porque drei garante carregamento dentro de
Suspense.

**Iterações:** `tsc --noEmit` pegou tipos `Texture | undefined` no retorno array do
`useTexture` do drei — corrigido com non-null assertions. Todos os 4 testes (content +
basketball schemas) passando.

**Prompt reutilizável:** sim — padrão "gerador procedural de texturas PBR com sharp" (ver
`scripts/gen-textures.mjs` como template).

## 2026-06-12 — Aprendizado-chave: documentação visual > texto para materiais

**Pedido:** Relato do autor sobre o processo da textura da bola: muitas iterações até o
couro esportivo ficar fiel à referência, e a pergunta — o aprendizado está sendo
preservado entre sessões ou reconstruído a cada vez?

**O que foi feito:** Criada a base de conhecimento `docs/MATERIAIS.md` (inteligência de
materiais): física do couro pebbled, anti-referências (erros recorrentes do gerador),
parâmetros validados e o Protocolo de Documentação Visual. Adicionada regra no
`AGENTS.md` tornando a leitura do MATERIAIS.md obrigatória em qualquer tarefa de
textura/material, e o registro de materiais validados automático.

**Decisões e porquês:** O maior custo do projeto não foi geometria, foi convergir a
textura — e esse custo se repetiria em todo material novo sem memória dedicada.
Arquivo markdown lido por regra (e não RAG/base vetorial) porque o corpus ainda é
pequeno; RAG é a Fase B do roadmap do curso e só se paga com mais volume.

**Iterações (o aprendizado em si):** (1) O gerador interpretava "couro granulado" como
escamas, pedras ou estrutura orgânica — corrigido com escala de célula menor, relevo
achatado e roughness alta variável. (2) Aumentar a quantidade de prompts de texto NÃO
melhorou o resultado. (3) O salto de qualidade veio de imagens de apoio técnicas:
vistas ortográficas, medidas/proporções, ampliações da superfície, estudos do material
e padrões geométricos — documentação visual estruturada como contexto. (4) Quanto mais
contexto visual sobre o material, melhor a fidelidade — para objetos dependentes de
superfície, referência visual vale mais que descrição.

**Prompt reutilizável:** não (marco de processo/conhecimento) — mas o Protocolo de
Documentação Visual do `docs/MATERIAIS.md` é o template a seguir em todo material novo.

## 2026-06-12 — Cesta clay (build inicial) — primeiro ciclo completo do START

**Pedido:** Criar a cesta de basquete 3D como teste do pipeline novo (START.md +
MATERIAIS.md + templates de documentação visual). Direção decidida no Portão 0:
estilizada total (clay), referência `public/reference/hoop.jpg`; alvo = objeto isolado
(cena bola+cesta no ciclo 2).

**O que foi feito:** Rota isolada `/cesta` (landing intocada). Config tipada Zod
(`hoop.schema.ts` + 3 testes TDD, incluindo refine de níveis descendentes da rede) e
conteúdo validado (`content/hoop.ts`, medidas em metros ancoradas em aro real ~Ø46cm).
**Rede procedural** (`primitives/hoopNet.ts`, Three puro conforme fronteira do projeto):
2 famílias × 8 fios CatmullRom descendo com meio passo angular por nível → treliça de
losangos extrudada como TubeGeometry e mesclada numa única BufferGeometry (intermediárias
descartadas com dispose; merge nulo lança erro — sem falha silenciosa). Cena R3F
(`Hoop.tsx`: torus do aro + RoundedBox de suporte/tabela + rede; material físico clay
único em 3 cores) e palco (`HoopExperience.tsx`: luz de estúdio suave, ContactShadows,
OrbitControls com damping/auto-rotate, câmera inicial em contra-plongée).

**Decisões e porquês:** Rede gerada por código (não asset) — simetria perfeita,
parametrizável via Zod e didática (mesmo princípio do gen-textures da bola). Folha
técnica do Nano Banana usada como apoio de ângulos; `hoop.jpg` canônica para proporção
(divergência da folha anotada e resolvida no Portão 0). Clay = sem texturas: fidelidade
vem de geometria + luz (Folha 2/texturas puladas conscientemente — protocolo na medida).

**Iterações:** primeira tentativa funcionou — tsc estrito limpo, 7/7 testes, render
visual correto no primeiro screenshot. Primeiro ciclo do laboratório sem retrabalho de
material/textura; o custo que na bola foi pago em iterações aqui foi pago em contexto
prévio (Portões 0 e 1).

**Prompt reutilizável:** sim — o prompt da Folha 1 preenchido para a cesta clay
(ver PROMPTS.md#design-system).

## 2026-06-13 — Ciclo 2: bola cai na cesta dirigida por scroll (+ 3 bugs caçados)

**Pedido:** A bola é heroína no topo e o scroll inteiro da página é a trajetória
dela caindo dentro da cesta no rodapé (clímax = fim da página). Mecânica: GSAP
ScrollTrigger com scrub (não física), como a landing wip.

**O que foi feito:** Rota isolada `/arremesso` (4 telas, canvas fixo). Cena unificada
`ShotExperience.tsx` com bola (Basketball reusada, escalada a 0.12 = tamanho real
vs aro em metros) + cesta (Hoop com `autoSpin={false}` e `netRef` exposto). Refator
de `Hoop` para aceitar `autoSpin` e `netRef`. Trajetória por **1 progresso scrubado
0→1** + array de waypoints `TRACK` interpolado com smoothstep (`sampleTrack`), e
pulso da rede como função de `p` (`netStretch`). Conhecimento consolidado em
`docs/ANIMACAO-3D.md` (leitura obrigatória via AGENTS.md).

**Decisões e porquês:** abandonei a timeline multi-tween em favor de 1 fonte de
verdade (progresso → waypoints) por robustez e clareza didática. Coreografia (scrub)
e não física: reversível com o scroll e sempre perfeita, alinhada à landing.

**Iterações (3 bugs reais — material de aula):**
1. **Refs em Suspense chegavam null** → a animação nunca rodava; a bola ficava em
   (0,0,0) e só o HTML de fundo rolava (ilusão de movimento). Correção: grupos
   controlados FORA do Suspense, suspendendo só a Basketball internamente.
2. **`keyframes` do GSAP com duration por quadro** rodava só o 1º trecho
   (`progress(1)` parava no keyframe 0).
3. **Tweens encadeadas na mesma propriedade** se anulavam (overwrite / posições em
   segundos vs frações). As 3 resolvidas pelo padrão de progresso único.
   Diagnóstico decisivo foi `apply(1)` direto + logs (o scrub no preview em
   background estrangula o rAF e dessincroniza o scroll — verificação enganosa).

**Prompt reutilizável:** não (marco de engenharia/animação) — padrão e armadilhas
ficam em `docs/ANIMACAO-3D.md`.

## 2026-06-13 — Correção: câmera panorâmica + projétil (cesta fixa no fim)

**Pedido:** Feedback do autor — os objetos pareciam parados e "rolando junto com a
página", e a cesta deveria ficar FIXA no fim da página, não junto da bola. Pediu
referência matemática/física.

**O que foi feito:** Reescrita do `ShotExperience` com o modelo "quadra vertical":
bola começa em y=0 (topo), cesta FIXA em y=-3.2 (fim do mundo). O scroll desce a
**câmera** (`camera.position.y`, via `useThree`) até enquadrar a cesta. Queda da
bola com **física de projétil** (`y ∝ p^1.8 ≈ ½gt²`). Removido `scroll-behavior:
smooth` do globals.css (conflitava com o scrub — causa do "tudo parado"), corrigido
`registerPlugin` (sem `useGSAP`), adicionados `invalidateOnRefresh` + `ScrollTrigger.refresh()`.

**Decisões e porquês:** câmera panorâmica (não mover a bola num canvas fixo) porque
casa com o modelo mental do autor — a cesta "mora" no fim e o scroll te leva até
ela. Física de projétil dá peso real à queda (aceleração constante).

**Iterações:** verificado nos 3 estados (topo: bola hero, sem cesta; meio: bola
caindo; fim: cesta enquadrada + bola na rede). O `scroll-behavior: smooth` era a
causa raiz do "objetos parados" relatado — registrado como Armadilha 4 no
`docs/ANIMACAO-3D.md`.

**Prompt reutilizável:** não — padrão "câmera panorâmica em quadra vertical" em
`docs/ANIMACAO-3D.md`.

## 2026-06-13 — Motion Spec: o plano de animação vira dado tipado

**Pedido:** Discussão com o autor sobre capacidade das IAs de interpretar movimento
por vídeo e qual arquitetura usar para o plano de animação. Decisão: extrair a
trajetória do código para um spec declarativo e tipado.

**O que foi feito:** Criados `schemas/motion.schema.ts` (keyframes `{p,x,y,z,scale,
ease}`, track escalar, evento de pulso, com refine p=0→1 crescente), `three/motion/
sampleMotion.ts` (easings nomeados incl. `gravityIn`=t²; `sampleTransform`/`sampleScalar`/
`samplePulse`) e `content/shotMotion.ts` (o plano do arremesso como dado, validado).
`ShotExperience` refatorado para apenas **executar** o spec via `sampleMotion`. 5 testes
novos do motion (12/12 no total). Templates: `prompt-vault/storyboard.md`; docs:
Briefing de Movimento no START, padrão Motion Spec + ponte ffmpeg no ANIMACAO-3D.md.

**Decisões e porquês:** animação é matemática (posição no tempo) → a IA raciocina
melhor sobre dado do que sobre pixels de vídeo. Vídeo não é input da IA de código;
serve ao humano + extração de frames (ffmpeg) → storyboard → spec. Spec tipado =
diff-ável, testável, reutilizável, RAG-ready. Refatoração preservou a animação
(fim idêntico; testes confirmam os valores amostrados).

**Iterações:** primeira tentativa — tsc limpo, 12/12 testes, swish final idêntico ao
de antes da refatoração.

**Prompt reutilizável:** sim — template de storyboard em `prompt-vault/storyboard.md`.

## 2026-06-13 — Landing do curso (vitrine 3D) + bola com 2 logos

**Pedido:** Transformar a landing (`/`) em vitrine do curso "Dev Coding Full IA",
usando a cena do arremesso como prova do método. Design system da referência
`Slam Dunk Store.html` adaptado: fundo branco, títulos Anton pretos, azul de acento
(a bola azul salta no branco). Depois: deixar a bola com só 2 logos Jumpman.

**O que foi feito:** Fluxo completo brainstorm → spec → plano → execução (specs/plans
em `docs/superpowers/`). Fontes Anton+Inter e tokens (ink/paper/brand-blue/cyan) +
`.text-outline`. Conteúdo do curso tipado/validado (hero, beats, metodo 5 passos, cta).
`ShotExperience` ganhou `trigger` parametrizado (default `"body"` preserva `/arremesso`).
Componentes `landing/{Hero,MethodSteps,CtaEmBreve}`. `page.tsx` em 2 atos: Ato 1 =
canvas `sticky` da cena com copy Anton por cima (camada puxada com `-mt-[100vh]`);
Ato 2 = método em 5 passos (cards, número ciano, espaço de imagem) + CTA "Em breve"
decorativo. Bola: removido o `<Decal>` frontal → ficam os 2 logos assados na textura.

**Decisões e porquês:** modelo "2 atos" (herói imersivo → conteúdo) em vez de 3D de
fundo eterno, pra manter o método legível. Fundo branco (não azul) decidido pelo
autor: a bola azul é o herói cromático. Remover o decal (em vez de regerar a textura)
é a mudança mínima pra chegar a 2 logos.

**Iterações:** primeira tentativa — tsc limpo, 12/12 testes. Verificação visual do
hero confirmada por screenshot + medição de DOM (o screenshot do preview reseta o
scroll na captura, então o Ato 2 foi conferido via DOM: 5 cards, 2 h2, 5 placeholders).
`/arremesso` e `/cesta` sem regressão.

**Prompt reutilizável:** não — a copy do curso vive em `content/home.ts`.

## 2026-06-16 — Seção de depoimentos (scroll reel) + correção do build

**Pedido:** Integrar o componente `ScrollReelTestimonials` como nova section logo após
a anterior; o `npm run dev` quebrava com "Error evaluating Node.js code" no `globals.css`.

**O que foi feito:** Causa-raiz do build error: `globals.css` fazia `@import 'tw-animate-css'`
mas o pacote não estava instalado (veio junto do snippet shadcn) — instalado `tw-animate-css`.
Adaptado `scroll-reel-testimonials.tsx` à tipagem estrita do projeto (`noUncheckedIndexedAccess`
+ `exactOptionalPropertyTypes`): `Featured` aceita `alt?: string | undefined`, `middleItems`
carrega o objeto do depoimento (em vez de re-indexar `testimonials[i]`) e guarda de lista
vazia em `current`. Removida a duplicata: a section `ato2` renderizava `DemoOne` (mesmo
componente em tela cheia) — apagada junto com `components/demo.tsx`; o depoimento agora é
só o `ato2` com título. Restaurados (do git) `metodo` e `cta` no `content.schema.ts` +
`home.ts`, que tinham sido reduzidos a só `hero` e quebravam `MethodSteps`/`CtaEmBreve`
(componentes órfãos). Asserção `!` no acesso provadamente seguro de `immersive-scroll-gallery`.

**Decisões e porquês:** instalar o pacote (em vez de remover o `@import`) seguiu a intenção
explícita do usuário, que colou as instruções de integração com tw-animate-css. Restaurar o
conteúdo por git (em vez de inventar copy) preservou o texto original do curso. `hero: "JORDAN"`
foi mantido intacto — só adicionei `metodo`/`cta`, sem tocar no herói Nike.

**Iterações:** primeira tentativa — `npx tsc --noEmit` limpo e `next build` ✓ (compilou,
TypeScript ok, 6 páginas geradas). Duplicata do DemoOne e erros pré-existentes (landing +
gallery) apontados ao usuário antes de mexer, conforme disciplina de escopo.

**Prompt reutilizável:** não — integração de componente pronto + correção de build.


## 2026-06-18 — Mural de retratos com scroll (ScrollPortraitWall) após a cesta

**Pedido:** Integrar o componente shadcn `ScrollPortraitWall` (mural de retratos que
crescem/somem no scroll, título fixo com `mix-blend-exclusion`) como nova section,
logo depois da seção da cesta (`#ato1`).

**O que foi feito:** Componente colado em `components/ui/scroll-portrait-wall.tsx`.
Pré-requisitos resolvidos sem instalar dependências novas: criado `src/lib/utils.ts`
com um `cn` enxuto (filter+join, sem `clsx`/`tailwind-merge`) — o projeto já segue esse
padrão minimalista (o `scroll-reel-testimonials` define `cn` inline). `gsap`/`@gsap/react`
já estavam instalados. Adicionado o token `--color-muted-foreground` (→ `on-surface-variant`)
no `@theme` do `globals.css`: o componente usa `text-muted-foreground` no hint/legendas, e
esse token não existia (o projeto só tinha `muted`). Ajuste único no código colado: guard
em `speakers[idx]` (`const s = idx === -1 ? undefined : speakers[idx]; if (!s) ...`) para
passar no `noUncheckedIndexedAccess`. Section adicionada no `page.tsx` após `#ato1` com
título "O Time", hint PT-BR e `showCaptions={false}` (evita exibir os nomes-placeholder
do demo).

**Decisões e porquês:** `cn` leve em vez de instalar `clsx`+`tailwind-merge` — coerente com
o padrão do projeto e sem inflar dependências; os usos atuais (base + `className`) não exigem
resolução de conflito Tailwind. `muted-foreground` mapeado ao mesmo `on-surface-variant` do
alias `muted`, então fica consistente com o resto do design system. `showCaptions={false}`:
os `speakers` ainda são o set de demo (imagens reais da CDN), então esconder as legendas
evita nomes em inglês placeholder — basta trocar `speakers` por gente real depois.

**Iterações:** primeira tentativa — `npx tsc --noEmit` limpo (exit 0).

**Prompt reutilizável:** não — integração de componente shadcn pronto.

## 2026-06-18 — Mural de retratos vira arquivo Air Jordan (imagens + copy da marca)

**Pedido:** Trocar as imagens de demo do `ScrollPortraitWall` por 6 fotos locais de tênis
Air Jordan e ajustar a copy para a marca do site — sem mexer no código do componente.

**O que foi feito:** Alteração contida só no `page.tsx`: criado o array `arquivoJordan: Speaker[]`
apontando para as 6 imagens em `public/images/` (4 da `gallery/`, 2 na raiz de `images/`) e
passado via prop `speakers`. Copy trocada para a marca: título "LEGADO", hint "role pelo
arquivo Jumpman", date "Air Jordan · Arquivo". `name` de cada par serve de `alt` (acessibilidade);
as duas fotos identificáveis ganharam nome real (Air Jordan VI Infrared 1991, Air Jordan IV
Fire Red), o resto ficou como "Par Air Jordan" para não inventar modelo/colorway. Componente
`scroll-portrait-wall.tsx` não foi tocado.

**Decisões e porquês:** passar `speakers` por prop (em vez de editar `DEMO_SPEAKERS` no
componente) respeitou o pedido de "não bagunçar o código" e mantém o componente reusável.
`showCaptions` continua `false` — uma das imagens (VI) já tem texto "queimado" na arte, então
legendas extras poluiriam. Observação registrada: o componente aplica `grayscale contrast-[1.15]`,
então os vermelhos/infrared icônicos renderizam em P&B (estética original do componente).

**Iterações:** primeira tentativa — `npx tsc --noEmit` limpo (exit 0).

**Prompt reutilizável:** não — troca de assets + copy.

## 2026-06-18 — Mural Jumpman: imagens locais Air Jordan + copy da marca

**Pedido:** Trocar as imagens demo (avatares da CDN) do ScrollPortraitWall pelas 6 fotos
locais de tênis Air Jordan e mudar a copy para a marca do site. Cuidado para não bagunçar o
código — só substituir.

**O que foi feito:** Sem tocar no componente — só na página. Criado o array `arquivoJordan:
Speaker[]` em `page.tsx` com as 6 imagens locais (4 de `public/images/gallery/media__*.jpg` +
2 com nome-hash em `public/images/`), passado via prop `speakers`. As imagens são tênis Air
Jordan (verificadas: VI Black/Infrared e IV Fire Red), não pessoas — por isso `showCaptions`
seguiu `false`. Copy trocada de "time/speakers" para a marca: título `LEGADO`, hint `role pelo
arquivo Jumpman`, date `Air Jordan · Arquivo`. Comentário da section atualizado (não fala mais
em "gente real").

**Decisões e porquês:** passar `speakers` por prop (em vez de editar `DEMO_SPEAKERS` no
componente) manteve o componente reutilizável e atendeu ao "não bagunçar o código". `name` de
cada item serve de `alt` (acessibilidade) — só os 2 modelos confirmados visualmente levam nome
específico; os outros ficam como "Par Air Jordan" para não inventar modelo. Copy alinhada ao
universo Jordan/atlético, ecoando o "DNA Archive" que aparece numa das próprias fotos.

**Iterações:** primeira tentativa — `npx tsc --noEmit` limpo (exit 0).

**Prompt reutilizável:** não — troca de assets + copy.

## 2026-06-18 — Section "Arquivo flip" (FlipCard) — trio Air Jordan IV

**Pedido:** Adicionar, depois da section "LEGADO", uma nova section com o componente
shadcn `FlipCard` (cartas que viram no hover revelando o verso).

**O que foi feito:** `flip-card.tsx` colado em `components/ui/`. Criada a section
`components/landing/ArquivoFlip.tsx` (3 cartas: os colorways Fire Red / Toro Bravo /
Orange do Air Jordan IV — frente é a foto local, verso é uma ficha "DNA Archive" nos
tokens do design system: `bg-brand-blue`, `font-anton`, `text-label-caps`, `shadow-hard`).
Plugada no `page.tsx` após o `ScrollPortraitWall`. `flipDirection` alterna horizontal/
vertical entre cartas. Deps: reusei `framer-motion` (já instalado) no lugar de instalar
`motion` — mesma lib, evita duplicata no bundle; NÃO instalei `@radix-ui/react-slot`/
`class-variance-authority` nem copiei o `Button` shadcn, pois o `flip-card` não depende
dele (só o demo importava). Zero deps novas.

**Decisões e porquês:** trio do mesmo modelo (AJ IV) dá coesão visual; frente=foto limpa,
verso=ficha, ecoando o layout "DNA Archive" presente nas próprias imagens. Ajustes de
tipagem para o modo estrito (não são bugs do componente): `FlipCardContextValue.disabled`
ganhou `| undefined` explícito; nos `motion.div`, o `style` foi extraído da desestruturação
(para não voltar via `{...props}` como `MotionStyle | undefined`) e o objeto mesclado é
castado para `NonNullable<HTMLMotionProps<'div'>['style']>` — tudo por causa do
`exactOptionalPropertyTypes`.

**Iterações:** três rodadas de `tsc` até zerar — todas no atrito conhecido do
`exactOptionalPropertyTypes` com spreads de `style` e props opcionais; resolvido extraindo
`style` + cast NonNullable. Build de tipos limpo ao fim (exit 0).

**Prompt reutilizável:** não — integração de componente shadcn + adaptação à marca.

## 2026-06-18 — Loading spinner: bola girando como placeholder da cena 3D

**Pedido:** Usar o componente "snow ball loading spinner" como placeholder do site.

**O que foi feito:** Componente colado em `components/ui/snow-ball-loading-spinner.tsx`
(CSS-puro, sem props; adicionados `role="status"` + `aria-label`). O snippet de origem
trouxe APENAS os `@keyframes` — as classes `.pl*` (toda a aparência: pista, anéis, bola,
sombras) faltavam, então foram RECONSTRUÍDAS em `globals.css`: pista em `surface-container-high`,
bola esférica em Skybolt Blue (degradê `primary-container → skybolt → primary`) p/ casar com a
bola 3D do herói, sheen correndo na superfície (`ballTexture`), volume via inner/outer-shadow
contra-rotacionados, e um brilho percorrendo a pista (`trackCover`, recortado na faixa do anel
por máscara radial). Incluído fallback `prefers-reduced-motion`. Plugado como o `loading:` do
`dynamic()` em `ShotScene.tsx`, substituindo o texto "Carregando…" — a bola 2D gira enquanto a
cena 3D carrega (escolha do usuário: placement "Cena 3D").

**Decisões e porquês:** reconstruir o CSS (em vez de só colar os keyframes) era obrigatório —
sem as classes `.pl*` o spinner renderiza vazio. Bola em Skybolt Blue, não laranja, p/ coerência
com o herói. Placement na cena 3D (confirmado via pergunta) porque é o único/maior carregamento
visível da home; `app/loading.tsx` global ficou de fora a pedido.

**Iterações:** primeira tentativa — `npx tsc --noEmit` limpo (exit 0). Aparência reconstruída
de memória a partir da estrutura de classes; sujeita a ajuste fino visual.

**Prompt reutilizável:** não — integração de componente CSS-puro (com reconstrução de estilos).

## 2026-06-18 — Section de fechamento: painéis sticky empilhados (sem Lenis)

**Pedido:** Adicionar, depois da última section (ArquivoFlip), o componente "smooth-scroll"
(ReactLenis + 3 painéis empilhados), com copy da marca.

**O que foi feito:** Criada `components/landing/FechamentoScroll.tsx` — 3 painéis `sticky top-0`
h-screen que empilham no scroll (CSS puro), com a grade técnica + máscara radial do componente
de origem e copy da marca em 3 tempos: "Tudo que você rolou até aqui" → "foi construído com IA
— do zero ao nível premium" → "isso é o DEV CODING FULL IA · em breve 🏀". Tokens do design
system (bg-ink, bg-surface-container, text-brand-blue, font-anton). Plugada no `page.tsx` após
`ArquivoFlip`.

**Decisões e porquês:** NÃO instalei `lenis` nem montei `<ReactLenis root>`. Motivo técnico
forte: o `root` instala smooth-scroll global, que conflita com o `ScrollTrigger` + scrub que
move a bola 3D do herói — exatamente a Armadilha 4 do docs/ANIMACAO-3D.md. O efeito que importa
(empilhar painéis) é `position: sticky` puro e não precisa do Lenis. Copy escolhida para
reenquadrar toda a página (bola 3D, galeria, flip cards) como prova do que o curso entrega —
fechamento que conduz ao "em breve". Zero deps novas.

**Iterações:** primeira tentativa — `npx tsc --noEmit` limpo (exit 0).

**Prompt reutilizável:** não — integração adaptada (efeito visual sem a lib de smooth-scroll
por conflito documentado).

## 2026-06-18 — Section parallax de camadas (Osmo) — título "denisin.dev"

**Pedido:** Adicionar, após a última section (FechamentoScroll), o componente parallax
(GSAP + Lenis, camadas Osmo), trocando só o texto "Parallax" por "denisin.dev".

**O que foi feito:** Criado `components/ui/parallax-scrolling.tsx` com o efeito parallax via
GSAP ScrollTrigger (scrub), título "denisin.dev". CSS `.parallax*` RECONSTRUÍDO no globals.css
(não veio no snippet): camadas absolutas ancoradas no rodapé, deslocadas em yPercent pelo GSAP;
título centralizado em font-anton; fade + faixa de corte no rodapé; ícone Osmo em Skybolt Blue.
Plugado no `page.tsx` após `FechamentoScroll`.

**Decisões e porquês (segurança > cópia literal):** o snippet original tinha DOIS perigos para
este projeto: (1) `new Lenis()` = smooth-scroll global, que conflita com o scrub do herói 3D
(Armadilha 4 do docs/ANIMACAO-3D.md); (2) cleanup com `ScrollTrigger.getAll().forEach(kill)`,
que mataria TODOS os ScrollTriggers da página — inclusive o da bola do herói (agravado pelo
mount/unmount duplo do StrictMode no dev). Solução: removido o Lenis (o parallax roda com
scroll nativo + GSAP, que o projeto já suporta) e o efeito migrado para `useGSAP` com `scope`,
cujo cleanup reverte só os tweens deste componente. Mantidas as imagens-camada do Osmo (arte
em camadas que cria a profundidade; fotos da marca quebrariam o efeito). Zero deps novas
(gsap + @gsap/react já instalados; `@studio-freight/lenis` — nome deprecado — não instalado).

**Iterações:** primeira tentativa — `npx tsc --noEmit` limpo (exit 0). CSS reconstruído de
memória; alinhamento fino das camadas sujeito a ajuste visual.

**Prompt reutilizável:** não — integração adaptada (efeito preservado, libs perigosas removidas).

## 2026-06-18 — Fix: parallax "bagunçado" era cache do Turbopack (CSS não recompilava)

**Pedido:** Parallax renderizava com as camadas empilhadas em vez de sobrepostas num quadro.

**O que foi feito:** Diagnóstico por verificação (não por chute): (1) home dava 500 só
transitoriamente durante recompile; após restart respondeu 200; (2) inspecionei o CSS
compilado servido pelo dev e confirmei que, com cache limpo, ele PASSA a conter as regras
.parallax* corretas. Causa raiz: cache do Turbopack não recompilava o globals.css editado —
o browser servia CSS antigo SEM as classes .parallax*, então as <img> caíam no fluxo (tamanho
do atributo width=800) e empilhavam. Mesmo tipo de bug do tw-animate-css que abriu a sessão.
Correção: kill do dev server travado + `Remove-Item .next` + restart limpo. Verificado: a regra
servida é `.parallax__layer-img { position:absolute; inset:0; width/height:100%; object-fit:cover }`.

**Decisões e porquês:** o CSS reconstruído já estava correto (o usuário inclusive corrigiu um
bug real meu: `left:50% + translateX(-50%)` é sobrescrito pelo transform do GSAP — trocado por
`inset:0`). O problema restante era puramente de cache; por isso a solução foi limpar `.next`,
não reescrever CSS. Verificação via curl no CSS compilado em vez de só confiar no arquivo-fonte.

**Iterações:** 1ª tentativa visual falhou (cache); resolvido limpando o cache e validando o CSS
servido. Sem screenshot automatizado (projeto não tem Playwright) — validação por inspeção do
CSS compilado + status HTTP 200.

**Prompt reutilizável:** não — depuração de cache de build.

## 2026-06-18 — Smooth-scroll global (Lenis) integrado ao ScrollTrigger

**Pedido:** Ter a rolagem suave (inércia) do demo Osmo no site inteiro, sem quebrar o
scrub da bola 3D do herói.

**O que foi feito:** Instalado `lenis@1.3.23` (pacote atual; não o `@studio-freight/lenis`
deprecado). Criado `components/SmoothScrollProvider.tsx` (client) usando `<ReactLenis root
options={{ autoRaf: false }}>`: o RAF do Lenis é dirigido pelo `gsap.ticker` (fonte de tempo
única), `lenis.on('scroll', ScrollTrigger.update)` mantém todos os scrubs em sincronia, e
`gsap.ticker.lagSmoothing(0)`. Provider envolve Navbar + children no `layout.tsx`. Importado
o CSS do Lenis no globals (`@import 'lenis/dist/lenis.css'`) — necessário para `html.lenis
body { height: auto }` (medição de scroll) e prevenção de scroll aninhado.

**Decisões e porquês:** esta é a forma OFICIAL de combinar Lenis + ScrollTrigger e NÃO recai
na Armadilha 4 (que é sobre `scroll-behavior: smooth` do CSS, não sobre o Lenis). Lenis v1 usa
o scroll nativo da janela (não translada conteúdo), então `position: sticky` e `window.scrollY`
do herói continuam válidos; o scrub do herói agora é alimentado por `ScrollTrigger.update` a
cada frame de scroll suavizado. Instância ÚNICA e global (no layout) — corrige o erro do
componente colado, que criava Lenis dentro de uma section.

**Iterações:** (1) provider + layout, tsc limpo; (2) descobri via inspeção do CSS servido que
o CSS do Lenis não estava incluído (ReactLenis não injeta) → importado no globals; reverificado:
5 ocorrências de 'lenis' no CSS compilado. Servidor 200, sem erros, #ato1 e parallax presentes.
Validação visual do tato + scrub do herói depende do usuário (projeto sem Playwright).

**Prompt reutilizável:** não — integração de infraestrutura (smooth-scroll global).

## 2026-06-20 — Loader "gooey" de 3 bolinhas (CSS puro + filtro SVG goo)

**Pedido:** Integrar um snippet de 3-dots-loader (metaball), entender a lógica da animação
e montá-lo depois da última section da home. (Mesma sessão: remoção da logo `denisin (3).png`
da section `.parallax__content`.)

**O que foi feito:** Criado `components/ui/3-dots-loader.tsx` (`ThreeDotsLoader`) — server
component, sem hooks. O snippet de origem só trazia os `@keyframes` (o movimento) e React
inválido (`class`, `useState` ocioso); reconstruí as classes-base que faltavam no
`globals.css`: `.dots-loader` (container centralizado por `translate(-50%,-50%)` + `filter:
url(#goo)` + `rotate-move`), `.dots-loader__dot` (3 dots sobrepostos em top/left 0) e os 3
modificadores amarrando cada `dot-N-move` + `index` (z-index defasado por delays negativos).
Cores via tokens da marca (`--skybolt`, `--tertiary-container`, `--error`). Filtro `#goo`
(feGaussianBlur + feColorMatrix alpha `21 -7`) inline no componente. Montado em `page.tsx`
como SEÇÃO 6, após `<ParallaxComponent />`.

**Decisões e porquês:** CSS no `globals.css` com classes nomeadas seguindo o padrão do projeto
(parallax, scroll-reel), em vez de utilitários Tailwind soltos. Classes namespaced
(`dots-loader*`) em vez do `.container`/`.dot` genéricos do snippet, p/ evitar colisão global.
Cores dos tokens em vez do vermelho/azul/amarelo cru, p/ casar com a identidade. Acessibilidade:
`role="status"` + texto `sr-only`, visual `aria-hidden`, e `prefers-reduced-motion` para o blob
estático. Sem `'use client'`: a animação é 100% declarativa.

**Iterações:** primeira tentativa funcionou; `npx tsc --noEmit` limpo. Validação visual do
movimento depende do usuário (projeto sem Playwright).

**Prompt reutilizável:** não — integração de snippet pronto.

## 2026-06-20 — Preloader da home (barra de progresso) + recorrência do cache Turbopack

**Pedido:** Usar um loader de barra de progresso como placeholder da página de início.

**O que foi feito:** Integração em 3 partes: (1) `components/ui/loader-progressive-bar.tsx`
(visual puro) — removido o `<style jsx>` do snippet (quebra em Server Component / foge da
convenção) e os `@keyframes` movidos para o globals.css, renomeados loading/blink →
`loaderbar-fill`/`loaderbar-blink` p/ evitar colisão; o componente referencia via utilitários
arbitrários `animate-[loaderbar-fill_4s_ease-out_infinite]`. (2) `components/Preloader.tsx`
('use client') — overlay fixo `z-[9999]` sobre a home que renderiza a barra e some no evento
`load` da página, com tempo MÍNIMO visível (1400ms) e fade-out (600ms) via `onTransitionEnd`.
(3) Montado como 1º filho do `<main>` em `page.tsx`. Removido antes o `<ThreeDotsLoader />`
(seção do loader goo) a pedido — componente e CSS dele ficaram órfãos (aguardando confirmação
p/ apagar).

**Decisões e porquês:** preloader em vez de `loading.tsx` porque o gargalo da home é a cena
3D que carrega no cliente (pós-hydration), fora do alcance do Suspense de rota; o overlay
client cobre desde o SSR (estado inicial visível) até o `load`. Tempo mínimo visível evita o
loader "piscar e sumir" em cache. Keyframes no globals (não styled-jsx) seguindo a convenção.

**Iterações:** (1) código + tsc limpo; HTML servido já trazia o overlay. (2) Verificação por
inspeção do CSS compilado revelou os `@keyframes loaderbar-*` AUSENTES no chunk servido (mesmo
hash) — recorrência do bug de cache parcial do Turbopack (utilities recompilam, @keyframes crus
do globals.css não). Correção documentada: Stop-Process do dev (PID), `Remove-Item .next`,
restart limpo. Reverificado: keyframes presentes, overlay presente, HTTP 200.

**Prompt reutilizável:** não — integração de snippet pronto.

## 2026-06-21 — Seção Spline + reveal de marca + rodapé com crachá 3D (Lanyard)

**Pedido:** Adicionar, após a última section, uma cena Spline (iframe); depois texto de
marca surgindo letra por letra ao lado do objeto; e um rodapé com autoria (Denilson
Rodrigues + Instagram/GitHub com ícones oficiais) e o crachá 3D `<Lanyard />` (React Bits)
com a foto do autor na frente.

**O que foi feito:**
- `SplineEmbed.tsx` — iframe do Spline com montagem preguiçosa (IntersectionObserver) e
  `pointer-events-none` (não captura o scroll). Seção em grid 2 colunas (texto | objeto).
- `BrandReveal.tsx` — revela texto letra por letra via GSAP (stagger 0.07s, duration 0.6s,
  ease power2.out) disparado por ScrollTrigger (`top 80%`). Cada char num `<span>`.
- `Lanyard.tsx` — crachá pendulante (R3F + Rapier + meshline), adaptado de Vite→Next.js:
  assets de `/public/lanyard/` por URL (não import de módulo), TS estrito (refs
  `RapierRigidBody`, "lerped" via `WeakMap`, material do cordão via `<primitive>`).
- `AuthorFooter.tsx` — `next/dynamic` (ssr:false) + lazy-mount do Canvas; nome + links com
  SVGs oficiais (Simple Icons) de Instagram/GitHub.
- Deps novas: `meshline`, `@react-three/rapier`. Assets baixados do repo react-bits.

**Decisões e porquês:**
- **Lazy-mount de toda cena WebGL extra** (Spline e Lanyard): a página já tem o herói R3F;
  3 contextos WebGL simultâneos no load disputam GPU e podem derrubar o contexto do herói
  (sintoma: "site some"). Montar só ao entrar na tela evita a disputa.
- **iframe com `pointer-events-none`**: iframe é documento isolado e engolia o wheel/scroll
  (travava na última seção). Sem pointer-events, o scroll atravessa.
- **Grid 2 colunas** em vez de adivinhar a posição do objeto na cena Spline: texto e objeto
  em colunas irmãs → zero sobreposição por construção.
- **Material do cordão via `<primitive>`** (memoizado): `MeshLineMaterial` exige `resolution`
  no construtor; passar via JSX `args` reconstruiria o material a cada frame.

**Iterações:** (1) `-z-10` original escondia o Spline atrás do `bg-paper` → `z-0`. (2) bg
preto pedido. (3) "site sumiu" → diagnóstico de contexto WebGL → lazy-mount. (4) "travando"
→ `pointer-events-none`. (5) TS estrito: refs `|null` do React 19 nos joints (cast),
`args` obrigatório no meshLineMaterial (→ primitive), regra `react-hooks/immutability` do
Next 16 (curveType no inicializador do useState; wrap da textura no `onLoad` do useTexture).
tsc + eslint = 0; assets e página servindo 200.

**Prompt reutilizável:** não — integração de componente pronto (React Bits).
