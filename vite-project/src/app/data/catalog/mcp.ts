import { Cloud, Code2, Lock, Shield, Users, Zap } from 'lucide-react';
import type { FeatureItem } from '../../types/catalog';

export const mcpFeatures: FeatureItem[] = [
  { title: 'Build custom components', description: 'Create reusable UI modules for consistent product experiences.', icon: Code2 },
  { title: 'Combine common UIs', description: 'Compose calendars, flow builders, and forms into higher-level templates.', icon: Cloud },
  { title: 'Launch a product', description: 'Turn reusable building blocks into production-ready solutions.', icon: Zap },
  { title: 'Create components with governance', description: 'Package assets with shared standards and team conventions.', icon: Shield },
  { title: 'Integrate native controls', description: 'Blend custom modules with existing Power Apps controls.', icon: Lock },
  { title: 'Generate full apps', description: 'Start from structured templates and scale with shared assets.', icon: Users },
];
