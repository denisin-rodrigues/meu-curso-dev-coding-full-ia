import Image from "next/image";

const NAV_LINKS = [
  { label: "Men", href: "#" },
  { label: "Women", href: "#" },
  { label: "Kids", href: "#" },
  { label: "Sale", href: "#" },
  { label: "SNKRS", href: "#" },
];

/** Ícone de busca (lupa) inline SVG */
function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

/** Ícone de coração (favoritos) inline SVG */
function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/** Ícone de sacola (carrinho) inline SVG */
function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

/** Navbar premium estilo Nike — fundo escuro, links centrais, ícones à direita. */
export function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-black px-6 py-3 md:px-12">
      {/* LOGO — esquerda */}
      <a href="/" aria-label="Início" className="flex-shrink-0">
        <Image
          src="/images/jordan-logo-white.jpg"
          alt="Jordan Logo"
          width={36}
          height={36}
          className="h-9 w-9 object-contain"
          priority
        />
      </a>

      {/* NAV LINKS — centro (oculto em mobile) */}
      <ul className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="relative font-mono text-label-caps uppercase tracking-wider text-white/80 transition-colors duration-200 hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* AÇÕES — direita */}
      <div className="flex items-center gap-1">
        {/* Busca com campo pill */}
        <div className="mr-2 hidden items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 transition-colors duration-200 hover:bg-white/20 md:flex">
          <SearchIcon />
          <span className="font-mono text-[11px] tracking-wider text-white/50">Search</span>
        </div>

        {/* Busca mobile */}
        <button
          type="button"
          aria-label="Search"
          className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white md:hidden"
        >
          <SearchIcon />
        </button>

        <button
          type="button"
          aria-label="Favoritos"
          className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <HeartIcon />
        </button>

        <button
          type="button"
          aria-label="Sacola"
          className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <BagIcon />
        </button>

        {/* Hamburger mobile */}
        <button
          type="button"
          aria-label="Menu"
          className="ml-1 flex flex-col gap-[5px] rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white md:hidden"
        >
          <span className="block h-[2px] w-[18px] bg-current" />
          <span className="block h-[2px] w-[18px] bg-current" />
          <span className="block h-[2px] w-[14px] bg-current" />
        </button>
      </div>
    </nav>
  );
}
