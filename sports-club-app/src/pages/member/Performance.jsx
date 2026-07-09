import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

export default function Performance() {
  const { currentUser, playerStats, badges } = useContext(AppContext);
  
  const myStats = playerStats[currentUser?.id] || { matchesPlayed: 0, goals: 0, assists: 0, rating: 0.0, remarks: 'Attend training to get ratings!' };
  const myBadges = badges[currentUser?.id] || [];

  const availableBadges = [
    { name: 'Perfect Attendance', icon: 'bi-calendar-check', desc: '100% attendance in training sessions for a month.' },
    { name: 'Top Scorer', icon: 'bi-fire', desc: 'Leading scorer in competitive league matches.' },
    { name: 'MVP', icon: 'bi-star-fill', desc: 'Selected as Most Valuable Player in club tournament.' },
    { name: 'Best Defender', icon: 'bi-shield-shaded', desc: 'Outstanding defensive contributions and clearances.' },
    { name: 'Most Improved Player', icon: 'bi-graph-up-arrow', desc: 'Demonstrated highest growth in performance metrics.' }
  ];

  return (
    <div className="container-fluid py-4 px-md-5 text-light">
      <h2 className="mb-2 text-white">My Performance Records</h2>
      <p className="text-muted small mb-4">View evaluation cards, matches played, and unlocked achievement badges.</p>

      <div className="row g-4 mb-4">
        {/* Rating Breakdown */}
        <div className="col-12 col-md-5">
          <div className="glass-panel p-4 text-center h-100 d-flex flex-column justify-content-center shadow">
            <span className="text-muted small text-uppercase">Performance Rating</span>
            <div className="display-2 text-warning fw-bold my-3">
              {myStats.rating ? myStats.rating.toFixed(1) : '0.0'}
            </div>
            <div className="d-flex justify-content-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <i key={i} className={`bi bi-star-fill ${i < Math.round((myStats.rating || 0) / 2) ? 'text-warning' : 'text-muted'}`}></i>
              ))}
            </div>
            <span className="text-muted small">Updated by Division Head Coach</span>
          </div>
        </div>

        {/* Stats card */}
        <div className="col-12 col-md-7">
          <div className="glass-panel p-4 h-100 shadow">
            <h5 className="text-white mb-3">Coach's Feedbacks</h5>
            <div className="p-3 bg-dark bg-opacity-40 rounded-3 border border-secondary border-opacity-10 mb-4">
              <p className="m-0 text-white italic">"{myStats.remarks}"</p>
            </div>
            
            <h6 className="text-white mb-2">Roster Metrics</h6>
            <div className="row text-center g-2 text-muted small">
              <div className="col-4 p-3 bg-dark bg-opacity-20 rounded-3">
                <div className="text-white fw-bold fs-5">{myStats.matchesPlayed}</div>
                Matches
              </div>
              <div className="col-4 p-3 bg-dark bg-opacity-20 rounded-3">
                <div className="text-white fw-bold fs-5">{myStats.goals || myStats.wins || 0}</div>
                Goals/Wins
              </div>
              <div className="col-4 p-3 bg-dark bg-opacity-20 rounded-3">
                <div className="text-white fw-bold fs-5">{myStats.assists || 0}</div>
                Assists
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="glass-panel p-4 shadow">
        <h5 className="text-white mb-4">Earned Achievement Badges</h5>
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
