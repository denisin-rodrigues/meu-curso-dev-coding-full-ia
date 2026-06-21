# vibecoding-3d (skill)

O método VibeCoding para criar objetos e cenas 3D premium na web, empacotado como
skill portátil. Destilado de projetos reais (bola Jordan, cesta clay, arremesso por
scroll) — carrega o processo com portões **e** as armadilhas já depuradas.

## Estrutura

```
vibecoding-3d/
├── SKILL.md                      # orquestrador: o método (START) + tipagem + portões
└── references/
    ├── materiais.md              # física, anti-referências e parâmetros por material
    ├── animacao-3d.md            # Motion Spec + 4 armadilhas de GSAP/R3F/scroll
    ├── documentacao-visual.md    # templates de reference sheet e storyboard
    └── memoria-e-aprendizado.md  # ritual de memória + loop de compounding
```

## Como usar

- **Claude Code (local):** copie a pasta `vibecoding-3d/` para `~/.claude/skills/`.
  Ela passa a ser invocável em qualquer projeto.
- **Via `npx skills` (a partir deste repo):**
  `npx skills add denisin-rodrigues/meu-curso-dev-coding-full-ia`
- A skill dispara sozinha quando o pedido envolver criar/animar objeto 3D, landing
  com 3D, ou mencionar Three.js / R3F / GSAP (ver o `description` no SKILL.md).

## Como ela fica mais inteligente

No Portão 4 de cada projeto, promova os aprendizados validados de volta para as
`references/` (material novo, armadilha nova, prompt campeão). Cada projeto deixa a
skill mais esperta — é o loop de compounding (precursor manual de um RAG).
