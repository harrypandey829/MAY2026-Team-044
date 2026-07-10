import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-darkest" style={{ background: 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, var(--bg-darkest) 70%)' }}>
      <div className="container px-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            
            {/* Logo */}
            <div className="text-center mb-4">
              <i className="bi bi-activity text-gradient-accent display-4"></i>
              <h2 className="mt-2 text-white fw-bold tracking-tight">ElitePlay</h2>
              <p className="text-muted small">Recover Your Credentials</p>
            </div>

            {/* Recover Card */}
            <div className="glass-panel p-4 p-md-5 animate-fade-in shadow-lg">
              <h4 className="text-white text-center mb-3">Reset Password</h4>
              
              {submitted ? (
                <div className="text-center">
                  <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3 p-3 small mb-4">
                    <i className="bi bi-envelope-check-fill me-2 fs-5"></i>
                    Recovery email sent! Check your inbox for reset instructions.
                  </div>
                  <Link to="/login" className="btn btn-primary-custom w-100 py-2.5">
                    Back to Login
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <p className="text-muted small text-center mb-4">Enter your registered email address and we'll send you a secure link to reset your account password.</p>
                  
                  {error && (
                    <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger rounded-3 p-3 text-center small mb-3">
                      {error}
                    </div>
                  )}

                  <div className="mb-4">
                    <label htmlFor="recoveryEmail" className="form-label text-muted small">Email Address</label>
                    <input 
                      type="email" 
                      id="recoveryEmail"
                      className="form-control form-control-custom" 
                      placeholder="name@club.com" 
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary-custom w-100 py-2.5 mb-3">
                    Send Reset Link
                  </button>

                  <div className="text-center">
                    <Link to="/login" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
                      <i className="bi bi-arrow-left me-1"></i>Back to Sign In
                    </Link>
                  </div>
                </form>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
