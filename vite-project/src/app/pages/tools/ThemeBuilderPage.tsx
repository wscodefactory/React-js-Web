import { useEffect, useMemo, useState } from 'react';
import { Check, Copy, Download, RotateCcw } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, FormField, Input } from '@/app/components/common';
import { useLanguage } from '@/app/context/LanguageContext';
import { copyTextToClipboard } from '@/app/utils/clipboard';

type ThemeDraft = {
  accent: string;
  background: string;
  foreground: string;
  primary: string;
  radius: number;
  spacing: number;
  surface: string;
};

const storageKey = 'web5:theme-builder:v1';

const defaultTheme: ThemeDraft = {
  accent: '#14b8a6',
  background: '#f8fafc',
  foreground: '#111827',
  primary: '#16a34a',
  radius: 8,
  spacing: 12,
  surface: '#ffffff',
};

const copy = {
  en: {
    actions: {
      copied: 'Copied',
      copyCss: 'Copy CSS',
      downloadCss: 'Download CSS',
      reset: 'Reset',
    },
    controls: {
      accent: 'Accent',
      background: 'Background',
      foreground: 'Text',
      primary: 'Primary',
      radius: 'Radius',
      spacing: 'Spacing',
      surface: 'Surface',
    },
    export: {
      description: 'Export the current values as CSS variables for another project.',
      status: 'Theme CSS is ready to copy or download.',
      title: 'CSS export',
    },
    page: {
      description: 'Tune colors, radius, and density, then export a reusable theme token set.',
      highlight: 'Theme',
      title: 'Builder',
    },
    preview: {
      description: 'Preview how the selected tokens feel in buttons, cards, fields, and status surfaces.',
      field: 'Project name',
      fieldPlaceholder: 'Launch workspace',
      primary: 'Primary action',
      secondary: 'Secondary action',
      status: 'Theme applied to preview',
      title: 'Live preview',
    },
  },
  ko: {
    actions: {
      copied: '복사됨',
      copyCss: 'CSS 복사',
      downloadCss: 'CSS 다운로드',
      reset: '초기화',
    },
    controls: {
      accent: '강조색',
      background: '배경',
      foreground: '텍스트',
      primary: '주요 색상',
      radius: '둥근 정도',
      spacing: '간격',
      surface: '표면',
    },
    export: {
      description: '현재 값을 다른 프로젝트에서 쓸 수 있는 CSS 변수로 내보냅니다.',
      status: '테마 CSS를 복사하거나 다운로드할 수 있습니다.',
      title: 'CSS 내보내기',
    },
    page: {
      description: '색상, radius, 밀도를 조정하고 재사용 가능한 테마 토큰으로 내보내세요.',
      highlight: '테마',
      title: '빌더',
    },
    preview: {
      description: '선택한 토큰이 버튼, 카드, 필드, 상태 영역에서 어떻게 보이는지 확인하세요.',
      field: '프로젝트 이름',
      fieldPlaceholder: '런치 워크스페이스',
      primary: '주요 액션',
      secondary: '보조 액션',
      status: '테마가 미리보기에 적용됨',
      title: '실시간 미리보기',
    },
  },
} as const;

function readStoredTheme() {
  try {
    const stored = window.localStorage.getItem(storageKey);

    if (!stored) {
      return defaultTheme;
    }

    return { ...defaultTheme, ...JSON.parse(stored) } as ThemeDraft;
  } catch {
    return defaultTheme;
  }
}

function buildCss(theme: ThemeDraft) {
  return `:root {
  --theme-primary: ${theme.primary};
  --theme-accent: ${theme.accent};
  --theme-background: ${theme.background};
  --theme-surface: ${theme.surface};
  --theme-foreground: ${theme.foreground};
  --theme-radius: ${theme.radius}px;
  --theme-spacing: ${theme.spacing}px;
}`;
}

