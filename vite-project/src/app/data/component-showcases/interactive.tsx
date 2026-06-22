import { useState } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import type { ComponentShowcaseConfig } from '@/app/types/component-showcase';
import { GhostPanel } from './helpers';

const interactivePreviewText = {
  en: {
    animation: {
      activeOption: 'Active option',
      baseline: 'Show baseline data',
      newData: 'Animate new data',
      options: {
        'Text 1': 'Text 1',
        'Text 2': 'Text 2',
      },
    },
    calendar: {
      month: 'September 2025',
      today: 'Today',
      weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    },
    modal: {
      cancel: 'Cancel',
      cancelled: 'Cancelled',
      delete: 'Delete',
      deleted: 'Report deleted',
      description: 'This action cannot be undone after the report is removed.',
      open: 'Open modal',
      status: 'Status',
      title: 'Delete this report?',
      waiting: 'Waiting for confirmation',
    },
    stepper: {
      back: 'Back',
      next: 'Next',
      steps: ['Details', 'Setup', 'Review', 'Launch'],
    },
  },
  ko: {
    animation: {
      activeOption: '활성 옵션',
      baseline: '기준 데이터 보기',
      newData: '새 데이터 애니메이션',
      options: {
        'Text 1': '텍스트 1',
        'Text 2': '텍스트 2',
      },
    },
    calendar: {
      month: '2025년 9월',
      today: '오늘',
      weekdays: ['일', '월', '화', '수', '목', '금', '토'],
    },
    modal: {
      cancel: '취소',
      cancelled: '취소됨',
      delete: '삭제',
      deleted: '보고서 삭제됨',
      description: '보고서를 제거하면 이 작업은 되돌릴 수 없습니다.',
      open: '모달 열기',
      status: '상태',
      title: '이 보고서를 삭제할까요?',
      waiting: '확인 대기 중',
    },
    stepper: {
      back: '이전',
      next: '다음',
      steps: ['상세', '설정', '검토', '출시'],
    },
  },
} as const;

type ToggleOption = 'Text 1' | 'Text 2';

function AnimatedLineChartPreview() {
  const { language } = useLanguage();
  const text = interactivePreviewText[language].animation;
  const [expanded, setExpanded] = useState(false);
  const heights = expanded ? [72, 46, 82, 55, 88, 63, 70, 94] : [20, 35, 25, 45, 55, 40, 60, 75];

  return (
    <div className="space-y-4">
      <div className="flex h-56 items-end gap-2">
        {heights.map((height, index) => (
          <div
            key={index}
            className="flex-1 rounded-t-lg bg-gradient-to-t from-blue-600 to-cyan-300 transition-all duration-500"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        {expanded ? text.baseline : text.newData}
      </button>
    </div>
  );
}

function AnimatedTogglePreview() {
  const { language } = useLanguage();
  const text = interactivePreviewText[language].animation;
  const [active, setActive] = useState<ToggleOption>('Text 1');

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="inline-flex rounded-full bg-gray-200 p-1 dark:bg-gray-700">
        {(['Text 1', 'Text 2'] as ToggleOption[]).map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setActive(label)}
            className={`rounded-full px-6 py-2 font-medium transition ${
              active === label ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-white/70 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            {text.options[label]}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{text.activeOption}: {text.options[active]}</p>
    </div>
  );
}

function CalendarPreview() {
  const { language } = useLanguage();
  const text = interactivePreviewText[language].calendar;

  return (
    <GhostPanel className="max-w-sm">
      <div className="mb-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
        <span>{text.month}</span>
        <span>{text.today}</span>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {text.weekdays.map((day) => <span key={day} className="text-gray-500">{day}</span>)}
        {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
          <span
            key={day}
            className={`rounded-lg py-2 ${day === 18 ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-200'}`}
          >
            {day}
          </span>
        ))}
      </div>
    </GhostPanel>
  );
}

function ModalPreview() {
  const { language } = useLanguage();
  const text = interactivePreviewText[language].modal;
  const [isOpen, setIsOpen] = useState(true);
  const [status, setStatus] = useState<string>(text.waiting);

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setStatus(text.waiting);
        }}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-gray-900"
      >
        {text.open}
      </button>

      {isOpen ? (
        <GhostPanel className="w-full max-w-md space-y-4 shadow-xl">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{text.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{text.description}</p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setStatus(text.cancelled);
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm transition hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              {text.cancel}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setStatus(text.deleted);
              }}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              {text.delete}
            </button>
          </div>
        </GhostPanel>
      ) : null}

      <p className="text-sm text-gray-600 dark:text-gray-400">{text.status}: {status}</p>
    </div>
  );
}

function StepperPreview() {
  const { language } = useLanguage();
  const text = interactivePreviewText[language].stepper;
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {text.steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isActive = index === currentStep;

          return (
            <button
              key={step}
              type="button"
              onClick={() => setCurrentStep(index)}
              className="flex items-center gap-3 text-left"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full font-medium transition ${
                  isComplete ? 'bg-blue-600 text-white' : isActive ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                {index + 1}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{step}</span>
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700"
        >
          {text.back}
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep((step) => Math.min(text.steps.length - 1, step + 1))}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
        >
          {text.next}
        </button>
      </div>
    </div>
  );
}

export const interactiveComponentShowcases = {
  animations: {
    eyebrow: 'Motion Library',
    title: 'Power Apps',
    titleHighlight: 'Animation Components',
    description: 'Animated progress and feedback patterns for dashboard-style interfaces.',
    updatedAt: 'Sep 1, 2025',
    sections: [
      {
        title: 'Animated Line Chart',
        description: 'A chart preview with gradient bars, useful for KPI or trend widgets.',
        badge: { label: 'PRO', tone: 'pro' },
        preview: <AnimatedLineChartPreview />,
      },
      {
        title: 'Animated Toggle',
        description: 'Segmented controls with animated state transitions for filters and modes.',
        badge: { label: 'PRO', tone: 'pro' },
        preview: <AnimatedTogglePreview />,
      },
    ],
  },
  calendars: {
    eyebrow: 'Date Selection',
    title: 'Calendars',
    titleHighlight: 'Component',
    description: 'Calendar layouts and date pickers for reservation, scheduling, and task views.',
    sections: [
      {
        title: 'Date Picker',
        description: 'A lightweight monthly view for selecting dates in forms.',
        preview: <CalendarPreview />,
      },
    ],
  },
  modals: {
    eyebrow: 'Focus States',
    title: 'Modals',
    titleHighlight: 'Component',
    description: 'Dialog patterns for confirmations, warnings, and short focused workflows.',
    sections: [
      {
        title: 'Confirmation Modal',
        description: 'A modal layout for confirming destructive actions or important changes.',
        preview: <ModalPreview />,
      },
    ],
  },
  steppers: {
    eyebrow: 'Workflow Progress',
    title: 'Steppers',
    titleHighlight: 'Component',
    description: 'Step indicators for onboarding, setup, and multi-step operational flows.',
    sections: [
      {
        title: 'Progress Stepper',
        description: 'A horizontal stepper for forms, wizard flows, and approvals.',
        preview: <StepperPreview />,
      },
    ],
  },
} satisfies Record<string, ComponentShowcaseConfig>;
