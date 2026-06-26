import type { LucideIcon } from 'lucide-react';
import type { AppLanguage } from '../../context/LanguageContext';

export type IconAsset = {
  id: string;
  name: string;
  category: string;
  Icon?: LucideIcon;
  svg?: string;
};

export type StoredIconAsset = Pick<IconAsset, 'category' | 'id' | 'name'> & {
  svg: string;
};

export type SvgLibraryDraft = {
  color: string;
  customIcons: StoredIconAsset[];
  selectedCategory: string;
  size: number;
};

export type CustomSvgLibraryCopy = Record<AppLanguage, {
  aria: {
    color: string;
    copy: (name: string) => string;
    download: (name: string) => string;
    remove: (name: string) => string;
    size: string;
  };
  builtInCount: (count: number) => string;
  categories: Record<string, string>;
  clearFilters: string;
  clearImported: string;
  copiedBanner: string;
  countSummary: (visible: number, total: number) => string;
  downloadZip: string;
  emptyDescription: string;
  emptyTitle: string;
  iconNames: Record<string, string>;
  importedBadge: string;
  importedCount: (count: number) => string;
  importSvg: string;
  page: {
    description: string;
    highlight: string;
    title: string;
  };
  remove: string;
  searchPlaceholder: string;
  showingCount: (count: number) => string;
  status: {
    added: (fileName: string) => string;
    cleared: string;
    clipboardBlocked: string;
    copied: (name: string) => string;
    customRemoved: string;
    invalid: (fileName: string) => string;
    noImported: string;
    noVisible: string;
    packed: (count: number) => string;
    ready: string;
    removed: (name: string) => string;
    restored: string;
  };
}>;

export type CustomSvgLibraryText = CustomSvgLibraryCopy[AppLanguage];
