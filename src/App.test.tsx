import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
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
    ['/no-such-page', 'Page not found'],
  ])('%s renders its H1', (path, title) => {
    renderAt(path);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(title);
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
    fireEvent.click(screen.getByRole('link', { name: 'Projects' }));
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Projects');
  });
});
