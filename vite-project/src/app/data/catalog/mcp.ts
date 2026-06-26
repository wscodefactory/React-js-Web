import { Cloud, Code2, Lock, Shield, Users, Zap } from 'lucide-react';
import type { FeatureItem } from '../../types/catalog';

export const mcpFeatures: FeatureItem[] = [
  { title: 'Build custom components', description: 'Create UI modules your team can reuse with confidence.', icon: Code2 },
  { title: 'Combine common UIs', description: 'Turn calendars, builders, and forms into larger templates.', icon: Cloud },
  { title: 'Launch a product', description: 'Move from reusable pieces to complete product screens.', icon: Zap },
  { title: 'Create with governance', description: 'Package assets with shared standards and team conventions.', icon: Shield },
  { title: 'Integrate native controls', description: 'Blend custom modules with the controls teams already use.', icon: Lock },
  { title: 'Generate full apps', description: 'Start from structured templates and grow with shared assets.', icon: Users },
];
