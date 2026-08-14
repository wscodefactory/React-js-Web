import { Link } from 'react-router';
import { Activity, Settings2, ShieldCheck, UsersRound, Workflow } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { roleDescriptions, roleLabels, userRoles } from '../../types/auth';

export function AdminDashboardPage() {
  const auth = useAuth();

  return (
    <div className="container-page space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-gray-950 via-green-950 to-green-700 p-6 text-white md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold text-green-100">Admin</p>
            <h1 className="mt-2 text-3xl font-bold">관리자 대시보드</h1>
            <p className="mt-3 max-w-2xl text-sm text-green-50">
              회원 권한, 데이터 관리 기준, Firebase 보안 설정을 확인하는 운영 화면입니다.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white ring-1 ring-white/20">
            <ShieldCheck className="h-4 w-4" />
            {roleLabels[auth.role]}
          </span>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader
            title="현재 권한"
            description={roleDescriptions[auth.role]}
            icon={<ShieldCheck className="h-5 w-5 text-green-600" />}
          />
        </Card>
        <Card hover>
          <Link to="/admin/users" className="block">
            <CardHeader
              title="회원 권한 관리"
              description="Firestore 프로필 권한을 확인하고 등급을 조정합니다."
              icon={<UsersRound className="h-5 w-5 text-green-600" />}
            />
          </Link>
        </Card>
        <Card hover>
          <Link to="/admin/settings" className="block">
            <CardHeader
              title="사이트 설정"
              description="회원가입, 메뉴 노출과 페이지별 접근 등급을 관리합니다."
              icon={<Settings2 className="h-5 w-5 text-green-600" />}
            />
          </Link>
        </Card>
        <Card hover>
          <Link to="/admin/activity" className="block">
            <CardHeader
              title="활동 기록"
              description="로그인과 주요 운영 변경 기록을 시간순으로 확인합니다."
              icon={<Activity className="h-5 w-5 text-green-600" />}
            />
          </Link>
        </Card>
        <Card>
          <CardHeader
            title="보안 흐름"
            description="실제 접근 권한은 Custom Claim과 Firestore Rules에서 최종 검증합니다."
            icon={<Workflow className="h-5 w-5 text-green-600" />}
          />
        </Card>
      </div>

      <Card>
        <CardHeader
          title="등급별 권한"
          description="아래 등급은 낮은 등급에서 높은 등급으로 올라가는 구조입니다."
        />
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  <th className="py-3 pr-4">등급</th>
                  <th className="py-3 pr-4">설명</th>
                  <th className="py-3 pr-4">사용 위치</th>
                </tr>
              </thead>
              <tbody>
                {userRoles.map((role) => (
                  <tr key={role} className="border-b border-gray-100 last:border-b-0 dark:border-gray-800">
                    <td className="py-3 pr-4 font-semibold text-gray-950 dark:text-white">{roleLabels[role]}</td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">{roleDescriptions[role]}</td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                      {role === 'admin' || role === 'owner' ? '관리자 화면 접근 가능' : '일반 작업 화면 중심'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50 dark:border-green-900/60 dark:bg-green-950/30">
        <CardContent>
          <h2 className="text-lg font-semibold text-green-950 dark:text-green-100">관리자 계정 만드는 순서</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-green-900 dark:text-green-100">
            <li>일반 회원가입으로 관리자 이메일을 먼저 만듭니다.</li>
            <li>`npm run set-role -- 이메일 admin` 명령으로 Custom Claim을 부여합니다.</li>
            <li>해당 계정으로 다시 로그인하거나 계정 화면에서 권한 새로고침을 누릅니다.</li>
            <li>관리자 화면에서 회원 프로필 등급을 관리합니다.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
