import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../pages/NotFound.tsx';
import Room from './Room.tsx';
import { pickFriend, pickVisitor } from './visitor.ts';

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
  it('sits at the same height as Ollie', async () => {
    const { FRIEND_VISIT, OLLIE_HEIGHT } = await import('./room.config.ts');
    for (const height of Object.values(FRIEND_VISIT.height)) {
      expect(height).toBe(OLLIE_HEIGHT.sit);
    }
  });
});
