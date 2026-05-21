import type { ComponentShowcaseConfig } from '@/app/types/component-showcase';
import { coreComponentShowcases } from './core';
import { interactiveComponentShowcases } from './interactive';
import { layoutComponentShowcases } from './layout';
import { mediaComponentShowcases } from './media';
import { navigationComponentShowcases } from './navigation';

export const componentShowcases: Record<string, ComponentShowcaseConfig> = {
  ...coreComponentShowcases,
  ...interactiveComponentShowcases,
  ...layoutComponentShowcases,
  ...mediaComponentShowcases,
  ...navigationComponentShowcases,
};
