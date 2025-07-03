import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Account.css';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  userType: 'freelancer' | 'user';
  serviceCategory?: string;
}

const Account: React.FC = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    location: '',
    userType: 'user',
    serviceCategory: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const serviceCategories = [
    'Cleaning',
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Painting',
    'Gardening',
    'Moving',
    'Tutoring',
    'Photography',
    'Other'
  ];

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        userType: user.userType || 'user',
        serviceCategory: user.serviceCategory || ''
      });
    }
    setLoading(false);
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`http://localhost:3000/api/users/${user?._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading account information...</p>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="account-container">
        <div className="account-header">
          <h1>Account Settings</h1>
          <p>Manage your profile information and preferences</p>
        </div>

        <div className="account-content">
          <div className="profile-section">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div className="avatar-info">
                <h3>{profile.name}</h3>
                <p className="user-type">
                  {profile.userType === 'freelancer' ? 'Freelancer' : 'Client'}
                </p>
                {profile.userType === 'freelancer' && profile.serviceCategory && (
                  <p className="service-category">{profile.serviceCategory}</p>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="account-form">
            {message && (
              <div className="success-message">
                {message}
              </div>
            )}
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={profile.location}
                  onChange={handleInputChange}
                  placeholder="City, State"
                />
              </div>

              <div className="form-group">
                <label htmlFor="userType">Account Type</label>
                <select
                  id="userType"
                  name="userType"
                  value={profile.userType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="user">Client</option>
                  <option value="freelancer">Freelancer</option>
                </select>
              </div>

              {profile.userType === 'freelancer' && (
                <div className="form-group">
                  <label htmlFor="serviceCategory">Service Category</label>
                  <select
                    id="serviceCategory"
                    name="serviceCategory"
                    value={profile.serviceCategory}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {serviceCategories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>

          <div className="danger-zone">
            <h3>Danger Zone</h3>
            <p>These actions cannot be undone</p>
            <div className="danger-actions">
              <button className="danger-btn">Change Password</button>
              <button className="danger-btn delete-btn">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;