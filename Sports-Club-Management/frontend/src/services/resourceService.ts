import api from './api';

export interface Resource {
  id: string;
  name: string;
  resource_type: string;
  quantity: number;
  capacity?: number;
  is_available: boolean;
  created_at: string;
}

export interface ResourceBooking {
  id: string;
  resource_id?: string;
  member_id?: string;
  coach_id?: string;
  sport_name?: string;
  venue_name?: string;
  booking_date: string;
  start_time?: string;
  end_time?: string;
  duration_hours?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  remarks?: string;
  is_cancelled: boolean;
  created_at: string;
}

export const resourceService = {
  async getAll(): Promise<Resource[]> {
    return api.get<Resource[]>('/resources');
  },

  async getById(id: string): Promise<Resource> {
    return api.get<Resource>(`/resources/${id}`);
  },

  async create(data: { name: string; resource_type: string; quantity: number; capacity?: number }): Promise<Resource> {
    return api.post<Resource>('/resources', data);
  },

  async update(
    id: string,
    data: { name: string; resource_type: string; quantity: number; is_available: boolean }
  ): Promise<Resource> {
    return api.put<Resource>(`/resources/${id}`, data);
  },

  async delete(id: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/resources/${id}`);
  },

  async getMyBookings(): Promise<ResourceBooking[]> {
    return api.get<ResourceBooking[]>('/resource-bookings');
  },

  async createBooking(data: {
    coach_id?: string;
    member_id?: string;
    sport_name?: string;
    venue_name?: string;
    booking_date: string;
    start_time?: string;
    end_time?: string;
    remarks?: string;
  }): Promise<ResourceBooking> {
    return api.post<ResourceBooking>('/resource-bookings', data);
  },
};

export const resourceBookingService = {
  async getAll(): Promise<ResourceBooking[]> {
    return api.get<ResourceBooking[]>('/resource-bookings');
  },

  async getById(id: string): Promise<ResourceBooking> {
    return api.get<ResourceBooking>(`/resource-bookings/${id}`);
  },

  async create(data: {
    coach_id?: string;
    member_id?: string;
    sport_name?: string;
    venue_name?: string;
    booking_date: string;
    start_time?: string;
    end_time?: string;
    remarks?: string;
  }): Promise<ResourceBooking> {
    return api.post<ResourceBooking>('/resource-bookings', data);
  },

  async updateStatus(id: string, status: 'APPROVED' | 'REJECTED', remarks?: string): Promise<ResourceBooking> {
    return api.put<ResourceBooking>(`/resource-bookings/${id}/status?status=${status}${remarks ? `&remarks=${encodeURIComponent(remarks)}` : ''}`, {});
  },

  async delete(id: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/resource-bookings/${id}`);
  },
};

export default resourceService;
