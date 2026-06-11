# Fundação do Laboratório `web/` — Site 3D Premium (Three.js)

> Spec de design. Fonte de verdade sobre a **fundação/contexto** a ser montada em `web/`
> **antes** de construir o site. Não cobre o site em si — cobre o terreno tipado,
> a stack 3D, o workflow de agentes e o auto-registro do processo.

- **Data:** 2026-06-10
- **Status:** Aprovado (aguardando revisão do spec escrito)
- **Autor:** Denis Rodrigues + Claude (brainstorming)

---

## 1. Contexto e objetivo

O repositório é o **Curso DEV CODING FULL IA — VibeCoding Premium** (ver `PROJETO.md`).
O app `web/` (Next.js 16, App Router, TS, Tailwind, Turbopack) é o **laboratório**:
vamos construir ali **um site premium com animação 3D em Three.js**, e o produto
principal não é só o site — é o **processo de construção**, capturado para virar
material do curso (Estudo de Caso, Prompt Vault, Cheatsheets). Isso corresponde à
**Fase 1 — projeto piloto** do roadmap.

**Este spec cobre apenas a fundação/contexto.** O site (referência visual, seções,
animações) é fase seguinte, com seu próprio ciclo.

### Restrições e princípios
- **Tudo no mesmo repositório** (o `web/` já vive aqui, sem `.git` aninhado).
- **Tipagem forte real** em TypeScript — não o modo permissivo.
- **Subagents do Claude, um de cada vez**, em sequência disciplinada e visível.
- **Documentação oficial do Three.js (`https://threejs.org/docs/`) é a fonte de verdade**
  para qualquer API 3D.
- **Português brasileiro** em todo o material.
- **YAGNI:** nada de área de membros, auth, CMS ou backend agora.

### Critérios de sucesso da fundação
1. `npm run dev` roda e uma **cena 3D mínima** (um objeto girando) renderiza — prova viva da stack.
2. `tsc --noEmit` passa com **zero erros** no modo estrito reforçado.
3. Um **conteúdo de exemplo** validado por Zod em runtime (prova da espinha de tipagem).
4. **Kit Memória de Dev** instalado em `web/` e `DEV-LOG.md` com o primeiro marco registrado.
5. `AGENT-PLAYBOOK.md` escrito e `AGENTS.md` tunado para este lab.

---

## 2. Arquitetura e estrutura de arquivos

```
web/
├── AGENTS.md              # regras canônicas (Kit Memória, tunado: 3D premium + tipagem forte)
├── CLAUDE.md              # ponteiro → @AGENTS.md
├── DEV-LOG.md             # diário do processo (cabeçalho: "site 3D Three.js")
├── PROMPTS.md             # prompts verbatim (alimenta o Prompt Vault depois)
├── docs/
│   └── AGENT-PLAYBOOK.md  # qual subagent roda em cada etapa (roteiro replicável)
└── src/
    ├── app/              # rotas Next (App Router) — já existe
    ├── types/           # ⭐ espinha de tipagem (contratos puros, sem runtime)
    │   ├── scene.ts      #   cena 3D: objetos, câmera, luzes
    │   └── content.ts    #   conteúdo das seções
    ├── schemas/         # Zod schemas → inferem os tipos (1 fonte de verdade)
    │   └── content.schema.ts
    ├── content/         # dados do site, tipados e validados por Zod
    │   └── home.ts
    ├── three/           # camada 3D
    │   ├── scene/        #   componentes R3F (<Experience/>, objetos)
    │   ├── primitives/   #   escape hatches Three.js puro (shaders, controles)
    │   └── hooks/        #   hooks tipados (scroll física, useFrame)
    ├── components/      # UI React (seções, layout)
    └── lib/             # utils
```

**Princípio de fronteiras:** `types/` e `schemas/` ficam no centro; todo o resto depende
deles. A camada `three/` separa explicitamente o R3F idiomático (`scene/`) dos *escape
hatches* em Three.js puro (`primitives/`). Essa fronteira visível é proposital: é
material didático — mostra "o jeito React" e "o motor por baixo" lado a lado.

---

## 3. Espinha de tipagem forte

### tsconfig estrito reforçado
Além do `strict: true` padrão do Next, ligar:
- `noUncheckedIndexedAccess` — acesso a array/índice retorna `T | undefined`.
- `noImplicitOverride` — exige `override` explícito.
- `exactOptionalPropertyTypes` — distingue "ausente" de "`undefined`".

### Zod como fonte única de verdade
Para qualquer dado que cruza a fronteira do app (conteúdo, config de cena, futuro CMS):
schema em Zod → o tipo é **inferido** com `z.infer`. Tipo e validação nunca divergem.
O dado é validado em runtime no ponto de entrada (ex: ao carregar `content/`).

```ts
// schemas/content.schema.ts
import { z } from "zod";
export const heroSchema = z.object({
  titulo: z.string().min(1),
  subtitulo: z.string(),
});
export type Hero = z.infer<typeof heroSchema>;
```

### 3D tipado nos dois lados
- **R3F:** já vem tipado; usar os tipos do pacote.
- **Three.js puro:** os tipos **já vêm embutidos no pacote `three`** (ver §4). Sem `any`
  nos *escape hatches*.

