import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import { useScrolled } from '../hooks/useScrolled';

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Sports', href: '#sports' },
  { label: 'Membership', href: '#membership' },
  { label: 'Events', href: '#events' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const scrolled = useScrolled(30);
  const [open, setOpen] = useState(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass shadow-lg shadow-sky-200/50'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
        <a href="/#home" className="shrink-0">
          <Logo className={scrolled ? '' : 'text-slate-900'} />
        </a>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={`/${l.href}`}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  scrolled
                    ? 'text-slate-600 hover:text-brand-700 hover:bg-sky-50'
                    : 'text-slate-700 hover:text-brand-700 hover:bg-white/70'
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/login"
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              scrolled
                ? 'text-brand-700 hover:bg-sky-50'
                : 'text-slate-700 hover:bg-white/70'
            }`}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-300/40 transition-all hover:scale-105 hover:shadow-xl hover:shadow-sky-300/50"
          >
            Register
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className={`grid h-10 w-10 place-items-center rounded-xl transition-colors lg:hidden ${
            scrolled ? 'text-slate-800 hover:bg-slate-100' : 'text-slate-800 hover:bg-white/70'
          }`}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="glass mx-4 mb-3 rounded-2xl p-4 shadow-xl">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={`/${l.href}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-brand-700"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2 border-t border-slate-200/60 pt-3">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-center text-sm font-semibold text-brand-700"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-sky-300/40"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
