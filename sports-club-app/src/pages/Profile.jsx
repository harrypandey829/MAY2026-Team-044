import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Profile() {
  const { currentUser, updateProfile } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || ''
  });
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setSuccess('Profile updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  if (!currentUser) return <div className="text-center mt-5 text-light">Please log in to view profile details.</div>;

  return (
    <div className="container-fluid py-4 px-md-5 text-light">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          
          <h2 className="mb-4 text-white">My Profile Management</h2>

          {success && (
            <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3 p-3 mb-4 animate-fade-in text-center small">
              <i className="bi bi-check-circle-fill me-2"></i>{success}
            </div>
          )}

          <div className="glass-panel p-4 p-md-5 animate-fade-in shadow-lg">
            
            {/* Header Badge */}
            <div className="d-flex flex-column flex-sm-row align-items-center gap-4 pb-4 border-bottom border-secondary border-opacity-20 mb-4">
              <div className="rounded-circle bg-gradient-primary d-flex align-items-center justify-content-center text-white fw-bold fs-2" style={{ width: '80px', height: '80px' }}>
                {currentUser.name ? currentUser.name.charAt(0) : 'U'}
              </div>
              <div className="text-center text-sm-start">
                <h3 className="text-white m-0">{currentUser.name || 'User Name'}</h3>
                <p className="text-muted m-0 small mb-2">{currentUser.email}</p>
                <span className="badge badge-custom badge-member text-uppercase">{currentUser.role} Account</span>
              </div>
            </div>

            {/* Profile Edit Form */}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label text-muted small">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    className="form-control form-control-custom" 
                    value={formData.name} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label text-muted small">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="form-control form-control-custom" 
                    value={formData.email} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label text-muted small">Phone Number</label>
                  <input 
                    type="text" 
                    name="phone" 
                    className="form-control form-control-custom" 
                    value={formData.phone} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label text-muted small">Division / Sport Branch</label>
                  <input 
                    type="text" 
                    className="form-control form-control-custom" 
                    value={currentUser.sport || 'General Athletics'} 
                    disabled 
                    style={{ opacity: 0.6 }}
                  />
                  <div className="form-text text-muted" style={{ fontSize: '0.75rem' }}>Contact club administrator to update division/sport.</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-top border-secondary border-opacity-20 d-flex justify-content-end">
                <button type="submit" className="btn btn-primary-custom px-4">
                  <i className="bi bi-save2 me-2"></i>Save Profile Changes
                </button>
              </div>
            </form>

          </div>

        </div>
      </div>
    </div>
  );
}
