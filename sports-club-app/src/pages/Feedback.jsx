import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Feedback() {
  const { feedback, submitFeedback, currentUser } = useContext(AppContext);
  
  const [trainingRating, setTrainingRating] = useState(5);
  const [coachRating, setCoachRating] = useState(5);
  const [facilitiesRating, setFacilitiesRating] = useState(5);
  const [comments, setComments] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    submitFeedback(Number(trainingRating), Number(coachRating), Number(facilitiesRating), comments);
    setComments('');
    setSuccess('Thank you! Your feedback has been recorded.');
    setTimeout(() => setSuccess(''), 3000);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i 
          key={i} 
          className={`bi ${i <= rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`} 
          style={{ fontSize: '0.9rem', marginRight: '2px' }}
        ></i>
      );
    }
    return stars;
  };

  return (
    <div className="container-fluid py-4 px-md-5 text-light">
      <h2 className="mb-2 text-white">Event & Session Feedback</h2>
      <p className="text-muted small mb-4">Rate the drills, training programs, coaching standards, and facilities to help us improve future sessions.</p>

      {success && (
        <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3 p-3 mb-4 text-center small animate-fade-in">
          <i className="bi bi-check-circle-fill me-2"></i>{success}
        </div>
      )}

      <div className="row g-4">
        {/* Feedback Submission Form */}
        <div className="col-12 col-lg-5">
          <div className="glass-panel p-4 animate-fade-in shadow-lg">
            <h5 className="text-white mb-4"><i className="bi bi-pencil-square text-primary me-2"></i>Submit Feedback</h5>
            
            <form onSubmit={handleSubmit}>
              
              {/* Training rating */}
              <div className="mb-3">
                <label className="form-label text-muted small d-block">Rate Today's Training Sessions</label>
                <div className="d-flex gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button 
                      key={val} 
                      type="button" 
                      className={`btn btn-sm ${trainingRating === val ? 'btn-warning text-dark' : 'btn-outline-secondary text-light'}`}
                      onClick={() => setTrainingRating(val)}
                      style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    >
                      {val} ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Coach rating */}
              <div className="mb-3">
                <label className="form-label text-muted small d-block">Rate Coach Performance</label>
                <div className="d-flex gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button 
                      key={val} 
                      type="button" 
                      className={`btn btn-sm ${coachRating === val ? 'btn-warning text-dark' : 'btn-outline-secondary text-light'}`}
                      onClick={() => setCoachRating(val)}
                      style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    >
                      {val} ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Facilities rating */}
              <div className="mb-3">
                <label className="form-label text-muted small d-block">Rate Ground / Court Facilities</label>
                <div className="d-flex gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button 
                      key={val} 
                      type="button" 
                      className={`btn btn-sm ${facilitiesRating === val ? 'btn-warning text-dark' : 'btn-outline-secondary text-light'}`}
                      onClick={() => setFacilitiesRating(val)}
                      style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    >
                      {val} ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div className="mb-4">
                <label className="form-label text-muted small">Suggestions & Comments</label>
                <textarea 
                  className="form-control form-control-custom" 
                  rows="4" 
                  placeholder="Tell us what went well or what we can improve..."
                  value={comments} 
                  onChange={(e) => setComments(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary-custom w-100 py-2.5">
                Submit Feedback Report
              </button>
            </form>
          </div>
        </div>

        {/* Feedback List */}
        <div className="col-12 col-lg-7">
          <div className="glass-panel p-4 animate-fade-in shadow-lg" style={{ minHeight: '400px' }}>
            <h5 className="text-white mb-4"><i className="bi bi-chat-left-quote text-secondary me-2"></i>Review Log</h5>
            
            {feedback.length === 0 ? (
              <div className="text-center text-muted py-5">
                <i className="bi bi-clipboard-x fs-1"></i>
                <p className="mt-2">No feedback has been recorded yet.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {feedback.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-semibold text-white">{item.memberName}</span>
                      <span className="small text-muted">Verified Club Member</span>
                    </div>
                    
                    <div className="row g-2 mb-2 text-muted small">
                      <div className="col-6 col-sm-4">
                        Training: {renderStars(item.trainingRating)}
                      </div>
                      <div className="col-6 col-sm-4">
                        Coach: {renderStars(item.coachRating)}
                      </div>
                      <div className="col-12 col-sm-4">
                        Facilities: {renderStars(item.facilitiesRating)}
                      </div>
                    </div>

                    {item.comments && (
                      <p className="small m-0 text-white bg-dark bg-opacity-20 p-2 rounded-2 border border-secondary border-opacity-10 mt-2">
                        "{item.comments}"
                      </p>
                    )}
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
