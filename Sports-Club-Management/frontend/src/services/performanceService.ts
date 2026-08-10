import api from './api';

export interface PerformanceRecord {
  id: string;
  member_id: string;
  event_id: string;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  minutes_played: number;
  rating: number | null;
  remarks: string | null;
  created_at: string;
}

export interface CreatePerformanceRequest {
  member_id: string;
  event_id: string;
  goals?: number;
  assists?: number;
  yellow_cards?: number;
  red_cards?: number;
  minutes_played?: number;
  rating?: number;
  remarks?: string;
}

export const performanceService = {
  async getMemberHistory(memberId: string): Promise<PerformanceRecord[]> {
    return api.get<PerformanceRecord[]>(`/performance/member/${memberId}`);
  },

  async getAll(): Promise<PerformanceRecord[]> {
    return api.get<PerformanceRecord[]>('/performance');
  },

  async getById(id: string): Promise<PerformanceRecord> {
    return api.get<PerformanceRecord>(`/performance/${id}`);
  },

  async create(data: CreatePerformanceRequest): Promise<PerformanceRecord> {
    return api.post<PerformanceRecord>('/performance', data);
  },

  async update(
    id: string,
    data: Partial<Omit<CreatePerformanceRequest, 'member_id' | 'event_id'>>
  ): Promise<PerformanceRecord> {
    return api.put<PerformanceRecord>(`/performance/${id}`, data);
  },

  async delete(id: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/performance/${id}`);
  },

  getTotals(records: PerformanceRecord[]) {
    return records.reduce(
      (acc, r) => ({
        goals: acc.goals + r.goals,
        assists: acc.assists + r.assists,
        minutes_played: acc.minutes_played + r.minutes_played,
        yellow_cards: acc.yellow_cards + r.yellow_cards,
        red_cards: acc.red_cards + r.red_cards,
        avg_rating:
          records.filter((x) => x.rating != null).length > 0
            ? records
                .filter((x) => x.rating != null)
                .reduce((s, x) => s + (x.rating ?? 0), 0) /
              records.filter((x) => x.rating != null).length
            : null,
      }),
      { goals: 0, assists: 0, minutes_played: 0, yellow_cards: 0, red_cards: 0, avg_rating: 0 as number | null }
    );
  },
};

export default performanceService;
