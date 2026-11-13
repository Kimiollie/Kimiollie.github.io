import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { friends } from '../../content/beyond.ts';
import { useTheme } from '../../theme/themeContext.ts';
import LightSwitch from '../LightSwitch.tsx';
import { poseLayout } from '../poseLayout.ts';
import {
  FRIEND_VISIT,
  OLLIE_HEIGHT,
  ROOM_H,
  ROOM_ITEMS,
  ROOM_W,
  boxToPercent,
  clientToImage,
  depthScale,
  itemBox,
  pictureToPercent,
  type Box,
  type Point,
  type RoomItemConfig,
} from '../room.config.ts';
import {
  artInset,
  friendSprites,
  itemImages,
  ollieSprites,
  poseImages,
  roomBackgrounds,
  wallPictures,
} from '../roomAssets.ts';
import { friendById, visitorBox } from '../visitor.ts';
import roomStyles from '../Room.module.css';
import {
  anchorOf,
  changedItems,
  clearLayout,
  configLayout,
  loadLayout,
  moveTo,
  nudge,
  resize,
  saveLayout,
  toSnippet,
  type RoomLayout,
  type Selectable,
} from './layoutModel.ts';
import styles from './RoomEditor.module.css';

const GRID = 50;

/**
 * Dev-only drag-and-drop layout editor for the room (/?edit, `npm run dev` only).
 * Nothing here navigates, downloads or walks: it only moves anchors and copies a snippet.
 */
