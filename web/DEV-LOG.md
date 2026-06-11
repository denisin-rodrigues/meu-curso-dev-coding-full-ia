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
