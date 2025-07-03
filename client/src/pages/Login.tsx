import React from 'react';

const Login = () => (
  <div>
    <h2>Login</h2>
    <form style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="email">Email:</label>
        <input 
          type="email" 
          id="email" 
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="password">Password:</label>
        <input 
          type="password" 
          id="password" 
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
        />
      </div>
      <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
        Login
      </button>
    </form>
  </div>
);

export default Login;