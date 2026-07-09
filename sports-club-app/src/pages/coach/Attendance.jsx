import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';

export default function Attendance() {
  const { currentUser, members, attendanceHistory, submitAttendance } = useContext(AppContext);
  const coachSport = currentUser?.specialty || 'Football';
  const teamMembers = members.filter(m => m.sport === coachSport && m.status === 'Active');

  const [sessionTitle, setSessionTitle] = useState('Tactical Drills Session');
  const [attendanceRecords, setAttendanceRecords] = useState({
    'm1': 'Present',
    'm2': 'Present',
    'm3': 'Present'
  });
  const [success, setSuccess] = useState('');

  const handleMark = (e) => {
    e.preventDefault();
    submitAttendance(
      sessionTitle,
      new Date().toISOString().split('T')[0],
      coachSport,
      attendanceRecords
    );
    setSuccess('Roster attendance saved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const toggleStatus = (id) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [id]: prev[id] === 'Present' ? 'Absent' : 'Present'
    }));
  };

  const coachHistory = attendanceHistory.filter(h => h.sport === coachSport);

  return (
    <div className="container-fluid py-4 px-md-5 text-light">
      <h2 className="mb-2 text-white">Attendance Tracking Hub ({coachSport})</h2>
      <p className="text-muted small mb-4">Mark daily training registers and track general attendance percentages across history.</p>

      {success && (
        <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3 p-3 mb-4 text-center small animate-fade-in">
          {success}
        </div>
      )}

      <div className="row g-4">
        {/* Daily Register */}
        <div className="col-12 col-lg-5">
          <div className="glass-panel p-4 shadow">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-white m-0">Mark Active Register</h5>
              <span className="small text-muted">{new Date().toDateString()}</span>
            </div>
            
            <form onSubmit={handleMark}>
              <div className="mb-3">
                <label className="form-label text-muted small">Session Title</label>
                <input type="text" className="form-control form-control-custom" value={sessionTitle} onChange={e => setSessionTitle(e.target.value)} />
              </div>

              <div className="list-group mb-4" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                {teamMembers.map((member) => (
                  <div key={member.id} className="list-group-item d-flex justify-content-between align-items-center bg-dark bg-opacity-25 border-secondary border-opacity-20 px-3 py-2.5">
                    <span className="text-white fw-semibold small">{member.name}</span>
                    <button 
                      type="button" 
                      className={`btn btn-sm px-3 ${attendanceRecords[member.id] === 'Present' ? 'btn-success' : 'btn-outline-danger'}`}
                      onClick={() => toggleStatus(member.id)}
                      style={{ borderRadius: '6px', fontSize: '0.8rem' }}
                    >
                      {attendanceRecords[member.id] === 'Present' ? 'Present' : 'Absent'}
                    </button>
                  </div>
                ))}
              </div>

              <button type="submit" className="btn btn-primary-custom w-100">
                Log Roster Sheet
              </button>
            </form>
          </div>
        </div>

        {/* History Log */}
        <div className="col-12 col-lg-7">
          <div className="glass-panel p-4 shadow h-100" style={{ minHeight: '400px' }}>
            <h5 className="text-white mb-4">Historical Attendance Registers</h5>
            
            {coachHistory.length === 0 ? (
              <div className="text-center py-5 text-muted">No attendance sheets logged yet.</div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {coachHistory.map((sheet) => (
                  <div key={sheet.id} className="p-3 rounded-4" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="m-0 text-white fw-bold">{sheet.eventTitle}</h6>
                      <span className="small text-muted">{sheet.date}</span>
                    </div>
                    
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {Object.entries(sheet.records).map(([mId, status]) => {
                        const m = members.find(p => p.id === mId);
                        if (!m || m.sport !== coachSport) return null;
                        return (
                          <span key={mId} className={`badge py-1.5 px-2.5 small ${status === 'Present' ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-35' : 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-35'}`}>
                            {m.name}: {status}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