function RoomEditor() {
  const [searchParams] = useSearchParams();
  // The friend always shows here; ?friend=kiwi|moon|tho picks which.
  const friend = friendById(searchParams.get('friend')) ?? friends[0];
  const { theme } = useTheme();

  const [layout, setLayout] = useState<RoomLayout>(() => loadLayout() ?? configLayout());
  const [selected, setSelected] = useState<Selectable | null>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const roomRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ target: Selectable; offset: Point } | null>(null);

  const update = (change: (current: RoomLayout) => RoomLayout) => {
    setLayout((current) => {
      const next = change(current);
      saveLayout(next);
      return next;
    });
    setCopyStatus('');
  };

  // Keyboard: arrows nudge 1 px (Shift: 10 px), + / - change h by 2, Escape deselects.
  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const step = event.shiftKey ? 10 : 1;
      const moves: Record<string, [number, number]> = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
      };
      if (moves[event.key]) {
        event.preventDefault();
        const [dx, dy] = moves[event.key];
        update((current) => nudge(current, selected, dx, dy));
      } else if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        update((current) => resize(current, selected, 2));
      } else if (event.key === '-' || event.key === '_') {
        event.preventDefault();
        update((current) => resize(current, selected, -2));
      } else if (event.key === 'Escape') {
        setSelected(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selected]);

  const toImage = (event: PointerEvent): Point =>
    clientToImage(roomRef.current!.getBoundingClientRect(), event.clientX, event.clientY);

  const startDrag = (target: Selectable) => (event: PointerEvent<HTMLElement>) => {
    event.stopPropagation();
    setSelected(target);
    const at = anchorOf(layout, target);
    const pointer = toImage(event);
    drag.current = { target, offset: { x: at.x - pointer.x, y: at.y - pointer.y } };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const current = drag.current;
    if (!current) return;
    const pointer = toImage(event);
    update((l) =>
      moveTo(l, current.target, {
        x: pointer.x + current.offset.x,
        y: pointer.y + current.offset.y,
      }),
    );
  };

  const endDrag = () => {
    drag.current = null;
  };

  const reset = () => {
    clearLayout();
    setLayout(configLayout());
    setSelected(null);
    setCopyStatus('');
  };

  const snippet = toSnippet(layout);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopyStatus('Copied!');
    } catch {
      setCopyStatus('Copy failed: select the snippet below and copy it by hand.');
    }
  };

  // Everything at its edited position.
  const placed = ROOM_ITEMS.map((item) => ({ ...item, ...layout.items[item.id] }));
  const friendBox = visitorBox(friend.id, layout.friendSpot);
  const ollieBox = sitBox(layout.home);
  const changed = new Set(changedItems(layout));

  const draggable = (
    target: Selectable,
    box: Box,
    zIndex: number,
    label: string,
    children: ReactNode,
    className = '',
  ) => (
    <div
      key={target}
      className={`${styles.draggable} ${className}`}
      style={{ ...boxToPercent(box), zIndex } as CSSProperties}
      data-selected={selected === target || undefined}
      data-testid={`edit-${target}`}
      tabIndex={0}
      aria-label={label}
      onPointerDown={startDrag(target)}
      onFocus={() => setSelected(target)}
    >
      {children}
    </div>
  );

  const selectedBox = selected ? boxOf(selected) : null;
  function boxOf(target: Selectable): Box {
    if (target === 'friend') return friendBox;
    if (target === 'home') return ollieBox;
    return itemBox(placed.find((item) => item.id === target)!);
  }

  return (
    <div className={styles.editor}>
      <div
        ref={roomRef}
        className={`${roomStyles.room} ${styles.room}`}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerDown={() => setSelected(null)}
        data-testid="edit-room"
      >
        <img className={roomStyles.background} src={roomBackgrounds.day} alt="" draggable={false} />
        <img
          className={`${roomStyles.background} ${roomStyles.night}`}
          src={roomBackgrounds.night}
          alt=""
          draggable={false}
        />
        <Grid />

        {placed.map((item) => (
          <ItemGhostPose key={`pose-${item.id}`} item={item} />
        ))}
        {placed.map((item) =>
          draggable(
            item.id,
            itemBox(item),
            Math.round(item.y),
            item.label,
            <ItemArt item={item} lightsOn={theme === 'day'} />,
            item.kind === 'floor' ? styles.floor : styles.wall,
          ),
        )}

        {draggable(
          'friend',
          friendBox,
          Math.round(layout.friendSpot.y),
          `${friend.name} (visiting friend spot)`,
          <img
            className={styles.sprite}
            style={artInset(friendSprites[friend.id])}
            src={friendSprites[friend.id].white}
            alt=""
            draggable={false}
          />,
          styles.floor,
        )}
        <span
          className={styles.greetDot}
          style={dotStyle({
            x: layout.friendSpot.x + FRIEND_VISIT.greetOffset.dx,
            y: layout.friendSpot.y + FRIEND_VISIT.greetOffset.dy,
          })}
          title="Ollie's greeting spot"
        />

        {draggable(
          'home',
          ollieBox,
          Math.round(layout.home.y),
          "Ollie's home spot",
          <img
            className={styles.sprite}
            style={artInset(ollieSprites.sit)}
            src={ollieSprites.sit.white}
            alt=""
            draggable={false}
          />,
          styles.floor,
        )}

        {selected && selectedBox && (
          <span className={styles.selectionLabel} style={labelStyle(selectedBox)}>
            {selected} · x {anchorOf(layout, selected).x} · y {anchorOf(layout, selected).y}
            {selected !== 'friend' && selected !== 'home' && ` · h ${layout.items[selected].h}`}
          </span>
        )}
      </div>

      <aside className={styles.panel} aria-label="Layout editor">
        <h2 className={styles.panelTitle}>Room layout (dev)</h2>
        <p className={styles.help}>
          Drag to move the bottom-centre anchor. Click to select: arrows 1 px, Shift + arrows 10 px,
          + / − height. Esc deselects.
        </p>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>id</th>
              <th>x</th>
              <th>y</th>
              <th>h</th>
            </tr>
          </thead>
          <tbody>
            {placed.map((item) => (
              <tr
                key={item.id}
                data-changed={changed.has(item.id) || undefined}
                data-selected={selected === item.id || undefined}
              >
                <td>{item.id}</td>
                <td>{item.x}</td>
                <td>{item.y}</td>
                <td>{item.h}</td>
              </tr>
            ))}
            <tr data-selected={selected === 'friend' || undefined}>
              <td>friend spot</td>
              <td>{layout.friendSpot.x}</td>
              <td>{layout.friendSpot.y}</td>
              <td />
            </tr>
            <tr data-selected={selected === 'home' || undefined}>
              <td>Ollie home</td>
              <td>{layout.home.x}</td>
              <td>{layout.home.y}</td>
              <td />
            </tr>
          </tbody>
        </table>

        <div className={styles.buttons}>
          <button type="button" onClick={copy}>
            Copy as TypeScript
          </button>
          <button type="button" onClick={reset}>
            Reset
          </button>
        </div>
        <p className={styles.status} role="status">
          {copyStatus}
        </p>
        <pre className={styles.snippet} data-testid="edit-snippet">
          {snippet}
        </pre>
      </aside>
    </div>
  );
}

