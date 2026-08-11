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
  approval_status?: 'Pending Coach Approval' | 'Confirmed' | 'Rejected';
  created_at: string;
}

const BOOKINGS_STATUS_KEY = 'sports_club_resource_booking_status';

function getStoredApprovalStatuses(): Record<string, 'Pending Coach Approval' | 'Confirmed' | 'Rejected'> {
  try {
    const data = localStorage.getItem(BOOKINGS_STATUS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
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
    const list = await api.get<ResourceBooking[]>('/resource-bookings');
    const statuses = getStoredApprovalStatuses();
    return list.map((b) => ({
      ...b,
      approval_status: statuses[b.id] || 'Pending Coach Approval',
    }));
  },

  async getById(id: string): Promise<ResourceBooking> {
    const b = await api.get<ResourceBooking>(`/resource-bookings/${id}`);
    const statuses = getStoredApprovalStatuses();
    return {
      ...b,
      approval_status: statuses[b.id] || 'Pending Coach Approval',
    };
  },

  async create(data: {
    resource_id: string;
    member_id: string;
    booking_date: string;
    duration_hours: number;
  }): Promise<ResourceBooking> {
    const booking = await api.post<ResourceBooking>('/resource-bookings', data);
    const statuses = getStoredApprovalStatuses();
    statuses[booking.id] = 'Pending Coach Approval';
    localStorage.setItem(BOOKINGS_STATUS_KEY, JSON.stringify(statuses));
    window.dispatchEvent(new Event('resource_booking_updated'));
    return {
      ...booking,
      approval_status: 'Pending Coach Approval',
    };
  },

  async updateApprovalStatus(id: string, status: 'Confirmed' | 'Rejected'): Promise<void> {
    const statuses = getStoredApprovalStatuses();
    statuses[id] = status;
    localStorage.setItem(BOOKINGS_STATUS_KEY, JSON.stringify(statuses));
    window.dispatchEvent(new Event('resource_booking_updated'));
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
