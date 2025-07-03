import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Booking {
  id: number;
  client: string;
  service: string;
  date: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'In Progress';
  amount: number;
}

const FreelancerDashboard = () => {
  const [bookings] = useState<Booking[]>([
    { id: 1, client: 'John Doe', service: 'House Cleaning', date: '2025-07-05', status: 'Confirmed', amount: 150 },
    { id: 2, client: 'Jane Smith', service: 'Plumbing', date: '2025-07-07', status: 'Pending', amount: 200 },
    { id: 3, client: 'Mike Johnson', service: 'Gardening', date: '2025-07-10', status: 'Completed', amount: 120 },
    { id: 4, client: 'Sarah Wilson', service: 'Handyman', date: '2025-07-12', status: 'In Progress', amount: 180 }
  ]);

  const totalEarnings = bookings
    .filter(booking => booking.status === 'Completed')
    .reduce((sum, booking) => sum + booking.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return { bg: '#d4edda', color: '#155724' };
      case 'Confirmed': return { bg: '#d1ecf1', color: '#0c5460' };
      case 'In Progress': return { bg: '#e2e3e5', color: '#383d41' };
      default: return { bg: '#fff3cd', color: '#856404' };
    }
  };

  return (
    <div className="container">
      <div className="mb-4">
        <h1>Freelancer Dashboard</h1>
        <p>Manage your bookings, profile, and earnings</p>
      </div>
      
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <h3 style={{ color: '#007bff' }}>{bookings.length}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <h3 style={{ color: '#28a745' }}>${totalEarnings}</h3>
            <p>Total Earnings</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <h3 style={{ color: '#ffc107' }}>4.8</h3>
            <p>Average Rating</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <h3 style={{ color: '#17a2b8' }}>{bookings.filter(b => b.status === 'Pending').length}</h3>
            <p>Pending Requests</p>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Profile Section */}
        <div className="col-md-4">
          <div className="card mb-4">
            <h3>Your Profile</h3>
            <div className="mb-3">
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#007bff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', margin: '0 auto 1rem' }}>
                JD
              </div>
              <div className="text-center">
                <h4>John Freelancer</h4>
                <p>⭐⭐⭐⭐⭐ 4.8/5 (127 reviews)</p>
              </div>
            </div>
            <div className="mb-2"><strong>Services:</strong> House Cleaning, Gardening, Handyman</div>
            <div className="mb-2"><strong>Rate:</strong> $25-35/hour</div>
            <div className="mb-3"><strong>Location:</strong> Downtown Area</div>
            <button className="btn btn-secondary" style={{ width: '100%' }}>Edit Profile</button>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/upload" className="btn btn-success">📸 Upload Photos</Link>
              <button className="btn btn-primary">📅 Update Availability</button>
              <button className="btn btn-secondary">💰 View Earnings</button>
              <button className="btn btn-secondary">⚙️ Settings</button>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="col-md-8">
          <div className="card">
            <h3>Recent Bookings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {bookings.map(booking => {
                const statusStyle = getStatusColor(booking.status);
                return (
                  <div key={booking.id} className="card" style={{ margin: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 0.5rem 0' }}>{booking.service}</h4>
                        <p style={{ margin: '0.25rem 0', color: '#666' }}>👤 {booking.client}</p>
                        <p style={{ margin: '0.25rem 0', color: '#666' }}>📅 {booking.date}</p>
                        <p style={{ margin: '0.25rem 0', color: '#666' }}>💰 ${booking.amount}</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '12px',
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}>
                          {booking.status}
                        </span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {booking.status === 'Pending' && (
                            <>
                              <button className="btn btn-success" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>Accept</button>
                              <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>Decline</button>
                            </>
                          )}
                          {booking.status === 'Confirmed' && (
                            <button className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>Start Job</button>
                          )}
                          {booking.status === 'In Progress' && (
                            <button className="btn btn-success" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>Complete</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;