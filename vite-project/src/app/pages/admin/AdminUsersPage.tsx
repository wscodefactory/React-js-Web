import { useEffect, useMemo, useState } from 'react';
import { Check, Clipboard, Crown, Filter, RefreshCw, Search, ShieldAlert, UserCheck, UserX, UsersRound, XCircle } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, Input, Select } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { listUserProfiles, updateUserProfileRole } from '../../services/authService';
import { recordActivity } from '../../services/activityService';
import {
  listMembershipRequests,
  reviewMembershipRequest,
} from '../../services/membershipRequestService';
import { createNotification } from '../../services/notificationService';
import {
  getRolePermissions,
  membershipPlanLabels,
  roleLabels,
  roleOptions,
  userRoles,
  type AppUserProfile,
  type UserRole,
} from '../../types/auth';
import {
  membershipRequestStatusLabels,
  type MembershipRequest,
  type MembershipRequestStatus,
} from '../../types/membership-request';
import { copyTextToClipboard } from '../../utils/clipboard';

type VerificationFilter = 'all' | 'verified' | 'unverified';

const allRoleFilter = 'all';

const verificationOptions = [
  { label: '전체 상태', value: 'all' },
  { label: '인증 완료', value: 'verified' },
  { label: '인증 필요', value: 'unverified' },
];

function getAdminErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return '회원 목록을 불러오지 못했습니다.';
}

function toDate(value: unknown) {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'object' && value !== null) {
    const maybeTimestamp = value as { seconds?: unknown; toDate?: unknown };

    if (typeof maybeTimestamp.toDate === 'function') {
      return maybeTimestamp.toDate() as Date;
    }

    if (typeof maybeTimestamp.seconds === 'number') {
      return new Date(maybeTimestamp.seconds * 1000);
    }
  }

  return null;
}

