import { useState } from 'react';
import type { CSSProperties } from 'react';
import { visitorLine } from '../content/beyond.ts';
import type { Friend } from '../content/types.ts';
import SpeechBubble from './SpeechBubble.tsx';
import { FRIEND_VISIT, boxToPercent } from './room.config.ts';
import { artInset, friendSprites } from './roomAssets.ts';
import { visitorBox } from './visitor.ts';
import styles from './VisitingFriend.module.css';

/** One of Ollie's friends sitting near the door. Decorative: hover shows a name bubble only. */
function VisitingFriend({ friend }: { friend: Friend }) {
  const [hovered, setHovered] = useState(false);
  const art = friendSprites[friend.id];
  const { x, y } = FRIEND_VISIT.spot;

  const box = visitorBox(friend.id);
  const style = {
    ...boxToPercent(box),
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
      {hovered && <SpeechBubble anchor={{ x, y: box.top }} text={visitorLine(friend.name)} />}
    </div>
  );
}

export default VisitingFriend;
