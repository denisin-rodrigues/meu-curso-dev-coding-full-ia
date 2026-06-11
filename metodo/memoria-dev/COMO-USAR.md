# Kit Memória de Dev — Como Usar

Sistema portátil que faz a IA **registrar sozinha** o processo de desenvolvimento
de cada projeto: seus prompts, o que ela gerou e as decisões tomadas.

## Por que existe

Você não consegue (nem deve) anotar tudo manualmente. Com este kit, cada projeto
nasce com uma regra permanente: a IA mantém um diário do desenvolvimento
(`DEV-LOG.md`) e uma coleção de prompts reutilizáveis (`PROMPTS.md`). No fim do
projeto, esse material alimenta o curso (prompt-vault, cheatsheets, estudos de caso).

## Como iniciar um projeto novo (< 1 minuto)

1. Crie a pasta do projeto novo (cada projeto em pasta separada).
2. **Copie os 4 arquivos de [`template/`](template/) para a raiz do projeto:**
   - `AGENTS.md` — regras canônicas (lido por Codex e Antigravity)
   - `CLAUDE.md` — ponteiro para o AGENTS.md (lido pelo Claude Code)
   - `DEV-LOG.md` — diário de marcos (começa vazio)
   - `PROMPTS.md` — prompts verbatim (começa vazio)
3. Preencha o cabeçalho do `DEV-LOG.md` (nome, referência, stack).
4. Desenvolva normalmente. A IA registra sozinha.

```powershell
# atalho no Windows (rode na pasta do projeto novo):
Copy-Item "caminho\para\meu-curso-dev-coding-full-ia\metodo\memoria-dev\template\*" .
```

## Compatibilidade por ferramenta

| Ferramenta | Como lê a regra | Observação |
|------------|-----------------|------------|
| **Claude Code** | `CLAUDE.md` → importa `@AGENTS.md` | Automático |
| **Codex** | `AGENTS.md` | Automático (padrão nativo) |
| **Antigravity** | `AGENTS.md` | Automático. Se a sua versão não ler, cole o conteúdo do AGENTS.md nas regras/memória do workspace |

## Boas práticas durante o desenvolvimento

- **Confie, mas confira:** de tempos em tempos, abra o `DEV-LOG.md` e veja se os
  marcos estão sendo registrados. Se a IA esquecer, diga apenas: *"registre o marco"*.
- **Fim de sessão:** antes de fechar uma sessão longa, peça *"registre os marcos
  pendentes no DEV-LOG"* — garante que nada se perde.
- **Não edite o histórico:** os arquivos são append-only de propósito. A linha do
  tempo real (com erros e iterações) é o material didático mais valioso.

## Ao terminar um projeto (extração para o curso)

1. Copie `DEV-LOG.md` e `PROMPTS.md` para `estudos-de-caso/projeto-XX/` neste repositório.
2. Promova os melhores prompts do `PROMPTS.md` para o [`prompt-vault/`](../../prompt-vault/) (transformando em template genérico).
3. Extraia regras de motion/design que apareceram nas iterações para os [`cheatsheets/`](../../cheatsheets/).

## Futuro (norte — ver PROJETO.md)

- **Fase B:** com ~10+ DEV-LOGs acumulados, indexar tudo num RAG para consulta semântica.
- **Fase C:** agente tutor de IA na área de membros do curso, respondendo alunos com base nesses logs reais.
