import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Signup.css';

interface SignupFormData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  userType: 'client' | 'freelancer';
  mpesaNumber?: string;
  serviceCategories?: string[];
  termsAccepted: boolean;
}

const serviceOptions = [
  'Cleaning',
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Gardening',
  'Appliance Repair',
  'Beauty & Wellness',
  'Tutoring',
  'Photography',
  'Catering',
  'Event Planning'
];

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    userType: 'client',
    mpesaNumber: '',
    serviceCategories: [],
    termsAccepted: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleServiceCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      serviceCategories: prev.serviceCategories?.includes(category)
        ? prev.serviceCategories.filter(c => c !== category)
        : [...(prev.serviceCategories || []), category]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.userType === 'freelancer' && (!formData.serviceCategories || formData.serviceCategories.length === 0)) {
      setError('Please select at least one service category');
      return;
    }

    if (!formData.termsAccepted) {
      setError('Please accept the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          userType: formData.userType,
          mpesaNumber: formData.mpesaNumber,
          serviceCategories: formData.serviceCategories,
          termsAccepted: formData.termsAccepted
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Use the login function from AuthContext
        login(data.token, data.user);
        
        // Redirect to intended destination or appropriate dashboard
        const from = location.state?.from;
        if (from) {
          navigate(from);
        } else if (data.user.userType === 'freelancer') {
          navigate('/freelancer-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Account Type</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
              required
            >
              <option value="client">Client</option>
              <option value="freelancer">Freelancer</option>
            </select>
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          {formData.userType === 'freelancer' && (
            <div className="form-group">
              <label>M-Pesa Number</label>
              <input
                type="tel"
                name="mpesaNumber"
                value={formData.mpesaNumber}
                onChange={handleInputChange}
                placeholder="e.g., 254712345678"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          {formData.userType === 'freelancer' && (
            <div className="form-group">
              <label>Service Categories</label>
              <div className="service-categories">
                {serviceOptions.map(category => (
                  <label key={category} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.serviceCategories?.includes(category) || false}
                      onChange={() => handleServiceCategoryChange(category)}
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                required
              />
              I accept the <a href="/terms" target="_blank">Terms and Conditions</a>
            </label>
          </div>

          <button type="submit" disabled={loading} className="signup-btn">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;