# Bola Jordan 3D — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir no `web/` uma bola de basquete Jordan 3D fotorrealista e interativa que bata com a foto de referência.

**Architecture:** Texturas PBR **geradas por código** (Node + `sharp`: albedo com base `#56B4C3` + elephant print + gomos `#FFFAF4`; normal com granulado + ranhuras dos gomos; roughness) — um único gerador garante alinhamento gomo↔normal. Uma esfera R3F com `meshStandardMaterial` (map/normalMap/roughnessMap; oclusão assada no albedo, sem aoMap para evitar a pegadinha uv1/uv2 do three r151+) e o logo via `<Decal>`. Palco com `<Environment>` de estúdio, `<ContactShadows>`, pós-processamento (Bloom + SMAA) e `<OrbitControls>` (auto-giro + inércia).

**Tech Stack:** Next.js 16, R3F 9, drei 10, @react-three/postprocessing 3, three 0.184, zod 4, sharp (já incluso no Next), vitest.

**Spec:** `docs/superpowers/specs/2026-06-11-bola-jordan-3d-design.md`

**Refinos sobre o spec (decididos na escrita do plano):**
- §4/§5: texturas **geradas por código** (não download CC0 + recolor). Sem `aoMap` separado (oclusão assada no albedo) para evitar o rename `uv2`→`uv1`.
- Pós: **Bloom + SMAA** (SSAO fica como polish). Tone mapping ACES é o default do R3F.

**Convenções:** comandos rodam **dentro de `web/`**. Cada commit termina com a trailer
`Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`. Branch de feature dedicada
(`feat/bola-jordan-3d`) — criar antes da Task 1 se ainda estiver na `main`.

---

### Task 1: Gerador procedural de texturas

**Files:**
- Create: `web/scripts/gen-textures.mjs`
- Generates: `web/public/textures/basketball/albedo.jpg`, `normal.jpg`, `roughness.jpg`

- [ ] **Step 1: Criar o script gerador**

