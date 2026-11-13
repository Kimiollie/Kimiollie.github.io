import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { RECHECK_MS, storeTheme, storedTheme, themeAt, type Theme } from './dayNight.ts';
import { ThemeContext } from './themeContext.ts';

/** --bg for day and night (src/styles/tokens.css). */
const THEME_COLOR: Record<Theme, string> = { day: '#fbf8f2', night: '#151a2c' };

/**
 * Day or night: a manual choice from this visit (sessionStorage), otherwise the local time.
 * Re-checks the time every 5 minutes, but never overrides a manual choice.
 */
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => storedTheme() ?? themeAt(new Date()));
  const manual = useRef(storedTheme() !== null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    // Browser bar colour follows the site's theme (the page background).
    for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
      meta.setAttribute('content', THEME_COLOR[theme]);
    }
  }, [theme]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!manual.current) setTheme(themeAt(new Date()));
    }, RECHECK_MS);
    return () => window.clearInterval(timer);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'day' ? 'night' : 'day';
      manual.current = true;
      storeTheme(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export default ThemeProvider;
