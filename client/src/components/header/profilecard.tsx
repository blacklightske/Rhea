import React from 'react';

interface ProfileCardProps {
  name?: string;
  rating?: number;
  avatar?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  name = "John Doe", 
  rating = 4.5, 
  avatar = "JD" 
}) => {
  return (
    <div className="card" style={{ maxWidth: '300px', margin: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#007bff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {avatar}
        </div>
        <div>
          <h4 style={{ margin: '0 0 0.25rem 0' }}>{name}</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>⭐</span>
            <span>{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;