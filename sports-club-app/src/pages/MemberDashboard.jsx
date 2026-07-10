import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

export default function MemberDashboard() {
  const { 
    currentUser, 
    events, 
    respondToEvent, 
    playerStats, 
    badges, 
    payments, 
    payInvoice 
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule', 'stats', 'badges', 'billing', 'plan'
  const [successMsg, setSuccessMsg] = useState('');
  const [practicePlan, setPracticePlan] = useState(null);

  const memberSport = currentUser?.sport || 'Football';
  
  // Load team practice plan published by coach
  useEffect(() => {
    const savedPlan = localStorage.getItem('elite_practice_plan_' + memberSport);
    if (savedPlan) {
      setPracticePlan(JSON.parse(savedPlan));
    } else {
      // Default fallback plan
      setPracticePlan({
        warmup: '15 mins dynamic stretching & aerobic jogging.',
        drills: 'Positioning exercises & 3v2 counter-attack drills.',
        fitness: 'Coopers test run: 12 minutes continuous running.',
        matchPractice: 'Intra-squad match play, focus on tactical width.'
      });
    }
  }, [memberSport]);

  // Filters for member-specific events
  const memberEvents = events.filter(e => e.sport === memberSport);
  const myStats = playerStats[currentUser?.id] || { matchesPlayed: 0, goals: 0, assists: 0, rating: 0.0, remarks: 'Welcome to the team! Attend training sessions to get rating feedback.' };
  const myBadges = badges[currentUser?.id] || [];
  const myInvoices = payments.filter(p => p.memberId === currentUser?.id);

  // Available badges dictionary
  const availableBadges = [
    { name: 'Perfect Attendance', icon: 'bi-calendar-check', desc: '100% attendance in training sessions for a month.' },
    { name: 'Top Scorer', icon: 'bi-fire', desc: 'Leading scorer in competitive league matches.' },
    { name: 'MVP', icon: 'bi-star-fill', desc: 'Selected as Most Valuable Player in club tournament.' },
    { name: 'Best Defender', icon: 'bi-shield-shaded', desc: 'Outstanding defensive contributions and clearances.' },
    { name: 'Most Improved Player', icon: 'bi-graph-up-arrow', desc: 'Demonstrated highest growth in performance metrics.' }
  ];

  const handleResponse = (eventId, response) => {
    respondToEvent(eventId, currentUser?.id, response);
    showNotification(`Marked your availability as: ${response}`);
  };

  const handlePay = (invoiceId) => {
    payInvoice(invoiceId);
    showNotification('Payment processed successfully! Membership status updated.');
  };

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="container-fluid py-4 px-md-5 text-light">
      {/* Header Profile Block */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4">
        <div>
          <h2 className="m-0 text-white font-title">Player Hub</h2>
          <p className="text-muted small m-0">Welcome back, {currentUser?.name}! View team schedule, register for matches, track stats, and pay fees.</p>
        </div>
        <span className="badge badge-custom badge-member mt-2 mt-sm-0 text-uppercase">Division: {memberSport}</span>
      </div>

      {successMsg && (
        <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3 p-3 mb-4 text-center small animate-fade-in">
          <i className="bi bi-check-circle-fill me-2"></i>{successMsg}
        </div>
      )}

      {/* Roster quick stats */}
      <div className="row g-4 mb-4">
        <div className="col-6 col-md-3">
          <div className="glass-panel p-3 text-center">
            <span className="text-muted small text-uppercase">Matches Played</span>
            <h3 className="text-white mt-1 mb-0">{myStats.matchesPlayed}</h3>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="glass-panel p-3 text-center">
            <span className="text-muted small text-uppercase">Performance Rating</span>
            <h3 className="text-warning mt-1 mb-0">★ {myStats.rating ? myStats.rating.toFixed(1) : '0.0'}</h3>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="glass-panel p-3 text-center">
            <span className="text-muted small text-uppercase">Goals / Wins</span>
            <h3 className="text-success mt-1 mb-0">{myStats.goals || myStats.wins || 0}</h3>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="glass-panel p-3 text-center">
            <span className="text-muted small text-uppercase">Badges Earned</span>
            <h3 className="text-info mt-1 mb-0">{myBadges.length}</h3>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="glass-panel p-2 mb-4">
        <ul className="nav nav-pills d-flex flex-wrap gap-2 justify-content-center justify-content-sm-start border-0">
          <li className="nav-item">
            <button className={`nav-link text-white border-0 ${activeTab === 'schedule' ? 'bg-gradient-primary' : 'bg-transparent'}`} onClick={() => setActiveTab('schedule')}>
              <i className="bi bi-calendar-event me-2"></i>My Schedule
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link text-white border-0 ${activeTab === 'stats' ? 'bg-gradient-primary' : 'bg-transparent'}`} onClick={() => setActiveTab('stats')}>
              <i className="bi bi-graph-up me-2"></i>Performance History
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link text-white border-0 ${activeTab === 'badges' ? 'bg-gradient-primary' : 'bg-transparent'}`} onClick={() => setActiveTab('badges')}>
              <i className="bi bi-award me-2"></i>Achievements & Badges
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link text-white border-0 ${activeTab === 'billing' ? 'bg-gradient-primary' : 'bg-transparent'}`} onClick={() => setActiveTab('billing')}>
              <i className="bi bi-credit-card me-2"></i>Dues & Invoices
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link text-white border-0 ${activeTab === 'plan' ? 'bg-gradient-primary' : 'bg-transparent'}`} onClick={() => setActiveTab('plan')}>
              <i className="bi bi-journal-text me-2"></i>Daily Practice Plan
            </button>
          </li>
        </ul>
      </div>

      {/* Tab Contents */}
      <div className="glass-panel p-4 p-md-5 animate-fade-in shadow-lg">
        
        {/* Tab 1: My Schedule & Availability responses */}
        {activeTab === 'schedule' && (
          <div>
            <h4 className="text-white mb-4"><i className="bi bi-calendar3 text-primary me-2"></i>Upcoming Matches & Practice Sessions</h4>
            
            {memberEvents.length === 0 ? (
              <div className="text-center py-5 text-muted">No activities scheduled for your division.</div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {memberEvents.map((evt) => {
                  const myResponse = evt.responses[currentUser?.id] || 'Unconfirmed';
                  return (
                    <div key={evt.id} className="p-4 rounded-4" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)' }}>
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <span className={`badge text-uppercase badge-custom ${evt.type === 'match' ? 'bg-danger bg-opacity-10 text-danger border-danger border border-opacity-30' : evt.type === 'tournament' ? 'bg-warning bg-opacity-10 text-warning border-warning border border-opacity-30' : 'bg-info bg-opacity-10 text-info border-info border border-opacity-30'}`}>
                              {evt.type}
                            </span>
                            <span className="text-muted small"><i className="bi bi-geo-alt me-1"></i>{evt.venue}</span>
                          </div>
                          <h5 className="text-white m-0">{evt.title}</h5>
                          <p className="text-muted small mt-2 mb-0">{evt.description}</p>
                          {evt.opponent && <p className="text-muted small m-0 mt-1">Opponent: <span className="text-danger fw-semibold">{evt.opponent}</span></p>}
                        </div>

                        <div className="d-flex flex-column align-items-md-end gap-2 w-100 w-md-auto">
                          <div className="text-md-end mb-2">
                            <div className="text-white fw-bold small"><i className="bi bi-calendar-event me-2 text-primary"></i>{evt.date}</div>
                            <div className="text-muted small">{evt.time}</div>
                          </div>

                          <div className="d-flex flex-column w-100">
                            <span className="small text-muted mb-1 text-md-end">My Status: <strong className={myResponse === 'Attending' ? 'text-success' : myResponse === 'Not Attending' ? 'text-danger' : 'text-warning'}>{myResponse}</strong></span>
                            <div className="btn-group btn-group-sm w-100" role="group">
                              <button className={`btn ${myResponse === 'Attending' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => handleResponse(evt.id, 'Attending')}>
                                <i className="bi bi-check-lg"></i> Attending
                              </button>
                              <button className={`btn ${myResponse === 'Not Attending' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => handleResponse(evt.id, 'Not Attending')}>
                                <i className="bi bi-x-lg"></i> Decline
                              </button>
                              <button className={`btn ${myResponse === 'Maybe' ? 'btn-warning text-dark' : 'btn-outline-warning text-light'}`} onClick={() => handleResponse(evt.id, 'Maybe')}>
                                <i className="bi bi-question-lg"></i> Maybe
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Performance History */}
        {activeTab === 'stats' && (
          <div>
            <h4 className="text-white mb-3"><i className="bi bi-graph-up text-success me-2"></i>Performance History & Statistics</h4>
            <p className="text-muted small mb-4">Review development charts, goals, ratings, and feedback logged by head coach.</p>

            <div className="row g-4">
              <div className="col-12 col-md-5">
                <div className="p-4 rounded-4 text-center h-100 d-flex flex-column justify-content-center" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)' }}>
                  <span className="text-muted small text-uppercase">Aggregated Performance Grade</span>
                  <div className="display-3 text-warning fw-bold my-3">
                    {myStats.rating ? myStats.rating.toFixed(1) : '0.0'}
                  </div>
                  <div className="d-flex justify-content-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <i key={i} className={`bi bi-star-fill ${i < Math.round((myStats.rating || 0) / 2) ? 'text-warning' : 'text-muted'}`}></i>
                    ))}
                  </div>
                  <span className="text-muted small">Based on training and match ratings</span>
                </div>
              </div>

              <div className="col-12 col-md-7">
                <div className="p-4 rounded-4 h-100" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)' }}>
                  <h5 className="text-white mb-3">Coach's Comments & Notes</h5>
                  <div className="p-3 bg-dark bg-opacity-40 rounded-3 border border-secondary border-opacity-10 mb-4">
                    <p className="m-0 text-white italic">"{myStats.remarks}"</p>
                  </div>
                  
                  <h6 className="text-white mb-2">Division Metrics Breakdown</h6>
                  <div className="row text-center g-2 text-muted small">
                    <div className="col-6 col-sm-4 p-3 bg-dark bg-opacity-20 rounded-3">
                      <div className="text-white fw-bold fs-5">{myStats.matchesPlayed}</div>
                      Matches Played
                    </div>
                    <div className="col-6 col-sm-4 p-3 bg-dark bg-opacity-20 rounded-3">
                      <div className="text-white fw-bold fs-5">{myStats.goals || myStats.wins || 0}</div>
                      Goals / Wins
                    </div>
                    <div className="col-12 col-sm-4 p-3 bg-dark bg-opacity-20 rounded-3">
                      <div className="text-white fw-bold fs-5">{myStats.assists || 0}</div>
                      Assists Logged
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Achievements & Badges */}
        {activeTab === 'badges' && (
          <div>
            <h4 className="text-white mb-2"><i className="bi bi-award text-warning me-2"></i>Unlocked Achievements & Badges</h4>
            <p className="text-muted small mb-4">Earn badges by exhibiting high attendance, scoring goals, and winning matches during tournament challenges.</p>

            <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-lg-3">
              {availableBadges.map((badge, i) => {
                const isUnlocked = myBadges.includes(badge.name);
                return (
                  <div key={i} className="col">
                    <div className="p-4 rounded-4 text-center h-100 transition-all border" style={{ background: isUnlocked ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.02)', borderColor: isUnlocked ? 'var(--color-primary)' : 'var(--border-color)' }}>
                      <div className={`badge-item ${isUnlocked ? 'active' : ''} mb-3`} style={{ width: '65px', height: '65px', fontSize: '1.8rem' }}>
                        <i className={`bi ${badge.icon} ${isUnlocked ? 'text-white' : 'text-muted'}`}></i>
                      </div>
                      <h5 className={isUnlocked ? 'text-white' : 'text-muted'}>{badge.name}</h5>
                      <p className="text-muted small mb-0">{badge.desc}</p>
                      <span className={`badge badge-custom mt-3 ${isUnlocked ? 'bg-success text-white' : 'bg-secondary text-muted'}`}>
                        {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Dues & Invoices */}
        {activeTab === 'billing' && (
          <div>
            <h4 className="text-white mb-2"><i className="bi bi-credit-card text-danger me-2"></i>Fees & Invoice History</h4>
            <p className="text-muted small mb-4">Pay membership dues, monitor payment logs, and review detailed invoice statements.</p>

            {myInvoices.length === 0 ? (
              <div className="text-center py-5 text-muted">No invoices found on your account.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-custom align-middle">
                  <thead>
                    <tr>
                      <th>Invoice No.</th>
                      <th>Date</th>
                      <th>Tier Model</th>
                      <th>Amount Due</th>
                      <th>Payment Status</th>
                      <th className="text-end">Billing Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myInvoices.map((inv) => (
                      <tr key={inv.id}>
                        <td className="fw-semibold text-white">{inv.invoiceNo}</td>
                        <td className="text-muted small">{inv.date}</td>
                        <td className="text-muted small">{inv.tier} Membership</td>
                        <td className="fw-bold text-white">${inv.amount}</td>
                        <td>
                          <span className={`badge badge-custom ${inv.status === 'Paid' ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-30' : 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-30'}`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="text-end">
                          {inv.status === 'Unpaid' ? (
                            <button className="btn btn-sm btn-primary-custom" onClick={() => handlePay(inv.id)}>
                              Pay Now
                            </button>
                          ) : (
                            <a 
                              href="#" 
                              className="btn btn-sm btn-outline-secondary" 
                              onClick={(e) => { 
                                e.preventDefault(); 
                                alert(`Downloading Invoice Receipt ${inv.invoiceNo}...\nAmount: $${inv.amount}\nStatus: Paid.`); 
                              }}
                            >
                              <i className="bi bi-download me-1"></i> Receipt
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Practice Plan of the Day */}
        {activeTab === 'plan' && (
          <div>
            <h4 className="text-white mb-2"><i className="bi bi-journal-text text-info me-2"></i>Daily Practice Planner</h4>
            <p className="text-muted small mb-4">View drills, tactical workout plans, and fitness exercises designed by your head coach for today's practice.</p>

            {practicePlan ? (
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <div className="p-4 rounded-4 h-100" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)' }}>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <div className="bg-primary bg-opacity-15 p-2 rounded text-primary">
                        <i className="bi bi-emoji-smile fs-5"></i>
                      </div>
                      <h5 className="text-white m-0">1. Warm-Up Exercises</h5>
                    </div>
                    <p className="text-muted small m-0">{practicePlan.warmup}</p>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="p-4 rounded-4 h-100" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)' }}>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <div className="bg-success bg-opacity-15 p-2 rounded text-success">
                        <i className="bi bi-arrows-move fs-5"></i>
                      </div>
                      <h5 className="text-white m-0">2. Skills & Tactical Drills</h5>
                    </div>
                    <p className="text-muted small m-0">{practicePlan.drills}</p>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="p-4 rounded-4 h-100" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)' }}>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <div className="bg-warning bg-opacity-15 p-2 rounded text-warning">
                        <i className="bi bi-lightning-charge fs-5"></i>
                      </div>
                      <h5 className="text-white m-0">3. Fitness Workouts</h5>
                    </div>
                    <p className="text-muted small m-0">{practicePlan.fitness}</p>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="p-4 rounded-4 h-100" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)' }}>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <div className="bg-danger bg-opacity-15 p-2 rounded text-danger">
                        <i className="bi bi-shield-shaded fs-5"></i>
                      </div>
                      <h5 className="text-white m-0">4. Match Play & Scrimmage</h5>
                    </div>
                    <p className="text-muted small m-0">{practicePlan.matchPractice}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-5 text-muted">No daily workout plan has been published yet.</div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
