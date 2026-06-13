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

