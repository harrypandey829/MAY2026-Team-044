import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';

export default function Announcements() {
  const { announcements, addAnnouncement, currentUser } = useContext(AppContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return;
    addAnnouncement(title, content, currentUser?.name || 'Admin Sumit');
    setTitle('');
    setContent('');
    setSuccess('Notice broadcasted to all member/coach feeds.');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="container-fluid py-4 px-md-5 text-light">
      <h2 className="mb-2 text-white">Broadcast Announcements</h2>
      <p className="text-muted small mb-4">Send notices, updates, maintenance schedule edits, and fee alerts to all player dashboards.</p>

      {success && (
        <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3 p-3 mb-4 text-center small animate-fade-in">
          {success}
        </div>
      )}

      <div className="row g-4">
        {/* Creator Form */}
        <div className="col-12 col-lg-4">
          <div className="glass-panel p-4 shadow">
            <h5 className="text-white mb-3">Post Announcement Notice</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small">Notice Title</label>
                <input type="text" className="form-control form-control-custom" placeholder="e.g. Schedule Updates" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="form-label text-muted small">Content Message</label>
                <textarea className="form-control form-control-custom" rows="5" placeholder="Broadcasting details..." value={content} onChange={e => setContent(e.target.value)}></textarea>
              </div>
              <button type="submit" className="btn btn-primary-custom w-100">
                Broadcast Notice
              </button>
            </form>
          </div>
        </div>

        {/* Notice Board List */}
        <div className="col-12 col-lg-8">
          <div className="glass-panel p-4 shadow" style={{ minHeight: '400px' }}>
            <h5 className="text-white mb-4">Announcement History Log</h5>
            
            <div className="d-flex flex-column gap-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-3.5 rounded-4" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="m-0 text-white fw-bold">{ann.title}</h6>
                    <span className="small text-muted">{ann.date}</span>
                  </div>
                  <p className="small text-muted mb-2">{ann.content}</p>
                  <span className="small text-primary">Posted By: {ann.author}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
