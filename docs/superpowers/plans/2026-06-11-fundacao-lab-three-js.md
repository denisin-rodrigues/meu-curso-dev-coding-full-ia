# Fundação do Laboratório `web/` (Site 3D Three.js) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Montar toda a fundação/contexto do laboratório `web/` (tipagem forte, stack 3D híbrida, workflow de agentes e auto-registro do processo) antes de construir o site.

**Architecture:** App Next.js 16 (App Router, TS, Tailwind, Turbopack) já existe em `web/`. Adicionamos uma espinha de tipagem (TS estrito reforçado + Zod como fonte única), uma camada 3D híbrida (`@react-three/fiber` + `drei` para o idiomático; `three` puro em `primitives/` como escape hatch), uma cena 3D mínima de prova (objeto girando), e o Kit Memória de Dev mesclado às regras do Next 16.

**Tech Stack:** Next.js 16, React 19, TypeScript (strict reforçado), `three` (tipos embutidos), `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `gsap`, `zod`, `leva`, `vitest`.

**Spec:** `docs/superpowers/specs/2026-06-10-fundacao-lab-three-js-design.md`

**Convenções de execução:**
- Todos os comandos rodam **dentro de `web/`** salvo indicação contrária. No PowerShell, abra o shell em `web/` (ou prefixe com `cd web;`).
- Doc oficial do Three.js (`https://threejs.org/docs/`) é a fonte de verdade para API 3D.
- Para qualquer API do Next.js, consulte `node_modules/next/dist/docs/` (Next 16 tem breaking changes).
- **NÃO** instalar `@types/three` (os tipos já vêm no pacote `three`).

---

### Task 0: Baseline — commitar o scaffold pristino do `web/`

> O app `web/` foi criado pelo create-next-app mas nunca foi commitado. Commitar o
> scaffold intacto primeiro deixa o histórico limpo (a fundação aparece como diff por
> cima do ponto de partida) e serve de material didático: o aluno vê o "antes".

**Files:** todo o conteúdo versionável de `web/` (o `web/.gitignore` já exclui
`node_modules/` e `.next/`).

- [ ] **Step 1: Conferir o que será commitado**

Run (na raiz do repo):
```bash
git add web && git status --short
```
Expected: vários arquivos `A web/...` (ex: `web/package.json`, `web/src/app/layout.tsx`,
`web/src/app/page.tsx`, `web/src/app/globals.css`, `web/next.config.ts`,
`web/eslint.config.mjs`, `web/postcss.config.mjs`, `web/tsconfig.json`, `web/public/*`,
`web/AGENTS.md`, `web/CLAUDE.md`, `web/README.md`). **Não** deve aparecer `node_modules/`
nem `.next/`.

- [ ] **Step 2: Commit do baseline**

```bash
git commit -m "chore(web): scaffold inicial Next.js 16 (create-next-app) como baseline"
```

---

### Task 1: Instalar a stack 3D + ferramentas

**Files:**
- Modify: `web/package.json` (via npm — não editar à mão)

- [ ] **Step 1: Instalar dependências de runtime**

Run (em `web/`):
```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing gsap zod leva
```
Expected: instala sem erro. Avisos de peer-dependency mencionando React 19 podem aparecer e são aceitáveis (R3F v9 suporta React 19).

- [ ] **Step 2: Instalar dependências de desenvolvimento (test runner)**

Run (em `web/`):
```bash
npm install -D vitest
```
Expected: instala sem erro.

- [ ] **Step 3: Confirmar que `@types/three` NÃO foi instalado**

Run (em `web/`):
```bash
npm ls @types/three
```
Expected: `(empty)` ou "not found". Se aparecer instalado, remova: `npm remove @types/three`.

- [ ] **Step 4: Confirmar que o build de tipos ainda passa**

Run (em `web/`):
```bash
npx tsc --noEmit
```
Expected: PASS (zero erros). A stack nova ainda não é usada, então nada quebra.

- [ ] **Step 5: Commit**

```bash
git add web/package.json web/package-lock.json
git commit -m "chore(web): instala stack 3D (three, R3F, drei, gsap, zod, leva) + vitest"
```

---

### Task 2: Reforçar o tsconfig (tipagem forte real)

**Files:**
- Modify: `web/tsconfig.json` (bloco `compilerOptions`)

