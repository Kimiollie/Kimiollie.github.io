import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../pages/NotFound.tsx';
import Room from './Room.tsx';
import { pickFriend, pickVisitor, visitorBox } from './visitor.ts';
import {
  FRIEND_VISIT,
  OLLIE_HEIGHT,
  ROOM_ITEMS,
  ROOM_W,
  depthScale,
  friendHeight,
  itemBox,
  walkTarget,
} from './room.config.ts';

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
  it('appears when the roll is < 1/2: decorative, with a name bubble on hover', () => {
    renderRoom(dice(0.2, 0.5));
    const visitor = screen.getByTestId('visiting-friend');
    expect(visitor.dataset.friend).toBe('moon');
    expect(visitor.getAttribute('aria-hidden')).toBe('true');
    expect(visitor.querySelector('a, button, [tabindex]')).toBeNull();
    expect(screen.queryByText('Moon is visiting!')).toBeNull();

    fireEvent.mouseEnter(visitor.firstElementChild!);
    expect(screen.getByText('Moon is visiting!')).toBeDefined();
    fireEvent.mouseLeave(visitor.firstElementChild!);
    expect(screen.queryByText('Moon is visiting!')).toBeNull();
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
      expect(box.left).toBeGreaterThan(walkTarget(contact).x + 100);
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
