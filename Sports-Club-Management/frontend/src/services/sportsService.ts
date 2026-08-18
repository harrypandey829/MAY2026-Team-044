import api from './api';

export interface Sport {
  id: string;
  name: string;
  monthly_fee: number;
  annual_fee: number;
  description?: string;
}

export interface EquipmentUtility {
  id: string;
  sport_name: string;
  name: string;
  total_quantity: number;
  available_quantity: number;
}

export const sportsService = {
  async getAllSports(): Promise<Sport[]> {
    try {
      return await api.get<Sport[]>('/sports');
    } catch {
      return [
        { id: '1', name: 'Badminton', monthly_fee: 1500, annual_fee: 15000, description: 'Indoor court badminton training & leagues.' },
        { id: '2', name: 'Football', monthly_fee: 2000, annual_fee: 20000, description: 'Outdoor grass pitch football coaching & tournaments.' },
        { id: '3', name: 'Cricket', monthly_fee: 2200, annual_fee: 22000, description: 'Net practice, pitch fixtures, and physical conditioning.' },
        { id: '4', name: 'Tennis', monthly_fee: 1800, annual_fee: 18000, description: 'Synthetic & clay court tennis training.' },
        { id: '5', name: 'Swimming', monthly_fee: 2500, annual_fee: 25000, description: 'Olympic size pool training and stroke refinement.' },
      ];
    }
  },

  async createSport(data: { name: string; monthly_fee: number; annual_fee: number; description?: string }): Promise<Sport> {
    return api.post<Sport>('/sports', data);
  },

  async deleteSport(sportName: string): Promise<void> {
    await api.delete(`/sports/${encodeURIComponent(sportName)}`);
  },

  async getUtilities(sportName: string): Promise<EquipmentUtility[]> {
    try {
      return await api.get<EquipmentUtility[]>(`/sports/${encodeURIComponent(sportName)}/utilities`);
    } catch {
      return [];
    }
  },

  async addUtility(sportName: string, data: { name: string; total_quantity: number }): Promise<EquipmentUtility> {
    return api.post<EquipmentUtility>(`/sports/${encodeURIComponent(sportName)}/utilities`, {
      sport_name: sportName,
      name: data.name,
      total_quantity: data.total_quantity
    });
  }
};

export default sportsService;
