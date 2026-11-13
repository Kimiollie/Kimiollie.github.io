import type { FriendId } from '../content/types.ts';
import {
  FRIEND_VISIT,
  greetSpot,
  HOME,
  ROOM_H,
  ROOM_ITEMS,
  ROOM_W,
  itemBox,
  type Point,
} from './room.config.ts';
import { visitorBox } from './visitor.ts';
import { poseLayout } from './poseLayout.ts';
import styles from './DebugOverlay.module.css';

const GRID = 50;

interface DebugOverlayProps {
  lastClick: Point | null;
  /** The visiting friend, outlined with its size factor. */
  visitor: FriendId | null;
}

/** Shown on /?debug: a 50 px grid, item boxes and the last clicked image coordinates. */
function DebugOverlay({ lastClick, visitor }: DebugOverlayProps) {
  const xs = Array.from({ length: Math.floor(ROOM_W / GRID) + 1 }, (_, i) => i * GRID);
  const ys = Array.from({ length: Math.floor(ROOM_H / GRID) + 1 }, (_, i) => i * GRID);

  return (
    <>
      <svg
        className={styles.overlay}
        viewBox={`0 0 ${ROOM_W} ${ROOM_H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        data-testid="room-debug"
      >
        {xs.map((x) => (
          <g key={`x${x}`}>
            <line
              x1={x}
              y1={0}
              x2={x}
              y2={ROOM_H}
              className={x % 100 ? styles.minor : styles.major}
            />
            {x % 100 === 0 && (
              <text x={x + 3} y={14} className={styles.text}>
                {x}
              </text>
            )}
          </g>
        ))}
        {ys.map((y) => (
          <g key={`y${y}`}>
            <line
              x1={0}
              y1={y}
              x2={ROOM_W}
              y2={y}
              className={y % 100 ? styles.minor : styles.major}
            />
            {y % 100 === 0 && y > 0 && (
              <text x={3} y={y - 3} className={styles.text}>
                {y}
              </text>
            )}
          </g>
        ))}

        {ROOM_ITEMS.map((item) => {
          const box = itemBox(item);
          return (
            <g key={item.id}>
              <rect
                x={box.left}
                y={box.top}
                width={box.width}
                height={box.height}
                className={styles.box}
              />
              <circle cx={item.x} cy={item.y} r={4} className={styles.anchor} />
              <text x={box.left} y={box.top - 4} className={styles.boxText}>
                {item.id} ({item.x}, {item.y})
              </text>
              {item.standAt && (
                <circle cx={item.standAt.x} cy={item.standAt.y} r={5} className={styles.stand} />
              )}
              {item.kind === 'wall' &&
                item.pose &&
                (() => {
                  const layout = poseLayout(item)!;
                  return (
                    <>
                      <rect
                        x={layout.box.left}
                        y={layout.box.top}
                        width={layout.box.width}
                        height={layout.box.height}
                        className={styles.poseBox}
                      />
                      <circle
                        cx={layout.feet.x}
                        cy={layout.feet.y}
                        r={5}
                        className={styles.stand}
                      />
                    </>
                  );
                })()}
            </g>
          );
        })}

        {visitor && (
          <g data-testid="debug-visitor">
            {(() => {
              const box = visitorBox(visitor);
              return (
                <>
                  <rect
                    x={box.left}
                    y={box.top}
                    width={box.width}
                    height={box.height}
                    className={styles.box}
                  />
                  <text x={box.left} y={box.top - 4} className={styles.boxText}>
                    {visitor} ×{FRIEND_VISIT.sizeFactor[visitor]}
                  </text>
                  <circle cx={greetSpot().x} cy={greetSpot().y} r={5} className={styles.stand} />
                </>
              );
            })()}
          </g>
        )}

        <circle cx={HOME.x} cy={HOME.y} r={6} className={styles.home} />
        <text x={HOME.x + 8} y={HOME.y + 4} className={styles.boxText}>
          home
        </text>

        {lastClick && <circle cx={lastClick.x} cy={lastClick.y} r={5} className={styles.click} />}
      </svg>

      <output className={styles.readout} aria-live="polite">
        {lastClick
          ? `x ${lastClick.x}, y ${lastClick.y}`
          : 'debug: click anywhere for image coordinates'}
      </output>
    </>
  );
}

export default DebugOverlay;
