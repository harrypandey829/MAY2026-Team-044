import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

export default function Practice() {
  const { currentUser } = useContext(AppContext);
  const coachSport = currentUser?.specialty || 'Football';

  const [warmup, setWarmup] = useState('Light jog, 10 min dynamic stretching.');
  const [drills, setDrills] = useState('Passing patterns & triangle possession drill.');
  const [fitness, setFitness] = useState('Interval sprints, 5 sets of 100m.');
  const [matchPractice, setMatchPractice] = useState('Half-field 6v6 scrimmage.');
  const [success, setSuccess] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const plan = { warmup, drills, fitness, matchPractice };
    localStorage.setItem('elite_practice_plan_' + coachSport, JSON.stringify(plan));
    setSuccess('Daily practice schedule published! Players can view this on their dashboard.');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="container-fluid py-4 px-md-5 text-light">
      <h2 className="mb-2 text-white">Practice Planner ({coachSport})</h2>
      <p className="text-muted small mb-4">Plan and broadcast daily workouts, warm-ups, tactical skills drills, and scrimmage rules.</p>

      {success && (
        <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3 p-3 mb-4 text-center small animate-fade-in">
          {success}
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="glass-panel p-4 shadow">
            <h5 className="text-white mb-4"><i className="bi bi-journal-album text-info me-2"></i>Daily Training Schedule</h5>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small">1. Warm-Up Schedule</label>
                <textarea className="form-control form-control-custom" rows="2" value={warmup} onChange={e => setWarmup(e.target.value)}></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">2. Skills & Drills Practice</label>
                <textarea className="form-control form-control-custom" rows="2" value={drills} onChange={e => setDrills(e.target.value)}></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">3. Fitness Exercises</label>
                <textarea className="form-control form-control-custom" rows="2" value={fitness} onChange={e => setFitness(e.target.value)}></textarea>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small">4. Match Play / Scrimmage</label>
                <textarea className="form-control form-control-custom" rows="2" value={matchPractice} onChange={e => setMatchPractice(e.target.value)}></textarea>
              </div>

              <button type="submit" className="btn btn-primary-custom w-100 py-2.5">
                Publish Today's Planner
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
