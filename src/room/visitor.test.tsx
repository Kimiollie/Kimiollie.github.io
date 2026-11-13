import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../pages/NotFound.tsx';
import Room from './Room.tsx';
import { pickFriend, pickVisitor, visitorBox } from './visitor.ts';
import {
  FRIEND_VISIT,
  OLLIE_HEIGHT,
  greetSpot,
  ROOM_ITEMS,
  ROOM_W,
  depthScale,
  friendHeight,
  itemBox,
} from './room.config.ts';
import { walkTargetFor } from './poseLayout.ts';

/** Dice that return the given rolls in order (then repeat the last one). */
function dice(...rolls: number[]) {
  let i = 0;
  return vi.fn(() => rolls[Math.min(i++, rolls.length - 1)]);
}

function renderRoom(random: () => number) {
  return render(
    <MemoryRouter>
      <Room random={random} />
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
});

describe('pickVisitor', () => {
  it('brings a friend when the roll is below 1/2, and nobody otherwise', () => {
    expect(pickVisitor(dice(0.49, 0))?.id).toBe('kiwi');
    expect(pickVisitor(dice(0, 0.5))?.id).toBe('moon');
    expect(pickVisitor(dice(0.1, 0.99))?.id).toBe('tho');
    expect(pickVisitor(dice(0.5))).toBeNull();
    expect(pickVisitor(dice(0.9))).toBeNull();
  });

  it('picks each friend for a third of the range', () => {
    expect(pickFriend(dice(0)).name).toBe('Kiwi');
    expect(pickFriend(dice(0.4)).name).toBe('Moon');
    expect(pickFriend(dice(0.7)).name).toBe('Tho');
  });
});

describe('visiting friend in the room', () => {
  it('appears when the roll is < 1/2, and stays decorative', () => {
    renderRoom(dice(0.2, 0.5));
    const visitor = screen.getByTestId('visiting-friend');
    expect(visitor.dataset.friend).toBe('moon');
    expect(visitor.getAttribute('aria-hidden')).toBe('true');
    expect(visitor.querySelector('a, button, [tabindex]')).toBeNull();
    expect(screen.queryByTestId('speech-bubble')).toBeNull();
  });

  it('does not appear when the roll is >= 1/2', () => {
    renderRoom(dice(0.5));
    expect(screen.queryByTestId('visiting-friend')).toBeNull();
  });

  it('decides once per mount, not on re-render', () => {
    const random = dice(0.1, 0.9);
    const { rerender } = renderRoom(random);
    const calls = random.mock.calls.length;
    rerender(
      <MemoryRouter>
        <Room random={random} />
      </MemoryRouter>,
    );
    fireEvent.mouseEnter(screen.getByRole('link', { name: 'Projects' }));
    expect(random.mock.calls.length).toBe(calls);
    expect(screen.getByTestId('visiting-friend').dataset.friend).toBe('tho');
  });
});

describe('404 page', () => {
  it('shows a friend, their name in the H1 and a link back to the room', () => {
    render(
      <MemoryRouter>
        <NotFound random={dice(0.1)} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Oops, Kiwi buried this page.',
    );
    expect(
      screen.getByRole('img', { name: 'Kiwi, Australian terrier, brown and yellow' }),
    ).toBeDefined();
    const back = screen.getByRole('link', { name: 'Back to the room' });
    expect(back.getAttribute('href')).toBe('/');
  });
});

describe('visitor size', () => {
  it("scales each friend from Ollie's sit height by its size factor", () => {
    expect(friendHeight('kiwi')).toBeCloseTo(OLLIE_HEIGHT.sit * 0.95);
    expect(friendHeight('moon')).toBeCloseTo(OLLIE_HEIGHT.sit * 0.9);
    expect(friendHeight('tho')).toBeCloseTo(OLLIE_HEIGHT.sit * 0.85);
  });

  it('sits on the spot with the depth scale', () => {
    const box = visitorBox('tho');
    const { x, y } = FRIEND_VISIT.spot;
    expect(box.left + box.width / 2).toBeCloseTo(x);
    expect(box.top + box.height).toBeCloseTo(y);
    expect(box.height).toBeCloseTo(friendHeight('tho') * depthScale(y));
  });

  it("stays on the right, clear of the contact item and Ollie's spot there", () => {
    const contact = ROOM_ITEMS.find((item) => item.id === 'contact')!;
    const contactBox = itemBox(contact);
    for (const id of ['kiwi', 'moon', 'tho'] as const) {
      const box = visitorBox(id);
      expect(box.left).toBeGreaterThan(contactBox.left + contactBox.width);
      expect(box.left).toBeGreaterThan(walkTargetFor(contact).x + 100);
      expect(box.left).toBeGreaterThan(ROOM_W / 2);
    }
  });

  it('always shows the chosen friend in ?debug, outlined with its factor', () => {
    render(
      <MemoryRouter initialEntries={['/?debug&friend=tho']}>
        <Room random={dice(0.99)} />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('visiting-friend').dataset.friend).toBe('tho');
    expect(screen.getByTestId('debug-visitor').textContent).toBe('tho ×0.85');
  });
});

