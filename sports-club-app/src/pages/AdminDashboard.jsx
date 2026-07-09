import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function AdminDashboard() {
  const { 
    members, 
    coaches, 
    teams, 
    events, 
    payments, 
    approveMember, 
    removeMember,
    createTeam, 
    assignCoach, 
    addAnnouncement,
    currentUser,
    sports,
    addSport,
    editSport,
    deleteSport
  } = useContext(AppContext);

  // Form states
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamSport, setNewTeamSport] = useState(sports[0]?.name || 'Football');
  const [newTeamCoach, setNewTeamCoach] = useState(coaches[0]?.id || 'c1');

  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || '');
  const [selectedCoachId, setSelectedCoachId] = useState(coaches[0]?.id || '');

  const [newSportName, setNewSportName] = useState('');
  const [newSportDesc, setNewSportDesc] = useState('');
  const [editingSportId, setEditingSportId] = useState(null);
  const [editingSportName, setEditingSportName] = useState('');
  const [editingSportDesc, setEditingSportDesc] = useState('');

  const [successMsg, setSuccessMsg] = useState('');
  const [teamsTab, setTeamsTab] = useState('create'); // 'create', 'assign'

  // Computed dashboard counts
  const totalMembers = members.filter(m => m.status === 'Active').length;
  const pendingApprovals = members.filter(m => m.status === 'Pending');
  const totalCoaches = coaches.length;
  const totalTeams = teams.length;
  const upcomingEvents = events.length;
  
  const totalRevenue = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleCreateTeam = (e) => {
    e.preventDefault();
    if (!newTeamName) return;
    createTeam(newTeamName, newTeamSport, newTeamCoach);
    setNewTeamName('');
    showNotification('New sports team created successfully!');
  };

  const handleAssignCoach = (e) => {
    e.preventDefault();
    assignCoach(selectedTeamId, selectedCoachId);
    showNotification('Coach assignment updated successfully!');
  };

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;
    addAnnouncement(annTitle, annContent, currentUser?.name || 'Admin Sumit');
    setAnnTitle('');
    setAnnContent('');
    showNotification('New announcement posted to all players!');
  };

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleAddSport = (e) => {
    e.preventDefault();
    if (!newSportName) return;
    addSport(newSportName, newSportDesc);
    setNewSportName('');
    setNewSportDesc('');
    showNotification('Sports category added successfully!');
  };

  const handleEditSportClick = (s) => {
    setEditingSportId(s.id);
    setEditingSportName(s.name);
    setEditingSportDesc(s.description);
  };

  const handleEditSportSubmit = (e) => {
    e.preventDefault();
    if (!editingSportName) return;
    editSport(editingSportId, editingSportName, editingSportDesc);
    setEditingSportId(null);
    showNotification('Sports category updated successfully!');
  };

  const handleDeleteSport = (id) => {
    if (window.confirm('Are you sure you want to delete this sports category? This will reset matching coach specialties and team sports.')) {
      deleteSport(id);
      showNotification('Sports category deleted.');
    }
  };

  return (
    <div className="container-fluid py-4 px-md-5 text-light">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4">
        <div>
          <h2 className="m-0 text-white font-title">Administrator Hub</h2>
          <p className="text-muted small m-0">Monitor activities, manage rosters, approve members, and coordinate coaching staff.</p>
        </div>
        <span className="text-muted small mt-2 mt-sm-0">System status: <span className="text-success"><i className="bi bi-circle-fill fs-6 me-1" style={{ fontSize: '0.6rem' }}></i>Online</span></span>
      </div>

      {successMsg && (
        <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3 p-3 mb-4 text-center small animate-fade-in">
          <i className="bi bi-check-circle-fill me-2"></i>{successMsg}
        </div>
      )}

      {/* Metrics Row */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="glass-panel p-4 shadow h-100 d-flex flex-column justify-content-between">
            <div>
              <span className="text-muted small text-uppercase fw-semibold">Active Members</span>
              <h3 className="text-white mt-1 mb-0">{totalMembers}</h3>
            </div>
            <div className="mt-3 small text-muted">
              <span className="text-warning fw-semibold">{pendingApprovals.length} pending</span> approvals
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="glass-panel p-4 shadow h-100 d-flex flex-column justify-content-between">
            <div>
              <span className="text-muted small text-uppercase fw-semibold">Coaches Assigned</span>
              <h3 className="text-white mt-1 mb-0">{totalCoaches}</h3>
            </div>
            <div className="mt-3 small text-muted">
              Across <span className="text-white">{totalTeams} registered teams</span>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="glass-panel p-4 shadow h-100 d-flex flex-column justify-content-between">
            <div>
              <span className="text-muted small text-uppercase fw-semibold">Total Revenue</span>
              <h3 className="text-white mt-1 mb-0">${totalRevenue}</h3>
            </div>
            <div className="mt-3 small text-muted">
              From member tier subscriptions
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="glass-panel p-4 shadow h-100 d-flex flex-column justify-content-between">
            <div>
              <span className="text-muted small text-uppercase fw-semibold">Active Events</span>
              <h3 className="text-white mt-1 mb-0">{upcomingEvents}</h3>
            </div>
            <div className="mt-3 small text-muted">
              Practices, matches, tournaments
            </div>
          </div>
        </div>
      </div>

      {/* Balanced Parallel Panels Rows */}
      <div className="d-flex flex-column gap-4">
        
        {/* Row 1: Registrations & Notices */}
        <div className="row g-4 align-items-stretch">
          <div className="col-12 col-lg-6 d-flex">
            <div className="glass-panel p-4 shadow w-100 d-flex flex-column">
              <h5 className="text-white mb-4"><i className="bi bi-person-check text-primary me-2"></i>Pending Member Registrations</h5>
              <div className="flex-grow-1">
                {pendingApprovals.length === 0 ? (
                  <div className="text-center text-muted py-5 my-3">
                    <i className="bi bi-patch-check fs-2 text-muted mb-2 d-block"></i>
                    No new registration requests waiting for review.
                  </div>
                ) : (
                  <div className="table-responsive" style={{ maxHeight: '300px' }}>
                    <table className="table table-custom align-middle m-0">
                      <thead>
                        <tr>
                          <th>Details</th>
                          <th>Division</th>
                          <th>Tier</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingApprovals.map((memb) => (
                          <tr key={memb.id}>
                            <td>
                              <div className="fw-semibold text-white">{memb.name}</div>
                              <div className="small text-muted">{memb.email} | {memb.phone}</div>
                            </td>
                            <td><span className="small text-info">{memb.sport}</span></td>
                            <td><span className="small text-warning">{memb.tier}</span></td>
                            <td className="text-end">
                              <div className="d-inline-flex align-items-center justify-content-end gap-2">
                                <button className="btn btn-sm btn-success py-1 px-2.5" onClick={() => approveMember(memb.id)}>Approve</button>
                                <button className="btn btn-sm btn-outline-danger py-1 px-2.5" onClick={() => removeMember(memb.id)}>Decline</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6 d-flex">
            <div className="glass-panel p-4 shadow w-100 d-flex flex-column">
              <h5 className="text-white mb-3"><i className="bi bi-megaphone text-warning me-2"></i>Post Club Notice</h5>
              <form onSubmit={handlePostAnnouncement} className="d-flex flex-column flex-grow-1 justify-content-between">
                <div>
                  <div className="mb-3">
                    <label className="form-label text-muted small">Notice Title</label>
                    <input 
                      type="text" 
                      className="form-control form-control-custom" 
                      placeholder="e.g. Facility Updates, Holiday Closure..." 
                      value={annTitle} 
                      onChange={(e) => setAnnTitle(e.target.value)} 
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted small">Content Message</label>
                    <textarea 
                      className="form-control form-control-custom" 
                      rows="3" 
                      placeholder="Details for all members to view..."
                      value={annContent} 
                      onChange={(e) => setAnnContent(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary-custom w-100 py-2.5 mt-2">
                  Broadcast Notice
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Row 2: Divisions & Roster vs Teams & Coaches Actions */}
        <div className="row g-4 align-items-stretch">
          <div className="col-12 col-lg-6 d-flex">
            <div className="glass-panel p-4 shadow w-100 d-flex flex-column">
              <h5 className="text-white mb-4"><i className="bi bi-shield text-info me-2"></i>Club Divisions & Staff Roster</h5>
              <div className="table-responsive flex-grow-1" style={{ maxHeight: '340px' }}>
                <table className="table table-custom align-middle m-0">
                  <thead>
                    <tr>
                      <th>Division Team</th>
                      <th>Sports Branch</th>
                      <th>Assigned Coach</th>
                      <th>Active Roster</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((t) => {
                      const coach = coaches.find(c => c.id === t.coachId);
                      return (
                        <tr key={t.id}>
                          <td className="fw-semibold text-white">{t.name}</td>
                          <td>
                            <span className="badge bg-dark text-info border border-info border-opacity-35">{t.sport}</span>
                          </td>
                          <td>
                            <div className="small text-white">{coach ? coach.name : 'Unassigned'}</div>
                            <div className="small text-muted" style={{ fontSize: '0.75rem' }}>{coach ? coach.email : ''}</div>
                          </td>
                          <td className="text-muted">{t.membersCount} Players</td>
                          <td>
                            <span className="text-success"><i className="bi bi-circle-fill me-1" style={{ fontSize: '0.55rem' }}></i>Running</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6 d-flex">
            {/* Teams & Coaching Action Center */}
            <div className="glass-panel p-4 shadow w-100 d-flex flex-column">
              <ul className="nav nav-tabs border-0 mb-3 gap-2">
                <li className="nav-item">
                  <button 
                    className={`nav-link text-white border-0 py-2 px-3 rounded-3 ${teamsTab === 'create' ? 'bg-gradient-primary' : 'bg-transparent'}`} 
                    onClick={() => setTeamsTab('create')}
                    type="button"
                  >
                    Create Team
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link text-white border-0 py-2 px-3 rounded-3 ${teamsTab === 'assign' ? 'bg-gradient-primary' : 'bg-transparent'}`} 
                    onClick={() => setTeamsTab('assign')}
                    type="button"
                  >
                    Reassign Head Coach
                  </button>
                </li>
              </ul>

              <div className="flex-grow-1 d-flex flex-column justify-content-center">
                {teamsTab === 'create' && (
                  <form onSubmit={handleCreateTeam}>
                    <div className="mb-3">
                      <label className="form-label text-muted small">Team Name</label>
                      <input 
                        type="text" 
                        className="form-control form-control-custom" 
                        placeholder="e.g. Titans Cricket, Smashers B" 
                        value={newTeamName} 
                        onChange={(e) => setNewTeamName(e.target.value)} 
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-muted small">Sport Division</label>
                      <select className="form-select form-select-custom" value={newTeamSport} onChange={(e) => setNewTeamSport(e.target.value)}>
                        {sports.map(s => (
                          <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-muted small">Initial Head Coach</label>
                      <select className="form-select form-select-custom" value={newTeamCoach} onChange={(e) => setNewTeamCoach(e.target.value)}>
                        {coaches.map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.specialty})</option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary-custom w-100 py-2.5 mt-2">
                      Create Team
                    </button>
                  </form>
                )}

                {teamsTab === 'assign' && (
                  <form onSubmit={handleAssignCoach} className="d-flex flex-column h-100 justify-content-between">
                    <div>
                      <div className="mb-3">
                        <label className="form-label text-muted small">Select Team</label>
                        <select className="form-select form-select-custom" value={selectedTeamId} onChange={(e) => setSelectedTeamId(e.target.value)}>
                          {teams.map(t => (
                            <option key={t.id} value={t.id}>{t.name} ({t.sport})</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="form-label text-muted small">Select Coach</label>
                        <select className="form-select form-select-custom" value={selectedCoachId} onChange={(e) => setSelectedCoachId(e.target.value)}>
                          {coaches.map(c => (
                            <option key={c.id} value={c.id}>{c.name} ({c.specialty})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary-custom w-100 py-2.5 mt-2">
                      Update Assignment
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Sports Table vs Add/Edit Sport Actions */}
        <div className="row g-4 align-items-stretch mb-2">
          <div className="col-12 col-lg-6 d-flex">
            <div className="glass-panel p-4 shadow w-100 d-flex flex-column">
              <h5 className="text-white mb-4"><i className="bi bi-tag text-secondary me-2"></i>Sports Categories Directory</h5>
              <div className="table-responsive flex-grow-1" style={{ maxHeight: '340px' }}>
                <table className="table table-custom align-middle m-0">
                  <thead>
                    <tr>
                      <th>Sport Name</th>
                      <th>Description</th>
                      <th>Assigned Specialty Staff</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sports.map((s) => {
                      const assignedCoaches = coaches.filter(c => c.specialty === s.name);
                      return (
                        <tr key={s.id}>
                          <td className="fw-bold text-white">{s.name}</td>
                          <td className="text-muted small" style={{ maxWidth: '240px', whiteSpace: 'normal' }}>
                            {s.description}
                          </td>
                          <td>
                            {assignedCoaches.length > 0 ? (
                              assignedCoaches.map((c) => (
                                <span key={c.id} className="badge bg-dark border border-secondary border-opacity-30 me-1" style={{ fontSize: '0.7rem' }}>
                                  {c.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-muted small">None</span>
                            )}
                          </td>
                          <td className="text-end">
                            <div className="d-inline-flex align-items-center justify-content-end gap-2">
                              <button 
                                className="btn btn-link text-info p-0 border-0 bg-transparent" 
                                onClick={() => handleEditSportClick(s)} 
                                title="Edit Category"
                              >
                                <i className="bi bi-pencil-square fs-5"></i>
                              </button>
                              <button 
                                className="btn btn-link text-danger p-0 border-0 bg-transparent" 
                                onClick={() => handleDeleteSport(s.id)} 
                                title="Delete Category"
                              >
                                <i className="bi bi-trash fs-5"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6 d-flex">
            {/* Sports Actions Center */}
            <div className="glass-panel p-4 shadow w-100 d-flex flex-column">
              {editingSportId ? (
                <form onSubmit={handleEditSportSubmit} className="d-flex flex-column flex-grow-1 justify-content-between">
                  <div>
                    <h5 className="text-info mb-3"><i className="bi bi-pencil me-2"></i>Edit Sport Category</h5>
                    <div className="mb-3">
                      <label className="form-label text-muted small">Category Name</label>
                      <input 
                        type="text" 
                        className="form-control form-control-custom" 
                        value={editingSportName} 
                        onChange={e => setEditingSportName(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-muted small">Description</label>
                      <textarea 
                        className="form-control form-control-custom" 
                        rows="2" 
                        value={editingSportDesc} 
                        onChange={e => setEditingSportDesc(e.target.value)} 
                      />
                    </div>
                  </div>
                  <div className="d-flex gap-2 mt-3">
                    <button type="submit" className="btn btn-primary-custom flex-grow-1">Save Changes</button>
                    <button type="button" className="btn btn-secondary-custom" onClick={() => setEditingSportId(null)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleAddSport} className="d-flex flex-column flex-grow-1 justify-content-between">
                  <div>
                    <h5 className="text-white mb-3"><i className="bi bi-plus-circle text-success me-2"></i>Add Sport Category</h5>
                    <div className="mb-3">
                      <label className="form-label text-muted small">Sport Name</label>
                      <input 
                        type="text" 
                        className="form-control form-control-custom" 
                        placeholder="e.g. Basketball, Tennis" 
                        value={newSportName} 
                        onChange={e => setNewSportName(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-muted small">Description</label>
                      <textarea 
                        className="form-control form-control-custom" 
                        rows="2" 
                        placeholder="Summary of court booking details, rosters etc." 
                        value={newSportDesc} 
                        onChange={e => setNewSportDesc(e.target.value)} 
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary-custom w-100 py-2.5 mt-2">
                    Add Category
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
