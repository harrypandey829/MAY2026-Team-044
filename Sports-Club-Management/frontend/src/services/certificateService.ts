import api from './api';

export interface Certificate {
  id: string;
  member_id: string;
  sport_name: string;
  title: string;
  issued_by: string;
  issued_date: string;
}

export const certificateService = {
  async getMemberCertificates(memberId: string): Promise<Certificate[]> {
    try {
      const response = await api.get(`/certificates/member/${memberId}`);
      return response.data;
    } catch {
      return [];
    }
  },

  async issueCertificate(data: { member_id: string; sport_name: string; title: string; issued_by: string }): Promise<Certificate> {
    const response = await api.post('/certificates', data);
    return response.data;
  }
};

export default certificateService;
