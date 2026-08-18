import api from './api';

export interface EquipmentIssuance {
  id: string;
  member_id: string;
  equipment_id: string;
  sport_name: string;
  quantity: number;
  issued_at: string;
  duration_hours: number;
  expected_return_at: string;
  returned_at?: string;
  status: 'ISSUED' | 'RETURNED' | 'EXPIRED';
}

export const equipmentService = {
  async issueEquipment(data: { equipment_id: string; quantity: number; duration_hours: number }): Promise<EquipmentIssuance> {
    const response = await api.post('/equipment/issue', data);
    return response.data;
  },

  async returnEquipment(issuanceId: string): Promise<EquipmentIssuance> {
    const response = await api.post(`/equipment/return/${issuanceId}`);
    return response.data;
  },

  async getMyIssuances(): Promise<EquipmentIssuance[]> {
    try {
      const response = await api.get('/equipment/my-issuances');
      return response.data;
    } catch {
      return [];
    }
  }
};

export default equipmentService;
