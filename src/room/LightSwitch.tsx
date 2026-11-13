import styles from './LightSwitch.module.css';

/** A small wall light switch in the room's thick-outline style. Toggle up = lights on (day). */
function LightSwitch({ on }: { on: boolean }) {
  return (
    <svg
      className={styles.switch}
      viewBox="0 0 26 40"
      width="100%"
      height="100%"
      aria-hidden="true"
      data-on={on}
    >
      <rect x="2" y="2" width="22" height="36" rx="4" className={styles.plate} />
      <rect x="9" y="9" width="8" height="22" rx="2.5" className={styles.slot} />
      <rect x="10.5" y="10.5" width="5" height="9" rx="1.5" className={styles.lever} />
    </svg>
  );
}

export default LightSwitch;
