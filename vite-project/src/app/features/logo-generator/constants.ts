import type { LogoGeneratorDraft, LogoStyle, PaletteName } from './types';

export const logoStyles: LogoStyle[] = ['Minimal', 'Modern', 'Geometric', 'Badge'];

export const logoPalettes: Record<PaletteName, [string, string, string]> = {
  Forest: ['#16a34a', '#22c55e', '#dcfce7'],
  Ocean: ['#0284c7', '#38bdf8', '#e0f2fe'],
  Sunset: ['#ea580c', '#f97316', '#ffedd5'],
  Mono: ['#111827', '#6b7280', '#f3f4f6'],
};

export const logoPaletteNames = Object.keys(logoPalettes) as PaletteName[];

export const defaultLogoGeneratorDraft: LogoGeneratorDraft = {
  brandName: 'Powerlibs',
  favorites: [],
  palette: 'Forest',
  seed: 0,
  style: 'Modern',
};

export const logoGeneratorStorageKey = 'web5:logo-generator:v1';
