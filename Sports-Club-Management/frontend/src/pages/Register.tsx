import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Trophy,
} from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const sports = ['Badminton', 'Cricket', 'Football', 'Swimming', 'Tennis', 'Basketball'] as const;

interface FieldErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirm?: string;
  sport?: string;
  terms?: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState<{
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirm: string;
    sport: string;
    role: 'Member' | 'Coach';
    terms: boolean;
  }>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    sport: '',
    role: 'Member',
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sportOpen, setSportOpen] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    if (touched[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!form.fullName) next.fullName = 'Full name is required';
    else if (form.fullName.trim().length < 2) next.fullName = 'Enter at least 2 characters';
    if (!form.email) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (!form.phone) next.phone = 'Phone number is required';
    else if (!/^[0-9+\-\s()]{7,}$/.test(form.phone)) next.phone = 'Enter a valid phone number';
    if (!form.password) next.password = 'Password is required';
    if (!form.confirm) next.confirm = 'Please confirm your password';
    else if (form.confirm !== form.password) next.confirm = 'Passwords do not match';
    if (!form.sport) next.sport = 'Please select a sport';
    if (!form.terms) next.terms = 'You must agree to the Terms & Privacy Policy';
    return next;
  }

  function markTouched(key: string) {
    setTouched((p) => ({ ...p, [key]: true }));
    setErrors((p) => ({ ...p, ...validate() }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      password: true,
      confirm: true,
      sport: true,
      terms: true,
    });
    if (Object.keys(next).length === 0) {
      setSubmitting(true);
      setRegisterError(null);
      try {
        const [firstName, ...rest] = form.fullName.trim().split(' ');
        const lastName = rest.join(' ') || '-';
        const response = await authService.register({
          first_name: firstName,
          last_name: lastName,
          email: form.email,
          phone: form.phone || undefined,
          password: form.password,
          role: form.role,
          sport: form.sport,
        });
        const role = response.user.role;
        if (role === 'Admin') navigate('/admin/dashboard');
        else if (role === 'Coach') {
          authService.logout();
          alert('Coach application submitted successfully! Your account is pending admin approval before you can log in.');
          navigate('/login');
        } else navigate('/dashboard');
      } catch (err) {
        setRegisterError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  }

  function fieldState(value: string, error?: string) {
    if (touched[value] && error) return 'invalid';
    if (touched[value] && !error && form[value as keyof typeof form]) return 'valid';
    return 'default';
  }

  const states: Record<string, 'invalid' | 'valid' | 'default'> = {
    fullName: fieldState('fullName', errors.fullName),
    email: fieldState('email', errors.email),
    phone: fieldState('phone', errors.phone),
    password: fieldState('password', errors.password),
    confirm: fieldState('confirm', errors.confirm),
  };

  const borderClass: Record<string, string> = {
    invalid: 'border-red-400 ring-2 ring-red-100',
    valid: 'border-pitch-400 ring-2 ring-pitch-100',
    default: 'border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100',
  };

  return (
    <AuthLayout
      title="Start Your Journey"
      subtitle="Create your account"
      motivational="Join thousands of athletes training, competing and growing with SportsClub. Your first session is closer than you think — let's get you on the field."
      statValue="6+"
      statLabel="Sports offered"
    >
      <form onSubmit={handleSubmit} className="mt-6 space-y-4 lg:mt-8" noValidate>
        {/* Role Selector */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            I am joining as a
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => update('role', 'Member')}
              className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                form.role === 'Member'
                  ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-100'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Member / Athlete
            </button>
            <button
              type="button"
              onClick={() => update('role', 'Coach')}
              className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                form.role === 'Coach'
                  ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-100'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Coach / Instructor
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-sm font-semibold text-slate-700">
            Full Name
          </label>
          <div className={`group flex items-center gap-3 rounded-2xl border bg-white px-4 transition-all ${borderClass[states.fullName]}`}>
            <User className={`h-5 w-5 shrink-0 ${states.fullName === 'invalid' ? 'text-red-400' : states.fullName === 'valid' ? 'text-pitch-500' : 'text-slate-400 group-focus-within:text-brand-500'}`} />
            <input
              id="fullName"
              type="text"
              value={form.fullName}
              onChange={(e) => update('fullName', e.target.value)}
              onBlur={() => markTouched('fullName')}
              placeholder="John Athlete"
              className="w-full bg-transparent py-3 text-sm text-slate-900 placeholder-slate-400 outline-none"
            />
            {states.fullName === 'valid' && <CheckCircle2 className="h-5 w-5 shrink-0 text-pitch-500" />}
          </div>
          {touched.fullName && errors.fullName && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email + Phone */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Email Address
            </label>
            <div className={`group flex items-center gap-3 rounded-2xl border bg-white px-4 transition-all ${borderClass[states.email]}`}>
              <Mail className={`h-5 w-5 shrink-0 ${states.email === 'invalid' ? 'text-red-400' : states.email === 'valid' ? 'text-pitch-500' : 'text-slate-400 group-focus-within:text-brand-500'}`} />
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                onBlur={() => markTouched('email')}
                placeholder="you@example.com"
                className="w-full bg-transparent py-3 text-sm text-slate-900 placeholder-slate-400 outline-none"
              />
              {states.email === 'valid' && <CheckCircle2 className="h-5 w-5 shrink-0 text-pitch-500" />}
            </div>
            {touched.email && errors.email && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Phone Number
            </label>
            <div className={`group flex items-center gap-3 rounded-2xl border bg-white px-4 transition-all ${borderClass[states.phone]}`}>
              <Phone className={`h-5 w-5 shrink-0 ${states.phone === 'invalid' ? 'text-red-400' : states.phone === 'valid' ? 'text-pitch-500' : 'text-slate-400 group-focus-within:text-brand-500'}`} />
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                onBlur={() => markTouched('phone')}
                placeholder="+91 90000 00000"
                className="w-full bg-transparent py-3 text-sm text-slate-900 placeholder-slate-400 outline-none"
              />
              {states.phone === 'valid' && <CheckCircle2 className="h-5 w-5 shrink-0 text-pitch-500" />}
            </div>
            {touched.phone && errors.phone && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Password + Confirm */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Password
            </label>
            <div className={`group flex items-center gap-3 rounded-2xl border bg-white px-4 transition-all ${borderClass[states.password]}`}>
              <Lock className={`h-5 w-5 shrink-0 ${states.password === 'invalid' ? 'text-red-400' : states.password === 'valid' ? 'text-pitch-500' : 'text-slate-400 group-focus-within:text-brand-500'}`} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                onBlur={() => markTouched('password')}
                placeholder="Enter password"
                className="w-full bg-transparent py-3 text-sm text-slate-900 placeholder-slate-400 outline-none"
              />
              {states.password === 'valid' && <CheckCircle2 className="h-5 w-5 shrink-0 text-pitch-500" />}
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="shrink-0 text-slate-400 transition-colors hover:text-slate-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {touched.password && errors.password && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirm" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Confirm Password
            </label>
            <div className={`group flex items-center gap-3 rounded-2xl border bg-white px-4 transition-all ${borderClass[states.confirm]}`}>
              <Lock className={`h-5 w-5 shrink-0 ${states.confirm === 'invalid' ? 'text-red-400' : states.confirm === 'valid' ? 'text-pitch-500' : 'text-slate-400 group-focus-within:text-brand-500'}`} />
              <input
                id="confirm"
                type={showConfirm ? 'text' : 'password'}
                value={form.confirm}
                onChange={(e) => update('confirm', e.target.value)}
                onBlur={() => markTouched('confirm')}
                placeholder="Re-enter password"
                className="w-full bg-transparent py-3 text-sm text-slate-900 placeholder-slate-400 outline-none"
              />
              {states.confirm === 'valid' && <CheckCircle2 className="h-5 w-5 shrink-0 text-pitch-500" />}
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="shrink-0 text-slate-400 transition-colors hover:text-slate-600"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {touched.confirm && errors.confirm && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.confirm}
              </p>
            )}
          </div>
        </div>

        {/* Preferred Sport dropdown */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Preferred Sport
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setSportOpen((v) => !v)}
              onBlur={() => setTimeout(() => markTouched('sport'), 150)}
              className={`flex w-full items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3 text-sm transition-all ${
                touched.sport && errors.sport
                  ? 'border-red-400 ring-2 ring-red-100'
                  : form.sport
                  ? 'border-pitch-400 ring-2 ring-pitch-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className={`flex items-center gap-3 ${form.sport ? 'text-slate-900' : 'text-slate-400'}`}>
                <Trophy className={`h-5 w-5 ${form.sport ? 'text-pitch-500' : 'text-slate-400'}`} />
                {form.sport || 'Select your sport'}
              </span>
              <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${sportOpen ? 'rotate-180' : ''}`} />
            </button>
            {sportOpen && (
              <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white py-1.5 shadow-xl shadow-slate-300/40">
                {sports.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => {
                        update('sport', s);
                        setSportOpen(false);
                        setErrors((p) => ({ ...p, sport: undefined }));
                      }}
                      className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-brand-50 ${
                        form.sport === s ? 'bg-brand-50 text-brand-700' : 'text-slate-700'
                      }`}
                    >
                      <span className="grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br from-brand-100 to-pitch-100">
                        <Trophy className="h-3.5 w-3.5 text-brand-600" />
                      </span>
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {touched.sport && errors.sport && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.sport}
            </p>
          )}
        </div>

        {/* Terms checkbox */}
        <div>
          <label className="flex cursor-pointer items-start gap-2.5">
            <button
              type="button"
              role="checkbox"
              aria-checked={form.terms}
              onClick={() => {
                update('terms', !form.terms);
                if (!form.terms) setErrors((p) => ({ ...p, terms: undefined }));
              }}
              className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition-all ${
                form.terms ? 'border-brand-600 bg-brand-600' : 'border-slate-300 bg-white'
              }`}
            >
              {form.terms && <CheckCircle2 className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
            </button>
            <span className="text-sm leading-relaxed text-slate-600">
              I agree to the{' '}
              <a href="#" className="font-semibold text-brand-600 hover:text-brand-700">Terms</a>{' '}
              &{' '}
              <a href="#" className="font-semibold text-brand-600 hover:text-brand-700">Privacy Policy</a>
            </span>
          </label>
          {touched.terms && errors.terms && (
            <p className="mt-1.5 flex items-center gap-1.5 pl-7 text-xs font-medium text-red-500">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.terms}
            </p>
          )}
        </div>

        {registerError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {registerError}
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
              Creating account…
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>

        {/* Bottom link */}
        <p className="pt-2 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-600 transition-colors hover:text-brand-700">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