Create `web/scripts/gen-textures.mjs`:
```js
// Gera albedo/normal/roughness da bola Jordan, 100% por codigo (deterministico).
// Base #56B4C3 + elephant print (Worley) + gomos #FFFAF4 (assados no albedo e no normal).
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const S = 1024;
const OUT = "public/textures/basketball";
const BASE = [0x56, 0xb4, 0xc3];   // #56B4C3
const CELL = [0x8f, 0xd6, 0xdf];   // celulas claras do elephant print
const ACC  = [0xff, 0xfa, 0xf4];   // #FFFAF4 (gomos)

function mulberry32(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const rng = mulberry32(20260611);

// --- value-noise tilavel (fBm) p/ granulado ---
function makeGrid(G){const g=new Float32Array(G*G);for(let i=0;i<g.length;i++)g[i]=rng();return g;}
const GRIDS = [16,32,64,128].map(G=>({G,g:makeGrid(G)}));
const smooth = t => t*t*(3-2*t);
function sample(g,G,u,v){
  const x=u*G,y=v*G,x0=Math.floor(x),y0=Math.floor(y);
  const fx=smooth(x-x0),fy=smooth(y-y0);
  const X0=((x0%G)+G)%G,Y0=((y0%G)+G)%G,X1=(X0+1)%G,Y1=(Y0+1)%G;
  const a=g[Y0*G+X0],b=g[Y0*G+X1],c=g[Y1*G+X0],d=g[Y1*G+X1];
  return (a*(1-fx)+b*fx)*(1-fy)+(c*(1-fx)+d*fx)*fy;
}
function fbm(u,v){let s=0,amp=0.5,sum=0;for(const{G,g} of GRIDS){s+=amp*sample(g,G,u,v);sum+=amp;amp*=0.5;}return s/sum;}

// --- Worley (F1,F2) tilavel p/ elephant print ---
const NP=150, PTS=[];
for(let i=0;i<NP;i++)PTS.push([rng(),rng()]);
function worley(u,v){let f1=9,f2=9;for(const[px,py]of PTS){let dx=Math.abs(u-px);dx=Math.min(dx,1-dx);let dy=Math.abs(v-py);dy=Math.min(dy,1-dy);const d=dx*dx+dy*dy;if(d<f1){f2=f1;f1=d;}else if(d<f2)f2=d;}return[Math.sqrt(f1),Math.sqrt(f2)];}

// --- gomos: distancia as costuras (4 meridianos + equador) -> aproximacao paneled ---
function seam(u,v){
  let d=1;
  for(const mu of [0,0.25,0.5,0.75]){let du=Math.abs(u-mu);du=Math.min(du,1-du);if(du<d)d=du;}
  const de=Math.abs(v-0.5); if(de<d)d=de;
  const w=0.013;                       // meia-largura da costura
  return Math.max(0,1-d/w);            // 1 no centro da costura, 0 longe
}
const lerp=(a,b,t)=>a+(b-a)*t;
const mix3=(A,B,t)=>[lerp(A[0],B[0],t),lerp(A[1],B[1],t),lerp(A[2],B[2],t)];

// --- 1) campo de altura (granulado - groove das costuras) ---
const H=new Float32Array(S*S);
for(let y=0;y<S;y++)for(let x=0;x<S;x++){
  const u=x/S,v=y/S;
  const pebble=fbm(u*1,v*1)*0.5 + fbm(u*2,v*2)*0.5; // granulado multi-escala
  const groove=seam(u,v);
  H[y*S+x]=pebble*0.6 - groove*1.0;   // costuras afundam
}

// --- 2) normal a partir da altura (diferencas centrais, tilavel em u) ---
const STR=2.2;
const normalBuf=Buffer.alloc(S*S*3);
const at=(x,y)=>H[(((y%S)+S)%S)*S+(((x%S)+S)%S)];
for(let y=0;y<S;y++)for(let x=0;x<S;x++){
  const dx=(at(x+1,y)-at(x-1,y))*STR;
  const dy=(at(x,y+1)-at(x,y-1))*STR;
  let nx=-dx,ny=-dy,nz=1;const l=Math.hypot(nx,ny,nz);nx/=l;ny/=l;nz/=l;
  const i=(y*S+x)*3;
  normalBuf[i]=Math.round((nx*0.5+0.5)*255);
  normalBuf[i+1]=Math.round((ny*0.5+0.5)*255);
  normalBuf[i+2]=Math.round((nz*0.5+0.5)*255);
}

// --- 3) albedo + roughness ---
const albedoBuf=Buffer.alloc(S*S*3);
const roughBuf=Buffer.alloc(S*S);
for(let y=0;y<S;y++)for(let x=0;x<S;x++){
  const u=x/S,v=y/S;
  const [f1,f2]=worley(u,v);
  const cellMix=Math.min(1,f1*6);            // interior da celula mais claro
  const crack=Math.max(0,1-(f2-f1)*40);      // bordas escuras (craquelado)
  let col=mix3(BASE,CELL,cellMix*0.8);
  col=mix3(col,[col[0]*0.7,col[1]*0.7,col[2]*0.7],crack*0.5);
  const s=seam(u,v);
  col=mix3(col,ACC,s);                        // gomos brancos
  // AO assado: leve escurecimento nas bordas das celulas (craquelado)
  col=mix3(col,[col[0]*0.85,col[1]*0.85,col[2]*0.85],crack*0.3);
  const i3=(y*S+x)*3;
  albedoBuf[i3]=Math.round(col[0]);albedoBuf[i3+1]=Math.round(col[1]);albedoBuf[i3+2]=Math.round(col[2]);
  roughBuf[y*S+x]=Math.round((0.62 - s*0.15 + (fbm(u*4,v*4)-0.5)*0.1)*255);
}

await mkdir(OUT,{recursive:true});
await sharp(albedoBuf,{raw:{width:S,height:S,channels:3}}).jpeg({quality:92}).toFile(`${OUT}/albedo.jpg`);
await sharp(normalBuf,{raw:{width:S,height:S,channels:3}}).jpeg({quality:95}).toFile(`${OUT}/normal.jpg`);
await sharp(roughBuf,{raw:{width:S,height:S,channels:1}}).jpeg({quality:92}).toFile(`${OUT}/roughness.jpg`);
console.log("texturas geradas em", OUT);
```

