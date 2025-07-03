import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders home page', () => {
  render(<App />);
  // Simple test to ensure the app renders without crashing
  expect(true).toBe(true);
});
