# Design — Landing do Curso (vitrine "Dev Coding Full IA")

> Spec validado em brainstorm em 2026-06-13. Escopo: redesenhar a landing (`/`)
> como vitrine do curso, usando a cena 3D do arremesso como herói e o design
> system "Slam Dunk" adaptado (branco + preto + azul).

## Objetivo

A landing vende o curso "Dev Coding Full IA", usando os projetos 3D como prova:
*"este site foi feito com o método que você vai aprender"*. Público leigo/iniciante
(designers, criadores). Copy em português do Brasil. Pré-lançamento: sem captura
de dados (CTA decorativo).

## Design system (Slam Dunk adaptado)

Referência: `Slam Dunk Store.html`. Estética plana, "punchy", esportiva premium.

- **Tipografia:** `Anton` para títulos (gigante, condensada, caixa-alta) + `Inter`
  para texto. Adicionar via `next/font/google` no `layout.tsx`.
- **Paleta (troca de cores aprovada):**
  - Fundo: branco `#FFFFFF` (a bola azul salta no branco) — herói e conteúdo
  - Títulos/texto: tinta quase-preta `#0E0E0E` (preto sobre branco = pegada esportiva)
  - Acento primário (CTA, links, destaques): azul forte `#1565C0`
  - Glow + texto-fantasma de contorno: ciano `#47C1E8` (harmoniza com a bola)
  - Cinza de apoio (texto secundário): `#5F5E5A`
- **Efeitos:** `text-outline` (título fantasma só com contorno, em ciano), `glow`
  azul, `fade-in`. Sem gradientes pesados; plano.
- Tokens definidos no `globals.css` (`@theme inline` do Tailwind v4).

## Estrutura — 2 atos

### Ato 1 — Herói imersivo (a cena É a landing)
- A cena do arremesso (`ShotExperience`) é a espinha. O canvas fica **`sticky`
  top:0 h:100vh** dentro de um wrapper alto (~350vh) — gruda na tela enquanto
  o Ato 1 rola e **se solta** ao entrar no Ato 2 (sem vazar por cima do conteúdo).
- Sobre o 3D, blocos de copy (Anton preto) cronometrados ao scroll:
  - Topo (bola no alto): nome do curso + promessa + botão "Em breve" (azul)
  - Meio (bola caindo): 1–2 frases de valor
  - Fim (swish): frase de virada que leva ao Ato 2
- Fundo da cena 3D muda de `#F4F6F8` para branco puro (canvas integrado à página).

### Ato 2 — Prova (scroll normal, fundo branco)
- Seção "O Método em 5 passos": Referência → Contexto → Prompt → Build → Polish.
  Cada passo = um card (Anton no número/título, Inter no texto) com **espaço
  marcado para imagem** (`[print aqui]`), pro autor preencher depois.
- Fecho: CTA "Em breve" (botão decorativo azul, sem backend).

## Componentes (isolamento)

- `app/page.tsx` — composição da landing (Ato 1 wrapper sticky + Ato 2 seções).
- `ShotExperience` — parametrizar o `ScrollTrigger` para aceitar o **elemento
  trigger** (o wrapper do Ato 1) em vez de `"body"`, para o pan da câmera mapear
  só o Ato 1. Default continua `"body"` (não quebra `/arremesso`).
- `components/landing/Hero.tsx`, `MethodSteps.tsx`, `CtaEmBreve.tsx` — seções
  isoladas, copy vinda de `content/`.
- `content/home.ts` (+ schema existente) — estender com a copy do curso, validada.
- `layout.tsx` — fontes Anton + Inter; `globals.css` — tokens de cor.

## Fora de escopo

- Captura de email / backend / Supabase (CTA é decorativo).
- Produção das imagens do método (ficam placeholders marcados).
- `BasketballExperience` (cena bola-só) fica órfã — remover em limpeza separada,
  não neste escopo (disciplina de escopo).

## Critérios de sucesso

- Ato 1: a cena do arremesso roda no scroll (bola cai na cesta) com a copy do
  curso por cima; canvas gruda e solta certo entre os atos.
- Ato 2: os 5 passos legíveis em fundo branco, com espaços de imagem.
- Visual: Anton preto + fundo branco + azul de acento; a bola azul salta.
- `npx tsc --noEmit` limpo e testes passando.
- `/arremesso` e `/cesta` continuam funcionando (não regredir).
