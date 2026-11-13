/** Day = 07:00–17:59, night = 18:00–06:59, in the visitor's local time. Change here only. */
export const DAY_START = 7;
export const NIGHT_START = 18;

/** How often the time is checked again (ms). */
export const RECHECK_MS = 5 * 60 * 1000;

/** sessionStorage key for a manual choice made during this visit. */
export const THEME_STORAGE_KEY = 'ollie-theme';

export type Theme = 'day' | 'night';

export function isDayAt(date: Date): boolean {
  const hour = date.getHours();
  return hour >= DAY_START && hour < NIGHT_START;
}

export function themeAt(date: Date): Theme {
  return isDayAt(date) ? 'day' : 'night';
}

/** The manual choice from this visit, if any. */
export function storedTheme(): Theme | null {
  try {
    const value = window.sessionStorage.getItem(THEME_STORAGE_KEY);
    return value === 'day' || value === 'night' ? value : null;
  } catch {
    return null;
  }
}

export function storeTheme(theme: Theme): void {
  try {
    window.sessionStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked (private mode); the choice then lasts until reload.
  }
}
