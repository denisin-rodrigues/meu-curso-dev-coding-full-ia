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
