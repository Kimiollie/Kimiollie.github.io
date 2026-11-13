import { createContext, useContext } from 'react';
import type { Theme } from './dayNight.ts';

export interface ThemeContextValue {
  theme: Theme;
  /** Flip day/night by hand; remembered for this visit. */
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'day',
  toggleTheme: () => {},
});

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