- [ ] **Step 2: Rodar o gerador**

Run (em `web/`):
```
node scripts/gen-textures.mjs
```
Expected: imprime `texturas geradas em public/textures/basketball` e cria os 3 `.jpg`
(pode levar ~5–20s). Confirme com `ls public/textures/basketball`.

- [ ] **Step 3: Inspeção rápida dos arquivos**

Run (em `web/`):
```
node -e "const s=require('sharp');['albedo','normal','roughness'].forEach(async n=>console.log(n, await s('public/textures/basketball/'+n+'.jpg').metadata().then(m=>m.width+'x'+m.height)))"
```
Expected: cada um `1024x1024`.

- [ ] **Step 4: Commit** (script + texturas geradas)

```
git add web/scripts/gen-textures.mjs web/public/textures/basketball/albedo.jpg web/public/textures/basketball/normal.jpg web/public/textures/basketball/roughness.jpg
git commit -m "feat(web): gerador procedural das texturas da bola (albedo/normal/roughness)"
```

> Nota: o resultado visual das texturas é **iterado no polish** (Task 8). Esta task
> entrega mapas válidos e alinhados; ajustes de cor/escala dos gomos e do print são
> esperados — é a etapa "build → polish" do método.

---

### Task 2: Decal do Jumpman recolorido (#FFFAF4)

**Files:**
- Create: `web/scripts/gen-decal.mjs`
- Generates: `web/public/decals/jumpman-white.png`

- [ ] **Step 1: Criar o script de recolor**

Create `web/scripts/gen-decal.mjs`:
```js
// Recolore a silhueta preta (jumpman.png) para #FFFAF4 preservando o alpha.
import sharp from "sharp";

const SRC = "public/decals/jumpman.png";
const OUT = "public/decals/jumpman-white.png";
const [R,G,B] = [0xff,0xfa,0xf4];

const img = sharp(SRC);
const { width, height } = await img.metadata();
const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const ch = info.channels; // 4
for (let i=0;i<data.length;i+=ch){
  data[i]=R; data[i+1]=G; data[i+2]=B; // alpha (data[i+3]) intacto
}
await sharp(data,{raw:{width:info.width,height:info.height,channels:ch}}).png().toFile(OUT);
console.log("decal gerado:", OUT, width+"x"+height);
```

- [ ] **Step 2: Rodar**

Run (em `web/`):
```
node scripts/gen-decal.mjs
```
Expected: imprime `decal gerado: public/decals/jumpman-white.png 480x520`.

- [ ] **Step 3: Verificar alpha preservado e cor trocada**

Run (em `web/`):
```
node -e "(async()=>{const s=require('sharp');const{data,info}=await s('public/decals/jumpman-white.png').raw().toBuffer({resolveWithObject:true});const c=(x,y)=>{const i=(y*info.width+x)*info.channels;return[data[i],data[i+1],data[i+2],data[i+3]];};console.log('canto',c(0,0));console.log('centro',c(info.width>>1,info.height>>1));})()"
```
Expected: `canto [255,250,244,0]` (transparente) e `centro [255,250,244,255]` (logo off-white opaco).

- [ ] **Step 4: Commit**

```
git add web/scripts/gen-decal.mjs web/public/decals/jumpman-white.png
git commit -m "feat(web): decal do Jumpman recolorido para #FFFAF4 (alpha preservado)"
```

---

### Task 3: Config tipada da bola (Zod, TDD)

**Files:**
- Create: `web/src/schemas/basketball.schema.ts`
- Test: `web/src/schemas/basketball.schema.test.ts`
- Create: `web/src/content/basketball.ts`

- [ ] **Step 1: Escrever o teste que falha**

