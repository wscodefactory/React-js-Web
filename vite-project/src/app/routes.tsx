import type { ComponentType, ReactElement } from 'react';
import { createBrowserRouter } from 'react-router';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/Layout';
import { routeSections } from './config/navigation';
import type { UserRole } from './types/auth';

type RouteAccess = {
  requiredRole?: UserRole;
  requiresAuth?: boolean;
};

function createRouteElement(Component: ComponentType, access: RouteAccess): ReactElement {
  const page = <Component />;

  if (access.requiresAuth || access.requiredRole) {
    return <ProtectedRoute requiredRole={access.requiredRole}>{page}</ProtectedRoute>;
  }

  return page;
}

const childRoutes = routeSections.flatMap((section) => {
  const routes = [] as Array<{ index?: true; path?: string; element: ReactElement }>;

  if (section.basePath === '/') {
    routes.push({
      index: true,
      element: createRouteElement(section.landingComponent, section),
    });
  } else {
    routes.push({
      path: section.basePath.slice(1),
      element: createRouteElement(section.landingComponent, section),
    });
  }

  for (const child of section.children ?? []) {
    if (!child.slug) continue;
    routes.push({
      path: child.slug,
      element: createRouteElement(child.component, child),
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
