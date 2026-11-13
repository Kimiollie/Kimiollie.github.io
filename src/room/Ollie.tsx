import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { OLLIE_HEIGHT, WALK, boxToPercent, depthScale, type Point } from './room.config.ts';
import { allOllieImages, artInset, ollieSprites, type OllieSprite } from './roomAssets.ts';
import type { Direction } from './useWalker.ts';
import styles from './Ollie.module.css';

const WALK_CYCLE: OllieSprite[] = ['walk_1', 'walk_2', 'walk_3', 'walk_2'];

interface OllieProps {
  position: Point;
  isWalking: boolean;
  direction: Direction;
  /** Sprite when standing still. */
  still?: 'sit' | 'lookup';
  /** Height of the still sprite in image px (before the depth scale). */
  stillHeight?: number;
  /** Hidden while one of his item poses is shown. */
  hidden?: boolean;
}

/** Ollie's top-centre in image px for a still sprite: where the speech bubble's tail points. */
export function ollieTop(position: Point, height: number): Point {
  return { x: position.x, y: position.y - height * depthScale(position.y) };
}

function Ollie({
  position,
  isWalking,
  direction,
  still = 'sit',
  stillHeight = OLLIE_HEIGHT.sit,
  hidden = false,
}: OllieProps) {
  const [frame, setFrame] = useState(0);

  // Preload every Ollie image once, so poses never flash in later.
  useEffect(() => {
    for (const src of allOllieImages) {
      const image = new Image();
      image.src = src;
    }
  }, []);

  useEffect(() => {
    if (!isWalking) return;
    const timer = window.setInterval(() => setFrame((f) => f + 1), WALK.frameMs);
    return () => window.clearInterval(timer);
  }, [isWalking]);

  const spriteName: OllieSprite = isWalking ? WALK_CYCLE[frame % WALK_CYCLE.length] : still;
  const sprite = ollieSprites[spriteName];
  const contentW = sprite.width - 2 * sprite.pad;
  const contentH = sprite.height - 2 * sprite.pad;

  const height = (isWalking ? OLLIE_HEIGHT.walk : stillHeight) * depthScale(position.y);
  const width = (height * contentW) / contentH;
  const box = { left: position.x - width / 2, top: position.y - height, width, height };

  const style = { ...boxToPercent(box), zIndex: Math.round(position.y) } as CSSProperties;
  const flip = isWalking && direction === 'left';

  return (
    <div
      className={styles.ollie}
      style={style}
      aria-hidden="true"
      hidden={hidden}
      data-testid="ollie"
      data-sprite={spriteName}
    >
      <span className={styles.shadow} />
      <img
        className={styles.sprite}
        style={{ ...artInset(sprite), transform: flip ? 'scaleX(-1)' : undefined }}
        src={sprite.white}
        alt=""
        draggable={false}
      />
    </div>
  );
}

export default Ollie;