function downloadCss(css: string) {
  const blob = new Blob([css], { type: 'text/css;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = 'theme-tokens.css';
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ThemeBuilderPage() {
  const { language } = useLanguage();
  const text = copy[language];
  const [theme, setTheme] = useState<ThemeDraft>(readStoredTheme);
  const [copied, setCopied] = useState(false);
  const css = useMemo(() => buildCss(theme), [theme]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(theme));
  }, [theme]);

  const updateTheme = <Key extends keyof ThemeDraft>(key: Key, value: ThemeDraft[Key]) => {
    setTheme((current) => ({ ...current, [key]: value }));
    setCopied(false);
  };

  const copyCss = async () => {
    const wasCopied = await copyTextToClipboard(css);

    setCopied(wasCopied);
    if (wasCopied) {
      window.setTimeout(() => setCopied(false), 1400);
    }
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
    setCopied(false);
  };

  return (
    <div className="container-page space-y-6">
      <header className="section-header">
        <p className="text-sm font-semibold uppercase text-green-600 dark:text-green-400">{text.page.highlight}</p>
        <h1 className="section-title text-gray-950 dark:text-white">{text.page.title}</h1>
        <p className="section-description max-w-3xl">{text.page.description}</p>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card>
          <CardHeader title="Tokens" description="Adjust the values that shape the theme." />
          <CardContent className="space-y-4">
            {(['primary', 'accent', 'background', 'surface', 'foreground'] as const).map((key) => (
              <FormField key={key} label={text.controls[key]}>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={theme[key]}
                    onChange={(event) => updateTheme(key, event.target.value)}
                    className="h-10 w-12 shrink-0 rounded-lg border border-gray-300 bg-white p-1 dark:border-gray-700 dark:bg-gray-900"
                    aria-label={text.controls[key]}
                  />
                  <Input value={theme[key]} onChange={(event) => updateTheme(key, event.target.value)} />
                </div>
              </FormField>
            ))}

            <FormField label={`${text.controls.radius}: ${theme.radius}px`}>
              <input
                type="range"
                min={0}
                max={24}
                value={theme.radius}
                onChange={(event) => updateTheme('radius', Number(event.target.value))}
                className="w-full accent-green-600"
              />
            </FormField>

            <FormField label={`${text.controls.spacing}: ${theme.spacing}px`}>
              <input
                type="range"
                min={8}
                max={24}
                value={theme.spacing}
                onChange={(event) => updateTheme('spacing', Number(event.target.value))}
                className="w-full accent-green-600"
              />
            </FormField>

            <Button variant="secondary" onClick={resetTheme} className="w-full justify-center gap-2">
              <RotateCcw className="icon-sm" />
              {text.actions.reset}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <section
            className="overflow-hidden border shadow-sm"
            style={{
              backgroundColor: theme.background,
              borderColor: theme.accent,
              borderRadius: theme.radius,
              color: theme.foreground,
              padding: theme.spacing,
            }}
          >
            <div
              className="grid gap-4 md:grid-cols-[minmax(0,1fr)_280px]"
              style={{ gap: theme.spacing }}
            >
              <div
                className="border"
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.accent,
                  borderRadius: theme.radius,
                  padding: theme.spacing * 1.5,
                }}
              >
                <h2 className="mb-2 text-xl font-semibold">{text.preview.title}</h2>
                <p className="mb-5 text-sm opacity-75">{text.preview.description}</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    style={{ backgroundColor: theme.primary, borderRadius: theme.radius, color: '#ffffff', padding: `${theme.spacing / 1.5}px ${theme.spacing}px` }}
                  >
                    {text.preview.primary}
                  </button>
                  <button
                    type="button"
                    style={{ border: `1px solid ${theme.accent}`, borderRadius: theme.radius, color: theme.foreground, padding: `${theme.spacing / 1.5}px ${theme.spacing}px` }}
                  >
                    {text.preview.secondary}
                  </button>
                </div>
              </div>

              <div
                className="border"
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.accent,
                  borderRadius: theme.radius,
                  padding: theme.spacing,
                }}
              >
                <label className="mb-2 block text-sm">{text.preview.field}</label>
                <input
                  value={text.preview.fieldPlaceholder}
                  readOnly
                  style={{
                    backgroundColor: theme.background,
                    border: `1px solid ${theme.accent}`,
                    borderRadius: theme.radius,
                    color: theme.foreground,
                    padding: `${theme.spacing / 1.5}px ${theme.spacing}px`,
                    width: '100%',
                  }}
                />
                <p
                  className="mt-4 text-sm"
                  style={{ backgroundColor: theme.primary, borderRadius: theme.radius, color: '#ffffff', padding: theme.spacing / 1.5 }}
                >
                  {text.preview.status}
                </p>
              </div>
            </div>
          </section>

          <Card>
            <CardHeader
              title={text.export.title}
              description={text.export.description}
              badge={(
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={copyCss} className="gap-2">
                    {copied ? <Check className="icon-sm" /> : <Copy className="icon-sm" />}
                    {copied ? text.actions.copied : text.actions.copyCss}
                  </Button>
                  <Button variant="secondary" onClick={() => downloadCss(css)} className="gap-2">
                    <Download className="icon-sm" />
                    {text.actions.downloadCss}
                  </Button>
                </div>
              )}
            />
            <CardContent className="space-y-3">
              <pre className="max-h-72 overflow-auto rounded-lg bg-gray-950 p-4 text-sm text-gray-100">
                <code>{css}</code>
              </pre>
              <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400">{text.export.status}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
