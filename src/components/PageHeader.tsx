import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { backToRoom } from '../content/site.ts';
import { olliePose } from '../utils/images.ts';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title: string;
  sub: string;
  /** Page colour for the square next to the title and the link hover, e.g. var(--c-about). */
  accent: string;
  /** Ollie pose file name in src/assets/ollie/, shown on the right. Hidden under 600px. */
  pose?: string;
}

function PageHeader({ title, sub, accent, pose }: PageHeaderProps) {
  const poseSrc = pose ? olliePose(pose) : undefined;

  return (
    <header className={styles.head} style={{ '--accent': accent } as CSSProperties}>
      <div className={styles.text}>
        <h1 className={styles.title}>
          <span className={styles.accent} aria-hidden="true" />
          {title}
        </h1>
        <p className={styles.sub}>{sub}</p>
        <Link to="/" className={styles.back}>
          <span aria-hidden="true">← </span>
          {backToRoom}
        </Link>
      </div>

      {pose && (
        <div className={styles.pose}>
          {poseSrc ? (
            <img src={poseSrc} alt="" />
          ) : (
            <div className={styles.posePlaceholder} aria-hidden="true" />
          )}
        </div>
      )}
    </header>
  );
}

export default PageHeader;
