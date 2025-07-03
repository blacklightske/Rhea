import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  const handleHireClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/services' } } });
    } else {
      navigate('/services');
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>Rhea</h1>
        </Link>

        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          {isAuthenticated && (
            <>
              <Link to="/services" className="nav-link">Services</Link>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            </>
          )}
        </nav>

        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <span className="welcome-message">
                Welcome, {user?.name}!
              </span>
              <div className="account-dropdown">
                <button 
                  className="account-btn"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                    <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor"/>
                  </svg>
                </button>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <Link 
                      to="/account" 
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      Account Settings
                    </Link>
                    <button 
                      className="dropdown-item logout-btn"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <div className="account-dropdown">
                <button 
                  className="account-btn"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                    <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor"/>
                  </svg>
                </button>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <Link 
                      to="/login" 
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/signup" 
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
          <button className="hire-btn" onClick={handleHireClick}>
            Hire Now
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;