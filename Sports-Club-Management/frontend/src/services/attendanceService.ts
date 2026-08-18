import api from './api';

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused' | 'PRESENT' | 'ABSENT';

export interface AttendanceRecord {
  id: string;
  event_id: string;
  member_id: string;
  attendance_status: AttendanceStatus | string;
  remarks: string | null;
  rating?: number;
  marked_at: string;
}

export interface MarkAttendanceRequest {
  event_id: string;
  member_id: string;
  attendance_status: AttendanceStatus | string;
  remarks?: string;
  rating?: number;
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
    const present = records.filter((r) => {
      const st = (r.attendance_status || '').toUpperCase();
      return st === 'PRESENT' || st === 'LATE';
    }).length;
    return Math.round((present / records.length) * 100);
  },
};

export default attendanceService;
