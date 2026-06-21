// Spinner de carregamento — bola (estilo basquete) rolando numa pista.
// CSS-puro: toda a aparência vive em globals.css (classes .pl*). Sem props/estado.
export default function LoadingSpinner() {
  return (
    <div className="pl" role="status" aria-label="Carregando">
      <div className="pl__outer-ring"></div>
      <div className="pl__inner-ring"></div>
      <div className="pl__track-cover"></div>
      <div className="pl__ball">
        <div className="pl__ball-texture"></div>
        <div className="pl__ball-outer-shadow"></div>
        <div className="pl__ball-inner-shadow"></div>
        <div className="pl__ball-side-shadows"></div>
      </div>
    </div>
  )
}
