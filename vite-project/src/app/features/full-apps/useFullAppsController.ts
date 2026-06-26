import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../../context/LanguageContext';
import { fullAppCatalog } from '../../data/catalog/full-apps';
import { fullAppsUiText, getCatalogItemCopy, getCatalogSearchText } from '../../i18n';
import { loadStoredJson, saveStoredJson } from '../../utils/storage';
import type { FullAppItem, ViewMode } from './types';

const favoritesStorageKey = 'web5:full-app-favorites:v1';
const viewModeStorageKey = 'web5:full-app-view-mode:v1';
const lastOpenedStorageKey = 'web5:full-app-last-opened:v1';

function readStoredFavorites() {
  return loadStoredJson<string[]>(favoritesStorageKey, [], (value): value is string[] => (
    Array.isArray(value) && value.every((favoritePath) => typeof favoritePath === 'string')
  ));
}

function readStoredViewMode(): ViewMode {
  try {
    const legacyViewMode = window.localStorage.getItem(viewModeStorageKey);
    if (legacyViewMode === 'grid' || legacyViewMode === 'list') {
      return legacyViewMode;
    }
  } catch {
    return 'grid';
  }

  return loadStoredJson<ViewMode>(viewModeStorageKey, 'grid', (value): value is ViewMode => value === 'grid' || value === 'list');
}

function readStoredLastOpened() {
  return loadStoredJson<Record<string, string>>(lastOpenedStorageKey, {}, (value): value is Record<string, string> => (
    value !== null
    && typeof value === 'object'
    && !Array.isArray(value)
    && Object.values(value).every((openedAt) => typeof openedAt === 'string')
  ));
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
  const favoritePaths = useMemo(() => new Set(favorites), [favorites]);

  useEffect(() => {
    saveStoredJson(favoritesStorageKey, favorites);
  }, [favorites]);

  useEffect(() => {
    saveStoredJson(viewModeStorageKey, viewMode);
  }, [viewMode]);

  useEffect(() => {
    saveStoredJson(lastOpenedStorageKey, lastOpened);
  }, [lastOpened]);

  useEffect(() => {
    setStatusMessage(text.initialStatus);
  }, [text.initialStatus]);

  const filteredApps = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return fullAppCatalog.filter((app) => {
      const searchableText = getCatalogSearchText(language, app).join(' ').toLowerCase();
      const matchesKeyword = !keyword || searchableText.includes(keyword);
      const matchesFavorite = !favoritesOnly || favoritePaths.has(app.path);

      return matchesKeyword && matchesFavorite;
    });
  }, [favoritePaths, favoritesOnly, language, query]);

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
    isFavorite: (path: string) => favoritePaths.has(path),
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
