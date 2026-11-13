import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App.tsx';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  // jsdom does not implement scrolling.
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('routes', () => {
  it.each([
    ['/', "Hi, I'm Kim."],
    ['/projects', 'Projects'],
    ['/about', 'About me'],
    ['/beyond', 'Beyond code'],
    ['/contact', 'Say hi'],
  ])('%s renders its H1', (path, title) => {
    renderAt(path);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(title);
  });

  it('renders the 404 page for unknown paths', () => {
    renderAt('/no-such-page');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(
      /^Oops, (Kiwi|Moon|Tho) buried this page\.$/,
    );
  });
});

describe('header', () => {
  it('marks the current page link as active', () => {
    renderAt('/about');
    const link = screen.getByRole('link', { name: 'About' });
    expect(link.getAttribute('aria-current')).toBe('page');
  });

  it('links the CV button to the PDF as a download', () => {
    renderAt('/');
    const cv = screen.getByRole('link', { name: 'Fetch CV' });
    expect(cv.getAttribute('href')).toBe('/Kim_Ngan_Tran_CV.pdf');
    expect(cv.hasAttribute('download')).toBe(true);
  });

  it('opens the menu and closes it on Escape and on route change', () => {
    renderAt('/');
    const button = screen.getByRole('button', { name: 'Menu' });
    expect(button.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);

    fireEvent.click(button);
    const mainNav = screen.getByRole('navigation', { name: 'Main' });
    fireEvent.click(within(mainNav).getByRole('link', { name: 'Projects' }));
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Projects');
  });
});

describe('CV links', () => {
  it('points the header button and the home quick link to the PDF as downloads', () => {
    renderAt('/');
    const cvLinks = [
      screen.getByRole('link', { name: 'Fetch CV' }),
      screen.getByRole('link', { name: 'CV (PDF)' }),
    ];
    for (const link of cvLinks) {
      expect(link.getAttribute('href')).toBe('/Kim_Ngan_Tran_CV.pdf');
      expect(link.hasAttribute('download')).toBe(true);
    }
  });

  it('has no CV link on the Contact page outside the header', () => {
    renderAt('/contact');
    const main = document.querySelector('main')!;
    expect(main.querySelector('a[href="/Kim_Ngan_Tran_CV.pdf"]')).toBeNull();
  });
});

describe('home', () => {
  it('renders the hero and the "In a hurry?" links', () => {
    renderAt('/');
    expect(screen.getByText('tech-curious').tagName).toBe('MARK');
    expect(
      screen.getByText('Software engineering, AI and a hospitality background · Helsinki'),
    ).toBeDefined();
    const quick = screen.getByRole('navigation', { name: 'In a hurry?' });
    const labels = [...quick.querySelectorAll('a')].map((a) => a.textContent);
    expect(labels).toEqual(['Projects', 'CV (PDF)', 'LinkedIn ↗', 'GitHub ↗', 'Email']);
  });
});
