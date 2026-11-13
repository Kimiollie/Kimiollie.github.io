import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Room from './Room.tsx';
import { ROOM_ITEMS, depthScale, itemBox } from './room.config.ts';

function renderRoom(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Room />
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('room config', () => {
  it('scales from 0.62 at the back wall to 1 at the front edge', () => {
    expect(depthScale(480)).toBeCloseTo(0.62);
    expect(depthScale(768)).toBeCloseTo(1);
    expect(depthScale(624)).toBeCloseTo(0.81);
  });

  it('anchors item boxes at their bottom-centre', () => {
    for (const item of ROOM_ITEMS) {
      const box = itemBox(item);
      expect(box.left + box.width / 2).toBeCloseTo(item.x);
      expect(box.top + box.height).toBeCloseTo(item.y);
    }
  });

  it('depth-scales floor items only', () => {
    const desk = ROOM_ITEMS.find((item) => item.id === 'projects')!;
    const frame = ROOM_ITEMS.find((item) => item.id === 'about')!;
    expect(itemBox(desk).height).toBeCloseTo(desk.h * depthScale(desk.y));
    expect(itemBox(frame).height).toBe(frame.h);
  });
});

describe('Room', () => {
  it('renders the items as named links and a light switch button', () => {
    renderRoom();
    const room = screen.getByRole('region', { name: "Ollie's House" });
    expect(room).toBeDefined();

    const links: [string, string][] = [
      ['Projects', '/projects'],
      ['About', '/about'],
      ['Beyond code', '/beyond'],
      ['Contact', '/contact'],
      ['CV (PDF)', '/Kim_Ngan_Tran_CV.pdf'],
    ];
    for (const [name, href] of links) {
      expect(screen.getByRole('link', { name }).getAttribute('href')).toBe(href);
    }
    expect(screen.getByRole('link', { name: 'CV (PDF)' }).hasAttribute('download')).toBe(true);
    expect(screen.getByRole('button', { name: 'Light switch' })).toBeDefined();
  });

  it('stacks items by depth (zIndex = y)', () => {
    renderRoom();
    const easel = screen.getByRole('link', { name: 'Beyond code' });
    expect(easel.style.zIndex).toBe('705');
  });

  it('shows the debug overlay only with ?debug, and reports clicked image coordinates', () => {
    renderRoom('/');
    expect(screen.queryByTestId('room-debug')).toBeNull();
    cleanup();

    vi.spyOn(console, 'log').mockImplementation(() => {});
    renderRoom('/?debug');
    expect(screen.getByTestId('room-debug')).toBeDefined();

    const room = screen.getByRole('region', { name: "Ollie's House" });
    vi.spyOn(room, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 688,
      height: 384,
    } as DOMRect);
    fireEvent.click(room, { clientX: 344, clientY: 192 });
    expect(screen.getByText('x 688, y 384')).toBeDefined();
    expect(console.log).toHaveBeenCalledWith('[room] x 688, y 384');
  });
});

describe('wall portrait', () => {
  it('shows the portrait inside the frame, in black and white until hover', () => {
    renderRoom();
    const about = screen.getByRole('link', { name: 'About' });
    const portrait = about.querySelector('img')!;
    expect(portrait.getAttribute('alt')).toBe('Portrait of Kim hugging Ollie');

    // The frame box is 848–904 × 304–368; the inner area is 857–896 × 313–361.
    expect(parseFloat(portrait.style.left)).toBeCloseTo((9 / 56) * 100);
    expect(parseFloat(portrait.style.top)).toBeCloseTo((9 / 64) * 100);
    expect(parseFloat(portrait.style.width)).toBeCloseTo((39 / 56) * 100);
    expect(parseFloat(portrait.style.height)).toBeCloseTo((48 / 64) * 100);
  });
});

describe('Ollie in the room', () => {
  it('starts sitting in the dog bed', () => {
    renderRoom();
    const ollie = screen.getByTestId('ollie');
    expect(ollie.dataset.sprite).toBe('sit');
    expect(ollie.style.zIndex).toBe('585');
    expect(ollie.getAttribute('aria-hidden')).toBe('true');
  });

  it('has debug walk buttons only in ?debug mode', () => {
    renderRoom('/');
    expect(screen.queryByRole('button', { name: 'Walk home' })).toBeNull();
    cleanup();

    renderRoom('/?debug');
    expect(screen.getByRole('button', { name: 'Walk to projects' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Walk home' })).toBeDefined();
  });

  it('jumps to the target with prefers-reduced-motion', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('reduce'),
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    renderRoom('/?debug');
    fireEvent.click(screen.getByRole('button', { name: 'Walk to contact' }));

    const ollie = screen.getByTestId('ollie');
    expect(ollie.dataset.sprite).toBe('sit');
    expect(ollie.style.zIndex).toBe('655');
    vi.unstubAllGlobals();
  });
});
