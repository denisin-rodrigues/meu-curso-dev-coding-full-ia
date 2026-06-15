# Landing do Curso (vitrine 3D) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesenhar a landing (`/`) como vitrine do curso "Dev Coding Full IA", com a cena do arremesso como herói imersivo (Ato 1) e a prova do método em 5 passos (Ato 2), no design system Slam Dunk adaptado (branco + preto Anton + azul).

**Architecture:** Página em 2 atos. Ato 1: canvas `sticky` da cena `ShotExperience` com a câmera panorâmica mapeada ao scroll da seção; copy do curso (Anton) sobreposta. Ato 2: seções de fundo branco com os 5 passos e o CTA decorativo. Conteúdo tipado/validado por Zod.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript estrito, Tailwind v4, Three.js/R3F, GSAP ScrollTrigger, Zod, Vitest.

**Referência:** spec em `docs/superpowers/specs/2026-06-13-landing-curso-design.md`.

---

## File Structure

- `src/app/layout.tsx` (modificar) — adicionar fontes Anton + Inter.
- `src/app/globals.css` (modificar) — tokens de cor + utilitário `.text-outline`.
- `src/schemas/content.schema.ts` (modificar) — schema do conteúdo do curso.
- `src/schemas/content.schema.test.ts` (modificar) — testes do schema novo.
- `src/content/home.ts` (modificar) — copy do curso.
- `src/three/scene/ShotExperience.tsx` (modificar) — aceitar `trigger`.
- `src/components/ShotScene.tsx` (modificar) — repassar `trigger`.
- `src/components/landing/Hero.tsx` (criar) — copy do Ato 1.
- `src/components/landing/MethodSteps.tsx` (criar) — 5 passos do Ato 2.
- `src/components/landing/CtaEmBreve.tsx` (criar) — CTA final.
- `src/app/page.tsx` (modificar) — montagem dos 2 atos.

---

## Task 1: Fontes Anton + Inter e tokens de cor

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Adicionar as fontes no layout**

Em `src/app/layout.tsx`, adicionar aos imports e instanciar (manter as fontes existentes):

```tsx
import { Anton, Inter } from "next/font/google";

const fontAnton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400" });
const fontInter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["300", "400", "500"] });
```

E acrescentar as variáveis ao `className` do `<html>` (junto das que já existem):

```tsx
className={`${fontAnybody.variable} ${fontHanken.variable} ${fontAnton.variable} ${fontInter.variable} h-full antialiased`}
```

- [ ] **Step 2: Adicionar tokens e utilitário no globals.css**

Em `src/app/globals.css`, dentro do bloco `@theme inline { ... }` adicionar:

```css
  --font-anton: var(--font-anton), sans-serif;
  --font-inter: var(--font-inter), sans-serif;
  --color-ink: #0E0E0E;
  --color-paper: #FFFFFF;
  --color-brand-blue: #1565C0;
  --color-brand-cyan: #47C1E8;
  --color-muted: #5F5E5A;
```

E no fim do arquivo, o utilitário de texto-fantasma:

```css
.text-outline {
  -webkit-text-stroke: 1.5px #47C1E8;
  color: transparent;
}
```

- [ ] **Step 3: Verificar build de tipos**

Run: `npx tsc --noEmit`
Expected: sem erros (TSC OK)

- [ ] **Step 4: Commit**

```bash
git add web/src/app/layout.tsx web/src/app/globals.css
git commit -m "feat(web): fontes Anton+Inter e tokens da landing do curso"
```

---

## Task 2: Conteúdo do curso (schema + dados) — TDD

**Files:**
- Modify: `src/schemas/content.schema.ts`
- Modify: `src/schemas/content.schema.test.ts`
- Modify: `src/content/home.ts`

- [ ] **Step 1: Escrever o teste do schema novo**

Substituir o conteúdo de `src/schemas/content.schema.test.ts` por:

