import { Link } from 'react-router-dom';
import { ChevronLeft, Trophy, Activity, Target } from 'lucide-react';
import Logo from './Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  motivational: string;
  statValue: string;
  statLabel: string;
}

/** Decorative sports-themed illustration for the auth side panel. */
function AuthIllustration() {
  return (
    <svg viewBox="0 0 480 420" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="authCourt" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#60a5fa" />
          <stop offset="1" stopColor="#4ade80" />
        </linearGradient>
        <radialGradient id="authGlow" cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="20" y="20" width="440" height="380" rx="28" fill="url(#authCourt)" opacity="0.16" />
      <rect x="20" y="20" width="440" height="380" rx="28" fill="url(#authGlow)" />

      {/* Runner silhouette */}
      <g className="animate-float-slow" style={{ transformOrigin: '160px 180px' }}>
        <circle cx="160" cy="110" r="18" fill="#bfdbfe" />
        <path d="M160 128 L160 190 L135 235" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round" />
        <path d="M160 128 L160 190 L185 235" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round" />
        <path d="M160 145 L188 125" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round" />
        <path d="M160 145 L132 165" stroke="#93c5fd" strokeWidth="8" strokeLinecap="round" />
      </g>

      {/* Basketball */}
      <g className="animate-bounce-ball" style={{ transformOrigin: '320px 150px' }}>
        <circle cx="320" cy="150" r="26" fill="#f97316" />
        <path d="M320 124 L320 176 M294 150 L346 150 M302 130 Q320 150 302 170 M338 130 Q320 150 338 170" stroke="#7c2d12" strokeWidth="2" fill="none" />
      </g>

      {/* Tennis racket + ball */}
      <g className="animate-float" style={{ transformOrigin: '350px 300px' }}>
        <ellipse cx="350" cy="280" rx="22" ry="30" transform="rotate(-25 350 280)" fill="#16a34a" />
        <ellipse cx="350" cy="280" rx="16" ry="22" transform="rotate(-25 350 280)" fill="#15803d" />
        <rect x="338" y="300" width="7" height="38" rx="3" transform="rotate(-25 341 320)" fill="#92400e" />
        <circle cx="300" cy="330" r="9" fill="#fde047" stroke="#fff" strokeWidth="2" />
      </g>

      {/* Swimmer waves */}
      <g className="animate-pulse-slow" style={{ transformOrigin: '140px 320px' }}>
        <path d="M100 320 Q140 308 180 320 T260 320" stroke="#60a5fa" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M95 335 Q140 323 185 335 T265 335" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M90 350 Q140 338 190 350 T270 350" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" fill="none" />
        <circle cx="160" cy="310" r="14" fill="#bfdbfe" />
      </g>

      {/* Floating accents */}
      <circle cx="70" cy="70" r="7" fill="#fbbf24" className="animate-float" />
      <circle cx="420" cy="80" r="6" fill="#22c55e" className="animate-float-slow" />
      <circle cx="440" cy="380" r="8" fill="#3b82f6" className="animate-bounce-ball" style={{ transformOrigin: '440px 380px' }} />
      <circle cx="50" cy="380" r="6" fill="#fbbf24" className="animate-float" />
    </svg>
  );
}

export default function AuthLayout({ children, title, subtitle, motivational, statValue, statLabel }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-100 via-white to-emerald-50">
      {/* mesh + glows */}
      <div className="absolute inset-0 bg-mesh-dark opacity-60" />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-pitch-500/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-5 py-8 lg:px-8">
        <div className="grid w-full animate-fade-up overflow-hidden rounded-[2rem] border border-sky-200/70 bg-white/80 shadow-2xl shadow-sky-100/80 backdrop-blur-md lg:grid-cols-2">
          {/* Left: illustration panel */}
          <div className="relative hidden flex-col justify-between p-10 lg:flex lg:p-14">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 text-slate-700 transition-colors hover:text-slate-900">
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm font-semibold">Back to Home</span>
              </Link>
              <Logo className="text-slate-900" />
            </div>

            <div className="my-8">
              <AuthIllustration />
            </div>

            <div>
              <h2 className="font-display text-3xl font-extrabold leading-tight text-slate-900">
                {title}
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
                {motivational}
              </p>

              <div className="mt-6 flex gap-3">
                <div className="rounded-2xl border border-sky-200 bg-white/80 px-4 py-3 backdrop-blur-md">
                  <p className="font-display text-2xl font-extrabold text-slate-900">{statValue}</p>
                  <p className="text-xs font-medium text-slate-600">{statLabel}</p>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-sky-200 bg-white/80 px-4 py-3 backdrop-blur-md">
                  <Trophy className="h-5 w-5 text-brand-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Pro Coaching</p>
                    <p className="text-xs text-slate-600">Certified trainers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: form panel */}
          <div className="relative bg-white/95 backdrop-blur-xl">
            {/* Mobile header */}
            <div className="flex items-center justify-between p-5 lg:hidden">
              <Link to="/" className="flex items-center gap-1.5 text-slate-600 transition-colors hover:text-brand-700">
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm font-semibold">Home</span>
              </Link>
              <Logo />
            </div>

            <div className="flex flex-col justify-center px-6 py-8 sm:px-10 lg:px-14 lg:py-12">
              {/* Mobile illustration badge */}
              <div className="mb-6 flex items-center gap-3 lg:hidden">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-500 shadow-lg shadow-sky-300/40">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-display text-lg font-extrabold text-slate-900">{subtitle}</p>
                  <p className="flex items-center gap-1 text-xs font-medium text-slate-500">
                    <Target className="h-3 w-3 text-emerald-600" />
                    {motivational.slice(0, 48)}…
                  </p>
                </div>
              </div>

              {/* Desktop heading */}
              <div className="hidden lg:block">
                <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">
                  {subtitle}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Welcome to the SportsClub members portal.
                </p>
              </div>

              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
