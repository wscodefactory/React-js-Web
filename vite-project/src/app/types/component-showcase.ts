import type { ReactNode } from 'react';

export type ShowcaseBadgeTone = "free" | "pro" | "new" | "featured";

export interface ComponentPreviewItem {
  id?: string;
  title: string;
  description: string;
  badge?: {
    label: string;
    tone?: ShowcaseBadgeTone;
  };
  preview: ReactNode;
  loadSourceCode?: () => Promise<string>;
  sourceCode?: string;
  sourcePath?: string;
}

export interface ComponentShowcaseConfig {
  eyebrow?: string;
  title: string;
  titleHighlight: string;
  description: string;
  updatedAt?: string;
  sections: ComponentPreviewItem[];
}
