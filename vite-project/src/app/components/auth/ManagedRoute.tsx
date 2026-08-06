import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import type { UserRole } from '../../types/auth';
import {
  getRequiredRoleForAccess,
  isConfigurableSectionKey,
  type ConfigurableSectionKey,
} from '../../types/siteSettings';
import type { RouteSectionKey } from '../../types/navigation';
import { ProtectedRoute } from './ProtectedRoute';

type ManagedRouteProps = {
  children: ReactNode;
  requiredRole?: UserRole;
  requiresAuth?: boolean;
  sectionKey?: RouteSectionKey;
};

function getConfigurableSectionKey(sectionKey?: RouteSectionKey): ConfigurableSectionKey | undefined {
  return isConfigurableSectionKey(sectionKey) ? sectionKey : undefined;
}

function SettingsLoadingState() {
  return (
    <div className="container-page flex min-h-[50vh] items-center justify-center">
      <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
        <Loader2 className="h-4 w-4 animate-spin" />
        페이지 설정을 확인하고 있습니다.
      </div>
    </div>
  );
}

export function ManagedRoute({ children, requiredRole, requiresAuth, sectionKey }: ManagedRouteProps) {
  const { isLoading, settings } = useSiteSettings();
  const configurableSectionKey = getConfigurableSectionKey(sectionKey);
  const configuredAccess = configurableSectionKey ? settings.pageAccess[configurableSectionKey] : 'public';
  const configuredRole = getRequiredRoleForAccess(configuredAccess);
  const shouldRequireAuth = Boolean(requiresAuth || requiredRole || configuredAccess !== 'public');
  const effectiveRequiredRole = requiredRole ?? configuredRole;

  if (!shouldRequireAuth) {
    return <>{children}</>;
  }

  if (isLoading && !requiresAuth && !requiredRole) {
    return <SettingsLoadingState />;
  }

  return <ProtectedRoute requiredRole={effectiveRequiredRole}>{children}</ProtectedRoute>;
}
