import { useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '../utils/useMediaQuery.ts';
import { ROOM_H, WALK, type Point } from './room.config.ts';

export type Direction = 'left' | 'right';

/** Control point of the curve: halfway between, pushed down (towards the viewer). */
export function controlPoint(from: Point, to: Point): Point {
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const dip = Math.min(WALK.maxDip, distance * WALK.dipRatio);
  return {
    x: (from.x + to.x) / 2,
    y: Math.min((from.y + to.y) / 2 + dip, ROOM_H - 10),
  };
}

/** Point on a quadratic Bézier curve at t (0–1). */
export function quadPoint(from: Point, control: Point, to: Point, t: number): Point {
  const u = 1 - t;
  return {
    x: u * u * from.x + 2 * u * t * control.x + t * t * to.x,
    y: u * u * from.y + 2 * u * t * control.y + t * t * to.y,
  };
}

/** Ease-in-out (quadratic): slow start, slow stop. */
export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

/** Length of the curve, measured in small straight steps. */
export function curveLength(from: Point, control: Point, to: Point, steps = 24): number {
  let length = 0;
  let previous = from;
  for (let i = 1; i <= steps; i++) {
    const point = quadPoint(from, control, to, i / steps);
    length += Math.hypot(point.x - previous.x, point.y - previous.y);
    previous = point;
  }
  return length;
}

/**
 * Moves a point to a target along a gentle curve at WALK.speed.
 * walkTo() during a walk restarts from where Ollie is now.
 * With prefers-reduced-motion, he jumps to the target instantly.
 */
export function useWalker(start: Point) {
  const [position, setPosition] = useState<Point>(start);
  const [isWalking, setIsWalking] = useState(false);
  const [direction, setDirection] = useState<Direction>('right');

  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const reducedMotionRef = useRef(reducedMotion);
  const positionRef = useRef(start);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  const cancel = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  useEffect(() => cancel, [cancel]);

  const walkTo = useCallback(
    (target: Point) => {
      cancel();
      const from = positionRef.current;
      if (Math.abs(target.x - from.x) > 1) {
        setDirection(target.x < from.x ? 'left' : 'right');
      }

      const control = controlPoint(from, target);
      const length = curveLength(from, control, target);
      if (reducedMotionRef.current || length < 1) {
        positionRef.current = target;
        setPosition(target);
        setIsWalking(false);
        return;
      }

      const duration = (length / WALK.speed) * 1000;
      let startTime: number | null = null;
      setIsWalking(true);

      const step = (now: number) => {
        startTime ??= now;
        const t = Math.min(1, (now - startTime) / duration);
        const point = quadPoint(from, control, target, easeInOut(t));
        positionRef.current = point;
        setPosition(point);
        if (t < 1) {
          frameRef.current = requestAnimationFrame(step);
        } else {
          frameRef.current = null;
          setIsWalking(false);
        }
      };
      frameRef.current = requestAnimationFrame(step);
    },
    [cancel],
  );

  return { position, isWalking, direction, walkTo, reducedMotion };
}
