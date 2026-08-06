import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import {
  configurableSectionKeys,
  defaultPageAccess,
  defaultSiteSettings,
  isPageAccessLevel,
  type SiteMenuVisibility,
  type SitePageAccess,
  type SiteSettings,
} from '../types/siteSettings';

const settingsCollection = 'siteSettings';
const generalSettingsDocId = 'general';

function requireDb() {
  if (!db) {
    throw new Error('Firestore 환경변수가 설정되지 않았습니다.');
  }

  return db;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeMenuVisibility(value: unknown): SiteMenuVisibility {
  const rawVisibility = isRecord(value) ? value : {};
  const visibility = {} as SiteMenuVisibility;

  for (const key of configurableSectionKeys) {
    visibility[key] = typeof rawVisibility[key] === 'boolean' ? rawVisibility[key] : true;
  }

  return visibility;
}

function normalizePageAccess(value: unknown): SitePageAccess {
  const rawAccess = isRecord(value) ? value : {};
  const access = {} as SitePageAccess;

  for (const key of configurableSectionKeys) {
    access[key] = isPageAccessLevel(rawAccess[key]) ? rawAccess[key] : defaultPageAccess[key];
  }

  return access;
}

export function normalizeSiteSettings(data: unknown): SiteSettings {
  if (!isRecord(data)) {
    return defaultSiteSettings;
  }

  return {
    maintenanceMode: typeof data.maintenanceMode === 'boolean' ? data.maintenanceMode : false,
    menuVisibility: normalizeMenuVisibility(data.menuVisibility),
    pageAccess: normalizePageAccess(data.pageAccess),
    signupEnabled: typeof data.signupEnabled === 'boolean' ? data.signupEnabled : true,
    updatedAt: data.updatedAt,
    updatedBy: typeof data.updatedBy === 'string' ? data.updatedBy : null,
  };
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const snapshot = await getDoc(doc(requireDb(), settingsCollection, generalSettingsDocId));

  if (!snapshot.exists()) {
    return defaultSiteSettings;
  }

  return normalizeSiteSettings(snapshot.data());
}

export async function saveSiteSettings(settings: SiteSettings, updatedBy?: string | null) {
  await setDoc(
    doc(requireDb(), settingsCollection, generalSettingsDocId),
    {
      maintenanceMode: settings.maintenanceMode,
      menuVisibility: settings.menuVisibility,
      pageAccess: settings.pageAccess,
      signupEnabled: settings.signupEnabled,
      updatedAt: serverTimestamp(),
      updatedBy: updatedBy ?? null,
    },
    { merge: true },
  );
}
