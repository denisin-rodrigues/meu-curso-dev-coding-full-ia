<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Regras do Projeto — Laboratório 3D (web/)

> Lido por Codex e Antigravity diretamente, e pelo Claude Code via `CLAUDE.md`.
> Define como a IA se comporta NESTE projeto. Não remova.
> O bloco acima (`nextjs-agent-rules`) é gerenciado pelo create-next-app — não edite à mão.

## 🎮 Three.js — documentação oficial é a fonte de verdade

`https://threejs.org/docs/` é a referência canônica para qualquer API 3D. Consulte antes
de usar/alterar API do Three.js. Regras:
- **Não instalar `@types/three`** — os tipos já vêm embutidos no pacote `three`.
- Preferir `renderer.setAnimationLoop()` ao `requestAnimationFrame` manual (compatível
  com WebGPU/WebXR). No R3F, isso é o `useFrame`.
- Shaders modernos: TSL / WebGPURenderer (ver skill `webgpu-threejs-tsl`).

## 🧬 Inteligência de Materiais (obrigatória em tarefas de textura/material)

Antes de **gerar, alterar ou refinar** qualquer textura ou material (PBR, shaders,
scripts de geração), leia `docs/MATERIAIS.md`. Ele contém a física, os erros comuns
(anti-referências) e os parâmetros já validados de cada material — conhecimento pago
com muitas iterações; não o redescubra.

- Para **material novo**: siga o Protocolo de Documentação Visual do MATERIAIS.md
  (vistas ortográficas, medidas, ampliações de superfície) ANTES de gerar textura.
  Referência visual estruturada > descrição textual — validado no Projeto 01.
- Após o usuário **validar** um material: registre a nova seção no MATERIAIS.md
  (física, erros observados, correções, parâmetros finais). Sem o usuário pedir.

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
