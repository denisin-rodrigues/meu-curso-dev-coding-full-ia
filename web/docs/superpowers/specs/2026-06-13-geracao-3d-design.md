# Design — Geração 3D por IA (Trilha A: realismo nível Meshy)

> **STATUS: PARADO (2026-06-13).** Requer chave de API + créditos pagos (Meshy/Tripo);
> a alternativa open-source (TRELLIS) exige GPU. Decisão do autor: descartar a geração
> paga por enquanto e seguir com o método artesanal (código). Spec mantido como
> registro de arquitetura para retomar quando houver chave/orçamento.

> Spec de arquitetura. Próximo salto estratégico do lab: gerar objetos 3D por IA
> (texto/imagem → GLB) e carregá-los na cena animada existente, em vez de modelar
> tudo à mão. Validado na discussão estratégica de 2026-06-13.

## Objetivo

Alcançar realismo de objeto 3D no nível de serviços generativos (Meshy/Tripo) sem
modelar à mão — integrando uma **API generativa** ao método do lab. A geração vira
um *passo* da etapa BUILD (codar OU gerar), e o GLB resultante entra na cena Three.js
com a animação (Motion Spec) por cima. O diferencial do lab continua sendo a
apresentação premium + o método, não a geração em si.

## Princípio central (a decisão que define tudo)

**Geração é etapa de AUTORIA, não de runtime.** Você gera o modelo UMA vez (gasta
crédito uma vez), commita o GLB no repo, e o site serve o arquivo estático — custo
de API por visitante = zero, e a chave nunca vai pro navegador. Isso resolve custo
e segurança de uma vez.

O padrão de integração é o mesmo do `meshy-3d-agent` (e do seu Kit): a IA/script
chama a REST API → faz polling → baixa o GLB. Nada de servidor dedicado.

## Provedores (escolha por adapter, trocável)

Abstrair atrás de uma interface `Generator3D` para não casar com um fornecedor:
- **Meshy API** — text/image→3D, GLB+PBR, retexture, rig, animação. Maduro. Padrão.
- **Tripo (Tripo3D)** — rápido, alta qualidade. Alternativa direta.
- **Microsoft TRELLIS** — open-source / self-host. Sem custo por crédito (futuro).

Provedor e chave por variável de ambiente; trocar de provedor = trocar o adapter.

## Arquitetura

```
AUTORIA (offline, gasta crédito 1x)
  npm run gen3d -- --prompt "..." [--image path] [--out public/models/x.glb]
     │  scripts/gen3d.mjs
     ▼
  Generator3D (adapter Meshy/Tripo) → submit job → poll → download GLB
     ▼
  public/models/x.glb   (commitado no repo)

RUNTIME (grátis, sem API)
  <GeneratedModel src="/models/x.glb" />   (drei useGLTF)
     ▼
  entra numa cena R3F + animado pelo Motion Spec existente
```

## Componentes (isolamento)

- `src/schemas/generation.schema.ts` — `GenerationJob` (Zod): `prompt`, `image?`,
  `provider`, `out`, `mode: "text" | "image"`. Validado.
- `src/generation/Generator3D.ts` — interface + adapter(s). `generate(job): Promise<string>`
  (caminho do GLB). Lê a chave de `process.env` (nunca no client).
- `scripts/gen3d.mjs` — CLI de autoria (Node): parseia args → chama o adapter →
  salva em `public/models/`. Adicionar script `"gen3d"` no `package.json`.
- `src/three/scene/GeneratedModel.tsx` — componente de runtime: `useGLTF(src)`,
  `<primitive object={...} />`, com `Suspense`. Reusa a fronteira R3F do projeto.
- `.env.local` (gitignored) — `MESHY_API_KEY` / `TRIPO_API_KEY`.
- `docs/GERACAO-3D.md` — conhecimento: provedores, custo por crédito, prompts que
  funcionaram, e a regra "geração é autoria, não runtime" (leitura via AGENTS.md).

## Fora de escopo (futuro)

- **Geração no navegador / chamada por visitante** (custo e segurança — proibido).
- **Loop gerar→avaliar→refinar** (um agente que gera, mede realismo, ajusta o prompt
  e regenera). É AQUI que LangGraph entra — Fase futura, não agora.
- **Rigging/animação vindos do Meshy** (usamos o Motion Spec próprio por enquanto).
- **RAG sobre os logs** (Fase B — ainda gated por corpus).

## Critérios de sucesso

- Com uma chave válida, `npm run gen3d -- --prompt "uma bola de basquete"` produz
  um GLB em `public/models/`.
- `<GeneratedModel src>` carrega o GLB numa rota de teste (`/gerar`) e ele pode ser
  animado pelo Motion Spec.
- A chave **não** aparece no bundle do cliente (verificar build).
- O site serve o GLB commitado com **zero** custo de API em runtime.
- `npx tsc --noEmit` limpo; schema com teste.

## Bloqueio conhecido (precisa de você)

A implementação real exige: (1) uma **conta + API key** do provedor escolhido,
(2) ciência de que **gerar gasta créditos pagos**. Sem isso, dá pra construir tudo
(adapter, schema, loader, CLI) mas não rodar a geração de verdade. O loader de GLB
(metade runtime) é testável de graça com um GLB de amostra.
