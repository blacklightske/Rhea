import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const Login = () => (
  <div>
    <SignIn path="/login" routing="path" />
  </div>
);

export default Login;