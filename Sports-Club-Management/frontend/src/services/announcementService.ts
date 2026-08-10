import api from './api';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  created_by: string;
  created_at: string;
}

export interface CreateAnnouncementRequest {
  title: string;
  message: string;
  created_by: string;
}

export const announcementService = {
  async getAll(): Promise<Announcement[]> {
    const data = await api.get<Announcement[]>('/announcements');
    // Sort newest first
    return data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getById(id: string): Promise<Announcement> {
    return api.get<Announcement>(`/announcements/${id}`);
  },

  async create(data: CreateAnnouncementRequest): Promise<Announcement> {
    return api.post<Announcement>('/announcements', data);
  },

  async update(id: string, data: { title: string; message: string }): Promise<Announcement> {
    return api.put<Announcement>(`/announcements/${id}`, data);
  },

  async delete(id: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/announcements/${id}`);
  },

  formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  },
};

export default announcementService;
