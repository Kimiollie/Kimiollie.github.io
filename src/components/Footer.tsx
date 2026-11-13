import { footerText } from '../content/site.ts';
import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <p className={styles.text}>{footerText}</p>
      </div>
    </footer>
  );
}

export default Footer;
