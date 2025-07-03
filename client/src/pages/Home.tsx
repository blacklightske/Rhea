import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // We'll move inline styles into CSS

const services = [
  { name: 'House Cleaning', icon: '🏠', description: 'Professional home cleaning services' },
  { name: 'Plumbing', icon: '🔧', description: 'Expert plumbing repairs and installations' },
  { name: 'Electrical Work', icon: '⚡', description: 'Safe and reliable electrical services' },
  { name: 'Gardening', icon: '🌱', description: 'Beautiful garden maintenance and design' },
  { name: 'Handyman', icon: '🔨', description: 'General home repairs and maintenance' },
  { name: 'Moving Help', icon: '📦', description: 'Professional moving and packing assistance' }
];

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Find and Book Local Freelancers</h1>
        <p>Browse, book, and pay trusted service providers. Freelancers can upload before/after photos for dispute resolution.</p>
        <Link to="/booking" className="cta-button">Book a Service Now</Link>
      </div>

      <div className="services-section">
        <h2>Popular Services</h2>
        <div className="services-grid">
          {services.map(service => (
            <Link
              to={`/services/${encodeURIComponent(service.name)}`}
              className="service-card"
              key={service.name}
            >
              <div className="service-icon">{service.icon}</div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div>
            <div className="step-icon">🔍</div>
            <h3>Browse Services</h3>
            <p>Find local freelancers offering the services you need</p>
          </div>
          <div>
            <div className="step-icon">📅</div>
            <h3>Book & Schedule</h3>
            <p>Choose your preferred freelancer and schedule a convenient time</p>
          </div>
          <div>
            <div className="step-icon">✅</div>
            <h3>Get It Done</h3>
            <p>Freelancers complete the work and upload photos for verification</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
