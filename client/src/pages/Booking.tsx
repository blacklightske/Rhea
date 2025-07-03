import React, { useState } from 'react';

const Booking = () => {
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedFreelancer, setSelectedFreelancer] = useState('');

  const services = [
    'House Cleaning',
    'Plumbing',
    'Electrical Work',
    'Gardening',
    'Handyman Services',
    'Moving Help'
  ];

  const freelancers = [
    { id: 1, name: 'Alice Johnson', rating: 4.8, price: '$25/hr' },
    { id: 2, name: 'Bob Smith', rating: 4.6, price: '$30/hr' },
    { id: 3, name: 'Carol Davis', rating: 4.9, price: '$28/hr' }
  ];

  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert(`Booking submitted!\nService: ${selectedService}\nFreelancer: ${selectedFreelancer}\nDate: ${selectedDate}`);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Book a Freelancer</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label htmlFor="service">Select Service:</label>
          <select 
            id="service" 
            value={selectedService} 
            onChange={(e) => setSelectedService(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            required
          >
            <option value="">Choose a service...</option>
            {services.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="freelancer">Select Freelancer:</label>
          <select 
            id="freelancer" 
            value={selectedFreelancer} 
            onChange={(e) => setSelectedFreelancer(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            required
          >
            <option value="">Choose a freelancer...</option>
            {freelancers.map(freelancer => (
              <option key={freelancer.id} value={freelancer.name}>
                {freelancer.name} - ⭐{freelancer.rating} - {freelancer.price}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date">Select Date & Time:</label>
          <input 
            type="datetime-local" 
            id="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            required
          />
        </div>

        <button 
          type="submit" 
          style={{ 
            padding: '0.75rem', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Book Now
        </button>
      </form>
    </div>
  );
};

export default Booking;