import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  Clock3,
  KeyRound,
  LockKeyhole,
  LogOut,
  Mail,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { AuthSetupNotice } from '../components/auth/AuthSetupNotice';
import { Button, Card, CardContent, CardHeader, Input } from '../components/common';
import { useAuth } from '../context/AuthContext';
import { listUserActivityLogs, recordActivity } from '../services/activityService';
import {
  changeUserPassword,
  hasPasswordProvider,
  sendCurrentUserPasswordReset,
} from '../services/authService';
import { activityActionLabels, type ActivityLog } from '../types/activity';

const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

function formatDate(value: unknown) {
  const date = value instanceof Date
    ? value
    : typeof value === 'string'
      ? new Date(value)
      : value && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate?: unknown }).toDate === 'function'
        ? ((value as { toDate: () => Date }).toDate())
        : null;

  if (!date || Number.isNaN(date.getTime())) return '기록 없음';

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function getAuthErrorCode(error: unknown) {
  if (!error || typeof error !== 'object' || !('code' in error)) return null;
  return typeof error.code === 'string' ? error.code : null;
}

function getSecurityErrorMessage(error: unknown) {
  switch (getAuthErrorCode(error)) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return '현재 비밀번호가 올바르지 않습니다.';
    case 'auth/weak-password':
      return '새 비밀번호의 보안 조건을 확인해주세요.';
    case 'auth/too-many-requests':
      return '요청이 너무 많습니다. 잠시 뒤 다시 시도해주세요.';
    case 'auth/network-request-failed':
      return '네트워크 연결을 확인해주세요.';
    case 'auth/requires-recent-login':
      return '보안을 위해 다시 로그인한 뒤 시도해주세요.';
    case 'auth/password-provider-required':
      return '이 계정은 이메일 비밀번호 방식으로 로그인하지 않아 해당 기능을 사용할 수 없습니다.';
    case 'permission-denied':
      return '보안 활동 조회 권한을 확인하지 못했습니다. Firestore 보안 규칙을 최신 상태로 적용해주세요.';
    default:
      return error instanceof Error ? error.message : '보안 작업을 완료하지 못했습니다.';
  }
}

