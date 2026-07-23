import { useEffect, useMemo, useState } from 'react';
import { Check, Copy, Play, RotateCcw, Server, ShieldCheck } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, FormField, Input, Select } from '@/app/components/common';
import { useLanguage } from '@/app/context/LanguageContext';
import { copyTextToClipboard } from '@/app/utils/clipboard';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type ResponseMode = 'success' | 'empty' | 'error';

type ApiDraft = {
  delayMs: number;
  endpoint: string;
  method: HttpMethod;
  responseBody: string;
  responseMode: ResponseMode;
  statusCode: number;
};

type SimulationResult = {
  body: string;
  delayMs: number;
  endpoint: string;
  method: HttpMethod;
  statusCode: number;
  timestamp: string;
};

const storageKey = 'web5:mock-api-studio:v1';

const defaultDraft: ApiDraft = {
  delayMs: 320,
  endpoint: '/api/projects',
  method: 'GET',
  responseBody: JSON.stringify({
    data: [
      { id: 'proj-001', name: 'Landing refresh', status: 'active' },
      { id: 'proj-002', name: 'Checkout QA', status: 'review' },
    ],
    meta: { total: 2 },
  }, null, 2),
  responseMode: 'success',
  statusCode: 200,
};

const copy = {
  en: {
    actions: {
      copied: 'Copied',
      copyFetch: 'Copy fetch',
      copyMsw: 'Copy MSW',
      reset: 'Reset',
      simulate: 'Send mock request',
    },
    controls: {
      delay: 'Delay',
      endpoint: 'Endpoint',
      method: 'Method',
      mode: 'Response mode',
      response: 'Response JSON',
      status: 'Status code',
    },
    mode: {
      empty: 'Empty',
      error: 'Error',
      success: 'Success',
    },
    page: {
      description: 'Design an endpoint, preview the response, and copy ready-to-use client or mock-server code.',
      highlight: 'Mock API',
      title: 'Studio',
    },
    preview: {
      description: 'Run the mock request to confirm the shape, status, and timing before wiring it into a screen.',
      empty: 'No request has been sent yet.',
      title: 'Response preview',
    },
    snippets: {
      fetchDescription: 'Client-side request example based on the current endpoint.',
      fetchTitle: 'Fetch snippet',
      mswDescription: 'Mock Service Worker handler for local UI development.',
      mswTitle: 'MSW handler',
    },
    stats: {
      delay: 'Delay',
      endpoint: 'Endpoint',
      method: 'Method',
      status: 'Status',
    },
  },
  ko: {
    actions: {
      copied: '복사됨',
      copyFetch: 'fetch 복사',
      copyMsw: 'MSW 복사',
      reset: '초기화',
      simulate: '목 요청 보내기',
    },
    controls: {
      delay: '지연 시간',
      endpoint: '엔드포인트',
      method: '메서드',
      mode: '응답 모드',
      response: '응답 JSON',
      status: '상태 코드',
    },
    mode: {
      empty: '빈 응답',
      error: '에러',
      success: '성공',
    },
    page: {
      description: '엔드포인트를 설계하고 응답을 미리 본 뒤 클라이언트 코드와 목 서버 코드를 바로 복사하세요.',
      highlight: 'Mock API',
      title: 'Studio',
    },
    preview: {
      description: '화면에 연결하기 전에 응답 형태, 상태 코드, 지연 시간을 먼저 확인하세요.',
      empty: '아직 요청을 보내지 않았습니다.',
      title: '응답 미리보기',
    },
    snippets: {
      fetchDescription: '현재 엔드포인트 기준으로 만든 클라이언트 요청 예시입니다.',
      fetchTitle: 'fetch 스니펫',
      mswDescription: '로컬 UI 개발에 붙여 쓰기 좋은 Mock Service Worker handler입니다.',
      mswTitle: 'MSW handler',
    },
    stats: {
      delay: '지연',
      endpoint: '엔드포인트',
      method: '메서드',
      status: '상태',
    },
  },
} as const;

const methodOptions = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((method) => ({ label: method, value: method }));

function readStoredDraft() {
  try {
    const stored = window.localStorage.getItem(storageKey);

    if (!stored) {
      return defaultDraft;
    }

    return { ...defaultDraft, ...JSON.parse(stored) } as ApiDraft;
  } catch {
    return defaultDraft;
  }
}

