import { CheckCircle2, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const perks = [
  'Join your favorite sport',
  'Easy online membership',
  'Professional coaching',
  'Regular tournaments',
];

/** Decorative SVG illustration of athletes across five sports. */
function SportsIllustration() {
  return (
    <svg viewBox="0 0 520 420" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="court" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2563eb" />
          <stop offset="1" stopColor="#16a34a" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="20" y="20" width="480" height="380" rx="32" fill="url(#court)" opacity="0.18" />
      <rect x="20" y="20" width="480" height="380" rx="32" fill="url(#glow)" />

      {/* Badminton player (top-left) */}
      <g className="animate-float-slow" style={{ transformOrigin: '140px 130px' }}>
        <circle cx="140" cy="95" r="16" fill="#bfdbfe" />
        <path d="M140 111 L140 165 L120 205" stroke="#93c5fd" strokeWidth="7" strokeLinecap="round" />
        <path d="M140 111 L140 165 L160 205" stroke="#93c5fd" strokeWidth="7" strokeLinecap="round" />
        <path d="M140 125 L168 108" stroke="#93c5fd" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="176" cy="100" rx="14" ry="20" transform="rotate(-30 176 100)" fill="#22c55e" />
        <circle cx="182" cy="86" r="5" fill="#fff" stroke="#22c55e" strokeWidth="2" />
        <circle cx="196" cy="70" r="6" fill="#fbbf24" />
      </g>

      {/* Cricket player (top-right) */}
      <g className="animate-float" style={{ transformOrigin: '380px 130px' }}>
        <circle cx="380" cy="95" r="16" fill="#bbf7d0" />
        <path d="M380 111 L380 165 L362 205" stroke="#86efac" strokeWidth="7" strokeLinecap="round" />
        <path d="M380 111 L380 165 L398 205" stroke="#86efac" strokeWidth="7" strokeLinecap="round" />
        <path d="M380 125 L354 108" stroke="#86efac" strokeWidth="7" strokeLinecap="round" />
        <rect x="342" y="98" width="8" height="44" rx="3" transform="rotate(-30 346 120)" fill="#92400e" />
        <circle cx="336" cy="92" r="9" fill="#dc2626" />
        <path d="M330 92 a6 6 0 0 1 12 0" stroke="#fff" strokeWidth="1.5" fill="none" />
      </g>

      {/* Swimmer (center) */}
      <g className="animate-pulse-slow" style={{ transformOrigin: '260px 215px' }}>
        <circle cx="260" cy="200" r="16" fill="#bfdbfe" />
        <path d="M244 205 Q260 195 276 205" stroke="#60a5fa" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M236 215 Q260 205 284 215" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M232 228 Q260 218 288 228" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M244 200 L226 196" stroke="#bfdbfe" strokeWidth="6" strokeLinecap="round" />
        <circle cx="222" cy="194" r="5" fill="#1d4ed8" />
      </g>

      {/* Tennis player (bottom-left) */}
      <g className="animate-float" style={{ transformOrigin: '140px 320px' }}>
        <circle cx="140" cy="290" r="16" fill="#fde68a" />
        <path d="M140 306 L140 360 L122 395" stroke="#fcd34d" strokeWidth="7" strokeLinecap="round" />
        <path d="M140 306 L140 360 L158 395" stroke="#fcd34d" strokeWidth="7" strokeLinecap="round" />
        <path d="M140 320 L168 305" stroke="#fcd34d" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="174" cy="300" rx="6" ry="22" transform="rotate(-35 174 300)" fill="#a16207" />
        <circle cx="196" cy="282" r="11" fill="#fbbf24" stroke="#fff" strokeWidth="2" />
        <path d="M185 282 a11 11 0 0 1 22 0" stroke="#fff" strokeWidth="1.5" fill="none" />
      </g>

      {/* Football player (bottom-right) */}
      <g className="animate-float-slow" style={{ transformOrigin: '380px 320px' }}>
        <circle cx="380" cy="290" r="16" fill="#bbf7d0" />
        <path d="M380 306 L380 360 L362 395" stroke="#86efac" strokeWidth="7" strokeLinecap="round" />
        <path d="M380 306 L380 360 L398 395" stroke="#86efac" strokeWidth="7" strokeLinecap="round" />
        <path d="M380 320 L408 335" stroke="#86efac" strokeWidth="7" strokeLinecap="round" />
        <circle cx="416" cy="342" r="11" fill="#fff" stroke="#1e293b" strokeWidth="2" />
        <path d="M416 331 L416 353 M405 342 L427 342 M408 334 L424 350 M424 334 L408 350" stroke="#1e293b" strokeWidth="1.5" />
      </g>

      {/* Floating ball accents */}
      <circle cx="70" cy="60" r="8" fill="#fbbf24" className="animate-bounce-ball" style={{ transformOrigin: '70px 60px' }} />
      <circle cx="460" cy="50" r="6" fill="#22c55e" className="animate-float" />
      <circle cx="450" cy="380" r="7" fill="#3b82f6" className="animate-float-slow" />
      <circle cx="60" cy="370" r="6" fill="#fbbf24" className="animate-bounce-ball" style={{ transformOrigin: '60px 370px' }} />
    </svg>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-white to-emerald-50 pt-28 pb-20 lg:pt-36 lg:pb-28"
    >
      {/* animated mesh overlay */}
      <div className="absolute inset-0 bg-mesh-dark opacity-60" />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-pitch-500/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
        {/* Left: copy */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-slate-700 backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
            Now accepting new members · Season 2026
          </span>

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-brand-500 to-emerald-500 bg-clip-text text-transparent">
              SportsClub
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-600 lg:mx-0 lg:text-lg">
            Become part of an active sports community. Join your favorite sport, participate in
            training sessions and tournaments, connect with coaches, and track your sporting
            journey—all in one place.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Link
              to="/register"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-sky-300/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-sky-300/60 sm:w-auto"
            >
              Join Now
              <Play className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="currentColor" />
            </Link>
            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-sky-200 bg-white/80 px-7 py-3.5 text-sm font-bold text-brand-700 backdrop-blur-md transition-all hover:bg-white sm:w-auto"
            >
              Login
            </Link>
          </div>

          <ul className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {perks.map((p) => (
              <li
                key={p}
                className="flex items-center gap-2.5 text-sm font-medium text-slate-700"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-500" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: illustration */}
        <div className="relative">
          <div className="absolute inset-0 -m-6 rounded-[2.5rem] bg-gradient-to-tr from-brand-500/20 to-pitch-500/20 blur-2xl" />
          <div className="relative rounded-[2rem] border border-sky-200/70 bg-white/80 p-4 shadow-2xl shadow-sky-100/80 backdrop-blur-md">
            <SportsIllustration />
          </div>

          {/* Floating stat cards */}
          <div className="absolute -left-2 top-8 hidden rounded-2xl glass px-4 py-3 shadow-xl shadow-sky-100/80 sm:block">
            <p className="font-display text-2xl font-extrabold text-brand-700">5+</p>
            <p className="text-xs font-medium text-slate-600">Sports</p>
          </div>
          <div className="absolute -right-2 bottom-10 hidden rounded-2xl glass px-4 py-3 shadow-xl shadow-sky-100/80 sm:block">
            <p className="font-display text-2xl font-extrabold text-pitch-600">1.2k+</p>
            <p className="text-xs font-medium text-slate-600">Active members</p>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="pointer-events-none absolute -bottom-px left-0 right-0">
        <svg viewBox="0 0 1440 80" className="h-12 w-full sm:h-16" preserveAspectRatio="none">
          <path d="M0,40 C240,80 480,0 720,30 C960,60 1200,10 1440,40 L1440,80 L0,80 Z" fill="#F8FAFC" />
        </svg>
      </div>
    </section>
  );
}