export function SecurityCenterPage() {
  const auth = useAuth();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const user = auth.user;

  const loadActivities = async () => {
    if (!user) return;

    setIsLoadingActivities(true);
    try {
      const userActivities = await listUserActivityLogs(user.uid);
      setActivities(userActivities.filter((activity) => activity.action.startsWith('auth.')).slice(0, 12));
    } catch (error) {
      setErrorMessage(getSecurityErrorMessage(error));
    } finally {
      setIsLoadingActivities(false);
    }
  };

  useEffect(() => {
    void loadActivities();
  }, [user?.uid]);

  const passwordEnabled = useMemo(() => user ? hasPasswordProvider(user) : false, [user]);

  if (!auth.firebaseReady) {
    return <div className="container-page"><AuthSetupNotice missingKeys={auth.missingConfigKeys} /></div>;
  }

  if (!user) {
    return <div className="container-page py-12 text-center text-sm text-gray-600 dark:text-gray-300">로그인 상태를 확인하고 있습니다.</div>;
  }

  const clearMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const logSecurityActivity = (action: 'auth.password.updated' | 'auth.password.reset-requested', summary: string) => {
    void recordActivity({
      displayName: user.displayName,
      email: user.email,
      role: auth.role,
      uid: user.uid,
    }, {
      action,
      summary,
      targetId: user.uid,
    }).then(loadActivities).catch((error) => console.warn('Failed to record security activity.', error));
  };

  const handlePasswordChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearMessages();

    if (!currentPassword) {
      setErrorMessage('현재 비밀번호를 입력해주세요.');
      return;
    }

    if (!passwordPattern.test(newPassword)) {
      setErrorMessage('새 비밀번호는 영문과 숫자를 각각 1개 이상 포함해 8자 이상이어야 합니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('새 비밀번호와 확인 값이 일치하지 않습니다.');
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage('현재 비밀번호와 다른 비밀번호를 입력해주세요.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changeUserPassword(user, currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMessage('비밀번호를 변경했습니다. 다음 로그인부터 새 비밀번호를 사용해주세요.');
      logSecurityActivity('auth.password.updated', '계정 비밀번호를 변경했습니다.');
    } catch (error) {
      setErrorMessage(getSecurityErrorMessage(error));
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handlePasswordReset = async () => {
    clearMessages();
    setIsSendingReset(true);

    try {
      await sendCurrentUserPasswordReset(user);
      setSuccessMessage(`${user.email ?? '계정 이메일'} 주소로 비밀번호 재설정 메일을 보냈습니다.`);
      logSecurityActivity('auth.password.reset-requested', '비밀번호 재설정 메일을 요청했습니다.');
    } catch (error) {
      setErrorMessage(getSecurityErrorMessage(error));
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleSessionRefresh = async () => {
    clearMessages();
    setIsRefreshing(true);

    try {
      await auth.refreshSession();
      setSuccessMessage('로그인 상태와 권한 정보를 새로 확인했습니다.');
    } catch (error) {
      setErrorMessage(getSecurityErrorMessage(error));
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="container-page space-y-6">
      <section className="border-b border-gray-200 pb-6 dark:border-gray-700">
        <p className="text-sm font-semibold text-green-600 dark:text-green-400">Security</p>
        <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-950 dark:text-white">보안 센터</h1>
            <p className="mt-3 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              계정 인증 상태를 확인하고 비밀번호와 현재 로그인 세션을 관리합니다.
            </p>
          </div>
          <Button type="button" variant="secondary" onClick={() => void handleSessionRefresh()} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 inline h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? '확인 중...' : '보안 상태 새로고침'}
          </Button>
        </div>
      </section>

      {errorMessage ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">{errorMessage}</p> : null}
      {successMessage ? <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-100">{successMessage}</p> : null}

      <section aria-label="계정 보안 상태" className="grid overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 md:grid-cols-3">
        <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-700 md:border-b-0 md:border-r">
          <CheckCircle2 className={`h-5 w-5 ${user.emailVerified ? 'text-green-600' : 'text-yellow-500'}`} />
          <div><p className="text-xs text-gray-500 dark:text-gray-400">이메일 인증</p><p className="font-bold text-gray-950 dark:text-white">{user.emailVerified ? '인증 완료' : '확인 필요'}</p></div>
        </div>
        <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-700 md:border-b-0 md:border-r">
          <KeyRound className="h-5 w-5 text-blue-600" />
          <div><p className="text-xs text-gray-500 dark:text-gray-400">로그인 방식</p><p className="font-bold text-gray-950 dark:text-white">{passwordEnabled ? '이메일·비밀번호' : '외부 계정'}</p></div>
        </div>
        <div className="flex items-center gap-3 px-5 py-4">
          <Clock3 className="h-5 w-5 text-gray-500" />
          <div><p className="text-xs text-gray-500 dark:text-gray-400">최근 로그인</p><p className="font-bold text-gray-950 dark:text-white">{formatDate(user.metadata.lastSignInTime)}</p></div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.6fr)]">
        <Card>
          <CardHeader title="비밀번호 변경" description="현재 비밀번호로 본인 확인 후 새 비밀번호를 적용합니다." icon={<LockKeyhole className="h-5 w-5 text-green-600" />} />
          <CardContent className="border-t border-gray-100 dark:border-gray-800">
            <form className="space-y-4" onSubmit={(event) => void handlePasswordChange(event)}>
              <label className="form-group">
                <span className="form-label">현재 비밀번호</span>
                <Input autoComplete="current-password" disabled={!passwordEnabled || isChangingPassword} onChange={(event) => { setCurrentPassword(event.target.value); clearMessages(); }} type="password" value={currentPassword} />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="form-group">
                  <span className="form-label">새 비밀번호</span>
                  <Input autoComplete="new-password" disabled={!passwordEnabled || isChangingPassword} onChange={(event) => { setNewPassword(event.target.value); clearMessages(); }} type="password" value={newPassword} />
                </label>
                <label className="form-group">
                  <span className="form-label">새 비밀번호 확인</span>
                  <Input autoComplete="new-password" disabled={!passwordEnabled || isChangingPassword} onChange={(event) => { setConfirmPassword(event.target.value); clearMessages(); }} type="password" value={confirmPassword} />
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">영문과 숫자를 각각 1개 이상 포함해 8자 이상 입력해주세요.</p>
              <Button type="submit" disabled={!passwordEnabled || isChangingPassword}>
                <KeyRound className="mr-2 inline h-4 w-4" />
                {isChangingPassword ? '변경 중...' : '비밀번호 변경'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="세션 및 복구" description="현재 계정의 로그인 상태와 복구 수단을 관리합니다." icon={<ShieldCheck className="h-5 w-5 text-green-600" />} />
          <CardContent className="space-y-3 border-t border-gray-100 dark:border-gray-800">
            <Button type="button" variant="secondary" className="w-full justify-center" disabled={!passwordEnabled || isSendingReset} onClick={() => void handlePasswordReset()}>
              <Mail className="mr-2 inline h-4 w-4" />
              {isSendingReset ? '메일 발송 중...' : '재설정 메일 보내기'}
            </Button>
            <Button type="button" variant="secondary" className="w-full justify-center" disabled={isRefreshing} onClick={() => void handleSessionRefresh()}>
              <RefreshCw className="mr-2 inline h-4 w-4" />
              로그인 상태 새로고침
            </Button>
            <Button type="button" variant="secondary" className="w-full justify-center" onClick={() => void auth.signOut()}>
              <LogOut className="mr-2 inline h-4 w-4" />
              현재 세션 로그아웃
            </Button>
            <dl className="border-t border-gray-100 pt-4 text-sm dark:border-gray-800">
              <div className="flex justify-between gap-4"><dt className="text-gray-500 dark:text-gray-400">계정 생성</dt><dd className="text-right text-gray-900 dark:text-white">{formatDate(user.metadata.creationTime)}</dd></div>
              <div className="mt-3 flex justify-between gap-4"><dt className="text-gray-500 dark:text-gray-400">계정 이메일</dt><dd className="min-w-0 truncate text-right text-gray-900 dark:text-white">{user.email}</dd></div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader title="최근 보안 활동" description="내 계정에서 기록된 최근 로그인과 비밀번호 관련 활동입니다." icon={<Clock3 className="h-5 w-5 text-green-600" />} />
        <CardContent className="border-t border-gray-100 dark:border-gray-800">
          {isLoadingActivities ? (
            <p className="py-5 text-center text-sm text-gray-600 dark:text-gray-300">보안 활동을 불러오고 있습니다.</p>
          ) : activities.length === 0 ? (
            <p className="py-5 text-center text-sm text-gray-600 dark:text-gray-300">기록된 보안 활동이 없습니다.</p>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {activities.map((activity) => (
                <div key={activity.id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-950 dark:text-white">{activityActionLabels[activity.action]}</p>
                    <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">{activity.summary}</p>
                  </div>
                  <time className="shrink-0 text-xs text-gray-500 dark:text-gray-400">{formatDate(activity.createdAt)}</time>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
