import { useMemo, useState } from 'react';
import { Accessibility, CheckCircle2, Copy, RotateCcw, TriangleAlert } from 'lucide-react';
import { Button, Card, CardContent, CardHeader } from '@/app/components/common';
import { useLanguage } from '@/app/context/LanguageContext';
import { copyTextToClipboard } from '@/app/utils/clipboard';

type AuditSeverity = 'critical' | 'warning' | 'pass';

type AuditIssue = {
  detail: string;
  id: string;
  recommendation: string;
  selector: string;
  severity: AuditSeverity;
  title: string;
};

type AuditResult = {
  issueCount: number;
  issues: AuditIssue[];
  passCount: number;
  score: number;
  warningCount: number;
};

const sampleMarkup = `<main>
  <section aria-labelledby="signup-title">
    <h1 id="signup-title">Project signup</h1>
    <p>Tell us what you want to build.</p>
    <label for="email">Email address</label>
    <input id="email" type="email" placeholder="you@example.com" />
    <button type="submit">Request invite</button>
  </section>
</main>`;

const text = {
  en: {
    actions: {
      copied: 'Copied',
      copyReport: 'Copy report',
      reset: 'Reset sample',
      run: 'Run check',
    },
    empty: {
      description: 'Paste HTML or rendered component markup, then run the checker.',
      title: 'Ready to inspect',
    },
    issueLabels: {
      critical: 'Fix',
      pass: 'Pass',
      warning: 'Review',
    },
    metrics: {
      issues: 'Issues',
      passed: 'Passed',
      score: 'Score',
      warnings: 'Warnings',
    },
    page: {
      description: 'Paste markup and catch common accessibility misses before they become product debt.',
      highlight: 'Accessibility',
      title: 'Checker',
    },
    panel: {
      description: 'Checks labels, button names, image alt text, link text, heading order, duplicate ids, and simple inline color contrast.',
      placeholder: 'Paste HTML markup here...',
      title: 'Markup input',
    },
    report: {
      allClear: 'No blocking issues found in this pass.',
      title: 'Audit report',
    },
  },
  ko: {
    actions: {
      copied: '복사됨',
      copyReport: '리포트 복사',
      reset: '샘플 초기화',
      run: '검사 실행',
    },
    empty: {
      description: 'HTML이나 렌더링된 컴포넌트 마크업을 붙여 넣고 검사를 실행하세요.',
      title: '검사 준비 완료',
    },
    issueLabels: {
      critical: '수정',
      pass: '통과',
      warning: '확인',
    },
    metrics: {
      issues: '이슈',
      passed: '통과',
      score: '점수',
      warnings: '경고',
    },
    page: {
      description: '마크업을 붙여 넣고 접근성 누락을 제품 부채가 되기 전에 잡아내세요.',
      highlight: '접근성',
      title: '검사기',
    },
    panel: {
      description: '라벨, 버튼 이름, 이미지 alt, 링크 텍스트, heading 순서, 중복 id, 간단한 inline 색상 대비를 확인합니다.',
      placeholder: 'HTML 마크업을 붙여 넣으세요...',
      title: '마크업 입력',
    },
    report: {
      allClear: '이번 검사에서 막히는 이슈를 찾지 못했습니다.',
      title: '검사 리포트',
    },
  },
} as const;

function getSelector(element: Element) {
  const tagName = element.tagName.toLowerCase();
  const id = element.getAttribute('id');
  const ariaLabel = element.getAttribute('aria-label');
  const name = element.getAttribute('name');

  if (id) return `${tagName}#${id}`;
  if (ariaLabel) return `${tagName}[aria-label="${ariaLabel}"]`;
  if (name) return `${tagName}[name="${name}"]`;
  return tagName;
}

function getAccessibleName(element: Element) {
  return [
    element.getAttribute('aria-label'),
    element.getAttribute('title'),
    element.textContent,
  ].find((value) => value?.trim())?.trim() ?? '';
}

function hasInputLabel(element: Element, document: Document) {
  const id = element.getAttribute('id');

  return Boolean(
    element.getAttribute('aria-label')
    || element.getAttribute('aria-labelledby')
    || element.closest('label')
    || (id && document.querySelector(`label[for="${CSS.escape(id)}"]`))
  );
}

function parseHexColor(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);

  if (!match) return null;

  const hex = match[1].length === 3
    ? match[1].split('').map((part) => `${part}${part}`).join('')
    : match[1];

  return {
    b: parseInt(hex.slice(4, 6), 16),
    g: parseInt(hex.slice(2, 4), 16),
    r: parseInt(hex.slice(0, 2), 16),
  };
}

