import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';

export default function Teams() {
  const { 
    teams, 
    coaches, 
    createTeam, 
    assignCoach, 
    sports, 
    addSport, 
    editSport, 
    deleteSport, 
    updateCoachSpecialty 
  } = useContext(AppContext);

  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamSport, setNewTeamSport] = useState(sports[0]?.name || 'Football');
  const [newTeamCoach, setNewTeamCoach] = useState(coaches[0]?.id || 'c1');
  
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || '');
  const [selectedCoachId, setSelectedCoachId] = useState(coaches[0]?.id || '');
  
  const [newSportName, setNewSportName] = useState('');
  const [newSportDesc, setNewSportDesc] = useState('');
  
  const [editingSportId, setEditingSportId] = useState(null);
  const [editingSportName, setEditingSportName] = useState('');
  const [editingSportDesc, setEditingSportDesc] = useState('');

  const [specialtyCoachId, setSpecialtyCoachId] = useState(coaches[0]?.id || '');
  const [specialtySportName, setSpecialtySportName] = useState(sports[0]?.name || 'Football');
  
  const [success, setSuccess] = useState('');
  const [teamsTab, setTeamsTab] = useState('create'); // 'create', 'assign'
  const [sportsTab, setSportsTab] = useState('add');   // 'add', 'specialty'

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTeamName) return;
    createTeam(newTeamName, newTeamSport, newTeamCoach);
    setNewTeamName('');
    showNotification('Sports team created successfully!');
  };

  const handleAssign = (e) => {
    e.preventDefault();
    assignCoach(selectedTeamId, selectedCoachId);
    showNotification('Head coach assignment saved!');
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

  const handleAssignSpecialty = (e) => {
    e.preventDefault();
    updateCoachSpecialty(specialtyCoachId, specialtySportName);
    showNotification('Coach specialty updated successfully!');
  };

  const showNotification = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="container-fluid py-4 px-md-5 text-light">
      <h2 className="mb-2 text-white">Teams & Head Coach Staff</h2>
      <p className="text-muted small mb-4">Create divisions, assign team managers/coaches, and structure active playing rosters.</p>

      {success && (
        <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3 p-3 mb-4 text-center small animate-fade-in">
          {success}
        </div>
      )}

      {/* Symmetric Layout Split */}
      <div className="d-flex flex-column gap-4">
        
        {/* Row 1: Active Divisions vs Teams & Coach Actions */}
        <div className="row g-4 align-items-stretch">
          <div className="col-12 col-lg-6 d-flex">
            <div className="glass-panel p-4 shadow w-100 d-flex flex-column">
              <h5 className="text-white mb-4"><i className="bi bi-people text-primary me-2"></i>Active Divisions Directory</h5>
              <div className="table-responsive flex-grow-1" style={{ maxHeight: '340px' }}>
                <table className="table table-custom align-middle m-0">
                  <thead>
                    <tr>
                      <th>Division Name</th>
                      <th>Sports Field</th>
                      <th>Assigned Head Coach</th>
                      <th>Staff Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((t) => {
                      const coach = coaches.find(c => c.id === t.coachId);
                      return (
                        <tr key={t.id}>
                          <td className="fw-bold text-white">{t.name}</td>
                          <td>
                            <span className="badge bg-dark text-info border border-info border-opacity-35">{t.sport}</span>
                          </td>
                          <td className="text-white">{coach ? coach.name : 'Unassigned'}</td>
                          <td className="text-muted small">{coach ? coach.email : ''}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6 d-flex">
            {/* Teams & Coaching Actions Card */}
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
                  <form onSubmit={handleCreate}>
                    <div className="mb-3">
                      <label className="form-label text-muted small">Team Name</label>
                      <input 
                        type="text" 
                        className="form-control form-control-custom" 
                        placeholder="e.g. Smashers B, Titans Cricket" 
                        value={newTeamName} 
                        onChange={e => setNewTeamName(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-muted small">Sport</label>
                      <select className="form-select form-select-custom" value={newTeamSport} onChange={e => setNewTeamSport(e.target.value)}>
                        {sports.map(s => (
                          <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-muted small">Head Coach</label>
                      <select className="form-select form-select-custom" value={newTeamCoach} onChange={e => setNewTeamCoach(e.target.value)}>
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
                  <form onSubmit={handleAssign} className="d-flex flex-column h-100 justify-content-between">
                    <div>
                      <div className="mb-3">
                        <label className="form-label text-muted small">Select Division</label>
                        <select className="form-select form-select-custom" value={selectedTeamId} onChange={e => setSelectedTeamId(e.target.value)}>
                          {teams.map(t => (
                            <option key={t.id} value={t.id}>{t.name} ({t.sport})</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="form-label text-muted small">Select Coach</label>
                        <select className="form-select form-select-custom" value={selectedCoachId} onChange={e => setSelectedCoachId(e.target.value)}>
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

        {/* Row 2: Sports Categories vs Sports Actions */}
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
            {/* Sports Actions Panel */}
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
                <div className="d-flex flex-column h-100">
                  <ul className="nav nav-tabs border-0 mb-3 gap-2">
                    <li className="nav-item">
                      <button 
                        className={`nav-link text-white border-0 py-2 px-3 rounded-3 ${sportsTab === 'add' ? 'bg-gradient-primary' : 'bg-transparent'}`} 
                        onClick={() => setSportsTab('add')}
                        type="button"
                      >
                        Add Sport
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link text-white border-0 py-2 px-3 rounded-3 ${sportsTab === 'specialty' ? 'bg-gradient-primary' : 'bg-transparent'}`} 
                        onClick={() => setSportsTab('specialty')}
                        type="button"
                      >
                        Assign Specialty
                      </button>
                    </li>
                  </ul>

                  <div className="flex-grow-1 d-flex flex-column justify-content-center">
                    {sportsTab === 'add' && (
                      <form onSubmit={handleAddSport}>
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
                        <button type="submit" className="btn btn-primary-custom w-100 py-2.5 mt-2">
                          Add Category
                        </button>
                      </form>
                    )}

                    {sportsTab === 'specialty' && (
                      <form onSubmit={handleAssignSpecialty} className="d-flex flex-column h-100 justify-content-between">
                        <div>
                          <div className="mb-3">
                            <label className="form-label text-muted small">Select Coach</label>
                            <select className="form-select form-select-custom" value={specialtyCoachId} onChange={e => setSpecialtyCoachId(e.target.value)}>
                              {coaches.map(c => (
                                <option key={c.id} value={c.id}>{c.name} ({c.specialty})</option>
                              ))}
                            </select>
                          </div>
                          <div className="mb-4">
                            <label className="form-label text-muted small">Assign Sport Specialty</label>
                            <select className="form-select form-select-custom" value={specialtySportName} onChange={e => setSpecialtySportName(e.target.value)}>
                              {sports.map(s => (
                                <option key={s.id} value={s.name}>{s.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary-custom w-100 py-2.5 mt-2">
                          Assign Specialty
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
