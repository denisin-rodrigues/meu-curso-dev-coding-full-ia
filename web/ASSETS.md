# Assets do Projeto 01 — Bola Jordan 3D

> Onde colocar as imagens/texturas do projeto. Tudo que é carregado em runtime pelo
> Three.js **precisa** ficar em `public/` (servido por URL). A foto de referência é só
> para calibração (não vai no render), mas fica aqui por organização.

## 📁 `public/reference/` — referência visual (não renderizada)

| Arquivo | O que é |
|---------|---------|
| `jordan-ball.png` | **A foto-alvo** que você mandou. Usada para calibrar cor/ângulo e como guia do design. **← coloque aqui** |

## 📁 `public/textures/basketball/` — mapas PBR (CC0 + albedo custom)

A base escaneada (normal/roughness/AO) vem de um set CC0 (PolyHaven/ambientCG) — eu busco.
O `albedo` é o nosso (azul Carolina + elephant print + gomos brancos), derivado do albedo
CC0 para alinhar com o normal.

| Arquivo | O que é | Origem |
|---------|---------|--------|
| `albedo.jpg`       | cor (azul + estampa + gomos brancos) | custom (nós) |
| `normal.jpg`       | granulado + ranhuras dos gomos        | CC0 |
| `roughness.jpg`    | variação de brilho do couro           | CC0 |
| `ao.jpg`           | oclusão ambiente nas frestas          | CC0 |
| `displacement.jpg` | *(opcional, polish)* profundidade dos gomos | CC0 |

## 📁 `public/decals/` — logo

| Arquivo | O que é |
|---------|---------|
| `jumpman.png` | **silhueta do logo em PNG com fundo transparente**, aplicada como decal. **← você fornece** (ou usamos um placeholder genérico nesta fase) |

---

### O que você precisa soltar agora
1. **`public/reference/jordan-ball.png`** — a foto que você mostrou.
2. **`public/decals/jumpman.png`** — se já tiver a silhueta transparente (senão, sigo com placeholder).

O resto (texturas CC0) eu providencio na fase de build.

> ⚠️ **Marca registrada:** o "Jumpman" é da Nike/Jordan. OK para laboratório privado de
> estudo; se publicar, troque por uma marca original. (Registrado no spec.)
