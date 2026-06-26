import { customSvgLibraryStorageKey, fallbackSvgLibraryDraft, iconAssets, svgSizeOptions } from './data';
import { sanitizeSvgMarkup } from './svgAsset';
import type { StoredIconAsset, SvgLibraryDraft } from './types';

function isStoredIconAsset(value: unknown): value is StoredIconAsset {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<StoredIconAsset>;
  return typeof candidate.id === 'string'
    && typeof candidate.name === 'string'
    && typeof candidate.category === 'string'
    && typeof candidate.svg === 'string';
}

export function readStoredSvgLibraryDraft() {
  if (typeof window === 'undefined') {
    return { restored: false, draft: fallbackSvgLibraryDraft };
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(customSvgLibraryStorageKey) ?? 'null') as Partial<SvgLibraryDraft> | null;

    if (!parsed || !Array.isArray(parsed.customIcons) || !parsed.customIcons.every(isStoredIconAsset)) {
      return { restored: false, draft: fallbackSvgLibraryDraft };
    }

    const importedIcons = parsed.customIcons.flatMap((asset) => {
      const svg = sanitizeSvgMarkup(asset.svg);

      return svg ? [{ ...asset, svg }] : [];
    });
    const availableCategories = new Set(['All', ...iconAssets.map((asset) => asset.category), ...(importedIcons.length > 0 ? ['Custom'] : [])]);
    const size = typeof parsed.size === 'number' && svgSizeOptions.includes(parsed.size) ? parsed.size : fallbackSvgLibraryDraft.size;

    return {
      restored: true,
      draft: {
        color: typeof parsed.color === 'string' ? parsed.color : fallbackSvgLibraryDraft.color,
        customIcons: importedIcons,
        selectedCategory: typeof parsed.selectedCategory === 'string' && availableCategories.has(parsed.selectedCategory)
          ? parsed.selectedCategory
          : fallbackSvgLibraryDraft.selectedCategory,
        size,
      },
    };
  } catch {
    return { restored: false, draft: fallbackSvgLibraryDraft };
  }
}
