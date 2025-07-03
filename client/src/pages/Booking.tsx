import React, { useState } from 'react';

interface Freelancer {
  id: number;
  name: string;
  rating: number;
  price: string;
  hourlyRate: number;
  reviews: number;
  specialties: string[];
  avatar: string;
  availability: string;
  description: string;
}

interface Service {
  name: string;
  icon: string;
  description: string;
  avgPrice: string;
}

const Booking = () => {
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedFreelancer, setSelectedFreelancer] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services: Service[] = [
    { name: 'House Cleaning', icon: '🏠', description: 'Professional home cleaning services', avgPrice: '$25-35/hr' },
    { name: 'Plumbing', icon: '🔧', description: 'Expert plumbing repairs and installations', avgPrice: '$40-60/hr' },
    { name: 'Electrical Work', icon: '⚡', description: 'Safe and reliable electrical services', avgPrice: '$45-65/hr' },
    { name: 'Gardening', icon: '🌱', description: 'Beautiful garden maintenance and design', avgPrice: '$20-30/hr' },
    { name: 'Handyman Services', icon: '🔨', description: 'General home repairs and maintenance', avgPrice: '$25-40/hr' },
    { name: 'Moving Help', icon: '📦', description: 'Professional moving and packing assistance', avgPrice: '$30-45/hr' }
  ];

  const freelancers: Freelancer[] = [
    { 
      id: 1, 
      name: 'Alice Johnson', 
      rating: 4.8, 
      price: '$25/hr',
      hourlyRate: 25,
      reviews: 127,
      specialties: ['House Cleaning', 'Deep Cleaning'],
      avatar: 'AJ',
      availability: 'Available today',
      description: 'Professional cleaner with 5+ years experience. Eco-friendly products available.'
    },
    { 
      id: 2, 
      name: 'Bob Smith', 
      rating: 4.6, 
      price: '$30/hr',
      hourlyRate: 30,
      reviews: 89,
      specialties: ['Plumbing', 'Handyman Services'],
      avatar: 'BS',
      availability: 'Available tomorrow',
      description: 'Licensed plumber and handyman. Quick response time and quality work guaranteed.'
    },
    { 
      id: 3, 
      name: 'Carol Davis', 
      rating: 4.9, 
      price: '$28/hr',
      hourlyRate: 28,
      reviews: 203,
      specialties: ['Gardening', 'Landscaping'],
      avatar: 'CD',
      availability: 'Available this week',
      description: 'Master gardener with expertise in both maintenance and landscape design.'
    },
    { 
      id: 4, 
      name: 'David Wilson', 
      rating: 4.7, 
      price: '$45/hr',
      hourlyRate: 45,
      reviews: 156,
      specialties: ['Electrical Work', 'Smart Home'],
      avatar: 'DW',
      availability: 'Available next week',
      description: 'Licensed electrician specializing in residential and smart home installations.'
    }
  ];

  const filteredFreelancers = selectedService 
    ? freelancers.filter(f => f.specialties.includes(selectedService))
    : freelancers;

  const selectedFreelancerData = freelancers.find(f => f.id === selectedFreelancer);
  const estimatedCost = selectedFreelancerData ? selectedFreelancerData.hourlyRate * estimatedHours : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedFreelancer || !selectedDate) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate booking process
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Booking submitted successfully!\n\nService: ${selectedService}\nFreelancer: ${selectedFreelancerData?.name}\nDate: ${selectedDate}\nEstimated Cost: $${estimatedCost}\nNotes: ${notes || 'None'}`);
      
      // Reset form
      setSelectedService('');
      setSelectedFreelancer(null);
      setSelectedDate('');
      setNotes('');
      setEstimatedHours(2);
    }, 2000);
  };

  return (
    <div className="container">
      <div className="mb-4 text-center">
        <h1>📅 Book a Freelancer</h1>
        <p>Find and book trusted local service providers</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Service Selection */}
          <div className="col-md-6">
            <div className="card mb-4">
              <h3>1. Select Service</h3>
              <div className="form-group">
                <label htmlFor="service" className="form-label">What service do you need?</label>
                <select 
                  id="service" 
                  className="form-control"
                  value={selectedService} 
                  onChange={(e) => {
                    setSelectedService(e.target.value);
                    setSelectedFreelancer(null); // Reset freelancer when service changes
                  }}
                  required
                >
                  <option value="">Choose a service...</option>
                  {services.map(service => (
                    <option key={service.name} value={service.name}>
                      {service.icon} {service.name} - {service.avgPrice}
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedService && (
                <div className="mt-3 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>
                      {services.find(s => s.name === selectedService)?.icon}
                    </span>
                    <div>
                      <strong>{selectedService}</strong>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>
                        {services.find(s => s.name === selectedService)?.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Date & Time Selection */}
            <div className="card mb-4">
              <h3>2. Select Date & Time</h3>
              <div className="form-group">
                <label htmlFor="date" className="form-label">When do you need this service?</label>
                <input 
                  type="datetime-local" 
                  id="date" 
                  className="form-control"
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="hours" className="form-label">Estimated Hours: {estimatedHours}</label>
                <input 
                  type="range" 
                  id="hours" 
                  min="1" 
                  max="8" 
                  step="0.5"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(parseFloat(e.target.value))}
                  className="form-control"
                  style={{ height: '40px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#666' }}>
                  <span>1 hour</span>
                  <span>8 hours</span>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="card">
              <h3>3. Additional Details</h3>
              <div className="form-group">
                <label htmlFor="notes" className="form-label">Special instructions or notes (optional)</label>
                <textarea
                  id="notes"
                  className="form-control"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific requirements, access instructions, or details about the job..."
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          {/* Freelancer Selection */}
          <div className="col-md-6">
            <div className="card">
              <h3>4. Choose Your Freelancer</h3>
              
              {!selectedService ? (
                <div className="text-center p-4" style={{ color: '#666' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👆</div>
                  <p>Please select a service first to see available freelancers</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {filteredFreelancers.map(freelancer => (
                    <div 
                      key={freelancer.id} 
                      className={`card ${selectedFreelancer === freelancer.id ? 'selected' : ''}`}
                      style={{ 
                        margin: 0,
                        cursor: 'pointer',
                        border: selectedFreelancer === freelancer.id ? '2px solid #007bff' : '1px solid #ddd',
                        backgroundColor: selectedFreelancer === freelancer.id ? '#f0f8ff' : 'white'
                      }}
                      onClick={() => setSelectedFreelancer(freelancer.id)}
                    >
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          backgroundColor: '#007bff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '1.2rem'
                        }}>
                          {freelancer.avatar}
                        </div>
                        
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h4 style={{ margin: '0 0 0.25rem 0' }}>{freelancer.name}</h4>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <span>⭐ {freelancer.rating}</span>
                                <span style={{ color: '#666', fontSize: '0.875rem' }}>({freelancer.reviews} reviews)</span>
                                <span style={{ color: '#28a745', fontSize: '0.875rem' }}>• {freelancer.availability}</span>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: 'bold', color: '#007bff' }}>{freelancer.price}</div>
                            </div>
                          </div>
                          
                          <p style={{ margin: '0.5rem 0', fontSize: '0.875rem', color: '#666' }}>
                            {freelancer.description}
                          </p>
                          
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {freelancer.specialties.map(specialty => (
                              <span 
                                key={specialty}
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  backgroundColor: '#e9ecef',
                                  borderRadius: '12px',
                                  fontSize: '0.75rem',
                                  color: '#495057'
                                }}
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Summary & Submit */}
        {selectedFreelancer && (
          <div className="card mt-4">
            <h3>📋 Booking Summary</h3>
            <div className="row">
              <div className="col-md-8">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div><strong>Service:</strong> {selectedService}</div>
                  <div><strong>Freelancer:</strong> {selectedFreelancerData?.name}</div>
                  <div><strong>Date & Time:</strong> {selectedDate ? new Date(selectedDate).toLocaleString() : 'Not selected'}</div>
                  <div><strong>Estimated Duration:</strong> {estimatedHours} hours</div>
                  <div><strong>Hourly Rate:</strong> ${selectedFreelancerData?.hourlyRate}/hr</div>
                </div>
              </div>
              <div className="col-md-4 text-center">
                <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Estimated Total</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>${estimatedCost}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>+ any materials</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-4">
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}
            disabled={!selectedService || !selectedFreelancer || !selectedDate || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading"></span>
                <span style={{ marginLeft: '0.5rem' }}>Processing Booking...</span>
              </>
            ) : (
              '🎯 Confirm Booking'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Booking;