import type { fullAppCatalog } from '../../data/catalog/full-apps';

export type FullAppItem = (typeof fullAppCatalog)[number];
export type ViewMode = 'grid' | 'list';