Create `web/src/schemas/basketball.schema.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { basketballConfigSchema } from "./basketball.schema";

const valido = {
  textures: { albedo: "/t/a.jpg", normal: "/t/n.jpg", roughness: "/t/r.jpg" },
  decal: { src: "/d/j.png", position: [0, 0, 1], rotation: [0, 0, 0], scale: 0.5, color: "#FFFAF4" },
  spin: { idleSpeed: 0.5, dampingFactor: 0.08 },
  colors: { base: "#56B4C3", accent: "#FFFAF4" },
};

describe("basketballConfigSchema", () => {
  it("aceita config válida", () => {
    expect(basketballConfigSchema.safeParse(valido).success).toBe(true);
  });
  it("rejeita cor fora do formato hex", () => {
    const bad = { ...valido, colors: { base: "azul", accent: "#FFFAF4" } };
    expect(basketballConfigSchema.safeParse(bad).success).toBe(false);
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run (em `web/`):
```
npx vitest run src/schemas/basketball.schema.test.ts
```
Expected: FAIL — `basketball.schema` não existe.

- [ ] **Step 3: Implementar o schema**

Create `web/src/schemas/basketball.schema.ts`:
```ts
import { z } from "zod";

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "cor hex #RRGGBB");
const vec3 = z.tuple([z.number(), z.number(), z.number()]);

export const basketballConfigSchema = z.object({
  textures: z.object({
    albedo: z.string().min(1),
    normal: z.string().min(1),
    roughness: z.string().min(1),
  }),
  decal: z.object({
    src: z.string().min(1),
    position: vec3,
    rotation: vec3,
    scale: z.number().positive(),
    color: hex,
  }),
  spin: z.object({
    idleSpeed: z.number(),
    dampingFactor: z.number().positive(),
  }),
  colors: z.object({ base: hex, accent: hex }),
});

export type BasketballConfig = z.infer<typeof basketballConfigSchema>;
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run (em `web/`):
```
npx vitest run src/schemas/basketball.schema.test.ts
```
Expected: PASS (2 verdes).

- [ ] **Step 5: Criar a config concreta validada**

Create `web/src/content/basketball.ts`:
```ts
import { basketballConfigSchema, type BasketballConfig } from "@/schemas/basketball.schema";

const data = {
  textures: {
    albedo: "/textures/basketball/albedo.jpg",
    normal: "/textures/basketball/normal.jpg",
    roughness: "/textures/basketball/roughness.jpg",
  },
  decal: {
    src: "/decals/jumpman-white.png",
    position: [0, 0.15, 1] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: 0.55,
    color: "#FFFAF4",
  },
  spin: { idleSpeed: 0.4, dampingFactor: 0.08 },
  colors: { base: "#56B4C3", accent: "#FFFAF4" },
};

export const basketballConfig: BasketballConfig = basketballConfigSchema.parse(data);
```

- [ ] **Step 6: Verificar tipos e commit**

Run (em `web/`): `npx tsc --noEmit` → PASS.
```
git add web/src/schemas/basketball.schema.ts web/src/schemas/basketball.schema.test.ts web/src/content/basketball.ts
git commit -m "feat(web): config tipada (Zod) da bola Jordan + conteudo validado"
```

---

### Task 4: Loader das texturas (color space correto)

**Files:**
- Create: `web/src/three/materials/basketballTextures.ts`

- [ ] **Step 1: Criar o hook de carregamento**

Create `web/src/three/materials/basketballTextures.ts`:
```ts
"use client";

import { useTexture } from "@react-three/drei";
import { useEffect } from "react";
import { RepeatWrapping, SRGBColorSpace, type Texture } from "three";
import type { BasketballConfig } from "@/schemas/basketball.schema";

export interface BasketballMaps {
  readonly map: Texture;
  readonly normalMap: Texture;
  readonly roughnessMap: Texture;
}

/** Carrega os mapas e aplica color space correto: albedo sRGB, normal/roughness lineares. */
export function useBasketballTextures(textures: BasketballConfig["textures"]): BasketballMaps {
  const [map, normalMap, roughnessMap] = useTexture([
    textures.albedo,
    textures.normal,
    textures.roughness,
  ]);

  useEffect(() => {
    map.colorSpace = SRGBColorSpace; // cor em sRGB
    for (const t of [map, normalMap, roughnessMap]) {
      t.wrapS = RepeatWrapping;
      t.wrapT = RepeatWrapping;
      t.needsUpdate = true;
    }
  }, [map, normalMap, roughnessMap]);

  return { map, normalMap, roughnessMap };
}
```

