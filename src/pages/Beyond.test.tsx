import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import Beyond from './Beyond.tsx';

afterEach(() => {
  cleanup();
});

describe('Beyond code page', () => {
  it('renders 6 hobby tiles', () => {
    render(<Beyond />);
    expect(screen.getAllByTestId('hobby')).toHaveLength(6);
  });

  it('renders 3 friend cards', () => {
    render(<Beyond />);
    const squad = screen.getByRole('region', { name: "Ollie's squad" });
    const cards = squad.querySelectorAll('article');
    expect(cards).toHaveLength(3);
    for (const name of ['Kiwi', 'Moon', 'Tho']) {
      expect(screen.getByRole('heading', { level: 3, name })).toBeDefined();
    }
  });

  it('gives every gallery placeholder an accessible name', () => {
    render(<Beyond />);
    expect(screen.getByRole('img', { name: 'Dog painting 1' })).toBeDefined();
    expect(screen.getByRole('img', { name: 'Ollie photo 3' })).toBeDefined();
  });
});
