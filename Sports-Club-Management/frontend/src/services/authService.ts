import api from './api';
import userService from './userService';

export type UserRole = 'Admin' | 'Coach' | 'Member';

export interface AuthUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  profile_picture_url: string | null;
  sport?: string | null;
  address?: string | null;
  gender?: string | null;
  dob?: string | null;
  emergency_contact?: string | null;
  blood_group?: string | null;
  is_approved: boolean;
  status: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export interface SignupRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password: string;
  role?: UserRole;
  sport?: string;
  address?: string;
  gender?: string;
  dob?: string;
  emergency_contact?: string;
  blood_group?: string;
}

const TOKEN_KEY = 'sc_token';
const USER_KEY = 'sc_user';

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    localStorage.setItem(TOKEN_KEY, response.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    return response;
  },

  async register(data: SignupRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/signup', data);
    // If the account is pending approval, do not set token locally
    if (response.user.is_approved) {
      localStorage.setItem(TOKEN_KEY, response.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }
    return response;
  },


  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem(USER_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as AuthUser;
    } catch {
      return null;
    }
  },

  updateUserLocal(user: AuthUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getEnrolledSports(): string[] {
    const user = this.getCurrentUser();
    if (!user || !user.sport || !user.sport.trim()) return [];
    return user.sport
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  },

  async addEnrolledSport(sportName: string): Promise<AuthUser | null> {
    const user = this.getCurrentUser();
    if (!user) return null;
    const current = this.getEnrolledSports();
    if (!current.includes(sportName)) {
      current.push(sportName);
      const newSportStr = current.join(', ');
      const updatedUser: AuthUser = { ...user, sport: newSportStr };
      this.updateUserLocal(updatedUser);
      try {
        await userService.updateProfile(user.id, { sport: newSportStr });
      } catch (err) {
        console.error('Failed to sync sports update to backend:', err);
      }
      return updatedUser;
    }
    return user;
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  getRole(): UserRole | null {
    return this.getCurrentUser()?.role ?? null;
  },

  getDisplayName(): string {
    const user = this.getCurrentUser();
    if (!user) return 'User';
    return `${user.first_name} ${user.last_name}`;
  },

  getFirstName(): string {
    return this.getCurrentUser()?.first_name ?? 'User';
  },

  getInitials(): string {
    const user = this.getCurrentUser();
    if (!user) return '?';
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  },
};

export default authService;
