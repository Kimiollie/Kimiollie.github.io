import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { backToRoom } from '../content/site.ts';
import { ollieSprites, poseImages, type ItemArt } from '../room/roomAssets.ts';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title: string;
  sub: string;
  /** Page colour for the square next to the title and the link hover, e.g. var(--c-about). */
  accent: string;
  /** Ollie's pose on the right (decorative). Hidden under 600px. */
  pose?: HeaderPose;
}

type HeaderPose = 'laptop' | 'lookup' | 'easel' | 'phone';

const HEADER_POSES: Record<HeaderPose, ItemArt> = {
  laptop: poseImages.laptop,
  lookup: ollieSprites.lookup,
  easel: poseImages.easel,
  phone: poseImages.phone,
};

function PageHeader({ title, sub, accent, pose }: PageHeaderProps) {
  const art = pose ? HEADER_POSES[pose] : undefined;

  return (
    <div className={styles.head} style={{ '--accent': accent } as CSSProperties}>
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
          {art ? (
            <img src={art.white} alt="" width={art.width} height={art.height} />
          ) : (
            <div className={styles.posePlaceholder} aria-hidden="true" />
          )}
        </div>
      )}
    </div>
  );
}

export default PageHeader;