function luminance(channel: number) {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function contrastRatio(foreground: string, background: string) {
  const fg = parseHexColor(foreground);
  const bg = parseHexColor(background);

  if (!fg || !bg) return null;

  const fgLum = 0.2126 * luminance(fg.r) + 0.7152 * luminance(fg.g) + 0.0722 * luminance(fg.b);
  const bgLum = 0.2126 * luminance(bg.r) + 0.7152 * luminance(bg.g) + 0.0722 * luminance(bg.b);
  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);

  return (lighter + 0.05) / (darker + 0.05);
}

function readInlineStyle(element: Element, property: string) {
  const style = element.getAttribute('style') ?? '';
  const match = style.match(new RegExp(`${property}\\s*:\\s*([^;]+)`, 'i'));
  return match?.[1]?.trim() ?? '';
}

function analyzeMarkup(markup: string): AuditResult {
  if (!markup.trim()) {
    return { issueCount: 0, issues: [], passCount: 0, score: 0, warningCount: 0 };
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(markup, 'text/html');
  const issues: AuditIssue[] = [];
  let passCount = 0;

  const addIssue = (issue: Omit<AuditIssue, 'id'>) => {
    issues.push({ ...issue, id: `${issue.selector}-${issue.title}-${issues.length}` });
  };

  document.querySelectorAll('img').forEach((image) => {
    if (!image.hasAttribute('alt')) {
      addIssue({
        detail: 'Image elements need alt text, even when the image is decorative.',
        recommendation: 'Add alt text, or use alt="" for decorative images.',
        selector: getSelector(image),
        severity: 'critical',
        title: 'Image is missing alt text',
      });
      return;
    }

    passCount += 1;
  });

  document.querySelectorAll('input, select, textarea').forEach((control) => {
    const type = control.getAttribute('type');

    if (['button', 'hidden', 'reset', 'submit'].includes(type ?? '')) {
      return;
    }

    if (!hasInputLabel(control, document)) {
      addIssue({
        detail: 'Form controls need a programmatic label so assistive technology can announce their purpose.',
        recommendation: 'Connect a label with htmlFor/id, wrap the control in a label, or add aria-label.',
        selector: getSelector(control),
        severity: 'critical',
        title: 'Form control has no accessible label',
      });
      return;
    }

    passCount += 1;
  });

  document.querySelectorAll('button').forEach((button) => {
    if (!getAccessibleName(button)) {
      addIssue({
        detail: 'Icon-only or empty buttons need an accessible name.',
        recommendation: 'Add visible text, aria-label, or title.',
        selector: getSelector(button),
        severity: 'critical',
        title: 'Button has no accessible name',
      });
      return;
    }

    passCount += 1;
  });

  document.querySelectorAll('a').forEach((link) => {
    if (!link.getAttribute('href')) {
      addIssue({
        detail: 'Links without href are not reliable keyboard or screen reader targets.',
        recommendation: 'Use a button for actions, or add a valid href for navigation.',
        selector: getSelector(link),
        severity: 'warning',
        title: 'Link is missing href',
      });
      return;
    }

    if (!getAccessibleName(link)) {
      addIssue({
        detail: 'Links need text that describes their destination.',
        recommendation: 'Add clear link text or aria-label.',
        selector: getSelector(link),
        severity: 'critical',
        title: 'Link has no accessible name',
      });
      return;
    }

    passCount += 1;
  });

  let lastHeadingLevel = 0;
  document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
    const level = Number(heading.tagName.slice(1));

    if (lastHeadingLevel && level > lastHeadingLevel + 1) {
      addIssue({
        detail: `Heading jumps from h${lastHeadingLevel} to h${level}.`,
        recommendation: 'Keep heading levels sequential so page structure is predictable.',
        selector: getSelector(heading),
        severity: 'warning',
        title: 'Heading level is skipped',
      });
    } else {
      passCount += 1;
    }

    lastHeadingLevel = level;
  });

  const ids = new Map<string, Element[]>();
  document.querySelectorAll('[id]').forEach((element) => {
    const id = element.getAttribute('id');

    if (!id) return;

    ids.set(id, [...(ids.get(id) ?? []), element]);
  });

  ids.forEach((elements, id) => {
    if (elements.length > 1) {
      addIssue({
        detail: `The id "${id}" is used ${elements.length} times.`,
        recommendation: 'Use unique ids so labels, descriptions, and anchors resolve correctly.',
        selector: `#${id}`,
        severity: 'critical',
        title: 'Duplicate id found',
      });
    }
  });

  document.querySelectorAll('[style]').forEach((element) => {
    const color = readInlineStyle(element, 'color');
    const background = readInlineStyle(element, 'background-color') || readInlineStyle(element, 'background');
    const ratio = color && background ? contrastRatio(color, background) : null;

    if (ratio === null) {
      return;
    }

    if (ratio < 4.5) {
      addIssue({
        detail: `Inline contrast ratio is ${ratio.toFixed(2)}:1.`,
        recommendation: 'Use a foreground/background pair with at least 4.5:1 contrast for normal text.',
        selector: getSelector(element),
        severity: 'warning',
        title: 'Text contrast may be too low',
      });
      return;
    }

    passCount += 1;
  });

  const criticalCount = issues.filter((issue) => issue.severity === 'critical').length;
  const warningCount = issues.filter((issue) => issue.severity === 'warning').length;
  const totalChecks = Math.max(1, passCount + criticalCount + warningCount);
  const score = Math.max(0, Math.round(((passCount - criticalCount * 0.8 - warningCount * 0.35) / totalChecks) * 100));

  return {
    issueCount: criticalCount,
    issues,
    passCount,
    score,
    warningCount,
  };
}

