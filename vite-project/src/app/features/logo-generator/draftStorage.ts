import { defaultLogoGeneratorDraft, logoGeneratorStorageKey, logoPaletteNames, logoStyles } from './constants';
import type { LogoGeneratorDraft, PaletteName, SavedLogo, LogoStyle } from './types';

function isSavedLogo(value: unknown): value is SavedLogo {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<SavedLogo>;
  return typeof candidate.id === 'string'
    && typeof candidate.label === 'string'
    && typeof candidate.brandName === 'string'
    && typeof candidate.createdAt === 'string'
    && typeof candidate.svg === 'string'
    && typeof candidate.seed === 'number'
    && logoStyles.includes(candidate.style as LogoStyle)
    && logoPaletteNames.includes(candidate.palette as PaletteName);
}

export function readStoredLogoDraft() {
  if (typeof window === 'undefined') {
    return { draft: defaultLogoGeneratorDraft, restored: false };
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(logoGeneratorStorageKey) ?? 'null') as Partial<LogoGeneratorDraft> | null;

    if (!parsed) {
      return { draft: defaultLogoGeneratorDraft, restored: false };
    }

    return {
      draft: {
        brandName: typeof parsed.brandName === 'string' ? parsed.brandName : defaultLogoGeneratorDraft.brandName,
        favorites: Array.isArray(parsed.favorites) ? parsed.favorites.filter(isSavedLogo).slice(0, 12) : [],
        palette: logoPaletteNames.includes(parsed.palette as PaletteName) ? parsed.palette as PaletteName : defaultLogoGeneratorDraft.palette,
        seed: typeof parsed.seed === 'number' ? parsed.seed : defaultLogoGeneratorDraft.seed,
        style: logoStyles.includes(parsed.style as LogoStyle) ? parsed.style as LogoStyle : defaultLogoGeneratorDraft.style,
      },
      restored: true,
    };
  } catch {
    return { draft: defaultLogoGeneratorDraft, restored: false };
  }
}
