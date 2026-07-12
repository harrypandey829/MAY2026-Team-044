// Temporary frontend-only demo authentication wrapper for the coach dashboard.
// This will be replaced with real backend authentication later.

import { getDemoRole, isDemoAuthenticated, logoutDemoUser } from './demoAuth';

export function loginCoachDemoUser(): boolean {
  return isDemoAuthenticated() && getDemoRole() === 'coach';
}

export function logoutCoachDemoUser(): void {
  logoutDemoUser();
}

export function isCoachAuthenticated(): boolean {
  return isDemoAuthenticated() && getDemoRole() === 'coach';
}
