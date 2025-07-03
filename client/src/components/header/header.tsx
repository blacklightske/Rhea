import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

const Header = () => {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/booking">Booking</Link>
        <Link to="/upload">Photo Upload</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
};

export default Header;