```ts
import { describe, expect, it } from "vitest";
import { homeContentSchema } from "./content.schema";

const valido = {
  hero: { titulo: "DEV CODING FULL IA", subtitulo: "Crie sites premium com IA", cta: "Em breve" },
  beats: ["Role a página.", "Cada rolagem é parte do arremesso."],
  metodo: {
    titulo: "O método em 5 passos",
    passos: [
      { numero: "01", titulo: "Referência", descricao: "Escolher o alvo." },
      { numero: "02", titulo: "Contexto", descricao: "Planejar antes." },
      { numero: "03", titulo: "Prompt", descricao: "Pedir com método." },
      { numero: "04", titulo: "Build", descricao: "Construir testando." },
      { numero: "05", titulo: "Polish", descricao: "Lapidar." },
    ],
  },
  cta: { titulo: "O curso está chegando.", botao: "Em breve" },
};

describe("homeContentSchema", () => {
  it("aceita conteúdo válido", () => {
    expect(homeContentSchema.safeParse(valido).success).toBe(true);
  });
  it("exige exatamente 5 passos no método", () => {
    const bad = { ...valido, metodo: { ...valido.metodo, passos: valido.metodo.passos.slice(0, 4) } };
    expect(homeContentSchema.safeParse(bad).success).toBe(false);
  });
});
```

- [ ] **Step 2: Rodar o teste e ver falhar**

Run: `npx vitest run src/schemas/content.schema.test.ts`
Expected: FAIL (schema ainda não tem `beats`, `metodo`, `cta`)

- [ ] **Step 3: Atualizar o schema**

Substituir `src/schemas/content.schema.ts` por:

```ts
import { z } from "zod";

export const heroSchema = z.object({
  titulo: z.string().min(1),
  subtitulo: z.string().min(1),
  cta: z.string().min(1),
});

export const metodoPassoSchema = z.object({
  numero: z.string().min(1),
  titulo: z.string().min(1),
  descricao: z.string().min(1),
  imagem: z.string().optional(),
});

export const homeContentSchema = z.object({
  hero: heroSchema,
  beats: z.array(z.string().min(1)).min(1),
  metodo: z.object({
    titulo: z.string().min(1),
    passos: z.array(metodoPassoSchema).length(5),
  }),
  cta: z.object({ titulo: z.string().min(1), botao: z.string().min(1) }),
});

export type Hero = z.infer<typeof heroSchema>;
export type MetodoPasso = z.infer<typeof metodoPassoSchema>;
export type HomeContent = z.infer<typeof homeContentSchema>;
```

- [ ] **Step 4: Rodar o teste e ver passar**

Run: `npx vitest run src/schemas/content.schema.test.ts`
Expected: PASS (2 testes)

- [ ] **Step 5: Preencher a copy do curso**

Substituir `src/content/home.ts` por:

```ts
import { homeContentSchema, type HomeContent } from "@/schemas/content.schema";

const data = {
  hero: {
    titulo: "DEV CODING FULL IA",
    subtitulo: "Crie sites premium com animações de alto nível usando IA — mesmo sem ser programador.",
    cta: "Em breve",
  },
  beats: [
    "Role a página.",
    "Cada rolagem é parte do arremesso.",
    "Este site foi feito com o método que você vai aprender.",
  ],
  metodo: {
    titulo: "O método em 5 passos",
    passos: [
      { numero: "01", titulo: "Referência", descricao: "Escolher a imagem ou vídeo do que se quer criar." },
      { numero: "02", titulo: "Contexto", descricao: "Planejar tudo antes de escrever uma linha de código." },
      { numero: "03", titulo: "Prompt", descricao: "Pedir à IA com contexto, referência, regras e resultado." },
      { numero: "04", titulo: "Build", descricao: "Construir em pedaços, testando a cada passo." },
      { numero: "05", titulo: "Polish", descricao: "Lapidar animação, luz e detalhes até o nível premium." },
    ],
  },
  cta: { titulo: "O curso está chegando.", botao: "Em breve" },
};

export const homeContent: HomeContent = homeContentSchema.parse(data);
```

- [ ] **Step 6: Rodar a suíte toda e tipos**

Run: `npx vitest run` then `npx tsc --noEmit`
Expected: todos os testes PASS; TSC OK

- [ ] **Step 7: Commit**

```bash
git add web/src/schemas/content.schema.ts web/src/schemas/content.schema.test.ts web/src/content/home.ts
git commit -m "feat(web): conteudo tipado do curso (hero, beats, metodo, cta)"
```

---

## Task 3: ShotExperience e ShotScene aceitam `trigger`

**Files:**
- Modify: `src/three/scene/ShotExperience.tsx`
- Modify: `src/components/ShotScene.tsx`

- [ ] **Step 1: Parametrizar o trigger no ShotExperience**

Em `src/three/scene/ShotExperience.tsx`, trocar a assinatura de `ShotScene` e `ShotExperience` para receber `trigger` (default `"body"`, preserva `/arremesso`).

