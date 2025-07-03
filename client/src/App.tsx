import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import FreelancerDashboard from './pages/FreelancerDashboard';
import Booking from './pages/Booking';
import PhotoUpload from './pages/PhotoUpload';

function App() {
  return (
    <Router>
      <div className="app">
        <nav style={{ padding: '1rem', backgroundColor: '#f0f0f0', marginBottom: '2rem' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
          <Link to="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
          <Link to="/booking" style={{ marginRight: '1rem' }}>Booking</Link>
          <Link to="/upload" style={{ marginRight: '1rem' }}>Photo Upload</Link>
          <Link to="/login">Login</Link>
        </nav>
        <div style={{ padding: '1rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<FreelancerDashboard />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/upload" element={<PhotoUpload />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
