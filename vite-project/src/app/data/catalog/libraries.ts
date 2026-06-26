import { FileCode, Palette } from 'lucide-react';
import type { CatalogItem } from '../../types/catalog';

export const libraryCatalog: CatalogItem[] = [
  { name: 'YAML Library', description: 'Save, convert, and reuse YAML snippets.', path: '/libraries/yaml-library', icon: FileCode, category: 'assets' },
  { name: 'Custom SVG Library', description: 'Collect, tune, and export SVG icons.', path: '/libraries/custom-svg-library', icon: Palette, category: 'graphics' },
];