`ShotScene` passa a receber prop:

```tsx
function ShotScene({ trigger }: { readonly trigger: string }) {
```

No `gsap.to(...)`, usar a prop no scrollTrigger:

```tsx
      scrollTrigger: {
        trigger,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
      },
```

E o export:

```tsx
export function ShotExperience({ trigger = "body" }: { readonly trigger?: string } = {}) {
  return (
    <Canvas camera={{ position: [0, 0.1, CAM_Z], fov: 42 }} dpr={[1, 2]}>
      <ShotScene trigger={trigger} />
    </Canvas>
  );
}
```

- [ ] **Step 2: Repassar o trigger no wrapper ShotScene**

Substituir `src/components/ShotScene.tsx` por:

```tsx
"use client";

import dynamic from "next/dynamic";

const ShotExperience = dynamic(
  () => import("@/three/scene/ShotExperience").then((mod) => mod.ShotExperience),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-neutral-400">
        Carregando…
      </div>
    ),
  },
);

export function ShotScene({ trigger = "body" }: { readonly trigger?: string }) {
  return <ShotExperience trigger={trigger} />;
}
```

- [ ] **Step 3: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: TSC OK

- [ ] **Step 4: Verificar que /arremesso não regrediu (default "body")**

Confirmar no preview que `/arremesso` continua animando (bola cai na cesta no scroll). Sem mudança de comportamento esperada.

- [ ] **Step 5: Commit**

```bash
git add web/src/three/scene/ShotExperience.tsx web/src/components/ShotScene.tsx
git commit -m "feat(web): ShotExperience aceita trigger de scroll parametrizado"
```

---

## Task 4: Componentes da landing (Hero, MethodSteps, CtaEmBreve)

**Files:**
- Create: `src/components/landing/Hero.tsx`
- Create: `src/components/landing/MethodSteps.tsx`
- Create: `src/components/landing/CtaEmBreve.tsx`

- [ ] **Step 1: Hero (overlay do Ato 1)**

Criar `src/components/landing/Hero.tsx`:

```tsx
import { homeContent } from "@/content/home";

/** Copy do curso sobreposta à cena 3D do Ato 1 (4 telas de scroll). */
export function Hero() {
  const { hero, beats } = homeContent;
  return (
    <div className="relative z-10 -mt-[100vh]">
      <section className="flex h-screen w-full flex-col justify-center px-8 md:px-24">
        <p className="mb-3 font-inter text-sm font-medium uppercase tracking-[0.3em] text-brand-blue">
          VibeCoding Premium
        </p>
        <h1 className="font-anton text-6xl uppercase leading-[0.95] text-ink md:text-[8rem]">
          {hero.titulo}
        </h1>
        <p className="mt-6 max-w-md font-inter text-lg text-muted">{hero.subtitulo}</p>
        <span className="mt-8 w-fit rounded-md bg-brand-blue px-8 py-3 font-inter font-medium text-white">
          {hero.cta}
        </span>
      </section>
      {beats.map((frase) => (
        <section key={frase} className="flex h-screen w-full items-center justify-center px-8">
          <p className="max-w-lg text-center font-anton text-3xl uppercase leading-tight text-ink md:text-5xl">
            {frase}
          </p>
        </section>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: MethodSteps (Ato 2)**

Criar `src/components/landing/MethodSteps.tsx`:

```tsx
import { homeContent } from "@/content/home";

