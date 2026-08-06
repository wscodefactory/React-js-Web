import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '../common';

export function AuthSetupNotice({ missingKeys }: { missingKeys: readonly string[] }) {
  return (
    <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900/60 dark:bg-yellow-950/30">
      <CardContent>
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-400" />
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100">Firebase 설정이 필요합니다</h2>
              <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-200">
                로그인과 회원가입을 사용하려면 프로젝트 루트에 `.env.local`을 만들고 Firebase Web App 값을 넣어주세요.
              </p>
            </div>
            <div className="rounded-md border border-yellow-200 bg-white/70 p-3 text-xs text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-100">
              <p className="font-semibold">빠진 환경변수</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {missingKeys.map((key) => (
                  <li key={key}>{key}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
