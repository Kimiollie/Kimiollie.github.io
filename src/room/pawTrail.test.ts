import { describe, expect, it } from 'vitest';
import { PAW_PRINTS, depthScale } from './room.config.ts';
import { pawPlacement, walkAngle } from './pawTrail.ts';

describe('paw trail', () => {
  it('measures the real walking angle from the previous position', () => {
    expect(walkAngle({ x: 0, y: 600 }, { x: 10, y: 600 })).toBeCloseTo(0);
    expect(walkAngle({ x: 10, y: 600 }, { x: 0, y: 600 })).toBeCloseTo(Math.PI);
    expect(walkAngle({ x: 0, y: 600 }, { x: 10, y: 610 })).toBeCloseTo(Math.PI / 4);
    expect(walkAngle({ x: 5, y: 600 }, { x: 5.1, y: 600 })).toBeNull();
  });

  it('turns the toes the way he walks', () => {
    const at = { x: 500, y: 600 };
    expect(pawPlacement(at, 0, 1).rotate).toBeCloseTo(90); // walking right
    expect(pawPlacement(at, Math.PI, 1).rotate).toBeCloseTo(270); // walking left
    expect(pawPlacement(at, Math.PI / 2, 1).rotate).toBeCloseTo(180); // towards the viewer
  });

  it('puts left and right paws on either side of the path, perpendicular to it', () => {
    const at = { x: 500, y: 600 };
    const size = PAW_PRINTS.size * depthScale(at.y);
    const offset = PAW_PRINTS.trackOffset * size;

    // Walking right: the paws sit above and below the path.
    const right = pawPlacement(at, 0, 1);
    const left = pawPlacement(at, 0, -1);
    expect(right.x).toBeCloseTo(500);
    expect(right.y).toBeCloseTo(600 + offset);
    expect(left.y).toBeCloseTo(600 - offset);

    // Walking diagonally: the offset is perpendicular to the direction of travel.
    const angle = Math.PI / 4;
    const diagonal = pawPlacement(at, angle, 1);
    const dx = diagonal.x - at.x;
    const dy = diagonal.y - at.y;
    expect(dx * Math.cos(angle) + dy * Math.sin(angle)).toBeCloseTo(0);
    expect(Math.hypot(dx, dy)).toBeCloseTo(offset);
  });

  it('makes prints about 40% bigger than before (16 → 22 image px)', () => {
    expect(PAW_PRINTS.size).toBe(22);
  });
});
