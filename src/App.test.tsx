import { render, screen } from '@testing-library/react';
import App from './App';

test('renders desktop fallback message when not on a mobile device', () => {
  render(<App />);
  expect(
    screen.getByText(/open this page on a mobile device/i)
  ).toBeInTheDocument();
});
