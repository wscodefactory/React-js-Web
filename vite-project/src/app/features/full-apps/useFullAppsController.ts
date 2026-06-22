import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../../context/LanguageContext';
import { fullAppCatalog } from '../../data/catalog/full-apps';
import { fullAppsUiText, getCatalogItemCopy, getCatalogSearchText } from '../../i18n';
import type { FullAppItem, ViewMode } from './types';

const favoritesStorageKey = 'web5:full-app-favorites:v1';
const viewModeStorageKey = 'web5:full-app-view-mode:v1';
const lastOpenedStorageKey = 'web5:full-app-last-opened:v1';

function readStoredFavorites() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(favoritesStorageKey) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function readStoredViewMode(): ViewMode {
  const value = window.localStorage.getItem(viewModeStorageKey);
  return value === 'list' ? 'list' : 'grid';
}

function readStoredLastOpened() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(lastOpenedStorageKey) ?? '{}');
    return parsed && typeof parsed === 'object' ? parsed as Record<string, string> : {};
  } catch {
    return {};
  }
}

export function useFullAppsController() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const text = fullAppsUiText[language];
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>(() => readStoredViewMode());
  const [favorites, setFavorites] = useState<string[]>(() => readStoredFavorites());
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [lastOpened, setLastOpened] = useState<Record<string, string>>(() => readStoredLastOpened());
  const [statusMessage, setStatusMessage] = useState<string>(text.initialStatus);

  useEffect(() => {
    window.localStorage.setItem(favoritesStorageKey, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    window.localStorage.setItem(viewModeStorageKey, viewMode);
  }, [viewMode]);

  useEffect(() => {
    window.localStorage.setItem(lastOpenedStorageKey, JSON.stringify(lastOpened));
  }, [lastOpened]);

  useEffect(() => {
    setStatusMessage(text.initialStatus);
  }, [text.initialStatus]);

  const filteredApps = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return fullAppCatalog.filter((app) => {
      const searchableText = getCatalogSearchText(language, app).join(' ').toLowerCase();
      const matchesKeyword = !keyword || searchableText.includes(keyword);
      const matchesFavorite = !favoritesOnly || favorites.includes(app.path);

      return matchesKeyword && matchesFavorite;
    });
  }, [favorites, favoritesOnly, language, query]);

  const openApp = (app: FullAppItem) => {
    const openedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const appName = getCatalogItemCopy(language, app).name;

    setLastOpened((current) => ({ ...current, [app.path]: openedAt }));
    setStatusMessage(text.opened(appName, openedAt));
    navigate(app.path);
  };

  const toggleFavorite = (app: FullAppItem) => {
    setFavorites((current) => {
      const exists = current.includes(app.path);
      const appName = getCatalogItemCopy(language, app).name;

      setStatusMessage(exists ? text.removed(appName) : text.savedForQuickAccess(appName));

      return exists ? current.filter((path) => path !== app.path) : [...current, app.path];
    });
  };

  const clearFilters = () => {
    setQuery('');
    setFavoritesOnly(false);
  };

  return {
    clearFilters,
    favoritesCount: favorites.length,
    favoritesOnly,
    filteredApps,
    isFavorite: (path: string) => favorites.includes(path),
    lastOpened,
    openApp,
    query,
    setFavoritesOnly,
    setQuery,
    setViewMode,
    statusMessage,
    toggleFavorite,
    totalCount: fullAppCatalog.length,
    viewMode,
  };
}
