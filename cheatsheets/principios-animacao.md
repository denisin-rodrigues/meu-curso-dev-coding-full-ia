# Cheatsheet — Princípios de Animação Premium

Regras de motion extraídas do código dos 4 projetos. O que separa uma animação
"amadora" de uma "premium".

> `[A EXTRAIR/VALIDAR a partir do código real dos projetos]`

---

## Easing
- Nunca use `linear` para movimento de UI — parece robótico.
- Entradas: easings "out" (desaceleram no fim) → `power2.out`, `power3.out`.
- Saídas: easings "in". Loops/contínuos: `inOut`.

## Duração
- Micro-interações: ~0.15–0.3s
- Entradas de elementos: ~0.5–0.8s
- Transições de seção / hero: ~0.8–1.2s
- Mantenha consistência — durações aleatórias quebram a sensação premium.

## Stagger
- Listas/grupos: 0.05–0.12s entre itens cria ritmo.
- Stagger pequeno demais = tudo junto; grande demais = lento.

## Scroll timing
- `scrub` para amarrar a animação ao scroll.
- Defina `start`/`end` com intenção, não no chute.
- Use `pin` com parcimônia — sequências, não a página inteira.

## Acessibilidade
- Sempre respeitar `prefers-reduced-motion`.

---

## Tabela de referência rápida

| Tipo | Duração | Easing | Stagger |
|------|---------|--------|---------|
| Micro-interação | 0.15–0.3s | `power2.out` | — |
| Entrada de elemento | 0.5–0.8s | `power3.out` | 0.05–0.12s |
| Hero / seção | 0.8–1.2s | custom / `power3.out` | conforme grupo |
