import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import Home from '../pages/Home.tsx';
import MobileRoom, { POSE_FLASH_MS } from './MobileRoom.tsx';

function Where() {
  return <p data-testid="where">{useLocation().pathname}</p>;
}

function renderMobile() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="*" element={<MobileRoom />} />
      </Routes>
      <Where />
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const card = (id: string) => document.querySelector<HTMLAnchorElement>(`[data-card="${id}"]`)!;

describe('MobileRoom', () => {
  it("shows Ollie's speech bubble and five cards in order, CV last and full width", () => {
    renderMobile();
    expect(
      screen.getByText("Hi! I'm Ollie. Tap something and I'll show you around."),
    ).toBeDefined();
    const ids = [...document.querySelectorAll('[data-card]')].map((el) =>
      el.getAttribute('data-card'),
    );
    expect(ids).toEqual(['projects', 'about', 'beyond', 'contact', 'cv']);
    expect(card('cv').closest('li')!.className).toMatch(/wide/);
  });

  it('cards have a name and a one-line description from content', () => {
    renderMobile();
    expect(card('projects').textContent).toBe("ProjectsWoof! Kim's projects live here.");
    expect(card('contact').textContent).toBe('ContactRing ring! Say hi to Kim!');
    expect(card('cv').getAttribute('href')).toBe('/Kim_Ngan_Tran_CV.pdf');
    expect(card('cv').hasAttribute('download')).toBe(true);
  });

  it('uses the wall phone for Contact, not the mailbox', () => {
    renderMobile();
    const images = [...card('contact').querySelectorAll('img')].map((img) =>
      img.getAttribute('src'),
    );
    expect(images.some((src) => src?.includes('phone_c'))).toBe(true);
    expect(screen.getByTestId('pose-contact').getAttribute('src')).toMatch(/phone/);
    expect(images.join(' ')).not.toMatch(/mailbox/);
  });

  it("tapping a card shows Ollie's pose for 0.7 s, then navigates", () => {
    vi.useFakeTimers();
    renderMobile();
    fireEvent.click(card('beyond'));

    expect(card('beyond').dataset.posing).toBe('true');
    expect(screen.getByTestId('where').textContent).toBe('/');

    act(() => {
      vi.advanceTimersByTime(POSE_FLASH_MS - 1);
    });
    expect(screen.getByTestId('where').textContent).toBe('/');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByTestId('where').textContent).toBe('/beyond');
  });

  it('downloads the CV after the pose', () => {
    vi.useFakeTimers();
    renderMobile();
    const cv = card('cv');
    const clicks = vi.fn();
    cv.addEventListener('click', clicks);

    fireEvent.click(cv);
    expect(clicks).toHaveBeenCalledTimes(1);
    act(() => {
      vi.advanceTimersByTime(POSE_FLASH_MS);
    });
    // The delayed second click is the real download, let through untouched.
    expect(clicks).toHaveBeenCalledTimes(2);
    expect(clicks.mock.calls[1][0].defaultPrevented).toBe(false);
  });

  it('lets Cmd/Ctrl-click open a new tab straight away', () => {
    renderMobile();
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, metaKey: true });
    card('about').dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(card('about').dataset.posing).toBeUndefined();
  });
});

describe('Home below 820px', () => {
  it('shows the mobile cards instead of the room: no visiting friend, no editor', () => {
    render(
      <MemoryRouter initialEntries={['/?edit&debug&friend=tho']}>
        <Home />
      </MemoryRouter>,
    );
    expect(document.querySelector('[data-card="projects"]')).not.toBeNull();
    expect(screen.queryByTestId('visiting-friend')).toBeNull();
    expect(screen.queryByTestId('edit-room')).toBeNull();
    expect(screen.queryByTestId('ollie')).toBeNull();
  });
});
