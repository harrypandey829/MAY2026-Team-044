import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';

export default function Matches() {
  const { currentUser, events, createEvent } = useContext(AppContext);
  const coachSport = currentUser?.specialty || 'Football';

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [desc, setDesc] = useState('');
  const [opponent, setOpponent] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date || !time || !venue || !opponent) return;

    createEvent({
      title,
      type: 'match',
      sport: coachSport,
      date,
      time,
      venue,
      description: desc,
      opponent,
      coachId: currentUser?.id || 'c1'
    });

    setTitle('');
    setDate('');
    setTime('');
    setVenue('');
    setDesc('');
    setOpponent('');
    setSuccess('Match scheduled successfully! Players notified.');
    setTimeout(() => setSuccess(''), 3000);
  };

  const coachMatches = events.filter(e => e.sport === coachSport && e.type === 'match');

  return (
    <div className="container-fluid py-4 px-md-5 text-light">
      <h2 className="mb-2 text-white">Schedule Team Matches ({coachSport})</h2>
      <p className="text-muted small mb-4">Schedule friendly or league matches, enter opponents, dates, times, and ground locations.</p>

      {success && (
        <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3 p-3 mb-4 text-center small animate-fade-in">
          {success}
        </div>
      )}

      <div className="row g-4">
        {/* Creator Form */}
        <div className="col-12 col-lg-5">
          <div className="glass-panel p-4 shadow">
            <h5 className="text-white mb-3">Schedule Match Fixture</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small">Match / Fixture Title</label>
                <input type="text" className="form-control form-control-custom" placeholder="e.g. League Qualifiers" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small">Opponent Club Name</label>
                <input type="text" className="form-control form-control-custom" placeholder="e.g. Metro Club" value={opponent} onChange={e => setOpponent(e.target.value)} />
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label text-muted small">Match Date</label>
                  <input type="date" className="form-control form-control-custom" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="col-6">
                  <label className="form-label text-muted small">Kickoff Time</label>
                  <input type="time" className="form-control form-control-custom" value={time} onChange={e => setTime(e.target.value)} />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small">Match Ground / Venue</label>
                <input type="text" className="form-control form-control-custom" placeholder="e.g. Arena Pitch B" value={venue} onChange={e => setVenue(e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="form-label text-muted small">Match Day Description</label>
                <textarea className="form-control form-control-custom" rows="2" placeholder="Warmup details, jersey colours..." value={desc} onChange={e => setDesc(e.target.value)}></textarea>
              </div>
              <button type="submit" className="btn btn-primary-custom w-100">
                Broadcast Match
              </button>
            </form>
          </div>
        </div>

        {/* Matches list */}
        <div className="col-12 col-lg-7">
          <div className="glass-panel p-4 shadow h-100" style={{ minHeight: '400px' }}>
            <h5 className="text-white mb-4">Scheduled Matches Directory</h5>
            
            {coachMatches.length === 0 ? (
              <div className="text-center py-5 text-muted">No competitive matches scheduled.</div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {coachMatches.map((m) => (
                  <div key={m.id} className="p-3.5 rounded-4" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="m-0 text-white fw-bold">{m.title} vs <span className="text-danger">{m.opponent}</span></h6>
                      <span className="small text-muted">{m.date} at {m.time}</span>
                    </div>
                    <p className="small text-muted mb-0">{m.description || 'No description provided.'}</p>
                    <span className="small text-info mt-1 d-block"><i className="bi bi-geo-alt me-1"></i>{m.venue}</span>
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