/** Ato 2 — prova do método em 5 passos, fundo branco e legível. */
export function MethodSteps() {
  const { metodo } = homeContent;
  return (
    <section className="bg-paper px-8 py-24 md:px-24">
      <h2 className="mb-12 font-anton text-4xl uppercase leading-none text-ink md:text-7xl">
        {metodo.titulo}
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {metodo.passos.map((passo) => (
          <article
            key={passo.numero}
            className="rounded-xl border border-black/10 bg-white p-6"
          >
            <span className="font-anton text-5xl text-brand-cyan">{passo.numero}</span>
            <h3 className="mt-2 font-anton text-2xl uppercase text-ink">{passo.titulo}</h3>
            <p className="mt-2 font-inter text-muted">{passo.descricao}</p>
            <div className="mt-4 flex h-40 items-center justify-center rounded-md border border-dashed border-black/20 font-inter text-sm text-muted">
              [imagem aqui]
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: CtaEmBreve (fecho)**

Criar `src/components/landing/CtaEmBreve.tsx`:

```tsx
import { homeContent } from "@/content/home";

/** CTA final decorativo (pré-lançamento, sem backend). */
export function CtaEmBreve() {
  const { cta } = homeContent;
  return (
    <section className="flex flex-col items-center justify-center bg-paper px-8 py-32 text-center">
      <h2 className="font-anton text-5xl uppercase leading-none text-ink md:text-8xl">
        {cta.titulo}
      </h2>
      <span className="mt-8 rounded-md bg-brand-blue px-12 py-4 font-inter font-medium uppercase tracking-widest text-white">
        {cta.botao}
      </span>
    </section>
  );
}
```

- [ ] **Step 4: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: TSC OK

- [ ] **Step 5: Commit**

```bash
git add web/src/components/landing/
git commit -m "feat(web): componentes da landing (Hero, MethodSteps, CtaEmBreve)"
```

---

## Task 5: Montagem da page.tsx (Ato 1 sticky + Ato 2)

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Reescrever a page.tsx**

Substituir `src/app/page.tsx` por:

```tsx
import { CanvasErrorBoundary } from "@/components/CanvasErrorBoundary";
import { ShotScene } from "@/components/ShotScene";
import { Hero } from "@/components/landing/Hero";
import { MethodSteps } from "@/components/landing/MethodSteps";
import { CtaEmBreve } from "@/components/landing/CtaEmBreve";

export default function Home() {
  return (
    <main className="w-full bg-paper font-inter text-ink">
      {/* ATO 1 — herói imersivo: canvas gruda enquanto a copy rola por cima */}
      <section id="ato1" className="relative">
        <div className="sticky top-0 h-screen w-full">
          <CanvasErrorBoundary
            fallback={
              <div className="flex h-full w-full items-center justify-center text-muted">
                A cena 3D não pôde ser carregada.
              </div>
            }
          >
            <ShotScene trigger="#ato1" />
          </CanvasErrorBoundary>
        </div>
        <Hero />
      </section>

      {/* ATO 2 — prova do método + CTA */}
      <MethodSteps />
      <CtaEmBreve />
    </main>
  );
}
```

- [ ] **Step 2: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: TSC OK

- [ ] **Step 3: Verificar visualmente no preview (Ato 1)**

Iniciar o dev server, abrir `/`. No topo: título Anton preto "DEV CODING FULL IA" sobre fundo branco, bola azul grande à direita, botão azul "Em breve". Tirar screenshot.

- [ ] **Step 4: Verificar a descida e o Ato 2**

Rolar até o fim. Meio: bola caindo + frases Anton. Fim do Ato 1: bola entra na cesta (swish). Depois: seção branca "O método em 5 passos" com 5 cards (número ciano) e o CTA final. Tirar screenshots e conferir legibilidade.

- [ ] **Step 5: Commit**

```bash
git add web/src/app/page.tsx
git commit -m "feat(web): landing do curso em 2 atos (heroi 3D + metodo)"
```

---

## Task 6: Verificação final e ajuste

**Files:** (ajustes conforme o preview)

- [ ] **Step 1: Suíte completa**

Run: `npx vitest run` then `npx tsc --noEmit`
Expected: todos PASS; TSC OK

- [ ] **Step 2: Não-regressão**

Conferir no preview que `/arremesso` e `/cesta` continuam funcionando.

- [ ] **Step 3: Registrar no DEV-LOG**

Adicionar entrada em `web/DEV-LOG.md` (marco "Landing do curso — vitrine 3D"): pedido, o que foi feito, decisões (design system Slam Dunk adaptado, 2 atos, trigger parametrizado) e iterações.

- [ ] **Step 4: Commit**

```bash
git add web/DEV-LOG.md
git commit -m "docs(web): registra marco da landing do curso no DEV-LOG"
```

---

## Self-Review (cobertura do spec)

- Design system (Anton/Inter, branco/preto/azul, text-outline): Task 1. ✓
- Copy do curso tipada/validada: Task 2. ✓
- Cena como herói com scroll mapeado ao Ato 1: Task 3 (trigger) + Task 5 (sticky). ✓
- Método em 5 passos com espaço de imagem: Task 4 (MethodSteps). ✓
- CTA decorativo: Task 4 (CtaEmBreve). ✓
- Não regredir /arremesso e /cesta: Task 3.4 e Task 6.2. ✓
- Fundo branco integrando o 3D: page bg `bg-paper` + canvas transparente. ✓
