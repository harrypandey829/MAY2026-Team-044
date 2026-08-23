import api from './api';

export interface Resource {
  id: string;
  name: string;
  resource_type: string;
  quantity: number;
  is_available: boolean;
  created_at: string;
}

export interface ResourceBooking {
  id: string;
  resource_id: string;
  member_id: string;
  booking_date: string;
  duration_hours: number;
  is_cancelled: boolean;
  created_at: string;
  user_name?: string;
  user_role?: string;
  resource_name?: string;
}

export const resourceService = {
  async getAll(): Promise<Resource[]> {
    return api.get<Resource[]>('/resources');
  },

  async getById(id: string): Promise<Resource> {
    return api.get<Resource>(`/resources/${id}`);
  },

  async create(data: { name: string; resource_type: string; quantity: number }): Promise<Resource> {
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
};

export const resourceBookingService = {
  async getAll(): Promise<ResourceBooking[]> {
    return api.get<ResourceBooking[]>('/resource-bookings');
  },

  async getById(id: string): Promise<ResourceBooking> {
    return api.get<ResourceBooking>(`/resource-bookings/${id}`);
  },

  async create(data: {
    resource_id: string;
    member_id: string;
    booking_date: string;
    duration_hours: number;
  }): Promise<ResourceBooking> {
    return api.post<ResourceBooking>('/resource-bookings', data);
  },

  async update(
    id: string,
    data: { booking_date: string; duration_hours: number; is_cancelled: boolean }
  ): Promise<ResourceBooking> {
    return api.put<ResourceBooking>(`/resource-bookings/${id}`, data);
  },

  async cancel(id: string, booking: ResourceBooking): Promise<ResourceBooking> {
    return api.put<ResourceBooking>(`/resource-bookings/${id}`, {
      booking_date: booking.booking_date,
      duration_hours: booking.duration_hours,
      is_cancelled: true,
    });
  },

  async delete(id: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/resource-bookings/${id}`);
  },
};

export default resourceService;
