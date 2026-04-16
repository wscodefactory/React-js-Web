import type { ComponentType } from 'react';
/**
 * Browser router created from central route metadata.
 * New pages should be registered in `src/app/config/navigation.tsx` so navigation,
 * search, and route definitions remain synchronized.
 */
import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { routeSections } from './config/navigation';

const childRoutes = routeSections.flatMap((section) => {
  const routes = [] as Array<{ index?: true; path?: string; Component: ComponentType }>;

  if (section.basePath === '/') {
    routes.push({ index: true, Component: section.landingComponent });
  } else {
    routes.push({ path: section.basePath.slice(1), Component: section.landingComponent });
  }

  for (const child of section.children ?? []) {
    if (!child.slug) continue;
    routes.push({ path: child.slug, Component: child.component });
  }

  return routes;
});

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: childRoutes,
  },
]);
