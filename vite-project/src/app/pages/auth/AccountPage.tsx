import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { CheckCircle2, Clock3, Crown, LogOut, RefreshCw, Send, ShieldCheck, UserRound, XCircle } from 'lucide-react';
import { AuthSetupNotice } from '../../components/auth/AuthSetupNotice';
import { Button, Card, CardContent, CardHeader } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { recordActivity } from '../../services/activityService';
import {
  cancelMembershipRequest,
  getMembershipRequest,
  submitMembershipRequest,
} from '../../services/membershipRequestService';
import { getRolePermissions, membershipPlanLabels, roleDescriptions, roleLabels } from '../../types/auth';
import type { MembershipRequest } from '../../types/membership-request';

const permissionLabels = {
  canEditContent: '콘텐츠 수정',
  canManageData: '데이터 관리',
  canManageOwners: '최고 관리자 지정',
  canManageUsers: '회원 관리',
  canReadContent: '콘텐츠 조회',
} as const;

export function AccountPage() {
  const auth = useAuth();
  const [membershipError, setMembershipError] = useState('');
  const [membershipRequest, setMembershipRequest] = useState<MembershipRequest | null>(null);
  const [isMembershipLoading, setIsMembershipLoading] = useState(false);

  useEffect(() => {
    if (!auth.user) {
      setMembershipRequest(null);
      return;
    }

    let isActive = true;
    setIsMembershipLoading(true);
    setMembershipError('');

    void getMembershipRequest(auth.user.uid)
      .then((request) => {
        if (isActive) setMembershipRequest(request);
      })
      .catch((error) => {
        if (isActive) {
          setMembershipError(error instanceof Error ? error.message : '회원 등급 신청 상태를 불러오지 못했습니다.');
        }
      })
      .finally(() => {
        if (isActive) setIsMembershipLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [auth.user]);

  const handleSubmitMembership = async () => {
    if (!auth.user) return;

    setIsMembershipLoading(true);
    setMembershipError('');

    try {
      setMembershipRequest(await submitMembershipRequest(auth.user));
      void recordActivity({
        displayName: auth.user.displayName,
        email: auth.user.email,
        role: auth.role,
        uid: auth.user.uid,
      }, {
        action: 'membership.request.created',
        summary: '프로 회원 등급을 신청했습니다.',
        targetId: auth.user.uid,
      }).catch((error) => console.warn('Failed to record membership request activity.', error));
    } catch (error) {
      setMembershipError(error instanceof Error ? error.message : '프로 등급을 신청하지 못했습니다.');
    } finally {
      setIsMembershipLoading(false);
    }
  };

  const handleCancelMembership = async () => {
    if (!auth.user) return;

    setIsMembershipLoading(true);
    setMembershipError('');

    try {
      setMembershipRequest(await cancelMembershipRequest(auth.user.uid));
      void recordActivity({
        displayName: auth.user.displayName,
        email: auth.user.email,
        role: auth.role,
        uid: auth.user.uid,
      }, {
        action: 'membership.request.cancelled',
        summary: '프로 회원 등급 신청을 취소했습니다.',
        targetId: auth.user.uid,
      }).catch((error) => console.warn('Failed to record membership cancellation activity.', error));
    } catch (error) {
      setMembershipError(error instanceof Error ? error.message : '프로 등급 신청을 취소하지 못했습니다.');
    } finally {
      setIsMembershipLoading(false);
    }
  };

  if (!auth.firebaseReady) {
    return (
      <div className="container-page">
        <AuthSetupNotice missingKeys={auth.missingConfigKeys} />
      </div>
    );
  }

  if (!auth.user) {
    return (
      <div className="container-page">
        <Card>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">Account</p>
                <h1 className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">로그인이 필요합니다</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  계정 정보를 보려면 먼저 로그인하거나 새 계정을 만들어주세요.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to="/auth/login" className="btn btn-primary">로그인</Link>
                <Link to="/auth/signup" className="btn btn-secondary">회원가입</Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const permissions = getRolePermissions(auth.role);

  return (
    <div className="container-page space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-green-600 to-gray-900 p-6 text-white md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold text-green-100">Account</p>
            <h1 className="mt-2 text-3xl font-bold">내 계정</h1>
            <p className="mt-3 max-w-2xl text-sm text-green-50">
              로그인 상태, 현재 권한, Firestore 프로필 정보를 한곳에서 확인합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/security"
              className="btn btn-secondary border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              <ShieldCheck className="mr-2 inline h-4 w-4" />
              보안 센터
            </Link>
            <Button
              type="button"
              variant="secondary"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              onClick={auth.refreshSession}
            >
              <RefreshCw className="mr-2 inline h-4 w-4" />
              권한 새로고침
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              onClick={auth.signOut}
            >
              <LogOut className="mr-2 inline h-4 w-4" />
              로그아웃
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <Card>
          <CardHeader
            title="계정 정보"
            description="Firebase Auth에 저장된 기본 로그인 정보입니다."
            icon={<UserRound className="h-5 w-5 text-green-600" />}
          />
          <CardContent className="space-y-4">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">이메일</dt>
                <dd className="mt-1 text-sm text-gray-950 dark:text-white">{auth.user.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">표시 이름</dt>
                <dd className="mt-1 text-sm text-gray-950 dark:text-white">{auth.user.displayName || '미설정'}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">UID</dt>
                <dd className="mt-1 break-all text-sm text-gray-950 dark:text-white">{auth.user.uid}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">로그인 상태</dt>
                <dd className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-green-700 dark:text-green-300">
                  <CheckCircle2 className="h-4 w-4" />
                  활성
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">회원 등급</dt>
                <dd className="mt-1">
                  <span className={`badge ${auth.membershipPlan === 'pro' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' : 'badge-success'}`}>
                    {membershipPlanLabels[auth.membershipPlan]}
                  </span>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="현재 권한"
            description={roleDescriptions[auth.role]}
            icon={<ShieldCheck className="h-5 w-5 text-green-600" />}
            badge={<span className="badge badge-success">{roleLabels[auth.role]}</span>}
          />
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {permissions
                ? Object.entries(permissionLabels).map(([key, label]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700"
                    >
                      <span className="text-gray-700 dark:text-gray-200">{label}</span>
                      <span className={permissions[key as keyof typeof permissions] ? 'text-green-600' : 'text-gray-400'}>
                        {permissions[key as keyof typeof permissions] ? '허용' : '제한'}
                      </span>
                    </div>
                  ))
                : null}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="회원 등급"
          description="프로 전용 컴포넌트 이용 상태와 신청 결과를 확인합니다."
          icon={<Crown className="h-5 w-5 text-purple-600" />}
          badge={(
            <span className={`badge ${auth.membershipPlan === 'pro' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' : 'badge-success'}`}>
              {membershipPlanLabels[auth.membershipPlan]}
            </span>
          )}
        />
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              {auth.membershipPlan === 'pro' ? (
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-purple-700 dark:text-purple-300">
                  <CheckCircle2 className="h-4 w-4" />
                  프로 회원 전용 컴포넌트를 사용할 수 있습니다.
                </p>
              ) : auth.isAdmin ? (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  관리자 계정은 운영 확인을 위해 프로 콘텐츠에 접근할 수 있습니다.
                </p>
              ) : membershipRequest?.status === 'pending' ? (
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                  <Clock3 className="h-4 w-4" />
                  프로 등급 신청을 관리자가 검토하고 있습니다.
                </p>
              ) : membershipRequest?.status === 'approved' ? (
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-300">
                  <CheckCircle2 className="h-4 w-4" />
                  등급 적용이 완료되었습니다. 권한을 새로고침하거나 다시 로그인해주세요.
                </p>
              ) : membershipRequest?.status === 'rejected' ? (
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-300">
                  <XCircle className="h-4 w-4" />
                  이전 신청이 승인되지 않았습니다. 다시 신청할 수 있습니다.
                </p>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  일반 회원입니다. 프로 전용 컴포넌트가 필요하면 등급을 신청해주세요.
                </p>
              )}

              {membershipError ? (
                <p className="mt-3 text-sm text-red-600 dark:text-red-300">{membershipError}</p>
              ) : null}
            </div>

            {!auth.isAdmin && auth.membershipPlan !== 'pro' ? (
              membershipRequest?.status === 'pending' ? (
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isMembershipLoading}
                  onClick={() => void handleCancelMembership()}
                  className="shrink-0"
                >
                  <XCircle className="mr-2 inline h-4 w-4" />
                  신청 취소
                </Button>
              ) : membershipRequest?.status === 'approved' ? (
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isMembershipLoading}
                  onClick={() => void auth.refreshSession()}
                  className="shrink-0"
                >
                  <RefreshCw className="mr-2 inline h-4 w-4" />
                  권한 새로고침
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={isMembershipLoading}
                  onClick={() => void handleSubmitMembership()}
                  className="shrink-0"
                >
                  <Send className="mr-2 inline h-4 w-4" />
                  프로 등급 신청
                </Button>
              )
            ) : null}
          </div>
        </CardContent>
      </Card>

      {auth.profile?.role && auth.profile.role !== auth.role ? (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900/60 dark:bg-yellow-950/30">
          <CardContent>
            <p className="text-sm text-yellow-900 dark:text-yellow-100">
              Firestore 프로필 권한은 {roleLabels[auth.profile.role]}이지만, 보안에 사용되는 Custom Claim 권한은 {roleLabels[auth.role]}입니다.
              관리자 권한 변경 후에는 관리자 스크립트로 Custom Claim까지 맞춰주세요.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
