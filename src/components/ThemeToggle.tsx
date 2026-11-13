import { themeToggleLabels } from '../content/site.ts';
import { useTheme } from '../theme/themeContext.ts';
import styles from './ThemeToggle.module.css';

/** Header button: moon by day (switch to night), sun at night (switch to day). */
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const label = theme === 'day' ? themeToggleLabels.toNight : themeToggleLabels.toDay;

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {theme === 'day' ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;