- [ ] **Step 1: Adicionar os flags estritos reforçados**

Em `web/tsconfig.json`, dentro de `compilerOptions`, logo após a linha `"strict": true,`, adicione:
```json
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
```

O bloco deve ficar assim (trecho):
```json
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "noEmit": true,
```

- [ ] **Step 2: Verificar que o código existente ainda passa**

Run (em `web/`):
```bash
npx tsc --noEmit
```
Expected: PASS (zero erros). O scaffold do create-next-app é compatível com esses flags.

- [ ] **Step 3: Commit**

```bash
git add web/tsconfig.json
git commit -m "chore(web): reforca tsconfig (noUncheckedIndexedAccess, noImplicitOverride, exactOptionalPropertyTypes)"
```

---

### Task 3: Configurar o Vitest

**Files:**
- Create: `web/vitest.config.ts`
- Modify: `web/package.json` (campo `scripts`)

- [ ] **Step 1: Criar a config do Vitest**

Create `web/vitest.config.ts`:
```ts
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(process.cwd(), "src"),
    },
  },
  test: {
    environment: "node",
  },
});
```

- [ ] **Step 2: Adicionar o script `test` ao package.json**

Em `web/package.json`, no objeto `"scripts"`, adicione:
```json
    "test": "vitest run"
```
(Mantenha as vírgulas válidas do JSON — adicione vírgula ao item anterior se necessário.)

- [ ] **Step 3: Commit**

```bash
git add web/vitest.config.ts web/package.json
git commit -m "chore(web): configura vitest (alias @/ + script test)"
```

---

### Task 4: Espinha de tipagem — schema Zod do conteúdo (TDD)

**Files:**
- Create: `web/src/schemas/content.schema.ts`
- Test: `web/src/schemas/content.schema.test.ts`

- [ ] **Step 1: Escrever o teste que falha**

Create `web/src/schemas/content.schema.test.ts`:
```ts
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
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run (em `web/`):
```bash
npx vitest run src/schemas/content.schema.test.ts
```
Expected: FAIL — erro de import (`content.schema` não existe / `homeContentSchema` não exportado).

- [ ] **Step 3: Implementar o schema mínimo**

Create `web/src/schemas/content.schema.ts`:
```ts
import { z } from "zod";

/** Conteúdo do hero (primeira dobra). */
export const heroSchema = z.object({
  titulo: z.string().min(1),
  subtitulo: z.string().min(1),
  cta: z.string().min(1),
});

/** Conteúdo completo da home. */
export const homeContentSchema = z.object({
  hero: heroSchema,
});

export type Hero = z.infer<typeof heroSchema>;
export type HomeContent = z.infer<typeof homeContentSchema>;
```

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run (em `web/`):
```bash
npx vitest run src/schemas/content.schema.test.ts
```
Expected: PASS (2 testes verdes).

- [ ] **Step 5: Commit**

```bash
git add web/src/schemas/content.schema.ts web/src/schemas/content.schema.test.ts
git commit -m "feat(web): schema Zod do conteudo da home (fonte unica de tipo + validacao)"
```

---

### Task 5: Tipos puros da cena 3D

**Files:**
- Create: `web/src/types/scene.ts`
- Create: `web/src/types/content.ts`

- [ ] **Step 1: Criar os contratos da cena**

Create `web/src/types/scene.ts`:
```ts
import type { Vector3Tuple } from "three";

/** Configuração declarativa de um objeto na cena 3D. */
export interface SceneObjectConfig {
  readonly id: string;
  readonly position: Vector3Tuple;
  readonly rotationSpeed: number;
}

/** Configuração da câmera da experiência 3D. */
export interface CameraConfig {
  readonly position: Vector3Tuple;
  readonly fov: number;
}
```

- [ ] **Step 2: Re-exportar os tipos de conteúdo inferidos do schema (DRY)**

Create `web/src/types/content.ts`:
```ts
// Contratos de conteúdo. Quando há validação em runtime, o tipo é inferido do schema
// Zod (fonte única de verdade) e apenas re-exportado aqui para uso conveniente.
export type { Hero, HomeContent } from "@/schemas/content.schema";
```

- [ ] **Step 3: Verificar tipos**

Run (em `web/`):
```bash
npx tsc --noEmit
```
Expected: PASS. (`Vector3Tuple` vem dos tipos embutidos no pacote `three`.)

- [ ] **Step 4: Commit**

```bash
git add web/src/types/scene.ts web/src/types/content.ts
git commit -m "feat(web): tipos puros da cena 3D + re-export dos tipos de conteudo"
```

---

### Task 6: Conteúdo da home tipado e validado em runtime

**Files:**
- Create: `web/src/content/home.ts`

- [ ] **Step 1: Criar o dado validado por Zod**

Create `web/src/content/home.ts`:
```ts
import { homeContentSchema, type HomeContent } from "@/schemas/content.schema";

