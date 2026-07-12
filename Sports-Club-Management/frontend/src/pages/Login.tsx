import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import GoogleButton from '../components/GoogleButton';
import { loginDemoUser } from '../utils/demoAuth';

interface FieldErrors {
  email?: string;
  password?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  function validate() {
    const next: FieldErrors = {};
    if (!email) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address';
    if (!password) next.password = 'Password is required';
    else if (password.length < 6) next.password = 'Password must be at least 6 characters';
    return next;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    setTouched({ email: true, password: true });
    if (Object.keys(next).length === 0) {
      setSubmitting(true);
      setTimeout(() => {
        const role = loginDemoUser(email, password);
        setSubmitting(false);

        if (role === 'admin') {
          navigate('/admin/dashboard');
          return;
        }

        if (role === 'coach') {
          navigate('/coach/dashboard');
          return;
        }

        if (role === 'member') {
          navigate('/dashboard');
          return;
        }

        setLoginError('Invalid username or password.');
      }, 900);
    }
  }

  const emailInvalid = touched.email && !!errors.email;
  const emailValid = touched.email && !errors.email && email.length > 0;
  const passwordInvalid = touched.password && !!errors.password;
  const passwordValid = touched.password && !errors.password && password.length > 0;

  return (
    <AuthLayout
      title="Welcome Back, Athlete"
      subtitle="Login to your account"
      motivational="Your next training session, tournament and personal best are just one login away. Pick up where you left off and keep pushing your limits."
      statValue="1.2k+"
      statLabel="Active members"
    >
      <form onSubmit={handleSubmit} className="mt-6 space-y-5 lg:mt-8" noValidate>
        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
            Email Address
          </label>
          <div
            className={`group flex items-center gap-3 rounded-2xl border bg-white px-4 transition-all ${
              emailInvalid
                ? 'border-red-400 ring-2 ring-red-100'
                : emailValid
                ? 'border-pitch-400 ring-2 ring-pitch-100'
                : 'border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100'
            }`}
          >
            <Mail className={`h-5 w-5 shrink-0 ${emailInvalid ? 'text-red-400' : emailValid ? 'text-pitch-500' : 'text-slate-400 group-focus-within:text-brand-500'}`} />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setLoginError(null);
                if (touched.email) setErrors((p) => ({ ...p, email: undefined }));
              }}
              onBlur={() => {
                setTouched((p) => ({ ...p, email: true }));
                setErrors((p) => ({ ...p, ...validate() }));
              }}
              placeholder="you@example.com"
              className="w-full bg-transparent py-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none"
            />
            {emailValid && <CheckCircle2 className="h-5 w-5 shrink-0 text-pitch-500" />}
          </div>
          {emailInvalid && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
            Password
          </label>
          <div
            className={`group flex items-center gap-3 rounded-2xl border bg-white px-4 transition-all ${
              passwordInvalid
                ? 'border-red-400 ring-2 ring-red-100'
                : passwordValid
                ? 'border-pitch-400 ring-2 ring-pitch-100'
                : 'border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100'
            }`}
          >
            <Lock className={`h-5 w-5 shrink-0 ${passwordInvalid ? 'text-red-400' : passwordValid ? 'text-pitch-500' : 'text-slate-400 group-focus-within:text-brand-500'}`} />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLoginError(null);
                if (touched.password) setErrors((p) => ({ ...p, password: undefined }));
              }}
              onBlur={() => {
                setTouched((p) => ({ ...p, password: true }));
                setErrors((p) => ({ ...p, ...validate() }));
              }}
              placeholder="Enter your password"
              className="w-full bg-transparent py-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none"
            />
            {passwordValid && <CheckCircle2 className="h-5 w-5 shrink-0 text-pitch-500" />}
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="shrink-0 text-slate-400 transition-colors hover:text-slate-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {passwordInvalid && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2">
            <button
              type="button"
              role="checkbox"
              aria-checked={remember}
              onClick={() => setRemember((v) => !v)}
              className={`grid h-5 w-5 place-items-center rounded-md border-2 transition-all ${
                remember ? 'border-brand-600 bg-brand-600' : 'border-slate-300 bg-white'
              }`}
            >
              {remember && <CheckCircle2 className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
            </button>
            <span className="text-sm font-medium text-slate-600">Remember Me</span>
          </label>
          <a href="#" className="text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700">
            Forgot Password?
          </a>
        </div>

        {loginError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {loginError}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-300/40 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-sky-300/50 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
        >
          {submitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Signing in…
            </>
          ) : (
            <>
              Login
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              OR
            </span>
          </div>
        </div>

        {/* Google */}
        <GoogleButton label="Login with Google" />

        <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-600">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
            Demo Login Credentials (Development Only)
          </p>
          <div className="mt-3 space-y-2">
            <p>
              <span className="font-semibold text-slate-800">Admin</span>
            </p>
            <p>
              <span className="font-medium text-slate-700">Email:</span> admin@sportsclub.com
            </p>
            <p>
              <span className="font-medium text-slate-700">Password:</span> admin123
            </p>
          </div>
        </div>

        {/* Bottom link */}
        <p className="pt-2 text-center text-sm text-slate-500">
          New to SportsClub?{' '}
          <Link to="/register" className="font-bold text-brand-600 transition-colors hover:text-brand-700">
            Create Account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