function formatDate(value: unknown) {
  const date = toDate(value);

  if (!date) {
    return '기록 없음';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function sortByRecentActivity(users: AppUserProfile[]) {
  return [...users].sort((firstUser, secondUser) => {
    const firstTime = toDate(firstUser.lastLoginAt)?.getTime() ?? toDate(firstUser.updatedAt)?.getTime() ?? 0;
    const secondTime = toDate(secondUser.lastLoginAt)?.getTime() ?? toDate(secondUser.updatedAt)?.getTime() ?? 0;

    return secondTime - firstTime;
  });
}

export function AdminUsersPage() {
  const auth = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [copiedMembershipUid, setCopiedMembershipUid] = useState<string | null>(null);
  const [membershipError, setMembershipError] = useState('');
  const [membershipRequests, setMembershipRequests] = useState<MembershipRequest[]>([]);
  const [reviewingMembershipUid, setReviewingMembershipUid] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<UserRole | typeof allRoleFilter>(allRoleFilter);
  const [savingUid, setSavingUid] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<AppUserProfile[]>([]);
  const [verificationFilter, setVerificationFilter] = useState<VerificationFilter>('all');
  const canManageOwners = auth.hasRole('owner');

  const loadAdminData = async () => {
    setErrorMessage('');
    setMembershipError('');
    setIsLoading(true);

    try {
      const [userProfiles, requests] = await Promise.all([
        listUserProfiles(),
        listMembershipRequests(),
      ]);
      setUsers(sortByRecentActivity(userProfiles));
      setMembershipRequests(requests);
    } catch (error) {
      setErrorMessage(getAdminErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAdminData();
  }, []);

  const pendingMembershipCount = useMemo(
    () => membershipRequests.filter((request) => request.status === 'pending').length,
    [membershipRequests],
  );

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return users.filter((user) => {
      const matchesQuery = !normalizedQuery
        || [user.displayName, user.email, user.uid]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery));
      const matchesRole = roleFilter === allRoleFilter || user.role === roleFilter;
      const matchesVerification = verificationFilter === 'all'
        || (verificationFilter === 'verified' && user.emailVerified)
        || (verificationFilter === 'unverified' && !user.emailVerified);

      return matchesQuery && matchesRole && matchesVerification;
    });
  }, [roleFilter, searchQuery, users, verificationFilter]);

  const stats = useMemo(() => {
    const verifiedCount = users.filter((user) => user.emailVerified).length;
    const adminCount = users.filter((user) => user.role === 'admin' || user.role === 'owner').length;

    return {
      adminCount,
      pendingVerificationCount: users.length - verifiedCount,
      totalCount: users.length,
      verifiedCount,
    };
  }, [users]);

  const roleFilterOptions = useMemo(() => [
    { label: '전체 등급', value: allRoleFilter },
    ...userRoles.map((role) => ({ label: roleLabels[role], value: role })),
  ], []);

  const handleRoleChange = async (uid: string, role: UserRole) => {
    const targetUser = users.find((user) => user.uid === uid);
    setSavingUid(uid);
    setErrorMessage('');

    try {
      await updateUserProfileRole(uid, role);
      setUsers((currentUsers) => currentUsers.map((user) => (
        user.uid === uid ? { ...user, permissions: getRolePermissions(role), role } : user
      )));
      if (auth.user) {
        void recordActivity({
          displayName: auth.user.displayName,
          email: auth.user.email,
          role: auth.role,
          uid: auth.user.uid,
        }, {
          action: 'admin.role.updated',
          details: `${roleLabels[targetUser?.role ?? 'user']} → ${roleLabels[role]}`,
          summary: `${targetUser?.displayName || targetUser?.email || uid} 회원의 권한을 변경했습니다.`,
          targetId: uid,
        }).catch((error) => console.warn('Failed to record role activity.', error));
        void createNotification(uid, {
          link: '/account',
          message: `계정 권한이 ${roleLabels[role]}(으)로 변경되었습니다. 다시 로그인하면 새 권한이 적용됩니다.`,
          title: '계정 권한 변경',
          type: 'role',
        }).catch((error) => console.warn('Failed to create role notification.', error));
      }
    } catch (error) {
      setErrorMessage(getAdminErrorMessage(error));
    } finally {
      setSavingUid(null);
    }
  };

  const handleCopyMembershipCommand = async (request: MembershipRequest) => {
    const command = `npm run set-membership -- ${request.email} pro`;
    setMembershipError('');

    try {
      const copied = await copyTextToClipboard(command);

      if (!copied) {
        throw new Error('클립보드를 사용할 수 없습니다.');
      }

      setCopiedMembershipUid(request.uid);
    } catch (error) {
      setMembershipError(getAdminErrorMessage(error));
    }
  };

  const handleMembershipReview = async (
    request: MembershipRequest,
    status: Extract<MembershipRequestStatus, 'approved' | 'rejected'>,
  ) => {
    if (!auth.user) return;

    setReviewingMembershipUid(request.uid);
    setMembershipError('');

    try {
      await reviewMembershipRequest(request.uid, status, auth.user.uid);
      setMembershipRequests((currentRequests) => currentRequests.map((currentRequest) => (
        currentRequest.uid === request.uid
          ? {
              ...currentRequest,
              reviewedAt: new Date(),
              reviewedBy: auth.user?.uid ?? null,
              status,
              updatedAt: new Date(),
            }
          : currentRequest
      )));
      setCopiedMembershipUid((currentUid) => currentUid === request.uid ? null : currentUid);

      void recordActivity({
        displayName: auth.user.displayName,
        email: auth.user.email,
        role: auth.role,
        uid: auth.user.uid,
      }, {
        action: 'admin.membership.reviewed',
        details: status === 'approved' ? '프로 등급 적용 완료' : '프로 등급 신청 거절',
        summary: `${request.displayName || request.email} 회원의 프로 등급 신청을 처리했습니다.`,
        targetId: request.uid,
      }).catch((error) => console.warn('Failed to record membership review activity.', error));

      void createNotification(request.uid, {
        link: '/account',
        message: status === 'approved'
          ? '프로 등급 적용이 완료되었습니다. 다시 로그인하거나 권한을 새로고침해주세요.'
          : '프로 등급 신청이 승인되지 않았습니다. 내 계정에서 다시 신청할 수 있습니다.',
        title: status === 'approved' ? '프로 등급 적용 완료' : '프로 등급 신청 결과',
        type: status === 'approved' ? 'success' : 'warning',
      }).catch((error) => console.warn('Failed to create membership notification.', error));
    } catch (error) {
      setMembershipError(getAdminErrorMessage(error));
    } finally {
      setReviewingMembershipUid(null);
    }
  };

  return (
    <div className="container-page space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">Admin</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">회원 및 권한 관리</h1>
            <p className="mt-3 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              회원 프로필, 이메일 인증 상태, 회원 등급과 운영 권한을 한곳에서 확인합니다.
            </p>
          </div>
          <Button type="button" variant="secondary" onClick={loadAdminData} disabled={isLoading}>
            <RefreshCw className="mr-2 inline h-4 w-4" />
            새로고침
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader title="전체 회원" description={`${stats.totalCount}명`} icon={<UsersRound className="h-5 w-5 text-green-600" />} />
        </Card>
        <Card>
          <CardHeader title="인증 완료" description={`${stats.verifiedCount}명`} icon={<UserCheck className="h-5 w-5 text-green-600" />} />
        </Card>
        <Card>
          <CardHeader title="인증 필요" description={`${stats.pendingVerificationCount}명`} icon={<UserX className="h-5 w-5 text-yellow-600" />} />
        </Card>
        <Card>
          <CardHeader title="관리 권한" description={`${stats.adminCount}명`} icon={<ShieldAlert className="h-5 w-5 text-green-600" />} />
        </Card>
      </div>

      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900/60 dark:bg-yellow-950/30">
        <CardContent>
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-400" />
            <p className="text-sm text-yellow-900 dark:text-yellow-100">
              운영 권한은 `npm run set-role -- 이메일 권한`, 회원 등급은
              `npm run set-membership -- 이메일 free|pro` 명령으로 Custom Claim까지 함께 반영해주세요.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="프로 등급 신청"
          description={`처리 대기 ${pendingMembershipCount}건 · 최근 신청 ${membershipRequests.length}건`}
          icon={<Crown className="h-5 w-5 text-purple-600" />}
        />
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            대기 중인 신청은 명령 복사 후 프로젝트 터미널에서 실행하고, 성공 메시지를 확인한 뒤 적용 완료를 눌러주세요.
          </p>

          {membershipError ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
              {membershipError}
            </p>
          ) : null}

          {isLoading ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">프로 등급 신청을 불러오는 중입니다.</p>
          ) : membershipRequests.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
              현재 프로 등급 신청이 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {membershipRequests.slice(0, 20).map((request) => {
                const command = `npm run set-membership -- ${request.email} pro`;
                const isPending = request.status === 'pending';
                const isReviewing = reviewingMembershipUid === request.uid;
                const commandWasCopied = copiedMembershipUid === request.uid;
                const statusClass = {
                  approved: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
                  cancelled: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
                  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
                  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
                }[request.status];

                return (
                  <div
                    key={request.uid}
                    className="border-b border-gray-200 py-4 first:pt-0 last:border-b-0 last:pb-0 dark:border-gray-700"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-gray-950 dark:text-white">
                            {request.displayName || '이름 없음'}
                          </p>
                          <span className={`badge ${statusClass}`}>
                            {membershipRequestStatusLabels[request.status]}
                          </span>
                        </div>
                        <p className="mt-1 break-all text-sm text-gray-600 dark:text-gray-300">{request.email}</p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          신청일 {formatDate(request.requestedAt)}
                        </p>
                        {isPending ? (
                          <code className="mt-3 block max-w-full overflow-x-auto rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                            {command}
                          </code>
                        ) : null}
                      </div>

                      {isPending ? (
                        <div className="flex shrink-0 flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            disabled={isReviewing}
                            onClick={() => void handleCopyMembershipCommand(request)}
                          >
                            {commandWasCopied ? <Check className="mr-2 inline h-4 w-4" /> : <Clipboard className="mr-2 inline h-4 w-4" />}
                            {commandWasCopied ? '복사됨' : '명령 복사'}
                          </Button>
                          <Button
                            type="button"
                            disabled={isReviewing || !commandWasCopied}
                            onClick={() => void handleMembershipReview(request, 'approved')}
                          >
                            <Check className="mr-2 inline h-4 w-4" />
                            적용 완료
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            disabled={isReviewing}
                            onClick={() => void handleMembershipReview(request, 'rejected')}
                            className="text-red-600 dark:text-red-300"
                          >
                            <XCircle className="mr-2 inline h-4 w-4" />
                            거절
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="회원 목록"
          description={`${filteredUsers.length}명의 프로필을 표시하고 있습니다.`}
          icon={<UsersRound className="h-5 w-5 text-green-600" />}
        />
        <CardContent className="space-y-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
            <label className="form-group">
              <span className="form-label">검색</span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  className="pl-9"
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="이름, 이메일, UID 검색"
                  type="search"
                  value={searchQuery}
                />
              </div>
            </label>
            <label className="form-group">
              <span className="form-label">관리 권한</span>
              <Select
                onChange={(event) => setRoleFilter(event.target.value as UserRole | typeof allRoleFilter)}
                options={roleFilterOptions}
                value={roleFilter}
              />
            </label>
            <label className="form-group">
              <span className="form-label">이메일 인증</span>
              <Select
                onChange={(event) => setVerificationFilter(event.target.value as VerificationFilter)}
                options={verificationOptions}
                value={verificationFilter}
              />
            </label>
          </div>

          {errorMessage ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
              {errorMessage}
            </p>
          ) : null}

          {isLoading ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">회원 목록을 불러오는 중입니다.</p>
          ) : filteredUsers.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
              <Filter className="mx-auto mb-3 h-8 w-8 text-gray-400" />
              조건과 일치하는 회원이 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    <th className="py-3 pr-4">회원</th>
                    <th className="py-3 pr-4">UID</th>
                    <th className="py-3 pr-4">이메일 인증</th>
                    <th className="py-3 pr-4">마지막 로그인</th>
                    <th className="py-3 pr-4">회원 등급</th>
                    <th className="py-3 pr-4">관리 권한</th>
                    <th className="py-3 pr-4">권한 변경</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const selectOptions = canManageOwners || user.role === 'owner'
                      ? roleOptions
                      : roleOptions.filter((option) => option.value !== 'owner');
                    const cannotChangeOwner = user.role === 'owner' && !canManageOwners;

                    return (
                      <tr key={user.uid} className="border-b border-gray-100 last:border-b-0 dark:border-gray-800">
                        <td className="py-3 pr-4">
                          <div className="font-semibold text-gray-950 dark:text-white">{user.displayName || '이름 없음'}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{user.email || '이메일 없음'}</div>
                        </td>
                        <td className="max-w-[220px] truncate py-3 pr-4 text-xs text-gray-500 dark:text-gray-400">
                          {user.uid}
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`badge ${user.emailVerified ? 'badge-success' : ''}`}>
                            {user.emailVerified ? '인증 완료' : '인증 필요'}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">{formatDate(user.lastLoginAt)}</td>
                        <td className="py-3 pr-4">
                          <span className={`badge ${user.membershipPlan === 'pro' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' : 'badge-success'}`}>
                            {membershipPlanLabels[user.membershipPlan]}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="badge badge-success">{roleLabels[user.role]}</span>
                        </td>
                        <td className="py-3 pr-4">
                          <Select
                            aria-label={`${user.email ?? user.uid} 권한 변경`}
                            className="max-w-52"
                            disabled={savingUid === user.uid || cannotChangeOwner}
                            onChange={(event) => void handleRoleChange(user.uid, event.target.value as UserRole)}
                            options={selectOptions}
                            value={user.role}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
