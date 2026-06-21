# Documentação Visual — Reference Sheets e Storyboard

Templates de prompt para gerar referência em ferramentas de imagem (Nano Banana,
Midjourney etc.). Comunicam forma e material à IA de imagem e ao build.

## ⚠️ Regra de ouro: imagem mostra, texto mede

Modelos de imagem **alucinam números** ("Ø 17230", "30.5m", "SCALE SCALE"). Por isso:
nunca peça cotas/medidas na imagem (peça explicitamente para NÃO ter). As medidas
reais ficam no markdown/spec, escritas por você. A imagem carrega o que faz bem:
forma, proporção, textura, ângulos, luz. Anti-referências também entram no prompt da
imagem (o gerador comete os mesmos erros do gerador de textura).

Checklist de aceitação da folha: objeto idêntico entre as vistas? escala do grão
uniforme? sem números inventados? close-ups mostram o material certo? Reprovou →
regenerar (folha ambígua produz textura ambígua).

## Folha 1 — Forma e ângulos (template)

```
Technical reference sheet of [OBJETO], engineering blueprint style, product design
documentation. Clean white background with subtle gray grid.
Row 1: orthographic views FRONT, BACK, LEFT, RIGHT — same object, same scale,
perfectly consistent, centered, no perspective distortion.
Row 2: TOP, BOTTOM, plus two 45-degree three-quarter views.
Object (identical in every view): [forma/proporções] · [cores nomeadas] · [acabamento].
Lighting: soft neutral studio, true colors, no colored light, no dramatic shadows.
Labels: only short view names. Absolutely NO dimension numbers, NO measurement
callouts, NO scale bars, NO annotation arrows.
Style: photorealistic object on a technical drawing sheet, sharp focus, 4k.
```

## Folha 2 — Material e superfície (template)

```
Material study sheet of [MATERIAL], engineering documentation style. Clean white
background with subtle gray grid. Panels in a grid, clearly separated:
1. Flat texture swatch, viewed perfectly straight-on, even flat lighting, seamless.
2. Macro close-up of the surface grain.
3. Extreme macro of the microstructure ([grão/padrão]).
4. Material cross-section showing internal layers ([camadas]).
5. Close-up of [detalhe construtivo, ex: costura].
6. Light-behavior study on a curved surface ([comportamento, ex: semi-matte]).
Material truth (every panel): [o que É — física] · [o que NÃO é — anti-referências].
Labels: short captions only. NO dimension numbers, NO measurements.
Style: photorealistic macro photography on a technical sheet, sharp focus, 4k.
```

## Storyboard de movimento (template)

Movimento é temporal — a referência mais rica é vídeo/GIF/link de site; o storyboard
estático é o segundo melhor (alinha os beats antes de codar).

```
Storyboard / motion study of [OBJETO] animation, [N] sequential panels left to right,
clean white background with subtle grid. Each panel = the SAME object at a key beat:
- Panel 1 — [beat 1] ... Panel N — [beat N].
Draw the trajectory as a thin dashed arc with small motion arrows per beat.
Camera: [fixa? acompanha?]. NO dimension numbers, NO measurements.
```

## Como vira código

1. Referência rica (vídeo/GIF/link). 2. Folhas geradas → `reference/<objeto>/`.
3. Medidas reais escritas no spec/`materiais.md`. 4. Build (geometria → material →
luz → interação). 5. Animação como Motion Spec (ver `animacao-3d.md`).
