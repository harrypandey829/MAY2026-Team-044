import { UserPlus, LogIn, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';

export default function FinalCTA() {
  const { ref, visible } = useReveal();
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div
          ref={ref}
          className={`animate-on-scroll ${visible ? 'is-visible' : ''} relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-200 via-brand-500 to-emerald-200 px-6 py-16 text-center shadow-2xl shadow-sky-200/80 sm:px-12 lg:py-20`}
        >
          <div className="absolute inset-0 bg-mesh-dark opacity-40" />
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-pitch-400/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-brand-300/30 blur-3xl" />

          {/* floating trophy */}
          <div className="relative mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-white/50 backdrop-blur-md">
            <Trophy className="h-8 w-8 text-brand-700" />
          </div>

          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Ready to Begin Your Sports Journey?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-700 lg:text-lg">
              Join our sports community today and start training, competing and achieving your goals.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-brand-700 shadow-xl transition-all hover:scale-105 sm:w-auto"
              >
                <UserPlus className="h-4 w-4" />
                Register
              </Link>
              <Link
                to="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/60 bg-white/70 px-8 py-3.5 text-sm font-bold text-brand-700 backdrop-blur-md transition-all hover:bg-white sm:w-auto"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
