import { Outlet } from 'react-router-dom';
import Header from './Header.tsx';
import Footer from './Footer.tsx';
import ScrollToTop from './ScrollToTop.tsx';
import styles from './Layout.module.css';

function Layout() {
  return (
    <div className={styles.layout}>
      <ScrollToTop />
      <Header />
      <main id="main" className={`wrap ${styles.main}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
