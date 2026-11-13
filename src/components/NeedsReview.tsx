import styles from './NeedsReview.module.css';

/** Yellow marker for content Kim still has to check. Rendered in development only. */
function NeedsReview() {
  if (!import.meta.env.DEV) return null;
  return <span className={styles.marker}>needs review</span>;
}

export default NeedsReview;