### Regras de tipagem (entram no AGENTS.md)
- Proibido `any` (usar `unknown` + narrowing quando necessário).
- Dado externo ao app passa por Zod antes de ser usado.
- Tipos derivam de schemas quando há validação; contratos puros ficam em `types/`.

---

## 4. Stack 3D (híbrida) — ancorada na doc oficial

**Instalar:** `three`, `@react-three/fiber`, `@react-three/drei`,
`@react-three/postprocessing`, `gsap`, `zod`, `leva`.

**NÃO instalar `@types/three`.** O Three.js moderno **já traz as definições TypeScript
embutidas** no pacote `three`; o `@types/three` (DefinitelyTyped) foi descontinuado e
causa conflito de tipos. (Confirmado na doc oficial: *"type definitions included in the
package"*.)

| Camada | Ferramenta | Papel |
|--------|-----------|-------|
| Base da cena | `@react-three/fiber` + `@react-three/drei` | Cena 3D como componentes React tipados |
| Escape hatches | `three` puro (em `primitives/`) | Shaders, controles e casos críticos |
| Shaders modernos | TSL / WebGPURenderer (skill `webgpu-threejs-tsl`) | Rota oficial moderna — quando necessário |
| Animação | `gsap` + ScrollTrigger | Física de scroll e timelines cinematográficas |
| Pós-processamento | `@react-three/postprocessing` | Bloom, DOF e efeitos premium |
| Debug/iteração | `leva` | Painel de parâmetros 3D ao vivo (ótimo para gravar aula) |

**Notas oficiais incorporadas:**
- Loop de animação: preferir `renderer.setAnimationLoop()` (compatível com WebGPU/WebXR)
  ao `requestAnimationFrame` manual. O R3F já faz isso por baixo via `useFrame`.
- Setup base oficial: `Scene`, `PerspectiveCamera`, `WebGLRenderer` — no R3F isso é o
  `<Canvas>` + câmera declarativa, mas a equivalência com a API oficial fica documentada
  para fins didáticos.

---

## 5. Playbook de Agentes (um de cada vez)

Workflow sequencial e disciplinado. **Um subagent por etapa**, e cada transição vira um
marco no `DEV-LOG.md` — é o bastidor que o curso vende.

| Etapa | Subagent / Skill | Entrega | Registra em |
|-------|------------------|---------|-------------|
| 0. Referência | brainstorming (humano) | `DESIGN.md` da referência visual | DEV-LOG |
| 1. Explorar | `code-explorer` | mapa do que existe + padrões | DEV-LOG |
| 2. Arquitetar | `code-architect` | blueprint da seção 3D | DEV-LOG |
| 3. Construir | `immersive-site-forge` / `webgpu-threejs-tsl` | código da seção | DEV-LOG + PROMPTS |
| 4. Revisar | `code-reviewer` + `type-design-analyzer` | correções de bug e tipos | DEV-LOG |

Documentado em `web/docs/AGENT-PLAYBOOK.md`. Pode ser promovido a `metodo/` depois como
método replicável do curso.

---

## 6. Camada de memória/contexto

Copiar os 4 arquivos do Kit Memória de Dev (`metodo/memoria-dev/template/`) para `web/`:
- `AGENTS.md` — **tunado** para este lab (ver regras abaixo).
- `CLAUDE.md` — ponteiro para `@AGENTS.md`.
- `DEV-LOG.md` — cabeçalho preenchido (nome, referência a definir, stack Three.js).
- `PROMPTS.md` — começa vazio.

**Tunagem do `AGENTS.md`** (somada às regras canônicas do template):
- Doc oficial `https://threejs.org/docs/` é a fonte de verdade para API 3D.
- Tipagem forte: proibir `any`; exigir Zod em dados externos; tipos derivam de schemas.
- Convenção de fronteira: R3F em `three/scene/`; Three.js puro só em `three/primitives/`.
- Não instalar `@types/three`; preferir `setAnimationLoop`.
- Regra de auto-registro de marcos no `DEV-LOG.md` (herdada do template).

---

## 7. Tratamento de erros

- **Carregamento de assets 3D (GLB/texturas):** `<Suspense>` com fallback visível; usar
  os loaders/helpers do `drei`. Erro de asset não quebra a página inteira.
- **Error boundary** ao redor da `<Canvas>` 3D: se a cena falhar, a UI 2D continua viva.
- **Zod:** `safeParse` no carregamento de conteúdo; erro de schema é explícito e
  registrado, nunca silencioso.

---

## 8. Testes

Site visual de animação tem baixo retorno em teste automatizado de pixel. A estratégia é
proporcional:
- **`tsc --noEmit` é o portão principal** — tipagem forte pega a maior parte dos erros.
- **Testes unitários dos schemas Zod** (entradas válidas/ inválidas) — barato e garante a
  espinha de tipagem.
- Sem TDD pesado para a camada 3D visual; validação dela é a inspeção no `npm run dev`.

---

## 9. Fora de escopo (YAGNI)

- Área de membros, autenticação, backend, CMS.
- O site em si (referência, seções, animações finais) — fase seguinte.
- RAG / agente tutor (Fase 5 do `PROJETO.md`) — norte futuro, spec próprio.
- Frameworks externos (BMad, Spec-Kit) — descartados como overkill para esta fundação.
