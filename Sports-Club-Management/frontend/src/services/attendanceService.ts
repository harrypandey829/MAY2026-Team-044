import api from './api';

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface AttendanceRecord {
  id: string;
  event_id: string;
  member_id: string;
  attendance_status: AttendanceStatus;
  remarks: string | null;
  marked_at: string;
}

export interface MarkAttendanceRequest {
  event_id: string;
  member_id: string;
  attendance_status: AttendanceStatus;
  remarks?: string;
}

export const attendanceService = {
  async getMemberHistory(memberId: string): Promise<AttendanceRecord[]> {
    return api.get<AttendanceRecord[]>(`/attendance/member/${memberId}`);
  },

  async getEventReport(eventId: string): Promise<AttendanceRecord[]> {
    return api.get<AttendanceRecord[]>(`/attendance/event/${eventId}`);
  },

  async markAttendance(data: MarkAttendanceRequest): Promise<AttendanceRecord> {
    return api.post<AttendanceRecord>('/attendance', data);
  },

  getAttendanceRate(records: AttendanceRecord[]): number {
    if (records.length === 0) return 0;
    const present = records.filter(
      (r) => r.attendance_status === 'Present' || r.attendance_status === 'Late'
    ).length;
    return Math.round((present / records.length) * 100);
  },
};

export default attendanceService;
