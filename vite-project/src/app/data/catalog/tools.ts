import { Accessibility, Code, Copy, LayoutGrid, Palette, Server, Wand2 } from 'lucide-react';
import type { CatalogItem } from '../../types/catalog';

export const toolCatalog: CatalogItem[] = [
  { name: 'Logo Generator', description: 'Create simple logo directions and export the best ones.', path: '/tools/logo-generator', icon: Wand2, badge: 'New', category: 'generator' },
  { name: "PowerT's Toolkit", description: 'Clean up snippets and turn them into implementation notes.', path: '/tools/powerts-toolkit', icon: Code, category: 'conversion' },
  { name: 'Form Builder', description: 'Assemble fields, preview the form, and export the result.', path: '/tools/form-builder', icon: LayoutGrid, category: 'builder' },
  { name: 'SVG Editor', description: 'Draw, adjust, preview, and export SVG assets.', path: '/tools/svg-editor', icon: Copy, category: 'graphics' },
  { name: 'Mock API Studio', description: 'Design mock endpoints and copy fetch or MSW snippets.', path: '/tools/mock-api-studio', icon: Server, badge: 'New', category: 'api' },
  { name: 'Theme Builder', description: 'Tune colors, spacing, and radius, then export CSS tokens.', path: '/tools/theme-builder', icon: Palette, badge: 'New', category: 'design' },
  { name: 'Accessibility Checker', description: 'Scan markup for common a11y issues before handoff.', path: '/tools/accessibility-checker', icon: Accessibility, badge: 'New', category: 'quality' },
];
