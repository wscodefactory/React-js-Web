import type { ReactNode } from 'react';
import { Link, Navigate, useLocation } from 'react-router';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { roleLabels, type UserRole } from '../../types/auth';
import { Card, CardContent } from '../common';
import { AuthSetupNotice } from './AuthSetupNotice';

export function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: ReactNode;
  requiredRole?: UserRole;
}) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.firebaseReady) {
    return (
      <div className="container-page">
        <AuthSetupNotice missingKeys={auth.missingConfigKeys} />
      </div>
    );
  }

  if (auth.isLoading) {
    return (
      <div className="container-page flex min-h-[50vh] items-center justify-center">
        <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
          <Loader2 className="h-4 w-4 animate-spin" />
          로그인 상태를 확인하고 있습니다.
        </div>
      </div>
    );
  }

  if (!auth.user) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  if (requiredRole && !auth.hasRole(requiredRole)) {
    return (
      <div className="container-page">
        <Card className="border-red-200 bg-red-50 dark:border-red-900/60 dark:bg-red-950/30">
          <CardContent>
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-1 h-6 w-6 shrink-0 text-red-600 dark:text-red-400" />
                <div>
                  <h1 className="text-xl font-semibold text-red-950 dark:text-red-100">접근 권한이 부족합니다</h1>
                  <p className="mt-2 text-sm text-red-800 dark:text-red-200">
                    이 화면은 {roleLabels[requiredRole]} 이상만 사용할 수 있습니다. 현재 권한은 {roleLabels[auth.role]}입니다.
                  </p>
                </div>
              </div>
              <Link
                to="/account"
                className="btn btn-secondary inline-flex items-center justify-center whitespace-nowrap"
              >
                내 계정 보기
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return children;
}
