import type { CSSProperties } from 'react';
import { boxToPercent, poseBox, type ItemPose, type RoomItemConfig } from './room.config.ts';
import { artInset, poseImages } from './roomAssets.ts';
import styles from './Ollie.module.css';

/** Ollie's item pose (e.g. at the laptop), drawn at the item with the depth scale. */
function OlliePose({ item, pose }: { item: RoomItemConfig; pose: ItemPose }) {
  const art = poseImages[pose];
  const aspect = (art.width - 2 * art.pad) / (art.height - 2 * art.pad);
  const style = {
    ...boxToPercent(poseBox(item, aspect)),
    zIndex: Math.round(item.y) + 1,
  } as CSSProperties;

  return (
    <div
      className={styles.ollie}
      style={style}
      aria-hidden="true"
      data-testid="ollie-pose"
      data-pose={pose}
    >
      <span className={styles.shadow} />
      <img
        className={styles.sprite}
        style={artInset(art)}
        src={art.white}
        alt=""
        draggable={false}
      />
    </div>
  );
}

export default OlliePose;
