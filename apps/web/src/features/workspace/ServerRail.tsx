export function ServerRail() {
  return (
    <nav className="server-rail" aria-label="Servidores">
      <button className="server-mark active" type="button" aria-label="Concord"><span>C</span></button>
      <div className="rail-line" />
      <button className="server-mark secondary" type="button" aria-label="Equipe zero">00</button>
      <button className="server-mark add" type="button" aria-label="Adicionar servidor">+</button>
      <span className="rail-version">A.01</span>
    </nav>
  )
}
