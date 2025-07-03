import React from 'react';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import FreelancerDashboard from './pages/FreelancerDashboard';
import Booking from './pages/Booking';
import PhotoUpload from './pages/PhotoUpload';

const clerkFrontendApi = 'YOUR_CLERK_FRONTEND_API'; // Replace with your Clerk frontend API

function App() {
  return (
    <ClerkProvider frontendApi={clerkFrontendApi}>
      <SignedIn>
        <Router>
          <nav>
            <Link to="/">Home</Link> |{' '}
            <Link to="/dashboard">Dashboard</Link> |{' '}
            <Link to="/booking">Booking</Link> |{' '}
            <Link to="/upload">Photo Upload</Link>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<FreelancerDashboard />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/upload" element={<PhotoUpload />} />
          </Routes>
        </Router>
      </SignedIn>
      <SignedOut>
        <Login />
      </SignedOut>
    </ClerkProvider>
  );
}

export default App;
