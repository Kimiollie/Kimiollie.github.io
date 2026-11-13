import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import App from './App.tsx';

afterEach(() => {
  cleanup();
});

describe('App', () => {
  it('renders the heading', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toBe("Hello from Ollie's House");
  });
});
