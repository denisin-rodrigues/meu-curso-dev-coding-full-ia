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
