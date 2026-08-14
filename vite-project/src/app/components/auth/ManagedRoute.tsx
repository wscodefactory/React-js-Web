import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Loader2, Wrench } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
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

function MaintenanceState({ isAdmin, isAuthenticated }: { isAdmin: boolean; isAuthenticated: boolean }) {
  return (
    <div className="container-page flex min-h-[55vh] items-center justify-center">
      <section className="w-full max-w-xl border-y border-gray-200 py-10 text-center dark:border-gray-700">
        <Wrench className="mx-auto h-9 w-9 text-green-600 dark:text-green-400" />
        <h1 className="mt-4 text-2xl font-bold text-gray-950 dark:text-white">서비스 점검 중입니다</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
          더 안정적인 이용을 위해 잠시 점검하고 있습니다. 점검이 끝난 뒤 다시 이용해주세요.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link className="btn btn-secondary inline-flex items-center justify-center" to={isAuthenticated ? '/account' : '/auth/login'}>
            {isAuthenticated ? '내 계정' : '로그인'}
          </Link>
          {isAdmin ? (
            <Link className="btn btn-primary inline-flex items-center justify-center" to="/admin/settings">
              사이트 설정
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export function ManagedRoute({ children, requiredRole, requiresAuth, sectionKey }: ManagedRouteProps) {
  const auth = useAuth();
  const { isLoading, settings } = useSiteSettings();
  const configurableSectionKey = getConfigurableSectionKey(sectionKey);
  const configuredAccess = configurableSectionKey ? settings.pageAccess[configurableSectionKey] : 'public';
  const configuredRole = getRequiredRoleForAccess(configuredAccess);
  const shouldRequireAuth = Boolean(requiresAuth || requiredRole || configuredAccess !== 'public');
  const effectiveRequiredRole = requiredRole ?? configuredRole;
  const bypassesMaintenance = sectionKey === 'account' || sectionKey === 'admin' || auth.isAdmin;

  if (isLoading || (settings.maintenanceMode && auth.isLoading && !bypassesMaintenance)) {
    return <SettingsLoadingState />;
  }

  if (settings.maintenanceMode && !bypassesMaintenance) {
    return <MaintenanceState isAdmin={auth.isAdmin} isAuthenticated={auth.isAuthenticated} />;
  }

  if (!shouldRequireAuth) {
    return <>{children}</>;
  }

  return <ProtectedRoute requiredRole={effectiveRequiredRole}>{children}</ProtectedRoute>;
}