- [ ] **Step 2: Verificar tipos e commit**

Run (em `web/`): `npx tsc --noEmit` → PASS.
```
git add web/src/three/materials/basketballTextures.ts
git commit -m "feat(web): loader das texturas da bola com color space correto"
```

---

### Task 5: Componente da bola (esfera + material + decal)

**Files:**
- Create: `web/src/three/scene/Basketball.tsx`

- [ ] **Step 1: Criar o componente**

Create `web/src/three/scene/Basketball.tsx`:
```tsx
"use client";

import { Decal, useTexture } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import { basketballConfig } from "@/content/basketball";
import { useBasketballTextures } from "@/three/materials/basketballTextures";

/** A bola: esfera com material PBR gerado + decal do Jumpman. Gira sozinha devagar. */
export function Basketball() {
  const ref = useRef<Mesh>(null);
  const { map, normalMap, roughnessMap } = useBasketballTextures(basketballConfig.textures);
  const decalMap = useTexture(basketballConfig.decal.src);
  const { idleSpeed } = basketballConfig.spin;

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * idleSpeed * 0.2;
  });

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[1, 128, 128]} />
      <meshStandardMaterial
        map={map}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        metalness={0}
      />
      <Decal
        position={basketballConfig.decal.position}
        rotation={basketballConfig.decal.rotation}
        scale={basketballConfig.decal.scale}
      >
        <meshStandardMaterial
          map={decalMap}
          transparent
          polygonOffset
          polygonOffsetFactor={-1}
          color={basketballConfig.decal.color}
          roughness={0.5}
          metalness={0}
        />
      </Decal>
    </mesh>
  );
}
```

> Nota: o `color` no material do decal multiplica o `map`. Como o `jumpman-white.png` já é
> `#FFFAF4`, o `color` igual mantém a cor; não usar preto.

- [ ] **Step 2: Verificar tipos e commit**

Run (em `web/`): `npx tsc --noEmit` → PASS. (Se o `<Decal>` reclamar de tipos do material
filho, é erro a reportar — não force `any`.)
```
git add web/src/three/scene/Basketball.tsx
git commit -m "feat(web): componente da bola (esfera PBR + decal Jumpman + auto-giro)"
```

---

### Task 6: Palco — Canvas, iluminação, sombra, pós, controles

**Files:**
- Create: `web/src/three/scene/BasketballExperience.tsx`

- [ ] **Step 1: Criar a experiência**

Create `web/src/three/scene/BasketballExperience.tsx`:
```tsx
"use client";

import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, SMAA } from "@react-three/postprocessing";
import { basketballConfig } from "@/content/basketball";
import { Basketball } from "@/three/scene/Basketball";

/** Palco de estúdio: bola + HDRI + sombra de contato + pós + controles (giro/inércia). */
export function BasketballExperience() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 3.2], fov: 45 }} gl={{ antialias: true }}>
      <color attach="background" args={["#eef2f4"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} castShadow />
      <Environment preset="studio" />

      <Basketball />

      <ContactShadows position={[0, -1.15, 0]} opacity={0.5} scale={6} blur={2.5} far={3} />

      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={basketballConfig.spin.dampingFactor}
        autoRotate
        autoRotateSpeed={basketballConfig.spin.idleSpeed}
        minDistance={2.4}
        maxDistance={5}
      />

      <EffectComposer>
        <Bloom intensity={0.18} luminanceThreshold={0.85} mipmapBlur />
        <SMAA />
      </EffectComposer>
    </Canvas>
  );
}
```

- [ ] **Step 2: Verificar tipos e commit**

Run (em `web/`): `npx tsc --noEmit` → PASS.
```
git add web/src/three/scene/BasketballExperience.tsx
git commit -m "feat(web): palco da bola (estudio HDRI + sombra + bloom/SMAA + controles)"
```

---

### Task 7: Montar na home + remover a cena-prova da fundação

