import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

export default function CoachDashboard() {
  const { 
    currentUser, 
    members, 
    events, 
    createEvent, 
    attendanceHistory, 
    submitAttendance, 
    playerStats, 
    updatePlayerPerformance 
  } = useContext(AppContext);

  // Form states: Event scheduling
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState('training'); // 'training', 'match', 'tournament'
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [opponent, setOpponent] = useState('');

  // Form states: Practice Planner
  const [warmup, setWarmup] = useState('Light jog, 10 min dynamic stretching.');
  const [drills, setDrills] = useState('Passing patterns & triangle possession drill.');
  const [fitness, setFitness] = useState('Interval sprints, 5 sets of 100m.');
  const [matchPractice, setMatchPractice] = useState('Half-field 6v6 scrimmage.');

  // Form states: Attendance marker
  const [attendanceRecords, setAttendanceRecords] = useState({
    'm1': 'Present',
    'm2': 'Present',
    'm3': 'Present'
  });
  const [attendanceTitle, setAttendanceTitle] = useState('Morning Practice Session');

  // Form states: Player performance ratings
  const [selectedPlayerId, setSelectedPlayerId] = useState(members[0]?.id || 'm1');
  const [perfMatches, setPerfMatches] = useState(10);
  const [perfGoals, setPerfGoals] = useState(2);
  const [perfAssists, setPerfAssists] = useState(2);
  const [perfRating, setPerfRating] = useState(7.0);
  const [perfRemarks, setPerfRemarks] = useState('');

  const [successMsg, setSuccessMsg] = useState('');
  const [scheduleTab, setScheduleTab] = useState('event'); // 'event', 'practice'

  // Filters to find only players in this coach's specialty
  const coachSport = currentUser?.specialty || 'Football';
  const teamMembers = members.filter(m => m.sport === coachSport && m.status === 'Active');
  
  // Computed fields
  const coachEvents = events.filter(e => e.sport === coachSport);
  const nextMatch = coachEvents.find(e => e.type === 'match');
  const nextPractice = coachEvents.find(e => e.type === 'training');

  // Load custom practice plan if saved previously
  useEffect(() => {
    const saved = localStorage.getItem('elite_practice_plan_' + coachSport);
    if (saved) {
      const data = JSON.parse(saved);
      setWarmup(data.warmup);
      setDrills(data.drills);
      setFitness(data.fitness);
      setMatchPractice(data.matchPractice);
    }
  }, [coachSport]);

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!eventTitle || !eventDate || !eventTime || !eventVenue) return;
    
    createEvent({
      title: eventTitle,
      type: eventType,
      sport: coachSport,
      date: eventDate,
      time: eventTime,
      venue: eventVenue,
      description: eventDesc,
      opponent: eventType === 'match' ? opponent : '',
      coachId: currentUser?.id || 'c1'
    });

    setEventTitle('');
    setEventDate('');
    setEventTime('');
    setEventVenue('');
    setEventDesc('');
    setOpponent('');
    showNotification('Event scheduled successfully! Players notified.');
  };

  const handleMarkAttendance = (e) => {
    e.preventDefault();
    submitAttendance(
      attendanceTitle,
      new Date().toISOString().split('T')[0],
      coachSport,
      attendanceRecords
    );
    showNotification('Attendance sheet logged successfully!');
  };

  const handleUpdatePerformance = (e) => {
    e.preventDefault();
    updatePlayerPerformance(selectedPlayerId, {
      matchesPlayed: Number(perfMatches),
      goals: Number(perfGoals),
      assists: Number(perfAssists),
      rating: Number(perfRating),
      remarks: perfRemarks
    });
    setPerfRemarks('');
    showNotification('Squad player statistics updated successfully!');
  };

  const handleSavePracticePlan = (e) => {
    e.preventDefault();
    const plan = { warmup, drills, fitness, matchPractice };
    localStorage.setItem('elite_practice_plan_' + coachSport, JSON.stringify(plan));
    showNotification('Daily training practice schedule published!');
  };

  const toggleAttendance = (id) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [id]: prev[id] === 'Present' ? 'Absent' : 'Present'
    }));
  };

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="container-fluid py-4 px-md-5 text-light">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4">
        <div>
          <h2 className="m-0 text-white font-title">Coach Control Centre ({coachSport})</h2>
          <p className="text-muted small m-0">Coordinate training drills, mark attendance sheets, schedule fixtures, and review athlete development.</p>
        </div>
        <span className="text-muted small mt-2 mt-sm-0">Team: <span className="text-primary fw-bold">{coachSport === 'Football' ? 'Red Devils FC' : coachSport === 'Badminton' ? 'Smashers Club' : 'Elite Cricketers'}</span></span>
      </div>

      {successMsg && (
        <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3 p-3 mb-4 text-center small animate-fade-in">
          <i className="bi bi-check-circle-fill me-2"></i>{successMsg}
        </div>
      )}

      {/* Quick stats cards */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-md-3">
          <div className="glass-panel p-4 shadow h-100 d-flex flex-column justify-content-between">
            <div>
              <span className="text-muted small text-uppercase fw-semibold">Squad Size</span>
              <h3 className="text-white mt-1 mb-0">{teamMembers.length} Active</h3>
            </div>
            <span className="text-muted small mt-2 d-block">Coached under {currentUser?.name}</span>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <div className="glass-panel p-4 shadow h-100 d-flex flex-column justify-content-between">
            <div>
              <span className="text-muted small text-uppercase fw-semibold">Next Practice</span>
              <h5 className="text-white mt-1 mb-0 text-truncate">{nextPractice ? nextPractice.title : 'None scheduled'}</h5>
            </div>
            <span className="text-muted small mt-2 d-block">{nextPractice ? `${nextPractice.date} at ${nextPractice.time}` : 'Schedule below'}</span>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <div className="glass-panel p-4 shadow h-100 d-flex flex-column justify-content-between">
            <div>
              <span className="text-muted small text-uppercase fw-semibold">Next Match</span>
              <h5 className="text-white mt-1 mb-0 text-truncate">{nextMatch ? `vs ${nextMatch.opponent}` : 'No matches'}</h5>
            </div>
            <span className="text-muted small mt-2 d-block">{nextMatch ? `${nextMatch.date} at ${nextMatch.time}` : 'Create a match'}</span>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <div className="glass-panel p-4 shadow h-100 d-flex flex-column justify-content-between">
            <div>
              <span className="text-muted small text-uppercase fw-semibold">Attendance Log</span>
              <h3 className="text-white mt-1 mb-0">{attendanceHistory.filter(h => h.sport === coachSport).length} Sheets</h3>
            </div>
            <span className="text-muted small mt-2 d-block">Submissions logged offline</span>
          </div>
        </div>
      </div>

      {/* Symmetric Parallel Layout */}
      <div className="d-flex flex-column gap-4">
        
        {/* Row 1: Squad Roster vs Log Performance Ratings */}
        <div className="row g-4 align-items-stretch">
          <div className="col-12 col-lg-6 d-flex">
            <div className="glass-panel p-4 shadow w-100 d-flex flex-column">
              <h5 className="text-white mb-4"><i className="bi bi-people-fill text-primary me-2"></i>My Squad Roster</h5>
              <div className="flex-grow-1">
                {teamMembers.length === 0 ? (
                  <div className="text-center text-muted py-5">No active squad members found.</div>
                ) : (
                  <div className="table-responsive" style={{ maxHeight: '330px' }}>
                    <table className="table table-custom align-middle m-0">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Contact Email</th>
                          <th>Match Stats</th>
                          <th>Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamMembers.map((member) => {
                          const stat = playerStats[member.id] || { matchesPlayed: 0, goals: 0, assists: 0, rating: 0.0 };
                          return (
                            <tr key={member.id}>
                              <td className="fw-semibold text-white">{member.name}</td>
                              <td className="text-muted small">{member.email}</td>
                              <td className="text-white small">
                                {stat.matchesPlayed} Pl. ({stat.goals} G / {stat.assists} A)
                              </td>
                              <td>
                                <span className={`badge ${stat.rating >= 8.0 ? 'bg-success' : stat.rating >= 7.0 ? 'bg-primary' : 'bg-secondary'}`}>
                                  ★ {stat.rating ? stat.rating.toFixed(1) : '0.0'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6 d-flex">
            <div className="glass-panel p-4 shadow w-100 d-flex flex-column">
              <h5 className="text-white mb-3"><i className="bi bi-star-half text-warning me-2"></i>Log Performance Ratings</h5>
              <form onSubmit={handleUpdatePerformance} className="d-flex flex-column flex-grow-1 justify-content-between">
                <div>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label text-muted small">Select Squad Athlete</label>
                      <select className="form-select form-select-custom" value={selectedPlayerId} onChange={(e) => setSelectedPlayerId(e.target.value)}>
                        {teamMembers.map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-6 col-sm-3">
                      <label className="form-label text-muted small">Matches</label>
                      <input type="number" className="form-control form-control-custom" value={perfMatches} onChange={(e) => setPerfMatches(e.target.value)} />
                    </div>
                    <div className="col-6 col-sm-3">
                      <label className="form-label text-muted small">Goals/Wins</label>
                      <input type="number" className="form-control form-control-custom" value={perfGoals} onChange={(e) => setPerfGoals(e.target.value)} />
                    </div>
                    <div className="col-6 col-sm-3">
                      <label className="form-label text-muted small">Assists</label>
                      <input type="number" className="form-control form-control-custom" value={perfAssists} onChange={(e) => setPerfAssists(e.target.value)} />
                    </div>
                    <div className="col-6 col-sm-3">
                      <label className="form-label text-muted small">Rating (1-10)</label>
                      <input type="number" step="0.1" className="form-control form-control-custom" value={perfRating} onChange={(e) => setPerfRating(e.target.value)} />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small">Remarks & Coach Notes</label>
                      <input type="text" className="form-control form-control-custom" placeholder="e.g. Excellent defense, sharp crosses..." value={perfRemarks} onChange={(e) => setPerfRemarks(e.target.value)} />
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary-custom w-100 py-2.5 mt-3">
                  Save Roster Stats
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Row 2: Mark Attendance vs Planning & Scheduling Actions */}
        <div className="row g-4 align-items-stretch mb-2">
          <div className="col-12 col-lg-6 d-flex">
            <div className="glass-panel p-4 shadow w-100 d-flex flex-column">
              <h5 className="text-white mb-3"><i className="bi bi-calendar-check text-info me-2"></i>Log Roster Attendance</h5>
              
              {teamMembers.length === 0 ? (
                <div className="text-center text-muted py-5 my-auto">No squad roster to log attendance.</div>
              ) : (
                <form onSubmit={handleMarkAttendance} className="d-flex flex-column flex-grow-1 justify-content-between">
                  <div>
                    <div className="mb-3">
                      <label className="form-label text-muted small">Training Session Title</label>
                      <input type="text" className="form-control form-control-custom" value={attendanceTitle} onChange={(e) => setAttendanceTitle(e.target.value)} required />
                    </div>
                    <div className="table-responsive" style={{ maxHeight: '200px' }}>
                      <table className="table table-custom align-middle m-0">
                        <thead>
                          <tr>
                            <th>Player Name</th>
                            <th>Status Toggle</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teamMembers.map(m => {
                            const isPresent = (attendanceRecords[m.id] || 'Present') === 'Present';
                            return (
                              <tr key={m.id}>
                                <td className="text-white">{m.name}</td>
                                <td>
                                  <button 
                                    type="button" 
                                    className={`btn btn-sm py-1 px-3 ${isPresent ? 'btn-success' : 'btn-outline-danger'}`} 
                                    onClick={() => toggleAttendance(m.id)}
                                  >
                                    {isPresent ? 'Present' : 'Absent'}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary-custom w-100 py-2.5 mt-3">
                    Submit Attendance Registry
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="col-12 col-lg-6 d-flex">
            {/* Planning Actions tabbed card */}
            <div className="glass-panel p-4 shadow w-100 d-flex flex-column">
              <ul className="nav nav-tabs border-0 mb-3 gap-2">
                <li className="nav-item">
                  <button 
                    className={`nav-link text-white border-0 py-2 px-3 rounded-3 ${scheduleTab === 'event' ? 'bg-gradient-primary' : 'bg-transparent'}`} 
                    onClick={() => setScheduleTab('event')}
                    type="button"
                  >
                    Schedule Match/Session
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link text-white border-0 py-2 px-3 rounded-3 ${scheduleTab === 'practice' ? 'bg-gradient-primary' : 'bg-transparent'}`} 
                    onClick={() => setScheduleTab('practice')}
                    type="button"
                  >
                    Practice Planner
                  </button>
                </li>
              </ul>

              <div className="flex-grow-1 d-flex flex-column justify-content-center">
                {scheduleTab === 'event' && (
                  <form onSubmit={handleCreateEvent}>
                    <div className="mb-2">
                      <label className="form-label text-muted small">Event Name / Title</label>
                      <input 
                        type="text" 
                        className="form-control form-control-custom py-1.5" 
                        placeholder="e.g. Midweek Friendlies, Tactical Defense Training" 
                        value={eventTitle} 
                        onChange={(e) => setEventTitle(e.target.value)} 
                        required
                      />
                    </div>
                    <div className="row g-2 mb-2">
                      <div className="col-6">
                        <label className="form-label text-muted small">Event Type</label>
                        <select className="form-select form-select-custom py-1.5" value={eventType} onChange={(e) => setEventType(e.target.value)}>
                          <option value="training">Training Practice</option>
                          <option value="match">Match / Fixture</option>
                          <option value="tournament">Tournament</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="form-label text-muted small">Opponent (If Match)</label>
                        <input 
                          type="text" 
                          className="form-control form-control-custom py-1.5" 
                          placeholder="e.g. City FC" 
                          value={opponent} 
                          onChange={(e) => setOpponent(e.target.value)} 
                          disabled={eventType !== 'match'}
                        />
                      </div>
                    </div>
                    <div className="row g-2 mb-2">
                      <div className="col-6">
                        <label className="form-label text-muted small">Date</label>
                        <input type="date" className="form-control form-control-custom py-1.5" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
                      </div>
                      <div className="col-6">
                        <label className="form-label text-muted small">Time</label>
                        <input type="time" className="form-control form-control-custom py-1.5" value={eventTime} onChange={(e) => setEventTime(e.target.value)} required />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-muted small">Venue / Court</label>
                      <input type="text" className="form-control form-control-custom py-1.5" placeholder="e.g. Field B, Indoor Court 2" value={eventVenue} onChange={(e) => setEventVenue(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary-custom w-100 py-2">
                      Broadcast & Schedule Event
                    </button>
                  </form>
                )}

                {scheduleTab === 'practice' && (
                  <form onSubmit={handleSavePracticePlan}>
                    <div className="mb-2">
                      <label className="form-label text-muted small">1. Warm-Up Schedule</label>
                      <input type="text" className="form-control form-control-custom py-1.5" value={warmup} onChange={(e) => setWarmup(e.target.value)} required />
                    </div>
                    <div className="mb-2">
                      <label className="form-label text-muted small">2. Skills & Drills Practice</label>
                      <input type="text" className="form-control form-control-custom py-1.5" value={drills} onChange={(e) => setDrills(e.target.value)} required />
                    </div>
                    <div className="mb-2">
                      <label className="form-label text-muted small">3. Fitness Exercises</label>
                      <input type="text" className="form-control form-control-custom py-1.5" value={fitness} onChange={(e) => setFitness(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-muted small">4. Match Practice / Scrimmage</label>
                      <input type="text" className="form-control form-control-custom py-1.5" value={matchPractice} onChange={(e) => setMatchPractice(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary-custom w-100 py-2">
                      Publish Today's Plan
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
