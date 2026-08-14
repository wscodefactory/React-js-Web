import { Suspense, type ComponentType, type ReactElement } from 'react';
import { createBrowserRouter } from 'react-router';
import { Loader2 } from 'lucide-react';
import { ManagedRoute } from './components/auth/ManagedRoute';
import { Layout } from './components/Layout';
import { routeSections } from './config/navigation';
import type { RouteSectionKey } from './types/navigation';
import type { UserRole } from './types/auth';

type RouteAccess = {
  requiredRole?: UserRole;
  requiresAuth?: boolean;
};

function RouteLoadingState() {
  return (
    <div className="container-page flex min-h-[50vh] items-center justify-center">
      <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
        <Loader2 className="h-4 w-4 animate-spin" />
        화면을 불러오고 있습니다.
      </div>
    </div>
  );
}

function createRouteElement(Component: ComponentType, access: RouteAccess, sectionKey?: RouteSectionKey): ReactElement {
  const page = (
    <Suspense fallback={<RouteLoadingState />}>
      <Component />
    </Suspense>
  );

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
