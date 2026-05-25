import { useState } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass =
    "hover:text-yellow-400 transition cursor-pointer";

  const closeMenu = () => setOpen(false);

  return (
    <nav className="w-full border-b border-white/10 bg-black/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
          Xhamia <span className="text-yellow-400">Baba Hamëz Llaushë</span>
        </h1>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex gap-8 text-sm text-white">
          <a href="#external" className={linkClass}>Investim i Jashtëm</a>
          <a href="#internal" className={linkClass}>Investim i Mbrendshëm</a>
          <a href="#donors" className={linkClass}>Donatorët</a>
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white text-2xl"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-300 bg-black/95 border-t border-white/10
          ${open ? "max-h-60 py-4 px-6" : "max-h-0"}
        `}
      >
        <div className="flex flex-col gap-4 text-white text-sm">

          <a href="#external" onClick={closeMenu} className={linkClass}>
            Investim i Jashtëm
          </a>

          <a href="#internal" onClick={closeMenu} className={linkClass}>
            Investim i Mbrendshëm
          </a>

          <a href="#donors" onClick={closeMenu} className={linkClass}>
            Donatorët
          </a>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;