/** The item's own drawing (no colour swap, no links). */
function ItemArt({ item, lightsOn }: { item: RoomItemConfig; lightsOn: boolean }) {
  const art = item.image ? itemImages[item.image] : undefined;
  return (
    <>
      {item.kind === 'floor' && <span className={styles.shadow} />}
      {art && (
        <img
          className={styles.sprite}
          style={artInset(art)}
          src={art.white}
          alt=""
          draggable={false}
        />
      )}
      {item.picture && (
        <img
          className={styles.picture}
          style={pictureToPercent(item, item.picture)}
          src={wallPictures[item.picture.image]}
          alt=""
          draggable={false}
        />
      )}
      {item.id === 'switch' && <LightSwitch on={lightsOn} />}
    </>
  );
}

/** Wall items with their own pose (the phone): the lined-up pose, faint, so you can check it. */
function ItemGhostPose({ item }: { item: RoomItemConfig }) {
  if (item.kind !== 'wall' || !item.pose) return null;
  const layout = poseLayout(item)!;
  const art = poseImages[item.pose];
  return (
    <div
      className={styles.ghost}
      style={{ ...boxToPercent(layout.box), zIndex: Math.round(layout.feet.y) }}
      aria-hidden="true"
    >
      <img
        className={styles.sprite}
        style={artInset(art)}
        src={art.colour}
        alt=""
        draggable={false}
      />
    </div>
  );
}

function Grid() {
  const xs = Array.from({ length: Math.floor(ROOM_W / GRID) + 1 }, (_, i) => i * GRID);
  const ys = Array.from({ length: Math.floor(ROOM_H / GRID) + 1 }, (_, i) => i * GRID);
  return (
    <svg
      className={styles.grid}
      viewBox={`0 0 ${ROOM_W} ${ROOM_H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {xs.map((x) => (
        <line key={`x${x}`} x1={x} y1={0} x2={x} y2={ROOM_H} />
      ))}
      {ys.map((y) => (
        <line key={`y${y}`} x1={0} y1={y} x2={ROOM_W} y2={y} />
      ))}
    </svg>
  );
}

/** Ollie's sit sprite box at a spot (same maths as the live room). */
function sitBox(at: Point): Box {
  const sprite = ollieSprites.sit;
  const height = OLLIE_HEIGHT.sit * depthScale(at.y);
  const width = (height * (sprite.width - 2 * sprite.pad)) / (sprite.height - 2 * sprite.pad);
  return { left: at.x - width / 2, top: at.y - height, width, height };
}

function dotStyle(at: Point): CSSProperties {
  return { left: `${(at.x / ROOM_W) * 100}%`, top: `${(at.y / ROOM_H) * 100}%` };
}

function labelStyle(box: Box): CSSProperties {
  return {
    left: `${(Math.max(0, box.left) / ROOM_W) * 100}%`,
    top: `${(Math.max(0, box.top) / ROOM_H) * 100}%`,
  };
}

export default RoomEditor;
