import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './UserDashboard.css';

interface Booking {
  _id: string;
  serviceType: string;
  description: string;
  price: number;
  status: 'pending' | 'accepted' | 'rejected' | 'started' | 'completed' | 'paid';
  freelancerId: {
    _id: string;
    name: string;
    rating: number;
  };
  createdAt: string;
  scheduledDate: string;
}

const UserDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
    totalSpent: 0
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/bookings/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings);
        
        // Calculate stats
        const totalJobs = data.bookings.length;
        const activeJobs = data.bookings.filter((b: Booking) => 
          ['pending', 'accepted', 'started'].includes(b.status)
        ).length;
        const completedJobs = data.bookings.filter((b: Booking) => 
          ['completed', 'paid'].includes(b.status)
        ).length;
        const totalSpent = data.bookings
          .filter((b: Booking) => ['completed', 'paid'].includes(b.status))
          .reduce((sum: number, b: Booking) => sum + b.price, 0);
        
        setStats({ totalJobs, activeJobs, completedJobs, totalSpent });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'accepted': return '#17a2b8';
      case 'started': return '#007bff';
      case 'completed': return '#28a745';
      case 'paid': return '#6f42c1';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Manage your service bookings and account</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>{stats.totalJobs}</h3>
              <p>Total Jobs Hired</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{stats.activeJobs}</h3>
              <p>Active Jobs</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.completedJobs}</h3>
              <p>Completed Jobs</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>${stats.totalSpent}</h3>
              <p>Total Spent</p>
            </div>
          </div>
        </div>

        <div className="bookings-section">
          <div className="section-header">
            <h2>Your Bookings</h2>
            <button className="hire-new-btn">
              + Hire New Service
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No bookings yet</h3>
              <p>Start by hiring your first service!</p>
              <button className="cta-btn">Browse Services</button>
            </div>
          ) : (
            <div className="bookings-grid">
              {bookings.map((booking) => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-header">
                    <h3>{booking.serviceType}</h3>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="booking-details">
                    <p className="description">{booking.description}</p>
                    <div className="booking-meta">
                      <div className="freelancer-info">
                        <strong>Freelancer:</strong> {booking.freelancerId.name}
                        <span className="rating">⭐ {booking.freelancerId.rating}</span>
                      </div>
                      <div className="booking-dates">
                        <div><strong>Booked:</strong> {formatDate(booking.createdAt)}</div>
                        <div><strong>Scheduled:</strong> {formatDate(booking.scheduledDate)}</div>
                      </div>
                      <div className="booking-price">
                        <strong>Price:</strong> ${booking.price}
                      </div>
                    </div>
                  </div>
                  
                  <div className="booking-actions">
                    <button className="view-details-btn">View Details</button>
                    {booking.status === 'completed' && (
                      <button className="review-btn">Leave Review</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;