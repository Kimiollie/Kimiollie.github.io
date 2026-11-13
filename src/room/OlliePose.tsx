import type { CSSProperties } from 'react';
import { boxToPercent, type ItemPose, type RoomItemConfig } from './room.config.ts';
import { poseLayout } from './poseLayout.ts';
import { artInset, poseImages } from './roomAssets.ts';
import styles from './Ollie.module.css';

/** Ollie's item pose (e.g. at the laptop or the phone). Uses the coloured version if there is one. */
function OlliePose({ item, pose }: { item: RoomItemConfig; pose: ItemPose }) {
  const art = poseImages[pose];
  const layout = poseLayout(item)!;
  const style = {
    ...boxToPercent(layout.box),
    zIndex: Math.round(Math.max(layout.feet.y, item.y)) + 1,
  } as CSSProperties;

  return (
    <div
      className={styles.ollie}
      style={style}
      aria-hidden="true"
      data-testid="ollie-pose"
      data-pose={pose}
    >
      {item.kind === 'floor' && <span className={styles.shadow} />}
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

export default OlliePose;
