# Design — Sistema de Memória de Desenvolvimento (Kit Memória de Dev)

> Spec validado em brainstorm em 2026-06-10. Escopo: **Peça A** apenas.

## Problema

O autor desenvolve projetos com IA assistida (Antigravity, Claude Code e, futuramente,
Codex) e não consegue anotar manualmente o processo: os prompts que envia, o que a IA
gera e as decisões tomadas. Esse histórico é a matéria-prima do curso (Prompt Vault,
cheatsheets, estudos de caso) e, no futuro, de um agente tutor na área de membros.

## Decisões de design

1. **Formato híbrido** (escolha do autor): resumo estruturado por marco no `DEV-LOG.md`
   + prompts-chave salvos **verbatim** no `PROMPTS.md`.
2. **`AGENTS.md` como arquivo canônico de regras** — padrão aberto lido nativamente
   por Codex e Antigravity. O `CLAUDE.md` é um ponteiro fino que importa o `AGENTS.md`
   (Claude Code suporta `@import`). Uma regra, três ferramentas, zero duplicação.
3. **Kit portátil por cópia**: a pasta `metodo/memoria-dev/template/` é copiada para a
   raiz de cada projeto novo. Nenhuma instalação, nenhum tooling.
4. **Append-only**: os arquivos de memória nunca são editados retroativamente, só
   recebem novas entradas — preserva a linha do tempo real do desenvolvimento.
5. **Categorias do `PROMPTS.md` espelham o `prompt-vault/`** do curso (hero,
   animacao-scroll, design-system, polish, outros) para facilitar a extração final.

## Componentes

```
metodo/memoria-dev/
├── COMO-USAR.md          # instruções: como iniciar um projeto com o kit
└── template/             # copiar esta pasta para a raiz de cada projeto novo
    ├── AGENTS.md         # regras canônicas (Codex + Antigravity)
    ├── CLAUDE.md         # ponteiro → @AGENTS.md (Claude Code)
    ├── DEV-LOG.md        # memória resumida por marco (append-only)
    └── PROMPTS.md        # prompts verbatim reutilizáveis, por categoria
```

### Fluxo de uso

1. Criar pasta do projeto novo → copiar conteúdo de `template/` para a raiz.
2. Desenvolver normalmente com qualquer das 3 ferramentas.
3. A regra no `AGENTS.md` instrui a IA a registrar cada marco no `DEV-LOG.md` e a
   salvar prompts reutilizáveis no `PROMPTS.md` — sem o autor pedir.
4. Ao final do projeto: copiar `DEV-LOG.md` + `PROMPTS.md` para
   `estudos-de-caso/projeto-XX/` no repositório do curso e alimentar o
   `prompt-vault/` com os templates.

## Fora de escopo (fases futuras — norte do projeto)

- **Fase B — RAG sobre os logs**: indexar os DEV-LOGs acumulados para consulta
  semântica. Só vale a pena com ~10+ logs; antes disso, busca em texto resolve.
  O formato markdown estruturado já nasce "RAG-ready".
- **Fase C — Agente tutor da área de membros**: app (LangChain/LangGraph) que
  responde dúvidas dos alunos consultando a base da Fase B. É um produto completo
  (auth, frontend, vector DB) e terá brainstorm/spec próprio.

## Critérios de sucesso

- Iniciar um projeto novo com o kit leva < 1 minuto (copiar uma pasta).
- Qualquer das 3 ferramentas registra no mesmo formato, sem instrução manual.
- Ao final de um projeto, a extração para o curso é mecânica (copiar arquivos),
  não arqueologia de histórico de chat.
