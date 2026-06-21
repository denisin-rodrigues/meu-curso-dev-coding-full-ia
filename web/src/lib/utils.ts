/**
 * `cn` — junta classes condicionais (padrão shadcn).
 *
 * Versão enxuta, sem `clsx`/`tailwind-merge`: o projeto evita dependências extras
 * (ver `components/ui/scroll-reel-testimonials.tsx`, que define o seu `cn` inline).
 * Para os usos atuais — concatenar classes-base com um `className` opcional — um
 * filtro + join resolve. Se algum dia for preciso resolver conflitos de utilitários
 * Tailwind (ex.: `p-2` vs `p-4` vindos de fora), aí sim trocar por `tailwind-merge`.
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(' ')
}
