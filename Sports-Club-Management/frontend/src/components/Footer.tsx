import { Trophy, Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import Logo from './Logo';

const quickLinks = ['Sports', 'Membership', 'Events', 'Contact'];
const supportLinks = ['Privacy Policy', 'Terms', 'Help Center', 'FAQ'];

export default function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-white to-emerald-50 pt-20 pb-8 text-slate-700">
      <div className="absolute inset-0 bg-mesh-dark opacity-40" />
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-brand-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-pitch-600/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand + contact */}
          <div className="lg:col-span-4">
            <Logo className="text-slate-900" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600">
              Your active sports community. Train, compete and grow — all in one place.
            </p>
            <div className="mt-6 space-y-2.5 text-sm">
              <p className="flex items-center gap-2.5 text-slate-400">
                <MapPin className="h-4 w-4 text-brand-400" />
                123 Stadium Road, Sports City
              </p>
              <p className="flex items-center gap-2.5 text-slate-400">
                <Mail className="h-4 w-4 text-brand-400" />
                hello@sportsclub.com
              </p>
              <p className="flex items-center gap-2.5 text-slate-400">
                <Phone className="h-4 w-4 text-brand-400" />
                +1 (555) 123-4567
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900">Quick Links</h4>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase()}`} className="text-sm text-slate-600 transition-colors hover:text-brand-600">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div className="lg:col-span-2">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900">Support</h4>
            <ul className="mt-4 space-y-2.5">
              {supportLinks.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-slate-600 transition-colors hover:text-brand-600">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + social */}
          <div className="lg:col-span-4">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900">Stay in the game</h4>
            <p className="mt-4 text-sm text-slate-600">Get club updates, event alerts and training tips.</p>
            <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-full border border-sky-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none transition-colors focus:border-brand-500"
              />
              <button className="shrink-0 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-105">
                Join
              </button>
            </form>
            <div className="mt-6 flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-10 w-10 place-items-center rounded-xl border border-sky-200 bg-white text-slate-600 transition-all hover:border-brand-500 hover:bg-brand-600 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-sky-200 pt-6 sm:flex-row">
          <p className="text-xs text-slate-500">© 2026 SportsClub. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Trophy className="h-3.5 w-3.5 text-brand-500" />
            Built for athletes, by athletes.
          </div>
        </div>
      </div>
    </footer>
  );
}
