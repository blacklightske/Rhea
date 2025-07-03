import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ServiceFreeLancer.css';

const ServiceFreelancers = () => {
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const [uploads, setUploads] = useState<Uploads>({});

  interface Review {
    id: number;
    text: string;
    stars: number;
  }

  interface Freelancer {
    id: number;
    name: string;
    profilePhoto: string;
    rating: number;
    expertise: string | undefined;
    fee: number;
    reviews: Review[];
  }

  interface Uploads {
    [id: number]: {
      before?: string;
      after?: string;
    };
  }

  type UploadType = 'before' | 'after';

  const freelancers: Freelancer[] = [
    {
      id: 1,
      name: 'John Doe',
      profilePhoto: 'https://randomuser.me/api/portraits/men/31.jpg',
      rating: 4.5,
      expertise: serviceName,
      fee: 2000,
      reviews: [
        { id: 1, text: 'Great work!', stars: 5 },
        { id: 2, text: 'Very professional', stars: 4 }
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      profilePhoto: 'https://randomuser.me/api/portraits/women/45.jpg',
      rating: 4.8,
      expertise: serviceName,
      fee: 2500,
      reviews: [
        { id: 1, text: 'Super friendly and efficient', stars: 5 }
      ]
    }
  ];

  const handleUpload = (id: number, type: UploadType, file: File) => {
    setUploads(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [type]: URL.createObjectURL(file)
      }
    }));
  };

  const handleHire = (freelancer: Freelancer) => {
    // Option 1: Navigate with query params
    navigate(`/booking?freelancerId=${freelancer.id}&name=${encodeURIComponent(freelancer.name)}&fee=${freelancer.fee}`);

    // Option 2 (better): navigate with state
    // navigate('/booking', { state: { freelancer } });
  };

  return (
    <div className="freelancers-container">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Home
      </button>
      <h2>{decodeURIComponent(serviceName ?? '')} Freelancers</h2>

      {freelancers.map(f => (
        <div key={f.id} className="freelancer-card">
          <img src={f.profilePhoto} alt={f.name} className="freelancer-photo" />
          <div className="freelancer-info">
            <h3>{f.name}</h3>
            <p>Expertise: {f.expertise}</p>
            <p>Fee: KES {f.fee}</p>
            <p>Rating: {'⭐'.repeat(Math.floor(f.rating))} ({f.rating})</p>

            <div className="review-section">
              <strong>Client Reviews:</strong>
              <ul>
                {f.reviews.map(r => (
                  <li key={r.id}>
                    {'⭐'.repeat(r.stars)} - {r.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="image-upload-section">
              <label>
                Before Image:
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      handleUpload(f.id, 'before', e.target.files[0]);
                    }
                  }}
                />
              </label>
              <label>
                After Image:
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      handleUpload(f.id, 'after', e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>

            <div className="image-preview">
              {uploads[f.id]?.before && <img src={uploads[f.id].before} alt="Before" />}
              {uploads[f.id]?.after && <img src={uploads[f.id].after} alt="After" />}
            </div>

            <div className="freelancer-buttons">
              <button className="hire-btn" onClick={() => handleHire(f)}>Hire</button>
              <button className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceFreelancers;