function reduceMotion() {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('reduce'),
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}

describe('Ollie greets the visiting friend', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const friendArea = () => screen.getByTestId('visiting-friend').firstElementChild!;

  it('walks over when the friend is hovered', () => {
    renderRoom(dice(0.2, 0.5));
    fireEvent.mouseEnter(friendArea());
    const ollie = screen.getByTestId('ollie');
    expect(ollie.dataset.sprite).toMatch(/^walk_/);
    expect(screen.queryByTestId('speech-bubble')).toBeNull();
  });

  it('sits facing the friend and says hi by name; the friend stays aria-hidden', () => {
    reduceMotion();
    renderRoom(dice(0.2, 0.5));
    fireEvent.mouseEnter(friendArea());

    const ollie = screen.getByTestId('ollie');
    expect(ollie.dataset.sprite).toBe('sit');
    expect(ollie.style.zIndex).toBe(String(greetSpot().y));
    expect(ollie.querySelector('img')!.style.transform).toBe('scaleX(-1)');
    const bubble = screen.getByTestId('speech-bubble');
    expect(bubble.textContent).toBe('Hi, Moon!');
    expect(bubble.textContent).toContain('Moon');
    expect(screen.getByTestId('visiting-friend').getAttribute('aria-hidden')).toBe('true');
  });

  it('greets each friend by their own name', () => {
    reduceMotion();
    renderRoom(dice(0.2, 0.9));
    fireEvent.mouseEnter(friendArea());
    expect(screen.getByTestId('speech-bubble').textContent).toBe('Hi, Tho!');
  });

  it('walks home when the mouse leaves the friend', () => {
    reduceMotion();
    renderRoom(dice(0.2, 0));
    fireEvent.mouseEnter(friendArea());
    fireEvent.mouseLeave(friendArea());
    expect(screen.queryByTestId('speech-bubble')).toBeNull();
    const ollie = screen.getByTestId('ollie');
    expect(ollie.dataset.sprite).toBe('sit');
    expect(ollie.style.zIndex).toBe('585');
    expect(ollie.querySelector('img')!.style.transform).toBe('');
  });

  it('hovering an item instead switches to that item', () => {
    reduceMotion();
    renderRoom(dice(0.2, 0));
    fireEvent.mouseEnter(friendArea());
    fireEvent.mouseEnter(screen.getByRole('link', { name: 'Projects' }));
    expect(screen.getByTestId('ollie-pose').dataset.pose).toBe('laptop');
    expect(screen.getByTestId('speech-bubble').textContent).toBe("Woof! Kim's projects live here.");
  });

  it('greets from a spot clear of the friend, the phone, the ball, the bowl and the switch', () => {
    const spot = greetSpot();
    const height = OLLIE_HEIGHT.sit * depthScale(spot.y);
    const width = (height * 269) / 376; // sit sprite drawing proportions
    const ollie = {
      left: spot.x - width / 2,
      top: spot.y - height,
      right: spot.x + width / 2,
      bottom: spot.y,
    };
    const apart = (a: typeof ollie, b: typeof ollie) =>
      a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top;
    const asRect = (b: { left: number; top: number; width: number; height: number }) => ({
      left: b.left,
      top: b.top,
      right: b.left + b.width,
      bottom: b.top + b.height,
    });

    for (const id of ['kiwi', 'moon', 'tho'] as const) {
      expect(apart(ollie, asRect(visitorBox(id)))).toBe(true);
    }
    for (const id of ['contact', 'cv', 'switch'] as const) {
      expect(apart(ollie, asRect(itemBox(ROOM_ITEMS.find((item) => item.id === id)!)))).toBe(true);
    }
    // The water bowl drawn in the room image (front of the door).
    expect(apart(ollie, { left: 1163, top: 672, right: 1252, bottom: 722 })).toBe(true);
  });
});
