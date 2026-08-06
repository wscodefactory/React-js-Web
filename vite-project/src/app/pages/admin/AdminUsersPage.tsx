import { useEffect, useState } from 'react';
import { RefreshCw, ShieldAlert, UsersRound } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, Select } from '../../components/common';
import { listUserProfiles, updateUserProfileRole } from '../../services/authService';
import {
  roleLabels,
  roleOptions,
  type AppUserProfile,
  type UserRole,
} from '../../types/auth';

function getAdminErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return '회원 목록을 불러오지 못했습니다.';
}

export function AdminUsersPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [savingUid, setSavingUid] = useState<string | null>(null);
  const [users, setUsers] = useState<AppUserProfile[]>([]);

  const loadUsers = async () => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      setUsers(await listUserProfiles());
    } catch (error) {
      setErrorMessage(getAdminErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const handleRoleChange = async (uid: string, role: UserRole) => {
    setSavingUid(uid);
    setErrorMessage('');

    try {
      await updateUserProfileRole(uid, role);
      setUsers((currentUsers) => currentUsers.map((user) => (
        user.uid === uid ? { ...user, role } : user
      )));
    } catch (error) {
      setErrorMessage(getAdminErrorMessage(error));
    } finally {
      setSavingUid(null);
    }
  };

  return (
    <div className="container-page space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">Admin</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">회원 권한 관리</h1>
            <p className="mt-3 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              Firestore의 회원 프로필 등급을 관리합니다. 실제 보안 접근은 Custom Claim과 Rules에서 한 번 더 확인됩니다.
            </p>
          </div>
          <Button type="button" variant="secondary" onClick={loadUsers} disabled={isLoading}>
            <RefreshCw className="mr-2 inline h-4 w-4" />
            새로고침
          </Button>
        </div>
      </section>

      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900/60 dark:bg-yellow-950/30">
        <CardContent>
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-400" />
            <p className="text-sm text-yellow-900 dark:text-yellow-100">
              이 화면은 Firestore 프로필의 등급을 바꿉니다. 관리자 페이지 접근 같은 핵심 보안 권한은
              `npm run set-role -- 이메일 등급`으로 Custom Claim까지 맞춰야 완전히 반영됩니다.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="회원 목록"
          description={`${users.length}명의 프로필을 불러왔습니다.`}
          icon={<UsersRound className="h-5 w-5 text-green-600" />}
        />
        <CardContent>
          {errorMessage ? (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
              {errorMessage}
            </p>
          ) : null}

          {isLoading ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">회원 목록을 불러오는 중입니다.</p>
          ) : users.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">아직 저장된 회원 프로필이 없습니다.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    <th className="py-3 pr-4">회원</th>
                    <th className="py-3 pr-4">UID</th>
                    <th className="py-3 pr-4">현재 등급</th>
                    <th className="py-3 pr-4">등급 변경</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.uid} className="border-b border-gray-100 last:border-b-0 dark:border-gray-800">
                      <td className="py-3 pr-4">
                        <div className="font-semibold text-gray-950 dark:text-white">{user.displayName || '이름 없음'}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{user.email || '이메일 없음'}</div>
                      </td>
                      <td className="max-w-[220px] truncate py-3 pr-4 text-xs text-gray-500 dark:text-gray-400">
                        {user.uid}
                      </td>
                      <td className="py-3 pr-4">
                        <span className="badge badge-success">{roleLabels[user.role]}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <Select
                          aria-label={`${user.email ?? user.uid} 권한 변경`}
                          className="max-w-48"
                          disabled={savingUid === user.uid}
                          onChange={(event) => void handleRoleChange(user.uid, event.target.value as UserRole)}
                          options={roleOptions}
                          value={user.role}
                        />
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
