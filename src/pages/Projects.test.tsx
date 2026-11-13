import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Projects from './Projects.tsx';

function renderProjects() {
  return render(
    <MemoryRouter>
      <Projects />
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
});

describe('Projects page', () => {
  it('renders 10 project cards', () => {
    renderProjects();
    expect(screen.getAllByRole('article')).toHaveLength(10);
  });

  it('renders the status badges', () => {
    renderProjects();
    // "Live" is also a link label on Metrade, so ignore matches inside links.
    const badgeTexts = ['In progress', 'Live', 'This site'].map((status) =>
      screen.getAllByText(status).filter((element) => !element.closest('a')),
    );
    for (const matches of badgeTexts) {
      expect(matches).toHaveLength(1);
    }
  });

  it('opens external links safely in a new tab', () => {
    renderProjects();
    const external = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('http'));

    expect(external.length).toBeGreaterThan(0);
    for (const link of external) {
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
      expect(link.getAttribute('target')).toBe('_blank');
    }
  });

  it('lists the 3 more projects', () => {
    renderProjects();
    const section = screen.getByRole('region', { name: 'More projects' });
    expect(section.querySelectorAll('li')).toHaveLength(3);
  });
});
