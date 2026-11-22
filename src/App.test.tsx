import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Z-score chart heading', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /z-score line chart/i })).toBeInTheDocument();
});
