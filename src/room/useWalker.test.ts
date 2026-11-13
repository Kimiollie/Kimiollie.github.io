import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { WALK } from './room.config.ts';
import { controlPoint, curveLength, easeInOut, quadPoint, useWalker } from './useWalker.ts';

const from = { x: 688, y: 585 };
const to = { x: 1005, y: 655 };

describe('path maths', () => {
  it('starts at the start and ends at the target', () => {
    const c = controlPoint(from, to);
    expect(quadPoint(from, c, to, 0)).toEqual(from);
    const end = quadPoint(from, c, to, 1);
    expect(end.x).toBeCloseTo(to.x);
    expect(end.y).toBeCloseTo(to.y);
  });

  it('passes the midpoint below the straight line (dips towards the viewer)', () => {
    const c = controlPoint(from, to);
    const mid = quadPoint(from, c, to, 0.5);
    const straightMid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };

    expect(mid.x).toBeCloseTo(straightMid.x);
    expect(mid.y).toBeGreaterThan(straightMid.y);
    // Midpoint of a quadratic curve = ¼ start + ½ control + ¼ end.
    expect(mid.y).toBeCloseTo(0.25 * from.y + 0.5 * c.y + 0.25 * to.y);
  });

  it('limits the dip and keeps it inside the room', () => {
    const far = controlPoint({ x: 0, y: 760 }, { x: 1376, y: 760 });
    expect(far.y).toBeLessThanOrEqual(758);
    const c = controlPoint({ x: 0, y: 500 }, { x: 1376, y: 500 });
    expect(c.y - 500).toBe(WALK.maxDip);
  });

  it('eases in and out', () => {
    expect(easeInOut(0)).toBe(0);
    expect(easeInOut(0.5)).toBe(0.5);
    expect(easeInOut(1)).toBe(1);
    expect(easeInOut(0.1)).toBeLessThan(0.1);
    expect(easeInOut(0.9)).toBeGreaterThan(0.9);
  });

  it('measures a curve at least as long as the straight line', () => {
    const c = controlPoint(from, to);
    expect(curveLength(from, c, to)).toBeGreaterThanOrEqual(
      Math.hypot(to.x - from.x, to.y - from.y),
    );
  });
});

describe('useWalker', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('walks to the target, faces the way it moves, then stops', () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
    const { result } = renderHook(() => useWalker(from));
    expect(result.current.isWalking).toBe(false);

    act(() => result.current.walkTo({ x: 300, y: 600 }));
    expect(result.current.isWalking).toBe(true);
    expect(result.current.direction).toBe('left');

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.isWalking).toBe(false);
    expect(result.current.position.x).toBeCloseTo(300);
    expect(result.current.position.y).toBeCloseTo(600);
  });

  it('restarts from the current position when given a new target mid-walk', () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
    const { result } = renderHook(() => useWalker(from));

    act(() => result.current.walkTo({ x: 1200, y: 600 }));
    act(() => {
      vi.advanceTimersByTime(600);
    });
    const midWalk = result.current.position;
    expect(midWalk.x).toBeGreaterThan(from.x);
    expect(midWalk.x).toBeLessThan(1200);

    act(() => result.current.walkTo({ x: 200, y: 700 }));
    act(() => {
      vi.advanceTimersByTime(20);
    });
    expect(result.current.direction).toBe('left');
    expect(Math.abs(result.current.position.x - midWalk.x)).toBeLessThan(10);
  });

  it('jumps instantly with prefers-reduced-motion', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('reduce'),
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    const { result } = renderHook(() => useWalker(from));

    act(() => result.current.walkTo(to));
    expect(result.current.isWalking).toBe(false);
    expect(result.current.position).toEqual(to);
  });
});
