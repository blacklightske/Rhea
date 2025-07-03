import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import FreelancerDashboard from './pages/FreelancerDashboard';
import Booking from './pages/Booking';
import PhotoUpload from './pages/PhotoUpload';
import Header from './components/header/header';
import ServiceFreelancers from './services/ServiceFreeLancers';

function App() {
  return (
    <Router>
      <div className="app">
      
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<FreelancerDashboard />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/upload" element={<PhotoUpload />} />
            <Route path="/login" element={<Login />} />
             <Route path="/services/:serviceName" element={<ServiceFreelancers />} />
          </Routes>
        </div>
    
    </Router>
  );
}

export default App;
