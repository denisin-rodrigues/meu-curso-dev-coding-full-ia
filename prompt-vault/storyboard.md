# Prompt Vault — Storyboard de Movimento

Template para gerar **storyboards** (tiras de beats) de animações de objetos 3D em
ferramentas de imagem (Nano Banana etc.). Comunica a INTENÇÃO do movimento antes de
codar — entra na Etapa 1 do START (Briefing de Movimento).

> Imagem comunica **forma** (ver `documentacao-visual.md`). Movimento é **temporal**:
> a referência mais rica é **vídeo/GIF/link de site**. O storyboard estático é o
> segundo melhor — alinha os beats e o arco antes do build. Ver `web/docs/ANIMACAO-3D.md`.

---

## ⚠️ Regras

- Storyboard mostra **poses-chave (beats)** + o **arco da trajetória** como linha.
- NÃO peça números/cotas (a IA de imagem alucina). Timing e easing ficam no
  **Motion Spec** (dado tipado), não na imagem.
- Cada beat = um momento; a sequência conta a história do movimento.

---

## Template mestre (preencha e cole na ferramenta de imagem)

```
Storyboard / motion study sheet of [OBJETO] animation, [N] sequential panels in a
row (left to right), clean white background with subtle grid, minimalist style.

Each panel shows the SAME object at a key beat of the motion:
- Panel 1 — [BEAT 1, ex: "hero: ball large at top"]
- Panel 2 — [BEAT 2, ex: "ball falling, mid-air, motion blur down"]
- Panel 3 — [BEAT 3, ex: "ball crossing the rim"]
- Panel 4 — [BEAT 4, ex: "ball settled in the net, net bulging"]

Across all panels, draw the trajectory as a thin dashed arc line showing the path
the object travels. Add small motion arrows indicating direction at each beat.

Object: [descrição curta e consistente do objeto]
Camera: [fixa? acompanha? ex: "camera pans down following the ball"]

Style: clean animation storyboard, flat panels, consistent object across panels,
soft neutral look. NO dimension numbers, NO measurement callouts.
```

---

## Como vira código (Etapa 1 → 3 do START)

1. Referência rica: **vídeo/GIF/link** do efeito desejado.
2. (opcional) `ffmpeg` extrai 4-6 key frames do vídeo → viram o storyboard
   (a IA de código lê imagens). Ver `web/docs/ANIMACAO-3D.md`.
3. Storyboard + beats em palavras → **Motion Spec tipado** (`src/content/*Motion.ts`,
   validado por `motion.schema.ts`) — o PLANO como dado.
4. O código (R3F + GSAP) só executa o spec (`sampleMotion`).

## Ideia futura (registrada)

Sistema dentro do framework onde o **usuário monta o storyboard** (arrasta beats /
desenha o arco numa UI) e isso gera o Motion Spec automaticamente. Papo pra frente —
fica como norte; hoje o fluxo é referência → storyboard → spec manual.
