import api from './api';
import type { AuthUser, UserRole } from './authService';

export type { AuthUser };

export const userService = {
  async getAll(): Promise<AuthUser[]> {
    return api.get<AuthUser[]>('/users');
  },

  async getById(id: string): Promise<AuthUser> {
    return api.get<AuthUser>(`/users/${id}`);
  },

  async getByRole(role: UserRole): Promise<AuthUser[]> {
    return api.get<AuthUser[]>(`/users/role/${role}`);
  },

  async updateProfile(id: string, data: {
    first_name: string;
    last_name: string;
    phone?: string | null;
    profile_picture_url?: string | null;
  }): Promise<AuthUser> {
    return api.put<AuthUser>(`/users/${id}`, data);
  },

  async resetPassword(data: {
    email: string;
    old_password: string;
    new_password: string;
  }): Promise<{ message: string }> {
    return api.post<{ message: string }>('/users/reset-password', data);
  },
};

export default userService;
