import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Booking {
  _id: string;
  clientId: {
    _id: string;
    name: string;
  };
  serviceType: string;
  description: string;
  price: number;
  status: 'pending' | 'accepted' | 'rejected' | 'started' | 'completed' | 'paid';
  scheduledDate: string;
  createdAt: string;
}

const FreelancerDashboard = () => {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalEarnings: 0,
    averageRating: 0,
    pendingRequests: 0
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/bookings/freelancer', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings);
        
        // Calculate stats
        const totalBookings = data.bookings.length;
        const totalEarnings = data.bookings
          .filter((b: Booking) => ['completed', 'paid'].includes(b.status))
          .reduce((sum: number, b: Booking) => sum + b.price, 0);
        const pendingRequests = data.bookings.filter((b: Booking) => b.status === 'pending').length;
        
        setStats({
          totalBookings,
          totalEarnings,
          averageRating: user?.rating || 0,
          pendingRequests
        });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId: string, action: 'accept' | 'reject' | 'start' | 'complete') => {
    try {
      const response = await fetch(`http://localhost:3000/api/bookings/${bookingId}/${action}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Refresh bookings
        fetchBookings();
      }
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { bg: '#d4edda', color: '#155724' };
      case 'paid': return { bg: '#e7e3ff', color: '#6f42c1' };
      case 'accepted': return { bg: '#d1ecf1', color: '#0c5460' };
      case 'started': return { bg: '#e2e3e5', color: '#383d41' };
      case 'rejected': return { bg: '#f8d7da', color: '#721c24' };
      default: return { bg: '#fff3cd', color: '#856404' };
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
    <div className="container">
      <div className="mb-4">
        <h1>Freelancer Dashboard</h1>
        <p>Manage your bookings, profile, and earnings</p>
      </div>
      
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <h3 style={{ color: '#007bff' }}>{stats.totalBookings}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <h3 style={{ color: '#28a745' }}>${stats.totalEarnings}</h3>
            <p>Total Earnings</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <h3 style={{ color: '#ffc107' }}>{(Number(stats.averageRating) || 0).toFixed(1)}</h3>
            <p>Average Rating</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <h3 style={{ color: '#17a2b8' }}>{stats.pendingRequests}</h3>
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
                <h4>{user?.name}</h4>
                <p>⭐ {(Number(user?.rating) || 0).toFixed(1)}/5 ({user?.completedJobs || 0} jobs completed)</p>
              </div>
            </div>
            <div className="mb-2"><strong>Service:</strong> {user?.serviceCategory || 'Not specified'}</div>
            <div className="mb-2"><strong>Email:</strong> {user?.email}</div>
            <div className="mb-3"><strong>Location:</strong> {user?.location || 'Not specified'}</div>
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
              {bookings.length === 0 ? (
                <div className="text-center" style={{ padding: '2rem', color: '#666' }}>
                  <h4>No bookings yet</h4>
                  <p>Your booking requests will appear here</p>
                </div>
              ) : (
                bookings.map(booking => {
                  const statusStyle = getStatusColor(booking.status);
                  return (
                    <div key={booking._id} className="card" style={{ margin: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 0.5rem 0' }}>{booking.serviceType}</h4>
                          <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>{booking.description}</p>
                          <p style={{ margin: '0.25rem 0', color: '#666' }}>👤 {booking.clientId.name}</p>
                          <p style={{ margin: '0.25rem 0', color: '#666' }}>📅 {formatDate(booking.scheduledDate)}</p>
                          <p style={{ margin: '0.25rem 0', color: '#666' }}>💰 ${booking.price}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                          <span style={{ 
                            padding: '0.25rem 0.75rem', 
                            borderRadius: '12px',
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            textTransform: 'capitalize'
                          }}>
                            {booking.status}
                          </span>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {booking.status === 'pending' && (
                              <>
                                <button 
                                  className="btn btn-success" 
                                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                                  onClick={() => handleBookingAction(booking._id, 'accept')}
                                >
                                  Accept
                                </button>
                                <button 
                                  className="btn btn-danger" 
                                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                                  onClick={() => handleBookingAction(booking._id, 'reject')}
                                >
                                  Decline
                                </button>
                              </>
                            )}
                            {booking.status === 'accepted' && (
                              <button 
                                className="btn btn-primary" 
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                                onClick={() => handleBookingAction(booking._id, 'start')}
                              >
                                Start Job
                              </button>
                            )}
                            {booking.status === 'started' && (
                              <button 
                                className="btn btn-success" 
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                                onClick={() => handleBookingAction(booking._id, 'complete')}
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;