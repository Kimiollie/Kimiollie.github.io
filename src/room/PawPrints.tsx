import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { PAW_PRINTS, ROOM_H, ROOM_W, type Point } from './room.config.ts';
import { pawPlacement, walkAngle, type PawPlacement } from './pawTrail.ts';
import styles from './PawPrints.module.css';

interface PawPrint extends PawPlacement {
  id: number;
}

interface PawPrintsProps {
  position: Point;
  isWalking: boolean;
  reducedMotion: boolean;
}

/** Leaves a fading paw print every 240 ms while Ollie walks, following his real path. */
function PawPrints({ position, isWalking, reducedMotion }: PawPrintsProps) {
  const [prints, setPrints] = useState<PawPrint[]>([]);
  const latest = useRef({ position, angle: 0 });
  const nextId = useRef(0);

  // Track the walking angle from the previous position to the current one.
  useEffect(() => {
    const angle = walkAngle(latest.current.position, position);
    latest.current = { position, angle: angle ?? latest.current.angle };
  }, [position]);

  useEffect(() => {
    if (!isWalking || reducedMotion) return;
    const timer = window.setInterval(() => {
      const id = nextId.current++;
      const { position: at, angle } = latest.current;
      const print: PawPrint = { id, ...pawPlacement(at, angle, id % 2 ? 1 : -1) };
      setPrints((current) => [...current, print].slice(-PAW_PRINTS.max));
    }, PAW_PRINTS.everyMs);
    return () => window.clearInterval(timer);
  }, [isWalking, reducedMotion]);

  const remove = (id: number) => setPrints((current) => current.filter((p) => p.id !== id));

  if (reducedMotion) return null;

  return (
    <div className={styles.layer} aria-hidden="true">
      {prints.map((print) => {
        const style = {
          left: `${(print.x / ROOM_W) * 100}%`,
          top: `${(print.y / ROOM_H) * 100}%`,
          width: `${(print.size / ROOM_W) * 100}%`,
          '--paw-rotate': `${print.rotate}deg`,
          '--paw-fade': `${PAW_PRINTS.fadeMs}ms`,
        } as CSSProperties;
        return (
          <svg
            key={print.id}
            className={styles.paw}
            style={style}
            viewBox="0 0 20 20"
            data-testid="paw-print"
            onAnimationEnd={() => remove(print.id)}
          >
            <ellipse cx="10" cy="13" rx="5" ry="4.2" />
            <ellipse cx="4.2" cy="7.6" rx="1.9" ry="2.4" />
            <ellipse cx="8" cy="4.6" rx="1.9" ry="2.4" />
            <ellipse cx="12" cy="4.6" rx="1.9" ry="2.4" />
            <ellipse cx="15.8" cy="7.6" rx="1.9" ry="2.4" />
          </svg>
        );
      })}
    </div>
  );
}

export default PawPrints;
