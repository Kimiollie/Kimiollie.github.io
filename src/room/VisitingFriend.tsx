import { useState } from 'react';
import type { CSSProperties } from 'react';
import { visitorLine } from '../content/beyond.ts';
import type { Friend } from '../content/types.ts';
import SpeechBubble from './SpeechBubble.tsx';
import { FRIEND_VISIT, boxToPercent, depthScale } from './room.config.ts';
import { artInset, friendSprites } from './roomAssets.ts';
import styles from './VisitingFriend.module.css';

/** One of Ollie's friends sitting near the door. Decorative: hover shows a name bubble only. */
function VisitingFriend({ friend }: { friend: Friend }) {
  const [hovered, setHovered] = useState(false);
  const art = friendSprites[friend.id];
  const { x, y } = FRIEND_VISIT.spot;

  const height = FRIEND_VISIT.height[friend.id] * depthScale(y);
  const width = (height * (art.width - 2 * art.pad)) / (art.height - 2 * art.pad);
  const style = {
    ...boxToPercent({ left: x - width / 2, top: y - height, width, height }),
    zIndex: Math.round(y),
  } as CSSProperties;

  return (
    <div aria-hidden="true" data-testid="visiting-friend" data-friend={friend.id}>
      <div
        className={styles.friend}
        style={style}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
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
      {hovered && <SpeechBubble anchor={{ x, y: y - height }} text={visitorLine(friend.name)} />}
    </div>
  );
}

export default VisitingFriend;
