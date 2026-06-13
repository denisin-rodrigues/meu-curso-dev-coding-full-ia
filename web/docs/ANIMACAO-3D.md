# ANIMACao-3D.md — Inteligência de Animação (R3F + GSAP + Scroll)

> Armadilhas e padrões validados de animação 3D dirigida por scroll. **Leitura
> obrigatória antes de criar/alterar animação de cena 3D** (regra no AGENTS.md).
> Conhecimento pago com muitas iterações de debug — não o redescubra.

---

## ⚠️ Armadilha 1 — Refs dentro de `<Suspense>` chegam `null` no efeito

**Sintoma:** a animação "não roda" — o objeto fica parado na posição default
`(0,0,0)`. Parece que o scroll não funciona (o fundo HTML rola e dá ilusão de
movimento), mas o objeto 3D nunca se move.

**Causa raiz:** se o `<group ref={...}>` que você anima está **dentro** de um
`<Suspense>` cujo filho suspende (ex: `<Basketball>` carregando texturas via
`useTexture`), o subárvore não monta enquanto o fallback está ativo. Quando o
`useGSAP`/`useEffect` roda, `ref.current` é `null` → early-return → animação
nunca é criada.

**Correção validada:** mantenha os grupos controlados **FORA** do Suspense; deixe
suspender só o componente que carrega assets, internamente:
```tsx
<group ref={ball} scale={BALL_SCALE}>
  <Suspense fallback={null}>
    <Basketball />   {/* só ISTO suspende */}
  </Suspense>
</group>
```

## ⚠️ Armadilha 2 — `keyframes` do GSAP com `duration` por quadro

**Sintoma:** a tween para no primeiro keyframe; `progress(1)` não chega ao último.

**Causa:** a forma `to(obj, { keyframes: [{...,duration},{...,duration}] })` tem
semântica de duração traiçoeira — as durações por quadro nem sempre somam como se
espera, e a tween roda só o primeiro trecho.

**Correção:** evite o atalho `keyframes`. Para múltiplos passos use **uma fonte de
verdade explícita** (ver Padrão abaixo) ou tweens com posições relativas `">"`.

## ⚠️ Armadilha 3 — Múltiplas tweens na mesma propriedade se anulam

**Sintoma:** encadear `.to(obj.position,...).to(obj.position,...)` produz resultado
errado; passos do meio não acontecem.

**Causa:** `overwrite` do GSAP e/ou posições absolutas em segundos (não frações)
fazem tweens da mesma propriedade conflitarem na timeline.

---

## ⚠️ Armadilha 4 — `scroll-behavior: smooth` quebra o scrub

**Sintoma:** os objetos parecem **parados/congelados**; a animação não acompanha o
scroll (parece que tudo só "rola junto" com a página).

**Causa:** `scroll-behavior: smooth` no CSS (html/body) conflita com o `scrub` do
ScrollTrigger — está na lista oficial de erros comuns do GSAP. Remova essa
propriedade do `globals.css`.

**Bônus de robustez:** registre só `gsap.registerPlugin(ScrollTrigger)` (NÃO passe
`useGSAP` como plugin), use `invalidateOnRefresh: true` e chame `ScrollTrigger.refresh()`
após criar a animação (garante medidas certas após o canvas/conteúdo assentarem).

## ✅ Padrão validado — Câmera panorâmica numa "quadra vertical"

Para "objeto no topo viaja até um alvo FIXO no fim da página": modele um mundo
vertical alto — objeto começa em `y=0`, alvo fixo em `y=HOOP_Y` (negativo, lá
embaixo). O scroll **desce a câmera** (`camera.position.y`) de enquadrar o objeto
até enquadrar o alvo. O alvo nunca se move → fica genuinamente "no fim". A queda do
objeto usa **física de projétil** (`y ∝ p^1.8 ≈ ½gt²`) para "pesar" ao cair.
(Ver `src/three/scene/ShotExperience.tsx`.)

## ✅ Padrão validado — Scroll storytelling com 1 fonte de verdade

Em vez de orquestrar N tweens, **scrube um único progresso `0→1`** e calcule o
estado por interpolação entre waypoints. Bulletproof, testável e didático.
(Ver `src/three/scene/ShotExperience.tsx`.)

```ts
const state = { p: 0 };
gsap.to(state, {
  p: 1, ease: "none",
  scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.2 },
  onUpdate: () => apply(state.p),   // apply() interpola TRACK[] e seta position/scale
});
```
- `TRACK` = array de waypoints `{ p, x, y, z, s }`; `sampleTrack(p)` faz `lerp` com
  `smoothstep` entre o par de waypoints que cerca `p`.
- Efeitos secundários (ex: pulso da rede) também são função de `p` → determinísticos
  e reversíveis com o scroll.

### Escala real entre objetos
Objetos de projetos diferentes têm escalas diferentes (bola raio 1 vs cesta em
metros). **Unifique para o mundo real**: bola Ø24cm → `scale 0.12`; aro Ø42cm
interno → a bola passa com folga. Proporção correta nasce de graça.

### Verificação confiável no preview
O preview em segundo plano **estrangula o `requestAnimationFrame`** e o scroll
dessincroniza — capturar o frame final via scroll é instável. Para validar a
composição de um estado específico, force-o direto (`apply(1)`) num diagnóstico
temporário, conferindo posições por log antes de confiar no screenshot.

### Easings (cheatsheet de motion)
Subida/aproximação `power1-2.out` (desacelera no alvo); queda `power2.in` (acelera —
gravidade); squash elástico `elastic.out(1,0.4)`. Nunca `linear` para movimento de UI.
