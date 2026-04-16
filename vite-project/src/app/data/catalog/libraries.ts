import { FileCode, Palette } from 'lucide-react';
import type { CatalogItem } from '../../types/catalog';

export const libraryCatalog: CatalogItem[] = [
  { name: 'YAML Library', description: 'Store and manage reusable YAML assets for faster development.', path: '/libraries/yaml-library', icon: FileCode, category: 'assets' },
  { name: 'Custom SVG Library', description: 'Import, organize, and reuse custom SVG icons.', path: '/libraries/custom-svg-library', icon: Palette, category: 'graphics' },
];
