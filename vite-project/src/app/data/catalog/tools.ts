import { Code, Copy, LayoutGrid, Wand2 } from 'lucide-react';
import type { CatalogItem } from '../../types/catalog';

export const toolCatalog: CatalogItem[] = [
  { name: 'Logo Generator', description: 'AI-assisted logo creation workflow for quick concept generation.', path: '/tools/logo-generator', icon: Wand2, badge: 'New', category: 'generator' },
  { name: "PowerT's Toolkit", description: 'Convert PowerT code into React or vanilla JavaScript implementations.', path: '/tools/powerts-toolkit', icon: Code, category: 'conversion' },
  { name: 'Form Builder', description: 'Build forms with a visual workflow and configurable field presets.', path: '/tools/form-builder', icon: LayoutGrid, category: 'builder' },
  { name: 'SVG Editor', description: 'Edit, preview, and export SVG assets in one workspace.', path: '/tools/svg-editor', icon: Copy, category: 'graphics' },
];