function buildReport(result: AuditResult) {
  if (result.issues.length === 0) {
    return `Accessibility score: ${result.score}\nNo issues found.`;
  }

  return [
    `Accessibility score: ${result.score}`,
    ...result.issues.map((issue) => `[${issue.severity}] ${issue.title}\n${issue.selector}: ${issue.recommendation}`),
  ].join('\n\n');
}

function getSeverityClass(severity: AuditSeverity) {
  if (severity === 'critical') {
    return 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300';
  }

  if (severity === 'warning') {
    return 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950/20 dark:text-yellow-300';
  }

  return 'border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/20 dark:text-green-300';
}

export function AccessibilityCheckerPage() {
  const { language } = useLanguage();
  const pageText = text[language];
  const [markup, setMarkup] = useState(sampleMarkup);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => analyzeMarkup(markup), [markup]);
  const report = useMemo(() => buildReport(result), [result]);

  const copyReport = async () => {
    const wasCopied = await copyTextToClipboard(report);
    setCopied(wasCopied);

    if (wasCopied) {
      window.setTimeout(() => setCopied(false), 1400);
    }
  };

  const metrics = [
    { label: pageText.metrics.score, value: result.score ? `${result.score}` : '--' },
    { label: pageText.metrics.issues, value: result.issueCount },
    { label: pageText.metrics.warnings, value: result.warningCount },
    { label: pageText.metrics.passed, value: result.passCount },
  ];

  return (
    <div className="container-page space-y-6">
      <header className="section-header">
        <p className="text-sm font-semibold uppercase text-green-600 dark:text-green-400">{pageText.page.highlight}</p>
        <h1 className="section-title text-gray-950 dark:text-white">{pageText.page.title}</h1>
        <p className="section-description max-w-3xl">{pageText.page.description}</p>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card>
          <CardHeader
            title={pageText.panel.title}
            description={pageText.panel.description}
            icon={<Accessibility className="icon-lg text-green-600 dark:text-green-400" />}
            badge={(
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => setMarkup(sampleMarkup)} className="gap-2">
                  <RotateCcw className="icon-sm" />
                  {pageText.actions.reset}
                </Button>
                <Button onClick={copyReport} className="gap-2">
                  <Copy className="icon-sm" />
                  {copied ? pageText.actions.copied : pageText.actions.copyReport}
                </Button>
              </div>
            )}
          />
          <CardContent className="space-y-4">
            <textarea
              value={markup}
              onChange={(event) => setMarkup(event.target.value)}
              placeholder={pageText.panel.placeholder}
              className="min-h-[420px] w-full resize-y rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-green-950"
            />
          </CardContent>
        </Card>

        <aside className="space-y-6">
          <Card>
            <CardHeader title={pageText.report.title} description={result.issues.length ? `${result.issues.length} findings` : pageText.report.allClear} />
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-950 dark:text-white">{metric.value}</p>
                  </div>
                ))}
              </div>

              {result.issues.length === 0 ? (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700 dark:border-green-900 dark:bg-green-950/20 dark:text-green-300">
                  <CheckCircle2 className="mb-2 h-5 w-5" />
                  <p className="text-sm">{pageText.report.allClear}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {result.issues.map((issue) => (
                    <article key={issue.id} className={`rounded-lg border p-4 ${getSeverityClass(issue.severity)}`}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <TriangleAlert className="h-4 w-4" />
                          <h2 className="text-sm font-semibold">{issue.title}</h2>
                        </div>
                        <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-semibold dark:bg-black/20">
                          {pageText.issueLabels[issue.severity]}
                        </span>
                      </div>
                      <p className="font-mono text-xs opacity-80">{issue.selector}</p>
                      <p className="mt-2 text-sm">{issue.detail}</p>
                      <p className="mt-2 text-sm font-medium">{issue.recommendation}</p>
                    </article>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