// Dado bruto do conteúdo. Validado no carregamento — se o formato divergir do schema,
// o erro aparece já no build/import, nunca silenciosamente.
const data = {
  hero: {
    titulo: "Laboratório 3D",
    subtitulo: "Fundação do site premium com Three.js",
    cta: "Explorar",
  },
};

export const homeContent: HomeContent = homeContentSchema.parse(data);
```

- [ ] **Step 2: Verificar tipos**

Run (em `web/`):
```bash
npx tsc --noEmit
```
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add web/src/content/home.ts
git commit -m "feat(web): conteudo da home tipado e validado por Zod no carregamento"
```

---

### Task 7: Cena 3D mínima (R3F) + escape hatch (Three.js puro)

**Files:**
- Create: `web/src/three/scene/RotatingBox.tsx`
- Create: `web/src/three/primitives/wireframeGlobe.ts`
- Create: `web/src/three/scene/Experience.tsx`

> Esta camada é visual: a verificação é `tsc --noEmit` (Step final) + inspeção no `npm run dev` (Task 11), não teste unitário — conforme §8 do spec.

- [ ] **Step 1: Criar o objeto girando (R3F idiomático)**

Create `web/src/three/scene/RotatingBox.tsx`:
```tsx
"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

/** Cubo que gira continuamente — prova viva de que o loop de render R3F funciona. */
export function RotatingBox() {
  const ref = useRef<Mesh>(null);

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    mesh.rotation.x += delta * 0.4;
    mesh.rotation.y += delta * 0.6;
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#6366f1" metalness={0.1} roughness={0.3} />
    </mesh>
  );
}
```

- [ ] **Step 2: Criar o escape hatch em Three.js puro**

Create `web/src/three/primitives/wireframeGlobe.ts`:
```ts
// ESCAPE HATCH — Three.js puro (sem R3F). Construído na mão e montado na cena R3F
// via <primitive object={...} />. Demonstra a fronteira híbrida do laboratório.
import {
  EdgesGeometry,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
} from "three";

/** Cria um globo de arame (wireframe) usando a API crua do Three.js. */
export function createWireframeGlobe(radius = 1): LineSegments {
  const geometry = new IcosahedronGeometry(radius, 2);
  const edges = new EdgesGeometry(geometry);
  const material = new LineBasicMaterial({ color: 0x22d3ee });
  return new LineSegments(edges, material);
}
```

- [ ] **Step 3: Compor a experiência (Canvas + luzes + os dois mundos)**

Create `web/src/three/scene/Experience.tsx`:
```tsx
"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import { createWireframeGlobe } from "@/three/primitives/wireframeGlobe";
import { RotatingBox } from "@/three/scene/RotatingBox";

/** Cena 3D mínima da fundação: R3F idiomático (RotatingBox) + escape hatch puro (globo). */
export function Experience() {
  // useMemo evita recriar o objeto Three.js puro a cada render.
  const globe = useMemo(() => createWireframeGlobe(2.4), []);

  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <directionalLight intensity={1.2} position={[5, 5, 5]} />
      <RotatingBox />
      <primitive object={globe} />
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}
```

- [ ] **Step 4: Verificar tipos**

Run (em `web/`):
```bash
npx tsc --noEmit
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/src/three
git commit -m "feat(web): cena 3D minima (R3F) + escape hatch wireframe em three puro"
```

---

### Task 8: Error boundary + montar a cena na página

**Files:**
- Create: `web/src/components/CanvasErrorBoundary.tsx`
- Modify: `web/src/app/page.tsx` (substituir todo o conteúdo)
- Modify: `web/src/app/layout.tsx:15-18` (metadata)

- [ ] **Step 1: Criar o error boundary da cena**

