// Gera albedo/normal/roughness da bola Jordan (Biomimetic Puffy Domes)
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const S = 1024;
const OUT = "public/textures/basketball";

// Cores "Ice-Blue" Vibrantes baseadas no Blueprint Zoom
const BASE_DARK  = [0x1a, 0x5a, 0x75]; // Cracks profundas e foscas
const BASE_LIGHT = [0x55, 0xbb, 0xd4]; // Topo celular brilhante
const ACC        = [0xff, 0xff, 0xff]; 

function mulberry32(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const rng = mulberry32(20260611);

// --- Packed Polygonal Puffy Cells (Jittered Grid) ---
// O segredo do "Couro Vivo": O grid de células É a própria textura. Sem noise extra.
const GRID_W = 160; 
const GRID_H = 160; // 25.600 células super densas
const PTS = [];
const jitter = 0.65; // Suficiente para criar hexágonos/pentágonos orgânicos
for (let y = 0; y < GRID_H; y++) {
  for (let x = 0; x < GRID_W; x++) {
    const px = (x + 0.5 + (rng() - 0.5) * jitter) / GRID_W;
    const py = (y + 0.5 + (rng() - 0.5) * jitter) / GRID_H;
    PTS.push([px, py]);
  }
}

// Otimização de busca
const GS = 60;
const GC = new Array(GS*GS).fill(null).map(()=>[]);
for(let i=0;i<PTS.length;i++){
  const gx=Math.max(0, Math.min(GS-1, Math.floor(PTS[i][0]*GS)));
  const gy=Math.max(0, Math.min(GS-1, Math.floor(PTS[i][1]*GS)));
  GC[gy*GS+gx].push(i);
}

function worley(u,v){
  let f1=9, f2=9;
  const gx=Math.floor(u*GS), gy=Math.floor(v*GS);
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
    const cx=((gx+dx)%GS+GS)%GS,cy=((gy+dy)%GS+GS)%GS;
    for(const idx of GC[cy*GS+cx]){
      const [px,py]=PTS[idx];
      let ddx=Math.abs(u-px);ddx=Math.min(ddx,1-ddx);
      let ddy=Math.abs(v-py);ddy=Math.min(ddy,1-ddy);
      const d = Math.sqrt(ddx*ddx+ddy*ddy);
      if(d<f1){f2=f1;f1=d;}else if(d<f2)f2=d;
    }
  }
  return [f1, f2];
}

// --- Costuras Clássicas ---
function seam(u,v){
  let d=1;
  const curve = Math.sin(v * Math.PI) * 0.15;
  for(const mu of [0.0, 0.5]){
    let du=Math.abs(u - mu - curve); du=Math.min(du,1-du);
    if(du<d) d=du;
    let du2=Math.abs(u - mu + curve - 0.25); du2=Math.min(du2,1-du2);
    if(du2<d) d=du2;
  }
  const de=Math.abs(v-0.5);if(de<d)d=de;
  const w=0.005, edge=0.002;
  if(d<w)return 1;if(d<w+edge)return 1-(d-w)/edge;return 0;
}

const lerp=(a,b,t)=>a+(b-a)*t;
const mix3=(A,B,t)=>[lerp(A[0],B[0],t),lerp(A[1],B[1],t),lerp(A[2],B[2],t)];
const clamp=(x,lo=0,hi=255)=>Math.max(lo,Math.min(hi,x));

// --- Carregar Logo ---
console.log("carregando logo jumpman duplo...");
const logoSrc = sharp("public/decals/jumpman-white.png");
const logoMeta = await logoSrc.metadata();

const LOGO_SCALE = 0.08; 
const LOGO_W = Math.round(S * LOGO_SCALE);
const LOGO_H = Math.round(LOGO_W * (logoMeta.height / logoMeta.width));
const LOGO_CX = Math.round(S * 0.375); // Eixo X matemático do centro do painel frontal largo
// Aproximando as logos da costura central (equador v=0.5) para corrigir a distorção esférica
// e fazer o "match" visual com o Blueprint (onde as logos flutuam mais perto do meio)
const LOGO_CY_TOP = Math.round(S * 0.35); // Antes 0.25 (muito alto no polo)
const LOGO_CY_BOT = Math.round(S * 0.65); // Antes 0.75 (muito baixo no polo)

