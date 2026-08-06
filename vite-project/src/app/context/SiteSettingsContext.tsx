import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { isFirebaseConfigured } from '../services/firebase';
import { fetchSiteSettings, saveSiteSettings } from '../services/siteSettingsService';
import { defaultSiteSettings, type SiteSettings } from '../types/siteSettings';

type SiteSettingsContextValue = {
  errorMessage: string;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  saveSettings: (settings: SiteSettings, updatedBy?: string | null) => Promise<void>;
  settings: SiteSettings;
};

const SiteSettingsContext = createContext<SiteSettingsContextValue | undefined>(undefined);

function getSettingsErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return '사이트 설정을 불러오지 못했습니다.';
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(isFirebaseConfigured);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  const refreshSettings = useCallback(async () => {
    if (!isFirebaseConfigured) {
      setErrorMessage('');
      setIsLoading(false);
      setSettings(defaultSiteSettings);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      setSettings(await fetchSiteSettings());
    } catch (error) {
      setErrorMessage(getSettingsErrorMessage(error));
      setSettings(defaultSiteSettings);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSettings = useCallback(async (nextSettings: SiteSettings, updatedBy?: string | null) => {
    setErrorMessage('');
    await saveSiteSettings(nextSettings, updatedBy);
    setSettings({
      ...nextSettings,
      updatedBy: updatedBy ?? null,
    });
  }, []);

  useEffect(() => {
    void refreshSettings();
  }, [refreshSettings]);

  const value = useMemo<SiteSettingsContextValue>(() => ({
    errorMessage,
    isLoading,
    refreshSettings,
    saveSettings,
    settings,
  }), [errorMessage, isLoading, refreshSettings, saveSettings, settings]);

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);

  if (!context) {
    throw new Error('useSiteSettings must be used inside SiteSettingsProvider.');
  }

  return context;
}