Create `web/src/components/CanvasErrorBoundary.tsx`:
```tsx
"use client";

import { Component, type ReactNode } from "react";

interface Props {
  readonly children: ReactNode;
  readonly fallback: ReactNode;
}

interface State {
  readonly hasError: boolean;
}

/** Isola falhas da cena 3D: se a <Canvas> quebrar, a UI 2D continua viva. */
export class CanvasErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

- [ ] **Step 2: Substituir a página inicial pela cena 3D**

Replace the entire contents of `web/src/app/page.tsx` with:
```tsx
import { Suspense } from "react";
import { CanvasErrorBoundary } from "@/components/CanvasErrorBoundary";
import { Experience } from "@/three/scene/Experience";

function SceneFallback({ message }: { readonly message: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-black text-zinc-400">
      {message}
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col">
      <div className="h-screen w-full bg-black">
        <CanvasErrorBoundary fallback={<SceneFallback message="A cena 3D falhou ao carregar." />}>
          <Suspense fallback={<SceneFallback message="Carregando cena 3D…" />}>
            <Experience />
          </Suspense>
        </CanvasErrorBoundary>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Atualizar o metadata do layout**

In `web/src/app/layout.tsx`, replace the `metadata` object (lines ~15-18):
```tsx
export const metadata: Metadata = {
  title: "Laboratório 3D — DEV CODING FULL IA",
  description: "Fundação do site premium com Three.js (laboratório do curso)",
};
```

- [ ] **Step 4: Verificar tipos**

Run (em `web/`):
```bash
npx tsc --noEmit
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/src/components/CanvasErrorBoundary.tsx web/src/app/page.tsx web/src/app/layout.tsx
git commit -m "feat(web): monta cena 3D na home com Suspense + error boundary"
```

---

### Task 9: Kit Memória de Dev mesclado às regras do Next 16

**Files:**
- Modify: `web/AGENTS.md` (substituir conteúdo — mesclando o aviso do Next que já existe)
- Create: `web/DEV-LOG.md`
- Create: `web/PROMPTS.md`
- (mantém `web/CLAUDE.md` como está: já contém `@AGENTS.md`)

- [ ] **Step 1: Reescrever o `web/AGENTS.md` mesclado**

Replace the entire contents of `web/AGENTS.md` with:
```markdown
# Regras do Projeto — Laboratório 3D (web/)

> Lido por Codex e Antigravity diretamente, e pelo Claude Code via `CLAUDE.md`.
> Define como a IA se comporta NESTE projeto. Não remova.

## ⚠️ Next.js 16 — não é o Next que você conhece

Esta versão tem breaking changes — APIs, convenções e estrutura podem diferir do seu
conhecimento de treino. **Antes de escrever código de Next**, leia o guia relevante em
`node_modules/next/dist/docs/`. Respeite avisos de depreciação.

## 🎮 Three.js — documentação oficial é a fonte de verdade

`https://threejs.org/docs/` é a referência canônica para qualquer API 3D. Consulte antes
de usar/alterar API do Three.js. Regras:
- **Não instalar `@types/three`** — os tipos já vêm embutidos no pacote `three`.
- Preferir `renderer.setAnimationLoop()` ao `requestAnimationFrame` manual (compatível
  com WebGPU/WebXR). No R3F, isso é o `useFrame`.
- Shaders modernos: TSL / WebGPURenderer (ver skill `webgpu-threejs-tsl`).

## 🧱 Tipagem forte (obrigatória)

- Proibido `any`. Use `unknown` + narrowing quando o tipo for incerto.
- Dado externo ao app (conteúdo, config, futuro CMS) passa por **Zod** antes do uso.
- O tipo deriva do schema (`z.infer`) quando há validação; contratos puros ficam em
  `src/types/`.
- `tsconfig` roda em modo estrito reforçado (`noUncheckedIndexedAccess`,
  `noImplicitOverride`, `exactOptionalPropertyTypes`). `npx tsc --noEmit` é o portão.

## 🔀 Fronteira R3F ↔ Three.js puro

- R3F idiomático (componentes de cena) vive em `src/three/scene/`.
- Three.js puro (escape hatches: shaders, controles, casos críticos) vive em
  `src/three/primitives/`, montado na cena via `<primitive object={...} />`.
- Não misture as duas abordagens no mesmo arquivo.

## Idioma

Todo material gerado (comentários, documentação, registros) em **português brasileiro**.

## 📓 REGRA PRINCIPAL — Registro automático do processo

Este projeto mantém uma memória de desenvolvimento em dois arquivos na raiz de `web/`.
**Você (IA) é responsável por mantê-los atualizados sem que o usuário peça.**

### 1. `DEV-LOG.md` — registrar a cada marco

Um **marco** é: uma seção/funcionalidade nova pronta; uma animação criada/refinada; um bug
relevante resolvido; uma decisão técnica/de design tomada; um deploy feito.

Ao completar um marco, **adicione** (nunca edite entradas antigas) uma entrada curta e
didática no `DEV-LOG.md` seguindo o template dentro do próprio arquivo:
- **Pedido:** intenção do usuário em 1-2 linhas
- **O que foi feito:** abordagem, arquivos criados/alterados, bibliotecas
- **Decisões e porquês:** por que esse caminho
- **Iterações:** o que mudou entre tentativas (ou "primeira tentativa funcionou")

### 2. `PROMPTS.md` — salvar prompts reutilizáveis VERBATIM

Quando um prompt for bom o suficiente para virar template (gerou resultado premium,
resolveu algo difícil, ou tem estrutura clara contexto+referência+regras+output), copie-o
**palavra por palavra** para `PROMPTS.md`, na categoria certa (`hero`, `animacao-scroll`,
`design-system`, `polish`, `outros`), com 1 linha do que gerou e link ao marco do DEV-LOG.

### Regras dos dois arquivos
- **Append-only:** nunca apague nem reescreva entradas anteriores.
- **Sem ruído:** não registre interações triviais.
- **Fim de sessão longa:** registre marcos pendentes antes de encerrar.

## Workflow de agentes (um de cada vez)

Ver `docs/AGENT-PLAYBOOK.md`. Sequência: Referência → Explorar (`code-explorer`) →
Arquitetar (`code-architect`) → Construir (`immersive-site-forge`/`webgpu-threejs-tsl`) →
Revisar (`code-reviewer` + `type-design-analyzer`). Um subagent por etapa.

## Método VibeCoding (contexto)

5 etapas: REFERÊNCIA → EXTRAÇÃO (DESIGN.md) → PROMPT → BUILD → POLISH. Os registros
alimentam o curso "DEV CODING FULL IA" — clareza didática importa mais que exaustividade.
```

- [ ] **Step 2: Criar o `web/DEV-LOG.md` com cabeçalho preenchido e primeiro marco**

Create `web/DEV-LOG.md`:
```markdown
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
Reforçado o `tsconfig` (modo estrito real). Criada a espinha de tipagem: schema Zod do
conteúdo (`src/schemas/`) com tipos inferidos, tipos puros da cena (`src/types/`) e
conteúdo validado em runtime (`src/content/`). Montada a cena 3D mínima de prova
(`src/three/`): cubo girando em R3F + globo wireframe em Three.js puro (escape hatch),
com Suspense e error boundary na home. Kit Memória de Dev mesclado às regras do Next 16.
Escrito o `docs/AGENT-PLAYBOOK.md`.

**Decisões e porquês:** R3F + Three.js puro (híbrido) para ter o idiomático e o motor por
baixo lado a lado (melhor material didático). Zod como fonte única de tipo+validação para
a tipagem nunca divergir do dado real. `@types/three` descartado: a doc oficial confirmou
que os tipos já vêm no pacote `three` (o pacote DefinitelyTyped foi descontinuado).

**Iterações:** primeira tentativa — fundação derivada de spec aprovado antes de codar.

**Prompt reutilizável:** não (setup de fundação, não prompt de geração visual).
```

- [ ] **Step 3: Criar o `web/PROMPTS.md` (vazio, do template)**

Create `web/PROMPTS.md`:
```markdown
# PROMPTS — `Laboratório 3D (web/)`

> Prompts reutilizáveis deste projeto, salvos **palavra por palavra** pela IA
> (regra no AGENTS.md). Categorias espelham o prompt-vault do curso.
> **Append-only** — nunca editar prompts já salvos.

<!-- TEMPLATE DE ENTRADA (a IA copia este bloco para a categoria certa):

### AAAA-MM-DD — [título curto]

**Gerou:** [resultado em 1 linha] · ver DEV-LOG.md → [marco]

```
[PROMPT VERBATIM — exatamente como o usuário digitou]
```

-->

## hero

*(vazio)*

## animacao-scroll

*(vazio)*

## design-system

*(vazio)*

## polish

*(vazio)*

## outros

*(vazio)*
```

- [ ] **Step 4: Commit**

```bash
git add web/AGENTS.md web/DEV-LOG.md web/PROMPTS.md
git commit -m "docs(web): Kit Memoria de Dev mesclado as regras Next 16 + Three.js/tipagem"
```

---

### Task 10: Playbook de agentes

**Files:**
- Create: `web/docs/AGENT-PLAYBOOK.md`

- [ ] **Step 1: Escrever o playbook**

Create `web/docs/AGENT-PLAYBOOK.md`:
```markdown
# AGENT PLAYBOOK — Laboratório 3D

> Como o site é construído: **subagents do Claude, um de cada vez**, em sequência.
> Cada transição vira um marco no `DEV-LOG.md` — é o bastidor que o curso ensina.

## Sequência

| Etapa | Subagent / Skill | Entrega | Registra em |
|-------|------------------|---------|-------------|
| 0. Referência | brainstorming (humano + IA) | `DESIGN.md` da referência visual | DEV-LOG |
| 1. Explorar | `code-explorer` | mapa do que existe + padrões | DEV-LOG |
| 2. Arquitetar | `code-architect` | blueprint da seção 3D | DEV-LOG |
| 3. Construir | `immersive-site-forge` / `webgpu-threejs-tsl` | código da seção | DEV-LOG + PROMPTS |
| 4. Revisar | `code-reviewer` + `type-design-analyzer` | correções de bug e tipos | DEV-LOG |

## Regras do fluxo

- **Um subagent por etapa.** Não pular etapas; não rodar dois em paralelo.
- Cada etapa termina com um marco registrado no `DEV-LOG.md`.
- A etapa 3 (Construir) é a única que costuma gerar prompt reutilizável → `PROMPTS.md`.
- `tsc --noEmit` e `npm test` devem passar antes de fechar a etapa 4.

## Portões de qualidade

- Tipagem forte (sem `any`, dado externo via Zod).
- Doc oficial do Three.js consultada para qualquer API 3D.
- Convenção de fronteira R3F (`scene/`) ↔ Three.js puro (`primitives/`) respeitada.
```

- [ ] **Step 2: Commit**

```bash
git add web/docs/AGENT-PLAYBOOK.md
git commit -m "docs(web): playbook de agentes (um subagent por etapa)"
```

---

### Task 11: Verificação final dos critérios de sucesso

**Files:** nenhum (verificação).

- [ ] **Step 1: Portão de tipos — zero erros no modo estrito**

Run (em `web/`):
```bash
npx tsc --noEmit
```
Expected: PASS, zero erros. (Critério de sucesso #2.)

- [ ] **Step 2: Portão de testes — schemas Zod verdes**

Run (em `web/`):
```bash
npm test
```
Expected: PASS (os 2 testes de `content.schema.test.ts`). (Critério de sucesso #3.)

- [ ] **Step 3: Confirmar ausência de `@types/three`**

Run (em `web/`):
```bash
npm ls @types/three
```
Expected: não instalado.

- [ ] **Step 4: Prova visual — a cena 3D renderiza**

Run (em `web/`):
```bash
npm run dev
```
Then abra `http://localhost:3000` e confirme:
- Um **cubo roxo girando** no centro (R3F funcionando — critério de sucesso #1).
- Um **globo de arame ciano** ao redor (escape hatch Three.js puro funcionando).
- Arrastar com o mouse orbita a câmera (OrbitControls).
- Nenhum erro no console do navegador.

Pare o servidor com Ctrl+C ao terminar.

- [ ] **Step 5: Confirmar todos os critérios de sucesso do spec**

Checklist (§1 do spec) — todos devem estar ✅:
1. `npm run dev` mostra cena 3D com objeto girando.
2. `tsc --noEmit` passa com zero erros (estrito reforçado).
3. Conteúdo validado por Zod em runtime.
4. Kit Memória instalado e `DEV-LOG.md` com o primeiro marco.
5. `AGENT-PLAYBOOK.md` escrito e `AGENTS.md` tunado.

A fundação está pronta. Próxima fase (fora deste plano): **Etapa 0 do playbook** —
escolher a referência visual e criar o `DESIGN.md`.
```
