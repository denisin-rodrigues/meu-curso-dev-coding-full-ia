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
