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
