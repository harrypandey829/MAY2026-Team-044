import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';

export default function Roster() {
  const { currentUser, members, playerStats, updatePlayerPerformance } = useContext(AppContext);
  const coachSport = currentUser?.specialty || 'Football';
  const teamMembers = members.filter(m => m.sport === coachSport && m.status === 'Active');

  const [selectedPlayerId, setSelectedPlayerId] = useState(teamMembers[0]?.id || '');
  const [perfMatches, setPerfMatches] = useState(10);
  const [perfGoals, setPerfGoals] = useState(2);
  const [perfAssists, setPerfAssists] = useState(1);
  const [perfRating, setPerfRating] = useState(7.0);
  const [perfRemarks, setPerfRemarks] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!selectedPlayerId) return;
    updatePlayerPerformance(selectedPlayerId, {
      matchesPlayed: Number(perfMatches),
      goals: Number(perfGoals),
      assists: Number(perfAssists),
      rating: Number(perfRating),
      remarks: perfRemarks
    });
    setSuccess('Player statistics updated successfully!');
    setPerfRemarks('');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSelectChange = (e) => {
    const id = e.target.value;
    setSelectedPlayerId(id);
    const stat = playerStats[id] || { matchesPlayed: 0, goals: 0, assists: 0, rating: 0, remarks: '' };
    setPerfMatches(stat.matchesPlayed);
    setPerfGoals(stat.goals || stat.wins || 0);
    setPerfAssists(stat.assists || 0);
    setPerfRating(stat.rating || 7.0);
    setPerfRemarks(stat.remarks || '');
  };

  return (
    <div className="container-fluid py-4 px-md-5 text-light">
      <h2 className="mb-2 text-white">Squad Roster Management ({coachSport})</h2>
      <p className="text-muted small mb-4">View contact sheets, edit match tallies, and update player performance grades.</p>

      {success && (
        <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3 p-3 mb-4 text-center small animate-fade-in">
          {success}
        </div>
      )}

      <div className="row g-4">
        {/* Roster table */}
        <div className="col-12 col-lg-8">
          <div className="glass-panel p-4 shadow h-100">
            <h5 className="text-white mb-4">Roster & Profile Contact Sheets</h5>
            <div className="table-responsive">
              <table className="table table-custom align-middle">
                <thead>
                  <tr>
                    <th>Player Name</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>Match Stats</th>
                    <th>Performance Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((member) => {
                    const stat = playerStats[member.id] || { matchesPlayed: 0, goals: 0, assists: 0, rating: 0.0 };
                    return (
                      <tr key={member.id}>
                        <td className="fw-semibold text-white">{member.name}</td>
                        <td className="text-muted small">{member.email}</td>
                        <td className="text-muted small">{member.phone}</td>
                        <td className="small text-white">
                          MP: <strong className="text-info">{stat.matchesPlayed}</strong> | G/W: <strong className="text-success">{stat.goals || stat.wins || 0}</strong> | A: <strong className="text-warning">{stat.assists || 0}</strong>
                        </td>
                        <td>
                          <span className="badge bg-warning text-dark font-title" style={{ fontSize: '0.8rem' }}>★ {stat.rating ? stat.rating.toFixed(1) : '0.0'}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Stats Editor Form */}
        <div className="col-12 col-lg-4">
          <div className="glass-panel p-4 shadow">
            <h5 className="text-white mb-3">Update Performance Card</h5>
            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="form-label text-muted small">Select Athlete</label>
                <select className="form-select form-select-custom" value={selectedPlayerId} onChange={handleSelectChange}>
                  <option value="" disabled>-- Select Player --</option>
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label text-muted small">Matches Played</label>
                  <input type="number" className="form-control form-control-custom" value={perfMatches} onChange={e => setPerfMatches(e.target.value)} />
                </div>
                <div className="col-6">
                  <label className="form-label text-muted small">Goals / Wins</label>
                  <input type="number" className="form-control form-control-custom" value={perfGoals} onChange={e => setPerfGoals(e.target.value)} />
                </div>
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label text-muted small">Assists</label>
                  <input type="number" className="form-control form-control-custom" value={perfAssists} onChange={e => setPerfAssists(e.target.value)} />
                </div>
                <div className="col-6">
                  <label className="form-label text-muted small">Grade Rating</label>
                  <input type="number" step="0.1" className="form-control form-control-custom" value={perfRating} onChange={e => setPerfRating(e.target.value)} />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label text-muted small">Remarks & Notes</label>
                <input type="text" className="form-control form-control-custom" placeholder="Athlete evaluation note" value={perfRemarks} onChange={e => setPerfRemarks(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary-custom w-100" disabled={!selectedPlayerId}>
                Save Evaluation
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
