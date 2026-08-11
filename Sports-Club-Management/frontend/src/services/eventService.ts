import api from './api';

export interface Event {
  id: string;
  team_id: string | null;
  created_by: string;
  title: string;
  description: string | null;
  sport?: string | null;
  event_type: 'Practice' | 'Match' | 'Tournament' | 'Club Event' | 'Holiday';
  event_status: 'Scheduled' | 'Cancelled' | 'Completed';
  date: string;
  start_time: string;
  end_time: string | null;
  venue: string;
  opponent: string | null;
  max_participants: number | null;
  registration_deadline: string | null;
  is_registration_open: boolean;
  created_at: string;
}

export interface CreateEventRequest {
  title: string;
  event_type: Event['event_type'];
  date: string;
  start_time: string;
  end_time?: string;
  venue: string;
  opponent?: string;
  description?: string;
  sport?: string;
  event_status?: Event['event_status'];
  max_participants?: number;
  registration_deadline?: string;
  created_by?: string;
  team_id?: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  member_id: string;
  registration_status: 'Registered' | 'Not Attending' | 'Waitlist';
  registered_at: string;
}

export const eventService = {
  async getAll(): Promise<Event[]> {
    return api.get<Event[]>('/events');
  },

  async getById(id: string): Promise<Event> {
    return api.get<Event>(`/events/${id}`);
  },

  async create(data: CreateEventRequest): Promise<Event> {
    return api.post<Event>('/events', data);
  },

  async update(id: string, data: Partial<CreateEventRequest>): Promise<Event> {
    return api.put<Event>(`/events/${id}`, data);
  },

  async cancel(id: string): Promise<Event> {
    return api.patch<Event>(`/events/${id}/cancel`);
  },

  async registerMember(eventId: string, memberId: string): Promise<EventRegistration> {
    return api.post<EventRegistration>('/event-registrations', {
      event_id: eventId,
      member_id: memberId,
    });
  },

  async unregisterMember(eventId: string, memberId: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/event-registrations/${eventId}/${memberId}`);
  },

  async getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
    return api.get<EventRegistration[]>(`/event-registrations/${eventId}`);
  },

  async getMemberRegistrations(memberId: string): Promise<EventRegistration[]> {
    return api.get<EventRegistration[]>(`/event-registrations/member/${memberId}`);
  },

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  },

  formatTime(timeStr: string): string {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  },

  getUpcoming(events: Event[]): Event[] {
    const today = new Date().toISOString().split('T')[0];
    return events
      .filter((e) => e.date >= today && e.event_status === 'Scheduled')
      .sort((a, b) => a.date.localeCompare(b.date));
  },
};

export default eventService;
