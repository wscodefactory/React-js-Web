import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Eye, EyeOff, RotateCcw, Save, Settings2, ShieldCheck, UserPlus, Wrench } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, Select } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { recordActivity } from '../../services/activityService';
import { createNotification } from '../../services/notificationService';
import {
  configurableSectionKeys,
  configurableSectionLabels,
  pageAccessLabels,
  pageAccessOptions,
  type ConfigurableSectionKey,
  type PageAccessLevel,
  type SiteSettings,
} from '../../types/siteSettings';

type SettingsToggleProps = {
  checked: boolean;
  description: string;
  disabled?: boolean;
  icon: ReactNode;
  label: string;
  onChange: (checked: boolean) => void;
};

function cloneSettings(settings: SiteSettings): SiteSettings {
  return {
    ...settings,
    menuVisibility: { ...settings.menuVisibility },
    pageAccess: { ...settings.pageAccess },
  };
}

function getComparableSettings(settings: SiteSettings) {
  return {
    maintenanceMode: settings.maintenanceMode,
    menuVisibility: settings.menuVisibility,
    pageAccess: settings.pageAccess,
    signupEnabled: settings.signupEnabled,
  };
}

function getSettingsErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return '사이트 설정을 저장하지 못했습니다.';
}

function SettingsToggle({ checked, description, disabled, icon, label, onChange }: SettingsToggleProps) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 py-1">
      <span className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 text-green-600 dark:text-green-400">{icon}</span>
        <span>
          <span className="block text-sm font-semibold text-gray-950 dark:text-white">{label}</span>
          <span className="mt-1 block text-sm text-gray-600 dark:text-gray-300">{description}</span>
        </span>
      </span>
      <input
        checked={checked}
        className="mt-1 h-5 w-5 shrink-0 accent-green-600"
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
    </label>
  );
}

