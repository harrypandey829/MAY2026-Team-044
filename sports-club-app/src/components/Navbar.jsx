import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function Navbar() {
  const { currentUser, logout, announcements, theme, toggleTheme } = useContext(AppContext);
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeClass = (role) => {
    if (role === 'admin') return 'badge-admin';
    if (role === 'coach') return 'badge-coach';
    return 'badge-member';
  };

  return (
    <nav className="navbar navbar-expand-lg border-bottom" style={{ background: 'var(--bg-darker)', borderColor: 'var(--border-color) !important', height: '70px', zIndex: 100 }}>
      <div className="container-fluid px-4">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-activity text-gradient-accent fs-3 me-2"></i>
          <span className="fw-extrabold text-white tracking-tight" style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem' }}>
            Elite<span style={{ color: 'var(--color-primary)' }}>Play</span>
          </span>
        </Link>

        <button className="navbar-toggler border-0 text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <i className="bi bi-list fs-3"></i>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          {currentUser && (
            <div className="d-flex align-items-center ms-auto gap-3">
              {/* Role Indicator Badge */}
              <span className={`badge badge-custom ${getRoleBadgeClass(currentUser.role)} text-uppercase`}>
                {currentUser.role}
              </span>

              {/* Theme Toggle Button */}
              <button 
                className="btn btn-link text-light p-1 me-2" 
                onClick={toggleTheme}
                style={{ textDecoration: 'none', boxShadow: 'none' }}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <i className="bi bi-sun fs-5 text-warning"></i>
                ) : (
                  <i className="bi bi-moon-fill fs-5 text-dark"></i>
                )}
              </button>

              {/* Notification Icon */}
              <div className="position-relative">
                <button 
                  className="btn btn-link text-light p-1 position-relative" 
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{ textDecoration: 'none' }}
                >
                  <i className="bi bi-bell fs-5"></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                    {announcements.length}
                  </span>
                </button>

                {showNotifications && (
                  <div className="glass-panel position-absolute end-0 mt-3 p-3 text-light" style={{ width: '320px', zIndex: 1000, background: 'var(--bg-darker)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-secondary">
                      <h6 className="m-0 fw-bold">Recent Announcements</h6>
                      <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>New</span>
                    </div>
                    <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                      {announcements.map((ann, i) => (
                        <div key={i} className="mb-3 pb-2 border-bottom border-dark">
                          <div className="d-flex justify-content-between">
                            <span className="fw-bold text-white small">{ann.title}</span>
                            <span className="text-muted small" style={{ fontSize: '0.7rem' }}>{ann.date}</span>
                          </div>
                          <p className="text-muted small m-0 mt-1">{ann.content}</p>
                          <span className="text-primary small" style={{ fontSize: '0.7rem' }}>By: {ann.author}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="bg-secondary" style={{ width: '1px', height: '24px', opacity: 0.3 }}></div>

              {/* User Dropdown */}
              <div className="dropdown">
                <button 
                  className="btn btn-link d-flex align-items-center gap-2 text-white p-0 dropdown-toggle text-decoration-none" 
                  type="button" 
                  id="userMenu" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <div className="rounded-circle bg-gradient-cool d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: '38px', height: '38px', fontSize: '0.9rem' }}>
                    {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                  </div>
                  <div className="text-start d-none d-sm-block">
                    <div className="fw-semibold text-white small" style={{ lineHeight: '1.2' }}>{currentUser.name || 'User'}</div>
                    <div className="text-muted small" style={{ fontSize: '0.75rem' }}>{currentUser.email}</div>
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end glass-panel mt-2 p-2 border-secondary border" aria-labelledby="userMenu" style={{ background: 'var(--bg-darker)' }}>
                  <li>
                    <Link className="dropdown-item text-light rounded py-2 small" to="/profile">
                      <i className="bi bi-person me-2"></i>My Profile
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider border-secondary" /></li>
                  <li>
                    <button className="dropdown-item text-danger rounded py-2 small w-100 text-start bg-transparent border-0" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
