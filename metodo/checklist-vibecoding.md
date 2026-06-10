# Checklist do Método VibeCoding

Passo a passo replicável. Use este checklist para construir qualquer site premium
do zero, sozinho.

---

## 1. REFERÊNCIA
- [ ] Escolher 1 site de inspiração (Puma, Nike, editorial premium…)
- [ ] Listar o que torna ele impressionante (3–5 pontos)
- [ ] Salvar screenshots / link das seções-chave

## 2. EXTRAÇÃO
- [ ] Criar `DESIGN.md` da referência
- [ ] Cores, tipografia, espaçamento, grid
- [ ] Estilo de motion (durações, easings, sensação)
- [ ] Componentes recorrentes

## 3. PROMPT
- [ ] Montar prompt estruturado: **contexto + referência + regras técnicas + output esperado**
- [ ] Anexar o `DESIGN.md` como contexto
- [ ] Definir a stack (ex: HTML/CSS/JS + GSAP)

## 4. BUILD
- [ ] Gerar seção por seção (hero primeiro)
- [ ] Rodar e revisar a cada iteração
- [ ] Ajustar prompts conforme o resultado

## 5. POLISH
- [ ] Aplicar regras de easing (sem `linear`)
- [ ] Padronizar durações
- [ ] Ajustar stagger e scroll timing
- [ ] Respeitar `prefers-reduced-motion`

## 6. DEPLOY
- [ ] Build de produção
- [ ] Publicar (ex: Vercel)
- [ ] Testar responsivo e performance

---

> Regra de ouro: se você não consegue responder *"como repito isso sozinho?"*,
> volte uma etapa e documente melhor.
