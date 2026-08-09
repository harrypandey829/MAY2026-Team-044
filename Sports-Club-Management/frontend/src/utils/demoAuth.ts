/**
 * demoAuth.ts — now delegates to real backend authentication.
 * Kept for backward compatibility with existing imports across the codebase.
 */
import authService from '../services/authService';
import type { UserRole } from '../services/authService';

// Legacy DemoRole type — maps to real UserRole values
export type DemoRole = 'member' | 'coach' | 'admin';

function mapRole(role: UserRole | null): DemoRole | null {
  if (!role) return null;
  const map: Record<UserRole, DemoRole> = {
    Admin: 'admin',
    Coach: 'coach',
    Member: 'member',
  };
  return map[role] ?? null;
}

/** @deprecated Use authService.login() directly */
export async function loginDemoUser(email: string, password: string): Promise<DemoRole | null> {
  try {
    const response = await authService.login(email, password);
    return mapRole(response.user.role);
  } catch {
    return null;
  }
}

export function isDemoAuthenticated(): boolean {
  return authService.isAuthenticated();
}

export function getDemoRole(): DemoRole | null {
  return mapRole(authService.getRole());
}

export function getDemoDisplayName(): string {
  return authService.getDisplayName();
}

export function getDemoSession() {
  const user = authService.getCurrentUser();
  if (!user) return null;
  return {
    role: mapRole(user.role) as DemoRole,
    email: user.email,
    displayName: authService.getDisplayName(),
  };
}

export function logoutDemoUser(): void {
  authService.logout();
}
