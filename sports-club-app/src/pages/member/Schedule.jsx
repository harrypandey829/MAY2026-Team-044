import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';

export default function Schedule() {
  const { currentUser, events, respondToEvent } = useContext(AppContext);
  const memberSport = currentUser?.sport || 'Football';
  const memberEvents = events.filter(e => e.sport === memberSport);
  const [success, setSuccess] = useState('');

  const handleResponse = (eventId, status) => {
    respondToEvent(eventId, currentUser?.id, status);
    setSuccess(`Marked your availability as: ${status}`);
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="container-fluid py-4 px-md-5 text-light">
      <h2 className="mb-2 text-white">My Schedule & Availability</h2>
      <p className="text-muted small mb-4">View upcoming team activities, practice schedules, and competitive fixtures, and mark your response.</p>

      {success && (
        <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3 p-3 mb-4 text-center small animate-fade-in">
          {success}
        </div>
      )}

      {memberEvents.length === 0 ? (
        <div className="text-center py-5 text-muted glass-panel">No upcoming events scheduled.</div>
      ) : (
        <div className="row g-4">
          {memberEvents.map((evt) => {
            const response = evt.responses[currentUser?.id] || 'Unconfirmed';
            return (
              <div key={evt.id} className="col-12">
                <div className="glass-panel p-4 animate-fade-in shadow">
                  <div className="row align-items-center g-3">
                    <div className="col-12 col-md-8">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className={`badge text-uppercase badge-custom ${evt.type === 'match' ? 'bg-danger bg-opacity-10 text-danger border-danger border border-opacity-30' : 'bg-info bg-opacity-10 text-info border-info border border-opacity-30'}`}>
                          {evt.type}
                        </span>
                        <span className="text-muted small"><i className="bi bi-geo-alt me-1"></i>{evt.venue}</span>
                      </div>
                      <h4 className="text-white m-0">{evt.title}</h4>
                      <p className="text-muted small mt-2 mb-0">{evt.description}</p>
                      {evt.opponent && <p className="text-muted small mt-1 mb-0">Opponent: <span className="text-danger fw-semibold">{evt.opponent}</span></p>}
                    </div>

                    <div className="col-12 col-md-4 text-md-end">
                      <div className="mb-3">
                        <div className="text-white fw-bold"><i className="bi bi-calendar-event me-2 text-primary"></i>{evt.date}</div>
                        <div className="text-muted small">{evt.time}</div>
                      </div>
                      
                      <div className="d-inline-flex flex-column align-items-md-end gap-1.5 w-100">
                        <span className="small text-muted">My response: <strong className={response === 'Attending' ? 'text-success' : response === 'Not Attending' ? 'text-danger' : 'text-warning'}>{response}</strong></span>
                        <div className="btn-group btn-group-sm w-100" role="group">
                          <button className={`btn ${response === 'Attending' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => handleResponse(evt.id, 'Attending')}>
                            Attending
                          </button>
                          <button className={`btn ${response === 'Not Attending' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => handleResponse(evt.id, 'Not Attending')}>
                            Decline
                          </button>
                          <button className={`btn ${response === 'Maybe' ? 'btn-warning text-dark' : 'btn-outline-warning text-light'}`} onClick={() => handleResponse(evt.id, 'Maybe')}>
                            Maybe
                          </button>
                        </div>
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
  );
}
