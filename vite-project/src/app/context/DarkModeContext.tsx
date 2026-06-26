/**
 * Provides theme state and persistence for dark mode.
 * The `dark` class is applied to the root element to integrate with utility classes.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { WithChildren } from '../types/common';

export type DarkModeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);
const darkModeStorageKey = 'web5:dark-mode:v1';
const legacyDarkModeStorageKey = 'darkMode';

function readStoredDarkMode() {
  try {
    const storedMode = localStorage.getItem(darkModeStorageKey) ?? localStorage.getItem(legacyDarkModeStorageKey);
    return storedMode === 'true';
  } catch {
    return false;
  }
}

function persistDarkMode(isEnabled: boolean) {
  try {
    localStorage.setItem(darkModeStorageKey, String(isEnabled));
    localStorage.removeItem(legacyDarkModeStorageKey);
  } catch {
    // Storage can be disabled; keep the in-memory theme state working.
  }
}

export function DarkModeProvider({ children }: WithChildren) {
  const [isDarkMode, setIsDarkMode] = useState(readStoredDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    persistDarkMode(isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((current) => !current);
  }, []);

  const contextValue = useMemo(() => ({ isDarkMode, toggleDarkMode }), [isDarkMode, toggleDarkMode]);

  return (
    <DarkModeContext.Provider value={contextValue}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
}