export function AdminSettingsPage() {
  const auth = useAuth();
  const siteSettings = useSiteSettings();
  const [draft, setDraft] = useState<SiteSettings>(() => cloneSettings(siteSettings.settings));
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setDraft(cloneSettings(siteSettings.settings));
  }, [siteSettings.settings]);

  const isDirty = useMemo(
    () => JSON.stringify(getComparableSettings(draft)) !== JSON.stringify(getComparableSettings(siteSettings.settings)),
    [draft, siteSettings.settings],
  );

  const updateMenuVisibility = (sectionKey: ConfigurableSectionKey, isVisible: boolean) => {
    setDraft((current) => ({
      ...current,
      menuVisibility: { ...current.menuVisibility, [sectionKey]: isVisible },
    }));
    setErrorMessage('');
    setSuccessMessage('');
  };

  const updatePageAccess = (sectionKey: ConfigurableSectionKey, accessLevel: PageAccessLevel) => {
    setDraft((current) => ({
      ...current,
      pageAccess: { ...current.pageAccess, [sectionKey]: accessLevel },
    }));
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleReset = () => {
    setDraft(cloneSettings(siteSettings.settings));
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSave = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsSaving(true);

    try {
      await siteSettings.saveSettings(draft, auth.user?.uid ?? null);
      setSuccessMessage('사이트 설정을 저장했습니다. 변경 내용이 전체 화면에 반영됩니다.');
      if (auth.user) {
        void recordActivity({
          displayName: auth.user.displayName,
          email: auth.user.email,
          role: auth.role,
          uid: auth.user.uid,
        }, {
          action: 'admin.settings.updated',
          summary: '사이트 운영 설정을 변경했습니다.',
          targetId: 'siteSettings/general',
        }).catch((error) => console.warn('Failed to record settings activity.', error));
        void createNotification(auth.user.uid, {
          link: '/admin/settings',
          message: '회원가입, 메뉴 노출 또는 페이지 접근 설정이 저장되었습니다.',
          title: '사이트 설정 저장 완료',
          type: 'success',
        }).catch((error) => console.warn('Failed to create settings notification.', error));
      }
    } catch (error) {
      setErrorMessage(getSettingsErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const controlsDisabled = isSaving || siteSettings.isLoading;

  return (
    <div className="container-page space-y-6">
      <section className="border-b border-gray-200 pb-6 dark:border-gray-700">
        <p className="text-sm font-semibold text-green-600 dark:text-green-400">Admin</p>
        <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-950 dark:text-white">사이트 설정</h1>
            <p className="mt-3 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              회원가입, 점검 상태, 메뉴 노출과 페이지별 최소 접근 등급을 관리합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={handleReset} disabled={!isDirty || controlsDisabled}>
              <RotateCcw className="mr-2 inline h-4 w-4" />
              변경 취소
            </Button>
            <Button type="button" onClick={() => void handleSave()} disabled={!isDirty || controlsDisabled}>
              <Save className="mr-2 inline h-4 w-4" />
              {isSaving ? '저장 중...' : '설정 저장'}
            </Button>
          </div>
        </div>
      </section>

      {siteSettings.errorMessage ? (
        <p className="rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-800 dark:border-yellow-900/60 dark:bg-yellow-950/30 dark:text-yellow-100">
          {siteSettings.errorMessage}
        </p>
      ) : null}

      {errorMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
          {errorMessage}
        </p>
      ) : null}

      {successMessage ? (
        <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-100">
          {successMessage}
        </p>
      ) : null}

      <Card>
        <CardHeader
          title="운영 설정"
          description="회원가입과 전체 서비스 이용 상태를 제어합니다."
          icon={<Settings2 className="h-5 w-5 text-green-600" />}
        />
        <CardContent className="space-y-5 border-t border-gray-100 dark:border-gray-800">
          <SettingsToggle
            checked={draft.signupEnabled}
            description="끄면 회원가입 화면에서 새 계정을 만들 수 없습니다."
            disabled={controlsDisabled}
            icon={<UserPlus className="h-5 w-5" />}
            label="회원가입 허용"
            onChange={(signupEnabled) => {
              setDraft((current) => ({ ...current, signupEnabled }));
              setErrorMessage('');
              setSuccessMessage('');
            }}
          />
          <div className="border-t border-gray-100 dark:border-gray-800" />
          <SettingsToggle
            checked={draft.maintenanceMode}
            description="켜면 관리자와 계정 화면을 제외한 페이지에 점검 안내가 표시됩니다."
            disabled={controlsDisabled}
            icon={<Wrench className="h-5 w-5" />}
            label="점검 모드"
            onChange={(maintenanceMode) => {
              setDraft((current) => ({ ...current, maintenanceMode }));
              setErrorMessage('');
              setSuccessMessage('');
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="메뉴 및 접근 권한"
          description="메뉴 노출 여부와 URL 직접 접근 시 필요한 최소 등급을 각각 설정합니다."
          icon={<ShieldCheck className="h-5 w-5 text-green-600" />}
        />
        <CardContent className="border-t border-gray-100 p-0 dark:border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  <th className="px-6 py-3">메뉴</th>
                  <th className="px-4 py-3">노출 상태</th>
                  <th className="px-6 py-3">최소 접근 등급</th>
                </tr>
              </thead>
              <tbody>
                {configurableSectionKeys.map((sectionKey) => {
                  const isVisible = draft.menuVisibility[sectionKey];
                  const accessLevel = draft.pageAccess[sectionKey];

                  return (
                    <tr key={sectionKey} className="border-b border-gray-100 last:border-b-0 dark:border-gray-800">
                      <td className="px-6 py-4 font-semibold text-gray-950 dark:text-white">
                        {configurableSectionLabels[sectionKey]}
                      </td>
                      <td className="px-4 py-4">
                        <label className="inline-flex cursor-pointer items-center gap-2">
                          <input
                            checked={isVisible}
                            className="h-5 w-5 accent-green-600"
                            disabled={controlsDisabled}
                            onChange={(event) => updateMenuVisibility(sectionKey, event.target.checked)}
                            type="checkbox"
                          />
                          {isVisible ? <Eye className="h-4 w-4 text-green-600" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
                          <span className="text-gray-700 dark:text-gray-200">{isVisible ? '표시' : '숨김'}</span>
                        </label>
                      </td>
                      <td className="px-6 py-4">
                        <Select
                          aria-label={`${configurableSectionLabels[sectionKey]} 최소 접근 등급`}
                          className="max-w-56"
                          disabled={controlsDisabled}
                          onChange={(event) => updatePageAccess(sectionKey, event.target.value as PageAccessLevel)}
                          options={pageAccessOptions}
                          value={accessLevel}
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{pageAccessLabels[accessLevel]}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
