---
name: vibecoding-3d
description: >-
  Método validado para criar objetos e cenas 3D premium na web (Three.js /
  React Three Fiber + GSAP com animação por scroll) — landing pages com herói
  3D, produto 3D interativo, animação de objeto dirigida por scroll, objetos
  estilizados ou realistas. Codifica um processo com portões (referência →
  contexto técnico → prompt → build → polish) E as armadilhas já depuradas de
  material, animação de scroll e config tipada, pra que cada projeto novo comece
  no nível em que o último terminou. Use SEMPRE que o pedido envolver criar/animar
  objeto 3D, cena 3D, landing com 3D, "bola/produto 3D", animação no scroll, ou
  mencionar Three.js, R3F, drei, GSAP, ScrollTrigger — mesmo que o usuário não
  diga "premium" nem peça o método explicitamente.
---

# VibeCoding 3D — método para 3D premium na web

Este é um método destilado de projetos reais. O seu valor não é "saber Three.js" —
é a **sequência com portões** e as **armadilhas já pagas** (material, scroll, refs).
Seguir isso faz o resultado ficar premium sem repetir erros caros.

Idioma do material gerado: **português do Brasil**.

## Por que portões (leia antes de pular etapas)

Quanto mais caro é errar numa etapa, mais barato é um portão antes dela. Em 3D, o
custo não está na geometria — está em **material/textura** e em **animação de
scroll**. Por isso o método trava nesses dois pontos até o contexto estar certo.
Tipos verdes e build limpo **não** significam "correto": só a verificação visual
real prova. Trate isso como verdade operacional.

## O START — 5 etapas

Quando o usuário pedir um objeto/cena 3D novo, conduza nesta ordem. Não escreva
código antes do Portão 1 (plano aprovado).

### Etapa 0 — Referência
- Conseguir a(s) imagem/vídeo do alvo (salvar em `reference/<objeto>/` do projeto).
- Perguntar: o que torna esse objeto impressionante? (3–5 pontos)
- **Portão 0:** sem referência salva, não avance. Peça-a.

### Etapa 1 — Contexto técnico (o "brainstorming" obrigatório)
- **Arquitetura:** geometria (primitiva/lathe/modelada/procedural), **escala real
  em unidades físicas** (cm/mm — crítico), materiais envolvidos (liste TODOS),
  interação (orbit/drag/scroll/física), R3F idiomático vs Three puro.
- **Materiais:** para cada material, consultar `references/materiais.md` — reusar
  se já validado; se novo, seguir o **Protocolo de Documentação Visual** ANTES de
  gerar textura (ver `references/documentacao-visual.md`).
- **Movimento** (se houver animação): definir o plano como **Motion Spec tipado**,
  não lógica solta — ver `references/animacao-3d.md`.
- **Portão 1:** plano apresentado e aprovado pelo usuário. Nenhum código antes do "sim".

### Etapa 2 — Prompt estruturado
- Formato: **contexto + referência visual + regras técnicas + output esperado**.
- Escala dos detalhes em unidades reais (ex: "grão 1–2 mm em bola de 24 cm").
- Incluir **anti-referências** (o que o objeto/material NÃO é).

### Etapa 3 — Build iterativo
- Ordem: geometria → material/textura → iluminação → interação/animação.
- Uma variável por iteração; comparar com a referência a cada passo.
- Portão técnico: typecheck e testes passando a cada marco.
- Travou (2 diagnósticos de causa-raiz errados)? Pare e reavalie do zero — contexto
  poluído se resolve com reset, não com mais tentativas.
- **Portão 3:** lado a lado com a referência, o usuário valida "é esse o objeto".

### Etapa 4 — Polish + consolidação
- Motion premium (easings, nunca `linear`; durações consistentes; inércia), luz,
  pós-processamento.
- Respeitar `prefers-reduced-motion`.
- **Portão 4 (definition of done):** o objeto só está pronto quando o **conhecimento**
  está consolidado (ver `references/memoria-e-aprendizado.md`): marco registrado,
  prompts vencedores salvos, material novo promovido para `references/materiais.md`.
  Objeto no ar com memória vazia = processo falhou (funcionou, mas não é replicável).

## Tipagem forte (obrigatória)

- Proibido `any`; use `unknown` + narrowing. Dado externo (conteúdo, config) passa
  por **Zod** antes do uso; o tipo deriva do schema (`z.infer`).
- Tudo que é "plano" vira **dado validado**, não lógica embutida: config do objeto,
  config da cena, e o Motion Spec da animação. Diff-ável, testável, reutilizável.
- Fronteira clara: R3F idiomático (componentes de cena) separado de Three puro
  (escape hatches: shaders, controles). Não misture no mesmo arquivo.

## Inteligência de Materiais

Antes de gerar/alterar textura ou material, leia `references/materiais.md`: física,
anti-referências (erros recorrentes do gerador) e parâmetros validados por material.
Para objetos dependentes de superfície, **documentação visual estruturada supera
descrição textual** — não tente resolver com mais prompts de texto.

## Inteligência de Animação

Antes de criar/alterar animação de cena (GSAP, ScrollTrigger, trajetórias), leia
`references/animacao-3d.md`: o padrão "Motion Spec (plano como dado)", o modelo
"câmera panorâmica em quadra vertical" para scroll storytelling, e quatro armadilhas
já depuradas (refs em Suspense chegam null; `keyframes` do GSAP com duration por
quadro; tweens encadeadas que se anulam; `scroll-behavior: smooth` quebra o scrub).

## Documentação Visual (reference sheets / storyboard)

Para comunicar forma e material à IA de imagem (Nano Banana etc.) e ao build, use
`references/documentacao-visual.md`. Regra de ouro: **imagem mostra, texto mede** —
nunca peça números/cotas na imagem (a IA de imagem os alucina); medidas reais ficam
no markdown/spec.

## O que torna a skill mais inteligente a cada uso

Esta skill é viva. No Portão 4 de cada projeto, **promova os aprendizados validados**
para as `references/` desta skill (material novo → `materiais.md`; armadilha nova →
`animacao-3d.md`; prompt campeão → `documentacao-visual.md`). Assim o próximo projeto
herda o que este aprendeu — é o loop de compounding, o precursor manual de um RAG.

## Resumo do fluxo

```
frase + referência → [Portão 0] → contexto técnico (materiais + movimento)
  → [Portão 1: plano aprovado] → prompt → build iterativo
  → [Portão 3: bate com a referência] → polish
  → [Portão 4: conhecimento consolidado] → PRONTO + skill mais esperta
```
