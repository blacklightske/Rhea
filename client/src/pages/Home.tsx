import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const services = [
    { name: 'House Cleaning', icon: '🏠', description: 'Professional home cleaning services' },
    { name: 'Plumbing', icon: '🔧', description: 'Expert plumbing repairs and installations' },
    { name: 'Electrical Work', icon: '⚡', description: 'Safe and reliable electrical services' },
    { name: 'Gardening', icon: '🌱', description: 'Beautiful garden maintenance and design' },
    { name: 'Handyman', icon: '🔨', description: 'General home repairs and maintenance' },
    { name: 'Moving Help', icon: '📦', description: 'Professional moving and packing assistance' }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>
          Find and Book Local Freelancers
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
          Browse, book, and pay trusted service providers. Freelancers can upload before/after photos for dispute resolution.
        </p>
        <Link 
          to="/booking" 
          style={{ 
            padding: '1rem 2rem', 
            backgroundColor: '#007bff', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '6px',
            fontSize: '1.1rem',
            display: 'inline-block'
          }}
        >
          Book a Service Now
        </Link>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Popular Services</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {services.map(service => (
            <div key={service.name} style={{ 
              padding: '1.5rem', 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              textAlign: 'center',
              backgroundColor: '#f8f9fa'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{service.icon}</div>
              <h3 style={{ marginBottom: '0.5rem' }}>{service.name}</h3>
              <p style={{ color: '#666' }}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '2rem', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2>How It Works</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem',
          marginTop: '2rem'
        }}>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
            <h3>Browse Services</h3>
            <p>Find local freelancers offering the services you need</p>
          </div>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📅</div>
            <h3>Book & Schedule</h3>
            <p>Choose your preferred freelancer and schedule a convenient time</p>
          </div>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✅</div>
            <h3>Get It Done</h3>
            <p>Freelancers complete the work and upload photos for verification</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;