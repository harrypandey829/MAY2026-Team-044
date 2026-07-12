// Temporary frontend-only demo authentication.
// This will be replaced with real backend authentication later.

const MEMBER_DEMO_EMAIL = 'demo@sportsclub.com';
const MEMBER_DEMO_PASSWORD = 'demo123';
const COACH_DEMO_EMAIL = 'democoach@sportsclub.com';
const COACH_DEMO_PASSWORD = 'coach123';
const ADMIN_DEMO_EMAIL = 'admin@sportsclub.com';
const ADMIN_DEMO_PASSWORD = 'admin123';
const DEMO_AUTH_STORAGE_KEY = 'sportsclub-demo-auth-session';

type DemoRole = 'member' | 'coach' | 'admin';

interface DemoSession {
  role: DemoRole;
  email: string;
  displayName: string;
}

function persistDemoSession(session: DemoSession): void {
  const serialized = JSON.stringify(session);
  localStorage.setItem(DEMO_AUTH_STORAGE_KEY, serialized);
  sessionStorage.setItem(DEMO_AUTH_STORAGE_KEY, serialized);
}

function clearDemoSession(): void {
  localStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
  sessionStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
}

export function loginDemoUser(email: string, password: string): DemoRole | null {
  if (email === ADMIN_DEMO_EMAIL && password === ADMIN_DEMO_PASSWORD) {
    persistDemoSession({ role: 'admin', email, displayName: 'Club Administrator' });
    return 'admin';
  }

  if (email === MEMBER_DEMO_EMAIL && password === MEMBER_DEMO_PASSWORD) {
    persistDemoSession({ role: 'member', email, displayName: 'Alex Carter' });
    return 'member';
  }

  if (email === COACH_DEMO_EMAIL && password === COACH_DEMO_PASSWORD) {
    persistDemoSession({ role: 'coach', email, displayName: 'Coach Rivera' });
    return 'coach';
  }

  clearDemoSession();
  return null;
}

export function getDemoSession(): DemoSession | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(DEMO_AUTH_STORAGE_KEY) ?? sessionStorage.getItem(DEMO_AUTH_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as DemoSession;
  } catch {
    clearDemoSession();
    return null;
  }
}

export function isDemoAuthenticated(): boolean {
  return getDemoSession() !== null;
}

export function getDemoRole(): DemoRole | null {
  return getDemoSession()?.role ?? null;
}

export function getDemoDisplayName(): string {
  return getDemoSession()?.displayName ?? 'Club Administrator';
}

export function logoutDemoUser(): void {
  clearDemoSession();
}
