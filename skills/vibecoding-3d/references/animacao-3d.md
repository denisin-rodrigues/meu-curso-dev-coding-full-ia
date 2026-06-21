# Inteligência de Animação (R3F + GSAP + Scroll)

Armadilhas e padrões validados. Ao descobrir uma armadilha nova, registre-a aqui.

## ⚠️ Armadilha 1 — Refs dentro de `<Suspense>` chegam null no efeito

**Sintoma:** a animação "não roda"; o objeto fica parado em (0,0,0) e só o HTML de
fundo rola (ilusão de movimento). **Causa:** se o `<group ref>` que você anima está
dentro de um `<Suspense>` cujo filho suspende (ex: carregando textura), o subárvore
não monta enquanto o fallback está ativo → `ref.current` é null quando o efeito roda.
**Correção:** mantenha os grupos controlados FORA do Suspense; suspenda só o
componente que carrega assets, internamente.

## ⚠️ Armadilha 2 — `keyframes` do GSAP com `duration` por quadro

**Sintoma:** a tween para no 1º keyframe; `progress(1)` não chega ao último.
**Correção:** evite o atalho `keyframes`; use uma fonte de verdade explícita
(waypoints, abaixo) ou tweens sequenciais.

## ⚠️ Armadilha 3 — Múltiplas tweens na mesma propriedade se anulam

`overwrite` do GSAP e/ou posições absolutas em segundos (não frações) fazem tweens
da mesma propriedade conflitarem. **Correção:** padrão de progresso único (abaixo).

## ⚠️ Armadilha 4 — `scroll-behavior: smooth` quebra o scrub

**Sintoma:** objetos parecem parados; a animação não acompanha o scroll. **Causa:**
`scroll-behavior: smooth` no CSS conflita com o `scrub` do ScrollTrigger. Remova-o.
Bônus: registre só `gsap.registerPlugin(ScrollTrigger)`, use `invalidateOnRefresh:
true` e chame `ScrollTrigger.refresh()` após criar a animação.

## ✅ Padrão — Motion Spec (o plano como DADO)

Animação é matemática (posição no tempo). A IA raciocina melhor sobre dado do que
sobre pixels de vídeo. Coloque o plano num spec declarativo e validado (Zod):
keyframes `{p,x,y,z,scale,ease}`, track escalar `{p,v,ease}` (ex: câmera) e eventos
(ex: pulso). Um `sampleMotion(spec, p)` interpola com easings nomeados. O componente
só **executa** o spec no `onUpdate` do scroll. Benefícios: diff-ável, testável,
reutilizável. `gravityIn` (t²) é a queda física real (aceleração constante).

## ✅ Padrão — Câmera panorâmica numa "quadra vertical"

Para "objeto no topo viaja até um alvo FIXO no fim da página": modele um mundo
vertical alto — objeto em y=0, alvo fixo em y negativo (lá embaixo). O scroll **desce
a câmera** (`camera.position.y`) de enquadrar o objeto até enquadrar o alvo. O alvo
nunca se move → fica "no fim". A queda usa física de projétil (`y ∝ p^1.8 ≈ ½gt²`).

## ✅ Padrão — Scroll storytelling com 1 fonte de verdade

Scrube um único progresso 0→1 e calcule o estado por interpolação entre waypoints
(`smoothstep`). Robusto, testável, didático. Efeitos secundários (ex: rede pulsando)
também viram função de `p` → determinísticos e reversíveis com o scroll.

## Verificação confiável no preview

Preview em segundo plano estrangula o `requestAnimationFrame` e dessincroniza o
scroll — capturar o frame final via scroll é instável. Para validar um estado
específico, force-o direto (ex: `apply(1)`) num diagnóstico temporário, conferindo
posições por log antes de confiar no screenshot. O build limpo é a prova autoritativa.

## Referência de movimento: vídeo > imagem (e a ponte ffmpeg)

A IA de código não consome vídeo como entrada. A referência rica (vídeo/GIF/site) é
para o humano + extração: `ffmpeg -i ref.mp4 -vf fps=2 frame_%02d.png` → vira
storyboard (a IA lê imagens) → vira Motion Spec.

## Easings (cheatsheet)

Subida/aproximação `power1-2.out`; queda `power2.in`/`gravityIn` (gravidade); squash
elástico `elastic.out(1,0.4)`. Nunca `linear` para movimento de UI.
