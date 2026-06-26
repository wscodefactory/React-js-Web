export type LogoStyle = 'Minimal' | 'Modern' | 'Geometric' | 'Badge';
export type PaletteName = 'Forest' | 'Ocean' | 'Sunset' | 'Mono';

export interface LogoOption {
  id: string;
  label: string;
  svg: string;
}

export interface SavedLogo {
  brandName: string;
  createdAt: string;
  id: string;
  label: string;
  palette: PaletteName;
  seed: number;
  style: LogoStyle;
  svg: string;
}

export type LogoGeneratorDraft = {
  brandName: string;
  favorites: SavedLogo[];
  palette: PaletteName;
  seed: number;
  style: LogoStyle;
};

export type LogoGeneratorCopy = {
  aria: {
    copy: (label: string) => string;
    downloadPng: (label: string) => string;
    downloadSvg: (label: string) => string;
    removeSaved: (label: string) => string;
    saveToggle: (saved: boolean, label: string) => string;
    savedCopy: (label: string) => string;
    savedDownload: (label: string) => string;
  };
  brandName: string;
  downloadPngSet: string;
  downloadSaved: string;
  downloadSvgZip: string;
  emptySaved: string;
  optionDescription: string;
  optionLabels: {
    primary: string;
    variation: (variant: number) => string;
  };
  page: {
    description: string;
    highlight: string;
    title: string;
  };
  palette: string;
  paletteLabels: Record<PaletteName, string>;
  refresh: string;
  saved: (count: number) => string;
  savedDescription: string;
  savedTitle: string;
  status: {
    allPngReady: string;
    allSvgPacked: string;
    clipboardBlocked: string;
    copied: (label: string) => string;
    copySaved: (label: string) => string;
    exportPngFailed: string;
    exportPngBatchFailed: string;
    favoriteDownloadEmpty: string;
    favoritePacked: (count: number) => string;
    loadSaved: (label: string) => string;
    pngReady: (label: string) => string;
    ready: string;
    refresh: string;
    removed: (label: string) => string;
    restored: string;
    saved: (label: string) => string;
    savedRemoved: string;
  };
  style: string;
  styleLabels: Record<LogoStyle, string>;
  useSettings: string;
};
