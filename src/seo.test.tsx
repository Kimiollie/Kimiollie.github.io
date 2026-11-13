import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App.tsx';
import indexHtml from '../index.html?raw';
import robots from '../public/robots.txt?raw';
import sitemap from '../public/sitemap.xml?raw';
import readme from '../README.md?raw';

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('page titles', () => {
  it.each([
    ['/', 'Kim Ngan Tran · Software, AI and hospitality'],
    ['/projects', 'Projects · Kim Ngan Tran'],
    ['/about', 'About · Kim Ngan Tran'],
    ['/beyond', 'Beyond code · Kim Ngan Tran'],
    ['/contact', 'Contact · Kim Ngan Tran'],
    ['/nope', 'Page not found · Kim Ngan Tran'],
  ])('%s → "%s"', async (path, title) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>,
    );
    await screen.findByRole('heading', { level: 1 });
    expect(document.title).toBe(title);
    expect(document.title.toLowerCase()).not.toContain('student');
    expect(document.title).not.toContain('Helsinki');
  });
});

describe('index.html', () => {
  const doc = new DOMParser().parseFromString(indexHtml, 'text/html');
  const meta = (attr: string, value: string) =>
    doc.querySelector(`meta[${attr}="${value}"]`)?.getAttribute('content');

  it('has the home title and meta description', () => {
    expect(doc.title).toBe('Kim Ngan Tran · Software, AI and hospitality');
    expect(meta('name', 'description')).toBe(
      'Kim Ngan Tran: software engineering, AI and a hospitality background',
    );
  });

  it('has Open Graph and Twitter tags with absolute URLs', () => {
    expect(meta('property', 'og:image')).toBe('https://kimiollie.github.io/og-image.png');
    expect(meta('property', 'og:url')).toBe('https://kimiollie.github.io/');
    expect(meta('name', 'twitter:card')).toBe('summary_large_image');
    expect(meta('name', 'twitter:image')).toBe('https://kimiollie.github.io/og-image.png');
  });

  it('links the favicon and has day and night theme colours', () => {
    expect(doc.querySelector('link[rel="icon"]')?.getAttribute('href')).toBe('/favicon.svg');
    const colours = [...doc.querySelectorAll('meta[name="theme-color"]')].map((m) => [
      m.getAttribute('content'),
      m.getAttribute('media'),
    ]);
    expect(colours).toEqual([
      ['#fbf8f2', '(prefers-color-scheme: light)'],
      ['#151a2c', '(prefers-color-scheme: dark)'],
    ]);
  });

  it('never mentions Helsinki or "student" in the title, description or sharing tags', () => {
    const texts = [
      doc.title,
      ...[...doc.querySelectorAll('meta')].map((m) => m.getAttribute('content') ?? ''),
    ];
    for (const text of texts) {
      expect(text).not.toContain('Helsinki');
      expect(text.toLowerCase()).not.toContain('student');
    }
  });
});

describe('robots.txt, sitemap.xml and README', () => {
  it('points robots.txt at the sitemap', () => {
    expect(robots).toContain('Sitemap: https://kimiollie.github.io/sitemap.xml');
  });

  it('lists the 5 routes in the sitemap', () => {
    const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    expect(locs).toEqual([
      'https://kimiollie.github.io/',
      'https://kimiollie.github.io/projects',
      'https://kimiollie.github.io/about',
      'https://kimiollie.github.io/beyond',
      'https://kimiollie.github.io/contact',
    ]);
  });

  it('keeps the README free of private files, the dropped script and Helsinki', () => {
    expect(readme).not.toMatch(/PLAN\.md|CLAUDE\.md|cut-items|cutting script|Helsinki/);
    expect(readme).toContain('https://kimiollie.github.io');
  });
});
