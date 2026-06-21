// Barra de progresso animada (visual puro, sem estado).
//
// ADAPTAÇÕES vs. o snippet de origem:
//  • Removido o <style jsx> (styled-jsx quebra em Server Component do App Router);
//    os @keyframes vivem no globals.css, padrão do projeto.
//  • Keyframes renomeados loading/blink → loaderbar-fill/loaderbar-blink p/ não
//    colidir com nomes globais; os utilitários arbitrários abaixo apontam pra eles.
const LoaderProgressiveBar = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5">
      {/* Texto "Loading" com 3 pontos piscando em cascata (delays escalonados) */}
      <div className="ml-[10px] text-[14pt] font-semibold text-ink">
        Loading dev
        <span className="ml-[3px] animate-[loaderbar-blink_1.5s_infinite]">.</span>
        <span className="ml-[3px] animate-[loaderbar-blink_1.5s_infinite] [animation-delay:0.3s]">
          .
        </span>
        <span className="ml-[3px] animate-[loaderbar-blink_1.5s_infinite] [animation-delay:0.6s]">
          .
        </span>
      </div>

      {/* Trilho da barra */}
      <div className="box-border flex h-[30px] w-[200px] items-center rounded-[15px] bg-[#212121] p-[5px] shadow-[inset_-2px_2px_4px_#0c0c0c]">
        {/* Preenchimento: largura anima de 0 → 100% (loaderbar-fill) */}
        <div className="animate-[loaderbar-fill_4s_ease-out_infinite] relative flex h-[20px] w-0 flex-col justify-center overflow-hidden rounded-[10px] bg-gradient-to-t from-[#0085cc] to-[#00b2ff]">
          {/* Listras brancas diagonais que dão o efeito de "energia" correndo */}
          <div className="absolute flex items-center gap-[18px]">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-[45px] w-[10px] rotate-45 bg-gradient-to-tr from-white to-transparent opacity-30"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoaderProgressiveBar
