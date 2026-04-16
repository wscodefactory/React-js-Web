import type { LucideIcon } from 'lucide-react';

export interface CatalogItem {
  name: string;
  description: string;
  path: string;
  badge?: string;
  category?: string;
  icon?: LucideIcon;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: LucideIcon;
}