function normalizeEndpoint(endpoint: string) {
  const trimmed = endpoint.trim();
  return trimmed.startsWith('/') ? trimmed : `/${trimmed || 'api/example'}`;
}

function prettyJson(value: string) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

function buildResponseBody(draft: ApiDraft) {
  if (draft.responseMode === 'empty') {
    return '';
  }

  if (draft.responseMode === 'error') {
    return JSON.stringify({
      error: {
        code: 'MOCK_ERROR',
        message: 'The mock endpoint returned an error state.',
      },
    }, null, 2);
  }

  return prettyJson(draft.responseBody);
}

function buildFetchSnippet(draft: ApiDraft) {
  const endpoint = normalizeEndpoint(draft.endpoint);
  const hasBody = !['GET', 'DELETE'].includes(draft.method);

  return `const response = await fetch('${endpoint}', {
  method: '${draft.method}',
  headers: {
    'Content-Type': 'application/json',
  }${hasBody ? `,
  body: JSON.stringify({
    // add request payload here
  })` : ''}
});

if (!response.ok) {
  throw new Error(\`Request failed: \${response.status}\`);
}

const data = await response.json();`;
}

function buildMswSnippet(draft: ApiDraft) {
  const endpoint = normalizeEndpoint(draft.endpoint);
  const method = draft.method.toLowerCase();
  const body = buildResponseBody(draft);
  const responseExpression = body
    ? `HttpResponse.json(${body}, { status: ${draft.statusCode} })`
    : `new HttpResponse(null, { status: ${draft.statusCode} })`;

  return `import { delay, http, HttpResponse } from 'msw';

export const handlers = [
  http.${method}('${endpoint}', async () => {
    await delay(${draft.delayMs});
    return ${responseExpression};
  }),
];`;
}

function getStatusTone(statusCode: number) {
  if (statusCode >= 500) return 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300';
  if (statusCode >= 400) return 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950/20 dark:text-yellow-300';
  return 'border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/20 dark:text-green-300';
}

