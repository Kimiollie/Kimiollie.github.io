import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Beyond from './Beyond.tsx';

function renderPage() {
  return render(
    <MemoryRouter>
      <Beyond />
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
});

describe('Beyond code page', () => {
  it('renders 6 hobby tiles', () => {
    renderPage();
    expect(screen.getAllByTestId('hobby')).toHaveLength(6);
  });

  it('renders 3 friend cards', () => {
    renderPage();
    const squad = screen.getByRole('region', { name: "Ollie's squad" });
    const cards = squad.querySelectorAll('article');
    expect(cards).toHaveLength(3);
    for (const name of ['Kiwi', 'Moon', 'Tho']) {
      expect(screen.getByRole('heading', { level: 3, name })).toBeDefined();
    }
  });

  it('gives every gallery placeholder an accessible name', () => {
    renderPage();
    expect(screen.getByRole('img', { name: 'Dog painting 1' })).toBeDefined();
    expect(screen.getByRole('img', { name: 'Ollie photo 3' })).toBeDefined();
  });
});
