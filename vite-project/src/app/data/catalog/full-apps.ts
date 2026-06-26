import type { CatalogItem } from '../../types/catalog';

export const fullAppCatalog: CatalogItem[] = [
  { name: 'Chrome Extensions', description: 'Plan files, permissions, popup previews, and setup notes.', path: '/full-apps/chrome-extensions', category: 'extension' },
  { name: 'Feedback App', description: 'Collect feedback, track ratings, and draft responses.', path: '/full-apps/feedback-app', category: 'workflow' },
  { name: 'Project Management App', description: 'Track projects, tasks, progress, and team ownership.', path: '/full-apps/project-management', category: 'operations' },
  { name: 'Cleaning Confirmation', description: 'Manage visits, room checks, and final confirmation.', path: '/full-apps/cleaning-confirmation', category: 'field service' },
];
