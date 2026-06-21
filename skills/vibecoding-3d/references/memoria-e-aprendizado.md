# Memória e Loop de Aprendizado

O que torna esta skill mais inteligente a cada projeto: registrar o processo e
**promover** os aprendizados validados de volta para a skill.

## Memória do projeto (dentro de cada projeto)

Mantenha dois arquivos na raiz do projeto, append-only:

- `DEV-LOG.md` — a cada marco (seção/feature pronta, animação criada, bug relevante
  resolvido, decisão técnica, deploy): **Pedido** (intenção em 1-2 linhas) · **O que
  foi feito** (abordagem, arquivos, libs) · **Decisões e porquês** · **Iterações** (o
  que mudou entre tentativas, ou "primeira tentativa funcionou").
- `PROMPTS.md` — prompts que viraram template (geraram resultado premium ou resolveram
  algo difícil), salvos **verbatim**, por categoria, com 1 linha do que geraram.

Regras: clareza didática importa mais que exaustividade; não registrar trivialidades;
registrar marcos pendentes antes de encerrar uma sessão longa.

## O loop de compounding (Portão 4)

Ao concluir um objeto, além de registrar no projeto, **promova o que é universal**
para esta skill:

- Material novo validado → nova seção em `materiais.md` (física, anti-referências,
  parâmetros).
- Armadilha nova de animação/scroll → nova seção em `animacao-3d.md`.
- Prompt de geração/documentação que funcionou muito bem → `documentacao-visual.md`.

Assim o conhecimento não fica preso num projeto — vira capacidade reutilizável. É o
precursor manual de um RAG: quando o volume justificar (muitos projetos), indexar
estes registros para busca semântica. Antes disso, leitura por regra tem recall de
100% e é mais simples.

## Disciplina de escopo (importante com várias IAs)

Altere apenas o que o pedido abrange. Não "melhore", recolora, re-gere texturas,
troque logos ou refatore fora do escopo — mesmo que pareçam imperfeitos. Se notar
algo fora do pedido que merece correção, **aponte e pergunte antes de mexer**.
Mudanças-surpresa quebram a confiança do usuário no processo.
