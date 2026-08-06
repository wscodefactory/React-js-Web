import type { ComponentType, ReactElement } from 'react';
import { createBrowserRouter } from 'react-router';
import { ManagedRoute } from './components/auth/ManagedRoute';
import { Layout } from './components/Layout';
import { routeSections } from './config/navigation';
import type { RouteSectionKey } from './types/navigation';
import type { UserRole } from './types/auth';

type RouteAccess = {
  requiredRole?: UserRole;
  requiresAuth?: boolean;
};

function createRouteElement(Component: ComponentType, access: RouteAccess, sectionKey?: RouteSectionKey): ReactElement {
  const page = <Component />;

  return (
    <ManagedRoute requiredRole={access.requiredRole} requiresAuth={access.requiresAuth} sectionKey={sectionKey}>
      {page}
    </ManagedRoute>
  );
}

const childRoutes = routeSections.flatMap((section) => {
  const routes = [] as Array<{ index?: true; path?: string; element: ReactElement }>;

  if (section.basePath === '/') {
    routes.push({
      index: true,
      element: createRouteElement(section.landingComponent, section, section.key),
    });
  } else {
    routes.push({
      path: section.basePath.slice(1),
      element: createRouteElement(section.landingComponent, section, section.key),
    });
  }

  for (const child of section.children ?? []) {
    if (!child.slug) continue;
    routes.push({
      path: child.slug,
      element: createRouteElement(child.component, child, section.key),
    });
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
