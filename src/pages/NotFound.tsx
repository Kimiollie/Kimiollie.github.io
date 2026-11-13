import { backToRoom, pageTitles } from '../content/site.ts';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { notFoundTitle } from '../content/beyond.ts';
import { pickFriend, type Random } from '../room/visitor.ts';
import { friendSprites } from '../room/roomAssets.ts';
import styles from './NotFound.module.css';
import { useDocumentTitle } from '../utils/useDocumentTitle.ts';

interface NotFoundProps {
  /** Dice for which friend shows up. Injectable for tests; defaults to Math.random. */
  random?: Random;
}

function NotFound({ random = Math.random }: NotFoundProps) {
  useDocumentTitle(pageTitles.notFound);
  const [friend] = useState(() => pickFriend(random));

  return (
    <section className={styles.page}>
      <img
        className={styles.friend}
        src={friendSprites[friend.id].white}
        alt={`${friend.name}, ${friend.breed}`}
        width={friendSprites[friend.id].width}
        height={friendSprites[friend.id].height}
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
