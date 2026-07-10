import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member'); // Default role selection
  const [error, setError] = useState('');
  
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const handlePresetLogin = (presetRole, presetEmail) => {
    login(presetRole, presetEmail);
    if (presetRole === 'admin') navigate('/admin/dashboard');
    else if (presetRole === 'coach') navigate('/coach/dashboard');
    else navigate('/member/dashboard');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }
    
    // Simulate simple authentication
    const user = login(role, email);
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'coach') navigate('/coach/dashboard');
    else navigate('/member/dashboard');
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
              <p className="text-muted small">Elite Sports Club Management Hub</p>
            </div>

            {/* Login Card */}
            <div className="glass-panel p-4 p-md-5 animate-fade-in shadow-lg">
              <h3 className="text-white text-center mb-4 font-title">Welcome Back</h3>

              {error && (
                <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger rounded-3 p-3 text-center small mb-3">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
                </div>
              )}

              <form onSubmit={handleFormSubmit}>
                {/* Role Switcher tabs */}
                <div className="mb-4">
                  <label className="form-label text-muted small text-uppercase fw-semibold mb-2">Login Role</label>
                  <div className="btn-group w-100" role="group">
                    <button type="button" className={`btn btn-sm ${role === 'member' ? 'btn-primary-custom' : 'btn-secondary-custom'}`} style={{ padding: '8px 10px', fontSize: '0.85rem' }} onClick={() => setRole('member')}>
                      Member
                    </button>
                    <button type="button" className={`btn btn-sm ${role === 'coach' ? 'btn-primary-custom' : 'btn-secondary-custom'}`} style={{ padding: '8px 10px', fontSize: '0.85rem' }} onClick={() => setRole('coach')}>
                      Coach
                    </button>
                    <button type="button" className={`btn btn-sm ${role === 'admin' ? 'btn-primary-custom' : 'btn-secondary-custom'}`} style={{ padding: '8px 10px', fontSize: '0.85rem' }} onClick={() => setRole('admin')}>
                      Admin
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label text-muted small">Email Address</label>
                  <input 
                    type="email" 
                    id="emailInput"
                    className="form-control form-control-custom" 
                    placeholder="name@club.com" 
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  />
                </div>

                {/* Password */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between">
                    <label htmlFor="passwordInput" className="form-label text-muted small">Password</label>
                    <Link to="/forgot-password" style={{ color: 'var(--color-secondary)', fontSize: '0.85rem', textDecoration: 'none' }}>Forgot?</Link>
                  </div>
                  <input 
                    type="password" 
                    id="passwordInput"
                    className="form-control form-control-custom" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* Submit */}
                <button type="submit" className="btn btn-primary-custom w-100 py-2.5 mb-3">
                  Sign In
                </button>
              </form>

              {/* Preset Login options */}
              <div className="mt-4 pt-3 border-top border-secondary border-opacity-20 text-center">
                <p className="text-muted small mb-3">Quick Demo Access (One-click Login):</p>
                <div className="d-flex flex-column gap-2">
                  <button className="btn btn-outline-info btn-sm text-start py-2" onClick={() => handlePresetLogin('member', 'rahul@club.com')}>
                    <i className="bi bi-person-fill me-2"></i>Login as Member (Rahul)
                  </button>
                  <button className="btn btn-outline-warning btn-sm text-start py-2" onClick={() => handlePresetLogin('coach', 'alex@club.com')}>
                    <i className="bi bi-person-workspace me-2"></i>Login as Coach (Alex)
                  </button>
                  <button className="btn btn-outline-primary btn-sm text-start py-2" onClick={() => handlePresetLogin('admin', 'admin@club.com')}>
                    <i className="bi bi-shield-lock-fill me-2"></i>Login as Admin (Sumit)
                  </button>
                </div>
              </div>

              {/* Registration Link */}
              <p className="text-muted text-center mt-4 mb-0 small">
                Want to join the club? <Link to="/register" style={{ color: 'var(--color-secondary)', fontWeight: '600', textDecoration: 'none' }}>Sign Up Here</Link>
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