**Files:**
- Modify: `web/src/app/page.tsx` (trocar `Experience` por `BasketballExperience`)
- Delete: `web/src/three/scene/Experience.tsx`, `web/src/three/scene/RotatingBox.tsx`, `web/src/three/primitives/wireframeGlobe.ts`

- [ ] **Step 1: Apontar a home para a bola**

In `web/src/app/page.tsx`, replace the import and the `<Experience />` usage:
- Change `import { Experience } from "@/three/scene/Experience";`
  to `import { BasketballExperience } from "@/three/scene/BasketballExperience";`
- Change `<Experience />` to `<BasketballExperience />`
- Update the Suspense fallback message from "Carregando cena 3D…" to "Carregando a bola…"
  and the boundary fallback to "A bola 3D falhou ao carregar." (keep the rest of the file).

- [ ] **Step 2: Remover a cena-prova (papel já cumprido, registrado no git)**

Run (em `web/`):
```
git rm src/three/scene/Experience.tsx src/three/scene/RotatingBox.tsx src/three/primitives/wireframeGlobe.ts
```

- [ ] **Step 3: Verificar tipos**

Run (em `web/`):
```
npx tsc --noEmit
```
Expected: PASS, zero erros (nenhum import órfão para os arquivos removidos).

- [ ] **Step 4: Commit**

```
git add web/src/app/page.tsx
git commit -m "feat(web): home renderiza a bola Jordan; remove cena-prova da fundacao"
```

---

### Task 8: Verificação visual, polish e registro

**Files:** nenhum novo (verificação + ajustes guiados).

- [ ] **Step 1: Portões objetivos**

Run (em `web/`):
```
npx tsc --noEmit
npm test
```
Expected: tipos PASS; testes PASS (schemas content + basketball).

- [ ] **Step 2: Prova visual contra a referência**

Run (em `web/`): `npm run dev` → abrir `http://localhost:3000`. Comparar com
`public/reference/jordan-ball.png`. Confirmar:
- Esfera azul `#56B4C3` com granulado visível reagindo à luz.
- Gomos claros `#FFFAF4` dividindo a bola em painéis.
- Jumpman `#FFFAF4` legível no painel frontal.
- Gira sozinha; arrastar gira com inércia; zoom limitado; fundo claro + sombra de contato.
- Console do navegador sem erros.

- [ ] **Step 3: Polish (iterar parâmetros até bater com a foto)**

Ajustes prováveis (re-rodar `node scripts/gen-textures.mjs` após mexer no gerador):
- **Cor das células** (`CELL`) e intensidade do `crack` no elephant print.
- **Largura/posição dos gomos** (`seam` `w` e os meridianos) para o padrão da foto.
- **`STR`** (força do normal) para o granulado mais/menos profundo.
- No palco: `Environment preset`, intensidade das luzes, `Bloom intensity`, posição do decal
  (`basketballConfig.decal.position/scale`).
Commitar cada ajuste relevante: `git commit -m "polish(web): <ajuste>"`.

- [ ] **Step 4: Registrar o marco no DEV-LOG**

Append a `web/DEV-LOG.md` (nunca editar entradas antigas) uma entrada datada
`## 2026-06-11 — Bola Jordan 3D (build inicial)` com: Pedido, O que foi feito (texturas
geradas por código, esfera PBR + decal, palco de estúdio, remoção da cena-prova), Decisões
e porquês (texturas procedurais em vez de CC0; sem aoMap por causa do rename uv1/uv2),
Iterações (parâmetros ajustados no polish). Marcar prompt reutilizável se houver.

- [ ] **Step 5: Commit do registro**

```
git add web/DEV-LOG.md
git commit -m "docs(web): registra marco da bola Jordan no DEV-LOG"
```

---

## Critérios de sucesso (do spec §1)
1. Bola reconhecível como a referência (azul/print/granulado/gomos/Jumpman) — Task 8 Step 2.
2. Auto-giro + arrastar com inércia, zoom limitado, sem pan — Task 6.
3. Estúdio (HDRI) + sombra de contato + fundo claro — Task 6.
4. `tsc` zero erros + teste do schema — Task 8 Step 1.
5. Processo registrado no DEV-LOG — Task 8 Step 4.