const logoResized = await logoSrc
  .resize(LOGO_W, LOGO_H, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const logoPx = logoResized.data;
const logoW = logoResized.info.width;
const logoH = logoResized.info.height;
const logoCh = logoResized.info.channels;

function logoAlpha(px, py) {
  const lx = px - (LOGO_CX - Math.floor(logoW / 2));
  
  // Verifica logo superior
  const lyTop = py - (LOGO_CY_TOP - Math.floor(logoH / 2));
  if (lx >= 0 && lx < logoW && lyTop >= 0 && lyTop < logoH) {
    return logoPx[(lyTop * logoW + lx) * logoCh + 3] / 255; 
  }

  // Verifica logo inferior
  const lyBot = py - (LOGO_CY_BOT - Math.floor(logoH / 2));
  if (lx >= 0 && lx < logoW && lyBot >= 0 && lyBot < logoH) {
    return logoPx[(lyBot * logoW + lx) * logoCh + 3] / 255; 
  }

  return 0; 
}

// --- 1) Campo de Altura (Puffy Domes Cross-Section) ---
console.log("gerando geometria das celulas pufadas...");
const H=new Float32Array(S*S);
const NORMALIZED_FACTOR = GRID_W * 0.9; // Para normalizar a distância (0.0 até ~1.0)

for(let y=0;y<S;y++)for(let x=0;x<S;x++){
  const u=x/S, v=y/S;
  
  const [f1, f2] = worley(u,v);
  
  // Distância até a borda exata do polígono
  const distToEdge = f2 - f1;
  const normDist = clamp(distToEdge * NORMALIZED_FACTOR, 0.0, 1.0);
  
  // A Mágica: Math.pow(x, 0.45) gera uma curva perfeitamente convexa (Puffy Dome/Pillow)
  // A borda cai abruptamente (crack), mas o topo é arredondado suavemente.
  const cellHeight = Math.pow(normDist, 0.45); 
  
  // O logo não muda o height map do couro, apenas a cor
  const s = seam(u,v);
  // Extrusão leve (0.15). Nas costuras afunda para -0.2
  H[y*S+x] = lerp(cellHeight * 0.15, -0.2, s);
}

// --- 2) Normal map ---
console.log("gerando normal map de alta reatividade...");
const STR = 4.0; // Puxa fortemente as encostas das células
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

// --- 3) Albedo + Roughness ---
console.log("iluminando domes para reflexo de couro vivo...");
const albedoBuf=Buffer.alloc(S*S*3);
const roughBuf=Buffer.alloc(S*S);
for(let y=0;y<S;y++)for(let x=0;x<S;x++){
  const u=x/S, v=y/S;
  const [f1, f2] = worley(u,v);
  const normDist = clamp((f2 - f1) * NORMALIZED_FACTOR, 0.0, 1.0);
  const cellHeight = Math.pow(normDist, 0.45);
  
  const s = seam(u,v);
  
  // Cracks profundas = cor base dark. Topo das células = cor vibrante.
  let col = mix3(BASE_DARK, BASE_LIGHT, cellHeight * 0.8 + 0.2);

  col=mix3(col,ACC,s); // Costuras brancas

  // Embossed Logo
  const la = logoAlpha(x, y);
  if (la > 0) {
    col = mix3(col, ACC, la);
  }

  const i3=(y*S+x)*3;
  albedoBuf[i3]=clamp(Math.round(col[0]));
  albedoBuf[i3+1]=clamp(Math.round(col[1]));
  albedoBuf[i3+2]=clamp(Math.round(col[2]));

  // O SEGREDO DO COURO VIVO:
  // As rachaduras (0.0) são completamente foscas (0.8) absorvendo luz.
  // O topo da célula (1.0) é brilhante (0.35) refletindo especular.
  const baseRough = lerp(0.85, 0.35, cellHeight); 
  let rough = lerp(baseRough, 0.4, s); // Costuras brancas
  rough = lerp(rough, 0.45, la); // Logo jumpman
  
  roughBuf[y*S+x]=clamp(Math.round(rough*255));
}

// --- Exportar ---
console.log("salvando texturas Biomimetic Domes...");
await mkdir(OUT,{recursive:true});
await sharp(albedoBuf,{raw:{width:S,height:S,channels:3}}).jpeg({quality:100}).toFile(`${OUT}/albedo.jpg`);
await sharp(normalBuf,{raw:{width:S,height:S,channels:3}}).jpeg({quality:100}).toFile(`${OUT}/normal.jpg`);
await sharp(roughBuf,{raw:{width:S,height:S,channels:1}}).jpeg({quality:100}).toFile(`${OUT}/roughness.jpg`);
console.log("✅ Texturas concluídas e salvas em", OUT);
