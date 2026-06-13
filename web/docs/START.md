# START.md — Ponto de Entrada: Criar um Objeto 3D

> **Roteiro obrigatório** para criar ou replicar qualquer objeto 3D neste laboratório
> (regra no AGENTS.md). A IA segue estas etapas em ordem, com os portões de qualidade.
> O usuário inicia tudo com UMA frase + UMA referência.

---

## 🚀 O start do usuário (é só isso)

```
Quero criar um objeto 3D: [nome do objeto].
Referência em public/reference/[arquivo].png
```

A partir daí, **a IA conduz o processo abaixo** — o usuário só decide nos portões.

---

## Por que existe (fundamento de engenharia)

Cada etapa tem um **portão de saída** (*definition of done* da etapa): critérios
objetivos que precisam estar satisfeitos antes de avançar. Princípio comprovado em
engenharia: **quanto mais caro é errar numa etapa, mais barato é colocar um portão
antes dela** — checklists operacionais reduzem erro justamente nos passos que
parecem óbvios (aviação e cirurgia usam isso há décadas; o Projeto 01 provou aqui:
a geometria foi barata, a textura sem contexto prévio custou dezenas de iterações).

---

## ETAPA 0 — REFERÊNCIA

A IA confirma que existe matéria-prima antes de qualquer outra coisa.

- [ ] Foto(s) de referência salvas em `public/reference/`
- [ ] Usuário respondeu: **o que torna esse objeto impressionante?** (3–5 pontos)
- [ ] Resultado-alvo claro: replicar a foto? estilizar? interativo ou estático?

**Portão 0:** sem referência visual salva no repositório, **não avance**. Peça-a.

---

## ETAPA 1 — CONTEXTO TÉCNICO (antes de qualquer código)

O "brainstorming obrigatório" deste framework. Duas frentes, nesta ordem:

### 1a. Decisões de arquitetura (`/architect` ou equivalente)
- [ ] Geometria: primitiva, lathe, modelada? Quantos segmentos?
- [ ] **Escala real do objeto em unidades físicas** (cm/mm — crítico para texturas)
- [ ] Materiais envolvidos (liste TODOS: ex. cesta = metal + nylon + acrílico)
- [ ] Interação: orbit? drag? animação de entrada? física?
- [ ] R3F ou Three puro? (ver fronteira no AGENTS.md)

### 1b. Inteligência de materiais (`docs/MATERIAIS.md`)
Para **cada** material listado:
- [ ] Já existe seção validada no MATERIAIS.md? → **reusar** física + parâmetros
- [ ] Material novo? → **Protocolo de Documentação Visual ANTES de gerar textura:**
      vistas ortográficas · medidas e proporções · ampliações da superfície ·
      estudo do material (luz/brilho) · padrões geométricos
- [ ] Anti-referências anotadas (o que o material **não** é)

### 1c. Briefing de Movimento (só se houver animação)
Se o objeto vai se mover/reagir (scroll, intro, interação):
- [ ] **Referência rica:** vídeo/GIF/link de site do efeito desejado (movimento é
      temporal — vídeo > imagem). `ffmpeg` extrai key frames se útil.
- [ ] **Beats em palavras:** os momentos-chave (ex: hero → cai → cruza aro → rede pulsa)
- [ ] **Storyboard** (opcional): ver `prompt-vault/storyboard.md`
- [ ] O plano vira **Motion Spec tipado** (`src/content/*Motion.ts` + `motion.schema.ts`),
      não lógica solta no componente. Ver `docs/ANIMACAO-3D.md`.

**Portão 1:** plano apresentado ao usuário e **aprovado explicitamente**.
Nenhum código antes do "sim". (Evidência local: DEV-LOG 2026-06-12 — mais contexto
visual estruturado superou mais prompts de texto.)

---

## ETAPA 2 — PROMPT ESTRUTURADO

- [ ] Formato: **contexto + referência visual + regras técnicas + output esperado**
- [ ] Escala dos detalhes em unidades reais (ex: "grão 1–2 mm em bola de 24 cm")
- [ ] Anti-referências incluídas no prompt
- [ ] Imagens de apoio anexadas (as da Etapa 1b)

**Portão 2:** prompt registrado — se gerar resultado premium, vai **verbatim** ao
`PROMPTS.md` (regra do AGENTS.md).

---

## ETAPA 3 — BUILD ITERATIVO

- [ ] Seguir `docs/AGENT-PLAYBOOK.md` (um subagent por etapa, revisão dupla)
- [ ] Ordem: geometria → material/textura → iluminação → interação
- [ ] Cada iteração: rodar, comparar com a referência, ajustar UMA variável por vez
- [ ] `npx tsc --noEmit` e testes passando a cada marco (portão técnico do AGENTS.md)
- [ ] 2 diagnósticos de causa-raiz errados seguidos? → pare e use `/recover`
      (contexto poluído se recupera com reset, não com mais prompts)

**Portão 3:** lado a lado com a foto de referência, o usuário valida: "é esse o objeto".

---

## ETAPA 4 — POLISH + CONSOLIDAÇÃO DA MEMÓRIA

- [ ] Motion premium: easings (nunca linear), durações consistentes, inércia
- [ ] Luz/pós: HDRI, sombras de contato, bloom/AA conforme o caso
- [ ] `prefers-reduced-motion` respeitado

**Portão 4 — saída do processo (definition of done):**
- [ ] Marco registrado no `DEV-LOG.md` (pedido, feito, decisões, iterações)
- [ ] Prompts vencedores no `PROMPTS.md`
- [ ] Material novo validado → **nova seção no `docs/MATERIAIS.md`**
- [ ] Usuário deu o aceite final comparando com a referência

> Um objeto só está "pronto" quando o **conhecimento** dele está consolidado.
> Objeto no ar com memória vazia = processo falhou (funcionou, mas não é replicável —
> e replicável é o produto deste curso).

---

## Resumo visual

```
Frase do usuário + foto
        │
   [Portão 0] referência existe?
        │
ETAPA 1: contexto técnico ──── MATERIAIS.md (reusar ou protocolo visual)
        │
   [Portão 1] plano aprovado pelo usuário
        │
ETAPA 2: prompt estruturado
        │
ETAPA 3: build iterativo ──── /recover se travar
        │
   [Portão 3] bate com a referência?
        │
ETAPA 4: polish
        │
   [Portão 4] DEV-LOG + PROMPTS + MATERIAIS atualizados → PRONTO
```
