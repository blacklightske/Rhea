import React from 'react';

const FreelancerDashboard = () => {
  const bookings = [
    { id: 1, client: 'John Doe', service: 'House Cleaning', date: '2025-07-05', status: 'Confirmed' },
    { id: 2, client: 'Jane Smith', service: 'Plumbing', date: '2025-07-07', status: 'Pending' },
    { id: 3, client: 'Mike Johnson', service: 'Gardening', date: '2025-07-10', status: 'Completed' }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2>Freelancer Dashboard</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3>Your Profile</h3>
        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <p><strong>Name:</strong> Your Name</p>
          <p><strong>Rating:</strong> ⭐⭐⭐⭐⭐ 4.8/5</p>
          <p><strong>Services:</strong> House Cleaning, Gardening, Handyman</p>
          <p><strong>Rate:</strong> $25/hour</p>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Recent Bookings</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {bookings.map(booking => (
            <div key={booking.id} style={{ 
              padding: '1rem', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong>{booking.service}</strong>
                <p>Client: {booking.client}</p>
                <p>Date: {booking.date}</p>
              </div>
              <div style={{ 
                padding: '0.25rem 0.5rem', 
                borderRadius: '12px',
                backgroundColor: booking.status === 'Completed' ? '#d4edda' : 
                                booking.status === 'Confirmed' ? '#d1ecf1' : '#fff3cd',
                color: booking.status === 'Completed' ? '#155724' : 
                       booking.status === 'Confirmed' ? '#0c5460' : '#856404'
              }}>
                {booking.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Upload Photos
          </button>
          <button style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: '#17a2b8', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Update Availability
          </button>
          <button style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: '#ffc107', 
            color: 'black', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            View Earnings
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;