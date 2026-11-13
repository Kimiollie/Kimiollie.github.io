import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import ExternalAnchor from '../components/ExternalAnchor.tsx';
import { hero, quickLinks, quickLinksTitle } from '../content/site.ts';
import type { QuickLink } from '../content/types.ts';
import styles from './Home.module.css';

function QuickLinkItem({ link }: { link: QuickLink }) {
  const props = {
    className: styles.quickLink,
    style: { '--accent': `var(--c-${link.accent})` } as CSSProperties,
  };

  switch (link.kind) {
    case 'route':
      return (
        <Link to={link.href} {...props}>
          {link.label}
        </Link>
      );
    case 'external':
      return (
        <ExternalAnchor href={link.href} {...props}>
          {link.label}
          <span aria-hidden="true"> ↗</span>
        </ExternalAnchor>
      );
    case 'download':
      return (
        <a href={link.href} download {...props}>
          {link.label}
        </a>
      );
    case 'email':
      return (
        <a href={link.href} {...props}>
          {link.label}
        </a>
      );
  }
}

function Home() {
  return (
    <>
      <section className={styles.hero}>
        <h1 className={styles.title}>{hero.title}</h1>
        <p className={styles.tagline}>
          {hero.tagline.before}
          <mark className={styles.highlight}>{hero.tagline.highlight}</mark>
          {hero.tagline.after}
        </p>
        <p className={styles.sub}>{hero.sub}</p>
        <p className={styles.hint}>{hero.hint}</p>
      </section>

      {/* The interactive room replaces this box in step 3.2. */}
      <div className={styles.roomPlaceholder} aria-hidden="true" />

      <nav className={styles.quick} aria-labelledby="quick-links-title">
        <h2 id="quick-links-title" className={styles.quickTitle}>
          {quickLinksTitle}
        </h2>
        <ul className={styles.quickList}>
          {quickLinks.map((link) => (
            <li key={link.href}>
              <QuickLinkItem link={link} />
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

export default Home;
