import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Header.tsx';
import Room from '../room/Room.tsx';
import ThemeProvider from './ThemeProvider.tsx';
import { RECHECK_MS, THEME_STORAGE_KEY } from './dayNight.ts';

const html = () => document.documentElement.dataset.theme;

function renderSite() {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <Header />
        <Room />
      </ThemeProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  sessionStorage.clear();
  vi.useFakeTimers({
    toFake: ['Date', 'setInterval', 'clearInterval', 'setTimeout', 'clearTimeout'],
  });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  delete document.documentElement.dataset.theme;
});

describe('ThemeProvider', () => {
  it('uses the local time when there is no manual choice', () => {
    vi.setSystemTime(new Date(2026, 10, 13, 12, 0));
    renderSite();
    expect(html()).toBe('day');
    cleanup();

    vi.setSystemTime(new Date(2026, 10, 13, 21, 0));
    renderSite();
    expect(html()).toBe('night');
  });

  it("uses this visit's manual choice from sessionStorage", () => {
    vi.setSystemTime(new Date(2026, 10, 13, 12, 0));
    sessionStorage.setItem(THEME_STORAGE_KEY, 'night');
    renderSite();
    expect(html()).toBe('night');
  });

  it('re-checks the time every 5 minutes', () => {
    vi.setSystemTime(new Date(2026, 10, 13, 17, 58));
    renderSite();
    expect(html()).toBe('day');

    act(() => {
      vi.advanceTimersByTime(RECHECK_MS);
    });
    expect(html()).toBe('night');
  });

  it('never overrides a manual choice when re-checking', () => {
    vi.setSystemTime(new Date(2026, 10, 13, 17, 58));
    renderSite();
    fireEvent.click(screen.getByRole('button', { name: 'Switch to night' }));
    fireEvent.click(screen.getByRole('button', { name: 'Switch to day' }));
    expect(html()).toBe('day');
    expect(sessionStorage.getItem(THEME_STORAGE_KEY)).toBe('day');

    act(() => {
      vi.advanceTimersByTime(RECHECK_MS * 3);
    });
    expect(html()).toBe('day');
  });
});

describe('header toggle and wall switch share one theme', () => {
  it('the wall switch updates the header icon', () => {
    vi.setSystemTime(new Date(2026, 10, 13, 12, 0));
    renderSite();
    const wallSwitch = screen.getByRole('button', { name: 'Light switch' });
    expect(wallSwitch.getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(wallSwitch);
    expect(html()).toBe('night');
    expect(wallSwitch.getAttribute('aria-pressed')).toBe('false');
    expect(wallSwitch.querySelector('svg')?.dataset.on).toBe('false');
    expect(screen.getByRole('button', { name: 'Switch to day' })).toBeDefined();
  });

  it('the header toggle flips the wall switch', () => {
    vi.setSystemTime(new Date(2026, 10, 13, 21, 0));
    renderSite();
    const wallSwitch = screen.getByRole('button', { name: 'Light switch' });
    expect(wallSwitch.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(screen.getByRole('button', { name: 'Switch to day' }));
    expect(html()).toBe('day');
    expect(wallSwitch.getAttribute('aria-pressed')).toBe('true');
    expect(wallSwitch.querySelector('svg')?.dataset.on).toBe('true');
  });

  it("Ollie's switch line follows the lights", () => {
    vi.setSystemTime(new Date(2026, 10, 13, 12, 0));
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('reduce'),
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    renderSite();
    const wallSwitch = screen.getByRole('button', { name: 'Light switch' });
    fireEvent.mouseEnter(wallSwitch);
    expect(screen.getByTestId('speech-bubble').textContent).toBe('Lights on!');

    fireEvent.click(wallSwitch);
    expect(screen.getByTestId('speech-bubble').textContent).toBe('Lights off…');
    vi.unstubAllGlobals();
  });
});
