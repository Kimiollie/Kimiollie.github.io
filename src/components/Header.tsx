import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BRAND, CV_URL, cvButtonLabel } from '../content/site.ts';
import ThemeToggle from './ThemeToggle.tsx';
import styles from './Header.module.css';

const NAV_LINKS = [
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/beyond', label: 'Beyond code' },
  { to: '/contact', label: 'Contact' },
] as const;

function Header() {
  const { pathname } = useLocation();
  // The menu remembers the page it was opened on, so it closes by itself on route change.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenOn(null);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.inner}`}>
        <Link to="/" className={styles.brand}>
          <span className={styles.dot} aria-hidden="true" />
          {BRAND}
        </Link>

        <nav className={styles.nav} aria-label="Main">
          <button
            ref={buttonRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpenOn(open ? null : pathname)}
          >
            Menu
          </button>
          <ul id="site-nav" className={styles.links} data-open={open}>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={styles.link} onClick={() => setOpenOn(null)}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <ThemeToggle />

        <a href={CV_URL} download className={styles.cv}>
          {cvButtonLabel}
        </a>
      </div>
    </header>
  );
}

export default Header;
