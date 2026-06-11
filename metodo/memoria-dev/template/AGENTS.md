# Regras do Projeto — Memória de Desenvolvimento (VibeCoding)

> Este arquivo é lido por Codex, Antigravity e (via CLAUDE.md) Claude Code.
> Ele define como a IA deve se comportar NESTE projeto. Não remova.

## Idioma

Todo o material gerado (comentários, documentação, registros) em **português brasileiro**.

## 📓 REGRA PRINCIPAL — Registro automático do processo

Este projeto mantém uma memória de desenvolvimento em dois arquivos na raiz.
**Você (IA) é responsável por mantê-los atualizados sem que o usuário peça.**

### 1. `DEV-LOG.md` — registrar a cada marco

Um **marco** é qualquer um destes eventos:
- Uma seção/funcionalidade nova ficou pronta (ex: hero, navbar, seção de produtos)
- Uma animação foi criada ou refinada (polish)
- Um bug relevante foi resolvido
- Uma decisão técnica ou de design foi tomada (stack, biblioteca, abordagem)
- O deploy foi feito

Ao completar um marco, **adicione** (nunca edite entradas antigas) uma entrada no
`DEV-LOG.md` seguindo o template que está dentro do próprio arquivo. A entrada deve ser
**curta e didática** — escrita para alguém que vai aprender com este processo depois:
- **Pedido:** a intenção do usuário, parafraseada em 1-2 linhas
- **O que foi feito:** abordagem, arquivos criados/alterados, bibliotecas usadas
- **Decisões e porquês:** por que esse caminho e não outro
- **Iterações:** se precisou de várias tentativas, o que mudou entre elas

### 2. `PROMPTS.md` — salvar prompts reutilizáveis VERBATIM

Quando o prompt do usuário for **bom o suficiente para virar template** (gerou um
resultado premium, resolveu algo difícil, ou tem estrutura clara de
contexto + referência + regras + output), copie-o **palavra por palavra** para o
`PROMPTS.md`, na categoria certa:

| Categoria | Quando usar |
|-----------|-------------|
| `hero` | Primeira dobra, seções de abertura |
| `animacao-scroll` | ScrollTrigger, parallax, reveal, pin |
| `design-system` | Extração de referência, DESIGN.md, cores/tipografia |
| `polish` | Refinamento de motion: easings, durações, stagger |
| `outros` | O que não couber acima |

Junto do prompt verbatim, anote em 1 linha **o que ele gerou** e um link/referência
para a entrada correspondente do `DEV-LOG.md`.

### Regras dos dois arquivos

- **Append-only:** nunca apague nem reescreva entradas anteriores.
- **Sem ruído:** não registre interações triviais (perguntas, ajustes de vírgula).
- **No fim de uma sessão longa:** se houver marcos não registrados, registre antes de encerrar.

## Método VibeCoding (contexto)

Este projeto segue o método de 5 etapas: REFERÊNCIA → EXTRAÇÃO (DESIGN.md) →
PROMPT → BUILD → POLISH. Os registros alimentam o material do curso
"DEV CODING FULL IA", então clareza didática importa mais que exaustividade.