export function MockApiStudioPage() {
  const { language } = useLanguage();
  const text = copy[language];
  const [draft, setDraft] = useState<ApiDraft>(readStoredDraft);
  const [copiedTarget, setCopiedTarget] = useState<'fetch' | 'msw' | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const modeOptions = [
    { label: text.mode.success, value: 'success' },
    { label: text.mode.empty, value: 'empty' },
    { label: text.mode.error, value: 'error' },
  ];

  const responseBody = useMemo(() => buildResponseBody(draft), [draft]);
  const fetchSnippet = useMemo(() => buildFetchSnippet(draft), [draft]);
  const mswSnippet = useMemo(() => buildMswSnippet(draft), [draft]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
  }, [draft]);

  const updateDraft = <Key extends keyof ApiDraft>(key: Key, value: ApiDraft[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setCopiedTarget(null);
  };

  const copySnippet = async (target: 'fetch' | 'msw', value: string) => {
    const wasCopied = await copyTextToClipboard(value);

    if (wasCopied) {
      setCopiedTarget(target);
      window.setTimeout(() => setCopiedTarget(null), 1400);
    }
  };

  const simulateRequest = () => {
    const nextStatusCode = draft.responseMode === 'error' && draft.statusCode < 400 ? 500 : draft.statusCode;

    setResult({
      body: draft.responseMode === 'error'
        ? buildResponseBody({ ...draft, statusCode: nextStatusCode })
        : responseBody,
      delayMs: draft.delayMs,
      endpoint: normalizeEndpoint(draft.endpoint),
      method: draft.method,
      statusCode: nextStatusCode,
      timestamp: new Date().toLocaleTimeString(language === 'ko' ? 'ko-KR' : 'en-US'),
    });
  };

  const resetDraft = () => {
    setDraft(defaultDraft);
    setResult(null);
    setCopiedTarget(null);
  };

  const metrics = [
    { label: text.stats.method, value: draft.method },
    { label: text.stats.endpoint, value: normalizeEndpoint(draft.endpoint) },
    { label: text.stats.status, value: `${draft.statusCode}` },
    { label: text.stats.delay, value: `${draft.delayMs}ms` },
  ];

  return (
    <div className="container-page space-y-6">
      <header className="section-header">
        <p className="text-sm font-semibold uppercase text-green-600 dark:text-green-400">{text.page.highlight}</p>
        <h1 className="section-title text-gray-950 dark:text-white">{text.page.title}</h1>
        <p className="section-description max-w-3xl">{text.page.description}</p>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Card>
          <CardHeader
            title="Endpoint"
            description="Shape the mock request and response contract."
            icon={<Server className="icon-lg text-green-600 dark:text-green-400" />}
          />
          <CardContent className="space-y-4">
            <FormField label={text.controls.endpoint}>
              <Input
                value={draft.endpoint}
                onChange={(event) => updateDraft('endpoint', event.target.value)}
                placeholder="/api/projects"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label={text.controls.method}>
                <Select
                  value={draft.method}
                  options={methodOptions}
                  onChange={(event) => updateDraft('method', event.target.value as HttpMethod)}
                />
              </FormField>
              <FormField label={text.controls.mode}>
                <Select
                  value={draft.responseMode}
                  options={modeOptions}
                  onChange={(event) => updateDraft('responseMode', event.target.value as ResponseMode)}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label={text.controls.status}>
                <Input
                  type="number"
                  min={100}
                  max={599}
                  value={draft.statusCode}
                  onChange={(event) => updateDraft('statusCode', Number(event.target.value))}
                />
              </FormField>
              <FormField label={`${text.controls.delay}: ${draft.delayMs}ms`}>
                <input
                  type="range"
                  min={0}
                  max={2000}
                  step={40}
                  value={draft.delayMs}
                  onChange={(event) => updateDraft('delayMs', Number(event.target.value))}
                  className="mt-3 w-full accent-green-600"
                />
              </FormField>
            </div>

            <FormField label={text.controls.response}>
              <textarea
                value={draft.responseBody}
                onChange={(event) => updateDraft('responseBody', event.target.value)}
                disabled={draft.responseMode !== 'success'}
                className="min-h-[220px] w-full resize-y rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-green-950 dark:disabled:bg-gray-900"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <Button onClick={simulateRequest} className="justify-center gap-2">
                <Play className="icon-sm" />
                {text.actions.simulate}
              </Button>
              <Button variant="secondary" onClick={resetDraft} className="justify-center gap-2">
                <RotateCcw className="icon-sm" />
                {text.actions.reset}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader
              title={text.preview.title}
              description={text.preview.description}
              icon={<ShieldCheck className="icon-lg text-green-600 dark:text-green-400" />}
            />
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-4">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
                    <p className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">{metric.label}</p>
                    <p className="mt-1 truncate text-lg font-semibold text-gray-950 dark:text-white">{metric.value}</p>
                  </div>
                ))}
              </div>

              {result ? (
                <div className={`rounded-xl border p-4 ${getStatusTone(result.statusCode)}`}>
                  <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                    <span>{result.method}</span>
                    <span>{result.endpoint}</span>
                    <span>{result.statusCode}</span>
                    <span>{result.delayMs}ms</span>
                    <span>{result.timestamp}</span>
                  </div>
                  <pre className="mt-4 max-h-80 overflow-auto rounded-lg bg-gray-950 p-4 text-sm text-gray-100">
                    <code>{result.body || 'No response body'}</code>
                  </pre>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                  {text.preview.empty}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader
                title={text.snippets.fetchTitle}
                description={text.snippets.fetchDescription}
                badge={(
                  <Button variant="secondary" onClick={() => copySnippet('fetch', fetchSnippet)} className="gap-2">
                    {copiedTarget === 'fetch' ? <Check className="icon-sm" /> : <Copy className="icon-sm" />}
                    {copiedTarget === 'fetch' ? text.actions.copied : text.actions.copyFetch}
                  </Button>
                )}
              />
              <CardContent>
                <pre className="max-h-72 overflow-auto rounded-lg bg-gray-950 p-4 text-sm text-gray-100">
                  <code>{fetchSnippet}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                title={text.snippets.mswTitle}
                description={text.snippets.mswDescription}
                badge={(
                  <Button variant="secondary" onClick={() => copySnippet('msw', mswSnippet)} className="gap-2">
                    {copiedTarget === 'msw' ? <Check className="icon-sm" /> : <Copy className="icon-sm" />}
                    {copiedTarget === 'msw' ? text.actions.copied : text.actions.copyMsw}
                  </Button>
                )}
              />
              <CardContent>
                <pre className="max-h-72 overflow-auto rounded-lg bg-gray-950 p-4 text-sm text-gray-100">
                  <code>{mswSnippet}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
