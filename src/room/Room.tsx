import { useEffect, useState } from 'react';
import type { FocusEvent, MouseEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { lightSwitchLines, ollieLines, roomLabel } from '../content/site.ts';
import type { Theme } from '../theme/dayNight.ts';
import { useTheme } from '../theme/themeContext.ts';
import DebugOverlay from './DebugOverlay.tsx';
import Ollie, { ollieTop } from './Ollie.tsx';
import OlliePose from './OlliePose.tsx';
import PawPrints from './PawPrints.tsx';
import RoomItem from './RoomItem.tsx';
import SpeechBubble from './SpeechBubble.tsx';
import {
  HOME,
  IDLE,
  ITEMS_IN_TAB_ORDER,
  ROOM_H,
  ROOM_ITEMS,
  ROOM_W,
  poseBox,
  walkTarget,
  type Point,
  type RoomItemConfig,
  type RoomItemKey,
} from './room.config.ts';
import { poseImages, roomBackgrounds } from './roomAssets.ts';
import { useWalker } from './useWalker.ts';
import styles from './Room.module.css';

const near = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y) < 0.5;

function lineFor(item: RoomItemConfig, theme: Theme): string {
  if (item.id === 'switch') return theme === 'day' ? lightSwitchLines.on : lightSwitchLines.off;
  return ollieLines[item.id];
}

/** Top-centre of the item's pose, for the speech bubble. */
function poseTop(item: RoomItemConfig): Point {
  const art = poseImages[item.pose!];
  const box = poseBox(item, (art.width - 2 * art.pad) / (art.height - 2 * art.pad));
  return { x: box.left + box.width / 2, y: box.top };
}

function Room() {
  const [searchParams] = useSearchParams();
  const debug = searchParams.has('debug');
  const [lastClick, setLastClick] = useState<Point | null>(null);
  const [activeId, setActiveId] = useState<RoomItemKey | null>(null);
  const [idleLookup, setIdleLookup] = useState(false);
  const { position, isWalking, direction, walkTo, reducedMotion } = useWalker(HOME);
  const { theme, toggleTheme } = useTheme();

  const active = ROOM_ITEMS.find((item) => item.id === activeId) ?? null;
  const arrived = active !== null && !isWalking && near(position, walkTarget(active));
  const posedAtFloor = arrived && active.kind === 'floor' && active.pose ? active : null;
  const lookingUpAtWall = arrived && active.kind === 'wall';
  const idleAtHome = active === null && !isWalking && near(position, HOME);

  // Idle at home: now and then, Ollie looks up for a moment.
  useEffect(() => {
    if (!idleAtHome) return;
    let lookupTimer: number | undefined;
    const timer = window.setInterval(() => {
      if (Math.random() < IDLE.chance) {
        setIdleLookup(true);
        lookupTimer = window.setTimeout(() => setIdleLookup(false), IDLE.lookupMs);
      }
    }, IDLE.everyMs);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(lookupTimer);
    };
  }, [idleAtHome]);

  const activate = (item: RoomItemConfig) => {
    if (item.id === activeId) return;
    setActiveId(item.id);
    walkTo(walkTarget(item));
  };

  const goHome = () => {
    if (activeId === null) return;
    setActiveId(null);
    walkTo(HOME);
  };

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) goHome();
  };

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

  let bubble: { anchor: Point; text: string } | null = null;
  if (posedAtFloor) {
    bubble = { anchor: poseTop(posedAtFloor), text: lineFor(posedAtFloor, theme) };
  } else if (lookingUpAtWall) {
    bubble = {
      anchor: ollieTop(position, active.poseH ?? 135),
      text: lineFor(active, theme),
    };
  }

  return (
    <section
      className={styles.room}
      aria-label={roomLabel}
      onMouseLeave={goHome}
      onBlur={handleBlur}
      onClickCapture={debug ? handleDebugClick : undefined}
      data-debug={debug || undefined}
    >
      <img className={styles.background} src={roomBackgrounds.day} alt="" draggable={false} />
      <img
        className={`${styles.background} ${styles.night}`}
        src={roomBackgrounds.night}
        alt=""
        draggable={false}
      />
      {ITEMS_IN_TAB_ORDER.map((item) => (
        <RoomItem
          key={item.id}
          item={item}
          active={item.id === activeId}
          posed={posedAtFloor?.id === item.id}
          onActivate={() => activate(item)}
          lightsOn={theme === 'day'}
          onToggleTheme={toggleTheme}
        />
      ))}
      <PawPrints position={position} isWalking={isWalking} reducedMotion={reducedMotion} />
      <Ollie
        position={position}
        isWalking={isWalking}
        direction={direction}
        still={lookingUpAtWall || (idleAtHome && idleLookup) ? 'lookup' : 'sit'}
        stillHeight={lookingUpAtWall ? active.poseH : undefined}
        hidden={posedAtFloor !== null}
      />
      {posedAtFloor && <OlliePose item={posedAtFloor} pose={posedAtFloor.pose!} />}
      {bubble && <SpeechBubble anchor={bubble.anchor} text={bubble.text} />}
      {debug && <DebugOverlay lastClick={lastClick} />}
    </section>
  );
}

export default Room;
