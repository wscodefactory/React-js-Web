import { FormEvent, useState } from 'react';
import { Link } from 'react-router';
import { LogIn, MailCheck, UserPlus } from 'lucide-react';
import { AuthSetupNotice } from '../../components/auth/AuthSetupNotice';
import { Button, Card, CardContent, Input } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const displayNamePattern = /^[A-Za-zㄱ-ㅎ가-힣ㅏ-ㅣ\s]+$/;
const displayNameBlockedPattern = /[^A-Za-zㄱ-ㅎ가-힣ㅏ-ㅣ\s]/g;
const displayNameRequirement = '이름은 한글, 영문, 공백만 입력할 수 있습니다.';
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const passwordRequirement = '영문과 숫자 포함 8자 이상 입력해주세요.';

type SignupFieldErrors = {
  displayName?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
};

function getFirebaseErrorCode(error: unknown) {
  if (typeof error === 'object' && error && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === 'string' ? code : null;
  }

  return null;
}

function getSignupErrorMessage(error: unknown) {
  const errorCode = getFirebaseErrorCode(error);

  switch (errorCode) {
    case 'auth/configuration-not-found':
    case 'auth/operation-not-allowed':
      return 'Firebase Console에서 이메일/비밀번호 로그인을 활성화해주세요.';
    case 'auth/email-already-in-use':
      return '이미 가입된 이메일입니다.';
    case 'auth/invalid-email':
      return '이메일 형식으로 입력해주세요.';
    case 'auth/weak-password':
      return '영문과 숫자 포함 8자 이상 입력해주세요.';
    default:
      break;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '회원가입 중 문제가 발생했습니다.';
}

function validateSignupForm({
  displayName,
  email,
  password,
  passwordConfirm,
}: {
  displayName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}) {
  const errors: SignupFieldErrors = {};
  const trimmedEmail = email.trim();

  if (!displayName.trim()) {
    errors.displayName = '이름을 입력해주세요.';
  } else if (!displayNamePattern.test(displayName)) {
    errors.displayName = displayNameRequirement;
  }

  if (!trimmedEmail) {
    errors.email = '이메일을 입력해주세요.';
  } else if (!emailPattern.test(trimmedEmail)) {
    errors.email = '이메일 형식으로 입력해주세요.';
  }

  if (!password) {
    errors.password = '비밀번호를 입력해주세요.';
  } else if (!passwordPattern.test(password)) {
    errors.password = passwordRequirement;
  }

  if (!passwordConfirm) {
    errors.passwordConfirm = '비밀번호 확인을 입력해주세요.';
  } else if (password !== passwordConfirm) {
    errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
  }

  return errors;
}

function hasSignupErrors(errors: SignupFieldErrors) {
  return Object.values(errors).some(Boolean);
}

export function SignupPage() {
  const auth = useAuth();
  const siteSettings = useSiteSettings();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<SignupFieldErrors>({});
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!auth.firebaseReady) {
    return (
      <div className="container-page">
        <AuthSetupNotice missingKeys={auth.missingConfigKeys} />
      </div>
    );
  }

  if (!siteSettings.isLoading && !siteSettings.settings.signupEnabled) {
    return (
      <div className="container-page">
        <div className="mx-auto max-w-xl">
          <Card>
            <CardContent>
              <UserPlus className="h-8 w-8 text-gray-400" />
              <h1 className="mt-4 text-2xl font-bold text-gray-950 dark:text-white">회원가입이 잠시 중단되었습니다</h1>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                현재는 새 계정을 만들 수 없습니다. 기존 계정이 있다면 로그인해주세요.
              </p>
              <Link to="/auth/login" className="btn btn-primary mt-6 inline-flex items-center justify-center">
                <LogIn className="mr-2 h-4 w-4" />
                로그인
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const syncFieldErrors = (nextValues: Partial<Record<keyof SignupFieldErrors, string>>) => {
    if (!hasTriedSubmit) {
      return;
    }

    setFieldErrors(
      validateSignupForm({
        displayName: nextValues.displayName ?? displayName,
        email: nextValues.email ?? email,
        password: nextValues.password ?? password,
        passwordConfirm: nextValues.passwordConfirm ?? passwordConfirm,
      }),
    );
  };

  const handleDisplayNameChange = (nextDisplayName: string) => {
    const sanitizedDisplayName = nextDisplayName.replace(displayNameBlockedPattern, '');

    setErrorMessage('');
    setSuccessMessage('');
    setDisplayName(sanitizedDisplayName);
    syncFieldErrors({ displayName: sanitizedDisplayName });
  };

  const handleEmailChange = (nextEmail: string) => {
    setErrorMessage('');
    setSuccessMessage('');
    setEmail(nextEmail);
    syncFieldErrors({ email: nextEmail });
  };

  const handlePasswordChange = (nextPassword: string) => {
    setErrorMessage('');
    setSuccessMessage('');
    setPassword(nextPassword);
    syncFieldErrors({ password: nextPassword });
  };

  const handlePasswordConfirmChange = (nextPasswordConfirm: string) => {
    setErrorMessage('');
    setSuccessMessage('');
    setPasswordConfirm(nextPasswordConfirm);
    syncFieldErrors({ passwordConfirm: nextPasswordConfirm });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasTriedSubmit(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!siteSettings.settings.signupEnabled) {
      setErrorMessage('현재는 회원가입을 이용할 수 없습니다.');
      return;
    }

    const validationErrors = validateSignupForm({
      displayName,
      email,
      password,
      passwordConfirm,
    });

    if (hasSignupErrors(validationErrors)) {
      setFieldErrors(validationErrors);
      return;
    }

    const trimmedEmail = email.trim();

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await auth.signUp({ displayName: displayName.trim(), email: trimmedEmail, password });
      setDisplayName('');
      setEmail('');
      setPassword('');
      setPasswordConfirm('');
      setFieldErrors({});
      setHasTriedSubmit(false);
      setSuccessMessage('회원가입이 완료되었습니다. 메일함에서 인증 링크를 누른 뒤 로그인해주세요.');
    } catch (error) {
      setErrorMessage(getSignupErrorMessage(error));
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
              <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">회원가입</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                새 계정은 기본적으로 일반 회원 권한으로 만들어집니다.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <label className="form-group">
                <span className="form-label">이름</span>
                <Input
                  aria-describedby={fieldErrors.displayName ? 'signup-name-error' : undefined}
                  aria-invalid={Boolean(fieldErrors.displayName)}
                  autoComplete="name"
                  onChange={(event) => {
                    handleDisplayNameChange(event.target.value);
                  }}
                  pattern="[A-Za-zㄱ-ㅎ가-힣ㅏ-ㅣ\s]+"
                  placeholder="홍길동"
                  title={displayNameRequirement}
                  type="text"
                  value={displayName}
                />
                {fieldErrors.displayName ? (
                  <span id="signup-name-error" className="text-xs font-medium text-red-600 dark:text-red-400">
                    {fieldErrors.displayName}
                  </span>
                ) : null}
              </label>

              <label className="form-group">
                <span className="form-label">이메일</span>
                <Input
                  aria-describedby={fieldErrors.email ? 'signup-email-error' : undefined}
                  aria-invalid={Boolean(fieldErrors.email)}
                  autoComplete="email"
                  inputMode="email"
                  onChange={(event) => {
                    handleEmailChange(event.target.value);
                  }}
                  placeholder="name@example.com"
                  title="이메일 형식으로 입력해주세요."
                  type="email"
                  value={email}
                />
                {fieldErrors.email ? (
                  <span id="signup-email-error" className="text-xs font-medium text-red-600 dark:text-red-400">
                    {fieldErrors.email}
                  </span>
                ) : null}
              </label>

              <label className="form-group">
                <span className="form-label">비밀번호</span>
                <Input
                  aria-describedby={fieldErrors.password ? 'signup-password-error' : undefined}
                  aria-invalid={Boolean(fieldErrors.password)}
                  autoComplete="new-password"
                  minLength={8}
                  onChange={(event) => {
                    handlePasswordChange(event.target.value);
                  }}
                  pattern="(?=.*[A-Za-z])(?=.*\d).{8,}"
                  title={passwordRequirement}
                  type="password"
                  value={password}
                />
                {fieldErrors.password ? (
                  <span id="signup-password-error" className="text-xs font-medium text-red-600 dark:text-red-400">
                    {fieldErrors.password}
                  </span>
                ) : null}
              </label>

              <label className="form-group">
                <span className="form-label">비밀번호 확인</span>
                <Input
                  aria-describedby={fieldErrors.passwordConfirm ? 'signup-password-confirm-error' : undefined}
                  aria-invalid={Boolean(fieldErrors.passwordConfirm)}
                  autoComplete="new-password"
                  minLength={8}
                  onChange={(event) => {
                    handlePasswordConfirmChange(event.target.value);
                  }}
                  pattern="(?=.*[A-Za-z])(?=.*\d).{8,}"
                  title={passwordRequirement}
                  type="password"
                  value={passwordConfirm}
                />
                {fieldErrors.passwordConfirm ? (
                  <span id="signup-password-confirm-error" className="text-xs font-medium text-red-600 dark:text-red-400">
                    {fieldErrors.passwordConfirm}
                  </span>
                ) : null}
              </label>

              {errorMessage ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
                  {errorMessage}
                </p>
              ) : null}

              {successMessage ? (
                <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-3 py-3 text-sm text-green-800 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-100">
                  <MailCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{successMessage}</p>
                </div>
              ) : null}

              <div className="pt-8">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || siteSettings.isLoading || !siteSettings.settings.signupEnabled}
                >
                  <UserPlus className="mr-2 inline h-4 w-4" />
                  {siteSettings.isLoading ? '설정 확인 중...' : isSubmitting ? '가입 중...' : '회원가입'}
                </Button>
              </div>
            </form>

            <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-300">
              이미 계정이 있나요?{' '}
              <Link to="/auth/login" className="font-semibold text-green-600 hover:underline dark:text-green-400">
                로그인
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
