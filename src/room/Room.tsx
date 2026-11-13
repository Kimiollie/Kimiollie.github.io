import { useEffect, useState } from 'react';
import type { FocusEvent, MouseEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { greetLine } from '../content/beyond.ts';
import { lightSwitchLines, ollieLines, roomLabel } from '../content/site.ts';
import type { Theme } from '../theme/dayNight.ts';
import { useTheme } from '../theme/themeContext.ts';
import DebugOverlay from './DebugOverlay.tsx';
import Ollie, { ollieTop } from './Ollie.tsx';
import OlliePose from './OlliePose.tsx';
import PawPrints from './PawPrints.tsx';
import RoomItem from './RoomItem.tsx';
import SpeechBubble from './SpeechBubble.tsx';
import VisitingFriend from './VisitingFriend.tsx';
import { friendById, pickFriend, pickVisitor, type Random } from './visitor.ts';
import {
  HOME,
  IDLE,
  OLLIE_HEIGHT,
  greetSpot,
  ITEMS_IN_TAB_ORDER,
  ROOM_ITEMS,
  clientToImage,
  type Point,
  type RoomItemConfig,
  type RoomItemKey,
} from './room.config.ts';
import { poseLayout, walkTargetFor } from './poseLayout.ts';
import { roomBackgrounds } from './roomAssets.ts';
import { useWalker } from './useWalker.ts';
import styles from './Room.module.css';

const near = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y) < 0.5;

function lineFor(item: RoomItemConfig, theme: Theme): string {
  if (item.id === 'switch') return theme === 'day' ? lightSwitchLines.on : lightSwitchLines.off;
  return ollieLines[item.id];
}

/** Top-centre of the item's pose, for the speech bubble. */
function poseTop(item: RoomItemConfig): Point {
  const { box } = poseLayout(item)!;
  return { x: box.left + box.width / 2, y: box.top };
}

interface RoomProps {
  /** Dice for the visiting friend. Injectable for tests; defaults to Math.random. */
  random?: Random;
}

function Room({ random = Math.random }: RoomProps) {
  const [searchParams] = useSearchParams();
  const debug = searchParams.has('debug');
  // Decided once per mount (= once per home visit), never on re-render.
  // In ?debug a friend always visits (?friend=kiwi|moon|tho picks which), to check the size.
  const [visitor] = useState(() =>
    debug ? (friendById(searchParams.get('friend')) ?? pickFriend(random)) : pickVisitor(random),
  );
  const [lastClick, setLastClick] = useState<Point | null>(null);
  // An item, the visiting friend, or nothing (Ollie at home).
  const [activeId, setActiveId] = useState<RoomItemKey | 'friend' | null>(null);
  const [idleLookup, setIdleLookup] = useState(false);
  const { position, isWalking, direction, walkTo, reducedMotion } = useWalker(HOME);
  const { theme, toggleTheme } = useTheme();

  const active = ROOM_ITEMS.find((item) => item.id === activeId) ?? null;
  const arrived = active !== null && !isWalking && near(position, walkTargetFor(active));
  const posedItem = arrived && active.pose ? active : null;
  const lookingUpAtWall = arrived && active.kind === 'wall' && !active.pose;
  const greeting =
    activeId === 'friend' && visitor !== null && !isWalking && near(position, greetSpot());
  const idleAtHome = activeId === null && !isWalking && near(position, HOME);

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
    walkTo(walkTargetFor(item));
  };

  const greetFriend = () => {
    if (activeId === 'friend') return;
    setActiveId('friend');
    walkTo(greetSpot());
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
    const point = clientToImage(rect, event.clientX, event.clientY);
    console.log(`[room] x ${point.x}, y ${point.y}`);
    setLastClick(point);
  };

  let bubble: { anchor: Point; text: string } | null = null;
  if (posedItem) {
    bubble = { anchor: poseTop(posedItem), text: lineFor(posedItem, theme) };
  } else if (greeting) {
    bubble = { anchor: ollieTop(position, OLLIE_HEIGHT.sit), text: greetLine(visitor.name) };
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
          posed={posedItem?.id === item.id}
          onActivate={() => activate(item)}
          lightsOn={theme === 'day'}
          onToggleTheme={toggleTheme}
        />
      ))}
      {visitor && <VisitingFriend friend={visitor} onHover={greetFriend} onLeave={goHome} />}
      <PawPrints position={position} isWalking={isWalking} reducedMotion={reducedMotion} />
      <Ollie
        position={position}
        isWalking={isWalking}
        direction={direction}
        still={lookingUpAtWall || (idleAtHome && idleLookup) ? 'lookup' : 'sit'}
        stillHeight={lookingUpAtWall ? active.poseH : undefined}
        hidden={posedItem !== null}
        faceRight={greeting}
      />
      {posedItem && <OlliePose item={posedItem} pose={posedItem.pose!} />}
      {bubble && <SpeechBubble anchor={bubble.anchor} text={bubble.text} />}
      {debug && <DebugOverlay lastClick={lastClick} visitor={visitor?.id ?? null} />}
    </section>
  );
}

export default Room;
