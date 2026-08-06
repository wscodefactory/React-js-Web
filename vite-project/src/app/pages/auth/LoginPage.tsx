import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { LogIn } from 'lucide-react';
import { AuthSetupNotice } from '../../components/auth/AuthSetupNotice';
import { Button, Card, CardContent, Input } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { hasRoleAtLeast } from '../../types/auth';

function getAuthErrorCode(error: unknown) {
  if (typeof error === 'object' && error && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === 'string' ? code : null;
  }

  return null;
}

function getAuthErrorMessage(error: unknown) {
  const errorCode = getAuthErrorCode(error);

  switch (errorCode) {
    case 'auth/email-not-verified':
      return '인증 메일을 다시 보냈습니다. 메일함의 인증 링크를 누른 뒤 로그인해주세요.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return '이메일 또는 비밀번호를 확인해주세요.';
    default:
      break;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '로그인 중 문제가 발생했습니다.';
}

export function LoginPage() {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState('');
  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/account';
  const defaultRedirect = auth.isAdmin ? '/admin' : '/account';
  const loggedInRedirect = redirectTo === '/account' ? defaultRedirect : redirectTo;

  useEffect(() => {
    if (!auth.isLoading && auth.user) {
      navigate(loggedInRedirect, { replace: true });
    }
  }, [auth.isLoading, auth.user, loggedInRedirect, navigate]);

  if (!auth.firebaseReady) {
    return (
      <div className="container-page">
        <AuthSetupNotice missingKeys={auth.missingConfigKeys} />
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const signedInRole = await auth.signIn({ email, password });
      const signInRedirect = hasRoleAtLeast(signedInRole, 'admin') ? '/admin' : '/account';

      navigate(redirectTo === '/account' ? signInRedirect : redirectTo, { replace: true });
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-page">
      <div className="mx-auto max-w-xl">
        <Card>
          <CardContent>
            <div className="mb-6">
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">Auth</p>
              <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">로그인</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                일반 회원과 관리자는 같은 로그인 화면을 사용하고, 관리자 여부는 권한 claim으로 확인합니다.
              </p>
            </div>

            {auth.user ? (
              <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-100">
                이미 로그인되어 있습니다. 다른 계정으로 들어가려면 먼저 로그아웃해주세요.
              </div>
            ) : null}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="form-group">
                <span className="form-label">이메일</span>
                <Input
                  autoComplete="email"
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  type="email"
                  value={email}
                />
              </label>
              <label className="form-group">
                <span className="form-label">비밀번호</span>
                <Input
                  autoComplete="current-password"
                  minLength={6}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  type="password"
                  value={password}
                />
              </label>

              {errorMessage ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
                  {errorMessage}
                </p>
              ) : null}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <LogIn className="mr-2 inline h-4 w-4" />
                {isSubmitting ? '로그인 중...' : '로그인'}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-300">
              계정이 없나요?{' '}
              <Link to="/auth/signup" className="font-semibold text-green-600 hover:underline dark:text-green-400">
                회원가입
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
