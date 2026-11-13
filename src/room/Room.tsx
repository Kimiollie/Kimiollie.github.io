import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { roomLabel } from '../content/site.ts';
import DebugOverlay from './DebugOverlay.tsx';
import RoomItem from './RoomItem.tsx';
import { ROOM_H, ROOM_ITEMS, ROOM_W, type Point } from './room.config.ts';
import { roomBackgrounds } from './roomAssets.ts';
import styles from './Room.module.css';

function Room() {
  const [searchParams] = useSearchParams();
  const debug = searchParams.has('debug');
  const [lastClick, setLastClick] = useState<Point | null>(null);

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
      {debug && <DebugOverlay lastClick={lastClick} />}
    </section>
  );
}

export default Room;
