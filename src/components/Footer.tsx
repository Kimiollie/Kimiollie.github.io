import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <p className={styles.text}>
          Illustrations of Ollie, the real boss of this house. Built by Kim.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
