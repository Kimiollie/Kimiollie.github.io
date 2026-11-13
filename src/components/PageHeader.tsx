import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title: string;
  sub: string;
  /** CSS colour for the square next to the title, e.g. var(--c-about). */
  accent: string;
}

function PageHeader({ title, sub, accent }: PageHeaderProps) {
  return (
    <header className={styles.head}>
      <h1 className={styles.title}>
        <span className={styles.accent} style={{ background: accent }} aria-hidden="true" />
        {title}
      </h1>
      <p className={styles.sub}>{sub}</p>
    </header>
  );
}

export default PageHeader;
