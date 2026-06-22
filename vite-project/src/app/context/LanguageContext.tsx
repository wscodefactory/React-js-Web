import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export type AppLanguage = 'en' | 'ko';

const languageStorageKey = 'web5:language:v1';

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function readStoredLanguage(): AppLanguage {
  if (typeof window === 'undefined') {
    return 'ko';
  }

  const storedLanguage = window.localStorage.getItem(languageStorageKey);
  return storedLanguage === 'en' ? 'en' : 'ko';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(readStoredLanguage);

  const setLanguage = (nextLanguage: AppLanguage) => {
    setLanguageState(nextLanguage);
  };

  useEffect(() => {
    window.localStorage.setItem(languageStorageKey, language);
    document.documentElement.lang = language === 'ko' ? 'ko' : 'en';
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    toggleLanguage: () => setLanguageState((current) => (current === 'ko' ? 'en' : 'ko')),
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider.');
  }

  return context;
}
