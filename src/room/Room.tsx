import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { roomLabel } from '../content/site.ts';
import DebugOverlay from './DebugOverlay.tsx';
import Ollie from './Ollie.tsx';
import PawPrints from './PawPrints.tsx';
import RoomItem from './RoomItem.tsx';
import { HOME, ROOM_H, ROOM_ITEMS, ROOM_W, walkTarget, type Point } from './room.config.ts';
import { useWalker } from './useWalker.ts';
import { roomBackgrounds } from './roomAssets.ts';
import styles from './Room.module.css';

function Room() {
  const [searchParams] = useSearchParams();
  const debug = searchParams.has('debug');
  const [lastClick, setLastClick] = useState<Point | null>(null);
  const { position, isWalking, direction, walkTo, reducedMotion } = useWalker(HOME);

  // Debug mode: every click reports image coordinates instead of following links.
  const handleDebugClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const point = {
      x: Math.round(((event.clientX - rect.left) / rect.width) * ROOM_W),
      y: Math.round(((event.clientY - rect.top) / rect.height) * ROOM_H),
    };
    console.log(`[room] x ${point.x}, y ${point.y}`);
    setLastClick(point);
  };

  return (
    <>
      <section
        className={styles.room}
        aria-label={roomLabel}
        onClickCapture={debug ? handleDebugClick : undefined}
        data-debug={debug || undefined}
      >
        <img className={styles.background} src={roomBackgrounds.day} alt="" draggable={false} />
        {ROOM_ITEMS.map((item) => (
          <RoomItem key={item.id} item={item} />
        ))}
        <PawPrints position={position} isWalking={isWalking} reducedMotion={reducedMotion} />
        <Ollie position={position} isWalking={isWalking} direction={direction} />
        {debug && <DebugOverlay lastClick={lastClick} />}
      </section>

      {/* Temporary (step 3.3): walk Ollie around in ?debug mode. Hover takes over in step 3.4. */}
      {debug && (
        <div className={styles.debugWalk}>
          {ROOM_ITEMS.map((item) => (
            <button key={item.id} type="button" onClick={() => walkTo(walkTarget(item))}>
              Walk to {item.id}
            </button>
          ))}
          <button type="button" onClick={() => walkTo(HOME)}>
            Walk home
          </button>
        </div>
      )}
    </>
  );
}

export default Room;
