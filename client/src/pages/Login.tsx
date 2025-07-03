import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      alert('Login functionality will be implemented with Clerk authentication');
    }, 1000);
  };

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: 'center', minHeight: '80vh', alignItems: 'center' }}>
        <div className="col-md-6">
          <div className="card">
            <div className="text-center mb-4">
              <h2>Welcome Back</h2>
              <p>Sign in to your account to continue</p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading"></span>
                    <span style={{ marginLeft: '0.5rem' }}>Signing in...</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
            
            <div className="text-center mt-4">
              <p>Don't have an account? <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Sign up here</Link></p>
              <p><Link to="/forgot-password" style={{ color: '#6c757d', textDecoration: 'none' }}>Forgot your password?</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;