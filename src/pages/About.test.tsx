import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import About from './About.tsx';
import { badges } from '../content/about.ts';

afterEach(() => {
  cleanup();
});

describe('About page', () => {
  it('renders 6 timeline entries', () => {
    render(<About />);
    const timeline = screen.getByRole('region', { name: 'Timeline' });
    expect(timeline.querySelectorAll('li')).toHaveLength(6);
  });

  it('renders 3 fact tiles', () => {
    render(<About />);
    expect(screen.getAllByTestId('fact')).toHaveLength(3);
  });

  it('links each badge with a verify URL safely, named by name and issuer', () => {
    render(<About />);
    const withUrl = badges.filter((badge) => badge.verifyUrl);
    expect(withUrl).toHaveLength(3);

    for (const badge of withUrl) {
      const link = screen.getByRole('link', { name: `${badge.name}, ${badge.issuer}` });
      expect(link.getAttribute('href')).toBe(badge.verifyUrl);
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
      expect(link.getAttribute('target')).toBe('_blank');
    }
  });

  it('does not link a badge that has no verify URL', () => {
    render(<About />);
    expect(
      screen.queryByRole('link', { name: 'Ethical Hacker, Cisco Networking Academy' }),
    ).toBeNull();
    expect(
      screen.getByRole('img', { name: 'Ethical Hacker, Cisco Networking Academy' }),
    ).toBeDefined();
  });
});
