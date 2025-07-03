import React from 'react';
import './FreelancerCard.css';

interface Freelancer {
  name: string;
  expertise: string;
  fee: number;
  profilePhoto: string;
  rating: number;
  reviews: string[];
  isHired: boolean;
}

interface FreelancerCardProps {
  freelancer: Freelancer;
  onHire: () => void;
  onDrop: () => void;
}

const FreelancerCard: React.FC<FreelancerCardProps> = ({ freelancer, onHire, onDrop }) => {
  const {
    name,
    expertise,
    fee,
    profilePhoto,
    rating,
    reviews,
    isHired
  } = freelancer;

  return (
    <div className="freelancer-card">
      <img src={profilePhoto} alt={`${name}'s profile`} className="profile-photo" />
      <div className="freelancer-info">
        <h2>{name}</h2>
        <p className="expertise">{expertise}</p>
        <p className="fee">Fee: KES {fee}</p>
        <div className="rating">
          <span>{'⭐'.repeat(Math.floor(rating))}</span>
          <span className="rating-number">({(Number(rating) || 0).toFixed(1)})</span>
        </div>
        <div className="reviews">
          <h4>Client Reviews:</h4>
          <ul>
            {reviews.map((review, index) => (
              <li key={index}>"{review}"</li>
            ))}
          </ul>
        </div>
        <div className="actions">
          <button onClick={onHire} disabled={isHired}>Hire</button>
          <button onClick={onDrop} disabled={!isHired}>Drop Hire</button>
        </div>
      </div>
    </div>
  );
};

export default FreelancerCard;
