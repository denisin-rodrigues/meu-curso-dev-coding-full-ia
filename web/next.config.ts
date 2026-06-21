import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Rapier (física do crachá Lanyard) cria o mundo num efeito; o double-invoke do
  // StrictMode em dev monta/desmonta 2x e trava a inicialização (cena fica vazia,
  // sem erro). Desligado para a física funcionar em dev. Em produção é indiferente.
  reactStrictMode: false,
  transpilePackages: [
    "three",
    "@react-three/fiber",
    "@react-three/drei",
    "@react-three/rapier",
    "meshline",
  ],
};

export default nextConfig;
