import { useState } from 'react';
import { Link } from 'react-router-dom';
import { notFoundTitle } from '../content/beyond.ts';
import { backToRoom } from '../content/site.ts';
import { pickFriend, type Random } from '../room/visitor.ts';
import { friendSprites } from '../room/roomAssets.ts';
import styles from './NotFound.module.css';

interface NotFoundProps {
  /** Dice for which friend shows up. Injectable for tests; defaults to Math.random. */
  random?: Random;
}

function NotFound({ random = Math.random }: NotFoundProps) {
  const [friend] = useState(() => pickFriend(random));

  return (
    <section className={styles.page}>
      <img
        className={styles.friend}
        src={friendSprites[friend.id].white}
        alt={`${friend.name}, ${friend.breed}`}
      />
      <h1 className={styles.title}>{notFoundTitle(friend.name)}</h1>
      <Link to="/" className={styles.back}>
        <span aria-hidden="true">← </span>
        {backToRoom}
      </Link>
    </section>
  );
}

export default NotFound;
