import { PAW_PRINTS, depthScale, type Point } from './room.config.ts';

export interface PawPlacement extends Point {
  /** Print size in image px (depth-scaled). */
  size: number;
  /** CSS rotation in degrees, so the toes point the way Ollie walks. */
  rotate: number;
}

/** Walking angle in radians (0 = right, π/2 = towards the viewer), or null if he hasn't moved. */
export function walkAngle(previous: Point, current: Point): number | null {
  const dx = current.x - previous.x;
  const dy = current.y - previous.y;
  if (Math.hypot(dx, dy) < 0.5) return null;
  return Math.atan2(dy, dx);
}

/**
 * Where to draw one paw print. Left (-1) and right (1) paws sit on either side of the path,
 * perpendicular to the walking direction, so the prints form a tidy double track.
 */
export function pawPlacement(at: Point, angle: number, side: -1 | 1): PawPlacement {
  const size = PAW_PRINTS.size * depthScale(at.y);
  const offset = side * PAW_PRINTS.trackOffset * size;
  return {
    // Perpendicular to the direction (cos, sin) is (-sin, cos).
    x: at.x - Math.sin(angle) * offset,
    y: at.y + Math.cos(angle) * offset,
    size,
    // The paw is drawn toes-up (-90°), so turn it by the walking angle + 90°.
    rotate: (angle * 180) / Math.PI + 90,
  };
}
