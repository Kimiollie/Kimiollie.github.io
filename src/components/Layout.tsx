import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { skipLinkLabel } from '../content/site.ts';
import Header from './Header.tsx';
import Footer from './Footer.tsx';
import ScrollToTop from './ScrollToTop.tsx';
import styles from './Layout.module.css';

function Layout() {
  return (
    <div className={styles.layout}>
      <a href="#main" className="skip-link">
        {skipLinkLabel}
      </a>
      <ScrollToTop />
      <Header />
      {/* tabIndex -1: the skip link can move focus here. */}
      <main id="main" tabIndex={-1} className={`wrap ${styles.main}`}>
        {/* Pages other than Home are loaded on demand. */}
        <Suspense fallback={<div className={styles.loading} aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
