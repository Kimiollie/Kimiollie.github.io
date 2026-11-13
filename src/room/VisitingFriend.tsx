import type { CSSProperties } from 'react';
import type { Friend } from '../content/types.ts';
import { FRIEND_VISIT, boxToPercent } from './room.config.ts';
import { artInset, friendSprites } from './roomAssets.ts';
import { visitorBox } from './visitor.ts';
import styles from './VisitingFriend.module.css';

interface VisitingFriendProps {
  friend: Friend;
  /** Mouse over the friend: Ollie walks over to say hi. */
  onHover: () => void;
  /** Mouse leaves the friend: Ollie walks home. */
  onLeave: () => void;
}

/** One of Ollie's friends sitting near the door. Decorative: not focusable, not clickable. */
function VisitingFriend({ friend, onHover, onLeave }: VisitingFriendProps) {
  const art = friendSprites[friend.id];
  const { y } = FRIEND_VISIT.spot;

  const box = visitorBox(friend.id);
  const style = {
    ...boxToPercent(box),
    zIndex: Math.round(y),
  } as CSSProperties;

  return (
    <div aria-hidden="true" data-testid="visiting-friend" data-friend={friend.id}>
      <div className={styles.friend} style={style} onMouseEnter={onHover} onMouseLeave={onLeave}>
        <span className={styles.shadow} />
        <img
          className={styles.sprite}
          style={artInset(art)}
          src={art.white}
          alt=""
          width={art.width}
          height={art.height}
          draggable={false}
        />
      </div>
    </div>
  );
}

export default VisitingFriend;
