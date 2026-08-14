import { useEffect, useMemo, useState } from 'react';
import { Activity, Filter, LogIn, RefreshCw, Search, Settings2, ShieldCheck } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, Input, Select } from '../../components/common';
import { listActivityLogs } from '../../services/activityService';
import {
  activityActionLabels,
  activityActions,
  type ActivityAction,
  type ActivityLog,
} from '../../types/activity';
import { roleLabels } from '../../types/auth';

const allActionFilter = 'all';

function toDate(value: unknown) {
  if (value instanceof Date) {
    return value;
  }

  if (value && typeof value === 'object' && 'toDate' in value) {
    const toDateValue = (value as { toDate?: unknown }).toDate;

    if (typeof toDateValue === 'function') {
      return toDateValue.call(value) as Date;
    }
  }

  return null;
}

function formatDate(value: unknown) {
  const date = toDate(value);

  if (!date) {
    return '방금 전';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(date);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '활동 기록을 불러오지 못했습니다.';
}

export function AdminActivityPage() {
  const [actionFilter, setActionFilter] = useState<ActivityAction | typeof allActionFilter>(allActionFilter);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadActivities = async () => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      setActivities(await listActivityLogs());
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadActivities();
  }, []);

  const filteredActivities = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return activities.filter((activityItem) => {
      const matchesAction = actionFilter === allActionFilter || activityItem.action === actionFilter;
      const matchesQuery = !normalizedQuery || [
        activityItem.actorDisplayName,
        activityItem.actorEmail,
        activityItem.summary,
        activityItem.details,
        activityItem.targetId,
      ].filter(Boolean).some((value) => String(value).toLowerCase().includes(normalizedQuery));

      return matchesAction && matchesQuery;
    });
  }, [actionFilter, activities, searchQuery]);

  const stats = useMemo(() => ({
    adminChanges: activities.filter((item) => item.action.startsWith('admin.')).length,
    logins: activities.filter((item) => item.action === 'auth.login').length,
    total: activities.length,
    workspaceChanges: activities.filter((item) => item.action.startsWith('workspace.')).length,
  }), [activities]);

  const actionOptions = useMemo(() => [
    { label: '전체 활동', value: allActionFilter },
    ...activityActions.map((action) => ({ label: activityActionLabels[action], value: action })),
  ], []);

  return (
    <div className="container-page space-y-6">
      <section className="border-b border-gray-200 pb-6 dark:border-gray-700">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">Admin</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">활동 기록</h1>
            <p className="mt-3 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              로그인과 주요 운영 변경을 시간순으로 확인합니다.
            </p>
          </div>
          <Button type="button" variant="secondary" onClick={() => void loadActivities()} disabled={isLoading}>
            <RefreshCw className={`mr-2 inline h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><CardHeader title="전체 기록" description={`${stats.total}건`} icon={<Activity className="h-5 w-5 text-green-600" />} /></Card>
        <Card><CardHeader title="로그인" description={`${stats.logins}건`} icon={<LogIn className="h-5 w-5 text-green-600" />} /></Card>
        <Card><CardHeader title="운영 변경" description={`${stats.adminChanges}건`} icon={<Settings2 className="h-5 w-5 text-green-600" />} /></Card>
        <Card><CardHeader title="워크스페이스" description={`${stats.workspaceChanges}건`} icon={<ShieldCheck className="h-5 w-5 text-green-600" />} /></Card>
      </div>

      <Card>
        <CardHeader title="기록 목록" description={`${filteredActivities.length}건을 표시하고 있습니다.`} icon={<Activity className="h-5 w-5 text-green-600" />} />
        <CardContent className="space-y-4 border-t border-gray-100 dark:border-gray-800">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
            <label className="form-group">
              <span className="form-label">검색</span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input className="pl-9" type="search" placeholder="회원, 활동 내용 검색" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
              </div>
            </label>
            <label className="form-group">
              <span className="form-label">활동 종류</span>
              <Select value={actionFilter} options={actionOptions} onChange={(event) => setActionFilter(event.target.value as ActivityAction | typeof allActionFilter)} />
            </label>
          </div>

          {errorMessage ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">{errorMessage}</p> : null}

          {isLoading ? (
            <p className="py-6 text-center text-sm text-gray-600 dark:text-gray-300">활동 기록을 불러오고 있습니다.</p>
          ) : filteredActivities.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-600 dark:text-gray-300">
              <Filter className="mx-auto mb-3 h-8 w-8 text-gray-400" />
              조건과 일치하는 활동이 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    <th className="py-3 pr-4">시간</th>
                    <th className="py-3 pr-4">활동</th>
                    <th className="py-3 pr-4">실행 회원</th>
                    <th className="py-3 pr-4">내용</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivities.map((activityItem) => (
                    <tr key={activityItem.id} className="border-b border-gray-100 last:border-b-0 dark:border-gray-800">
                      <td className="whitespace-nowrap py-3 pr-4 text-gray-600 dark:text-gray-300">{formatDate(activityItem.createdAt)}</td>
                      <td className="py-3 pr-4"><span className="badge badge-success">{activityActionLabels[activityItem.action]}</span></td>
                      <td className="py-3 pr-4">
                        <div className="font-semibold text-gray-950 dark:text-white">{activityItem.actorDisplayName || activityItem.actorEmail || '이름 없음'}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{roleLabels[activityItem.actorRole]}</div>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="text-gray-950 dark:text-white">{activityItem.summary}</div>
                        {activityItem.details ? <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{activityItem.details}</div> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
