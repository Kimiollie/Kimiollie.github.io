import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App.tsx';
import Room from './room/Room.tsx';

const ROUTES = ['/', '/projects', '/about', '/beyond', '/contact', '/no-such-page'];

async function renderRoute(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
  await screen.findByRole('heading', { level: 1 });
}

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe.each(ROUTES)('%s', (path) => {
  it('starts with a skip link to the main content', async () => {
    await renderRoute(path);
    const skip = screen.getByRole('link', { name: 'Skip to content' });
    expect(skip.getAttribute('href')).toBe('#main');
    const main = screen.getByRole('main');
    expect(main.id).toBe('main');
    expect(main.getAttribute('tabindex')).toBe('-1');
    // It is the first link on the page.
    expect(document.querySelector('a')).toBe(skip);
  });

  it('has the page landmarks and exactly one H1', async () => {
    await renderRoute(path);
    expect(screen.getAllByRole('banner')).toHaveLength(1);
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeDefined();
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getAllByRole('contentinfo')).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('gives every image an alt attribute (empty only for decorative ones)', async () => {
    await renderRoute(path);
    for (const img of document.querySelectorAll('img')) {
      expect(img.hasAttribute('alt')).toBe(true);
    }
  });
});

describe('room keyboard access', () => {
  it('names the room and lets every item be reached by Tab with an aria-label', () => {
    render(
      <MemoryRouter>
        <Room random={() => 0.9} />
      </MemoryRouter>,
    );
    const room = screen.getByRole('region', { name: "Ollie's House" });
    const items = [...room.querySelectorAll<HTMLElement>('a, button')];
    expect(items).toHaveLength(6);
    for (const item of items) {
      expect(item.getAttribute('aria-label')).toBeTruthy();
      expect(item.tabIndex).toBe(0);
    }
    // Decorative layers stay hidden from screen readers.
    expect(screen.getByTestId('ollie').getAttribute('aria-hidden')).toBe('true');
  });
});
