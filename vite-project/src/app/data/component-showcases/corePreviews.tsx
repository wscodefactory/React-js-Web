import { useId, useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { GhostPanel, PreviewStack } from "./helpers";

const corePreviewText = {
  en: {
    accordion: {
      openPanel: "This section is open. Pick another row to move focus, or select this one again to close it.",
      questions: {
        "Are accordions difficult to implement in Power Apps?": "Are accordions difficult to implement in Power Apps?",
        "How do accordions improve mobile responsiveness?": "How do accordions improve mobile responsiveness?",
        "How do I import custom icons?": "How do I import custom icons?",
        "Where can I learn more Power Apps design tricks?": "Where can I learn more Power Apps design tricks?",
        "Why do most Power Apps look outdated?": "Why do most Power Apps look outdated?",
        "Why should I use accordions in my Power Apps?": "Why should I use accordions in my Power Apps?",
      },
    },
    buttons: {
      actions: {
        "Add New": "Add New",
        Confirm: "Confirm",
        Danger: "Danger",
        Delete: "Delete",
        Primary: "Primary",
        Secondary: "Secondary",
        Success: "Success",
      },
      lastAction: "Last action",
    },
    input: {
      charactersReady: (count: number) => `${count} characters entered. This name is ready to use.`,
      label: "Project name",
      placeholder: "Enter a project name",
      tooShort: "Use at least 3 characters so this name is easier to recognize.",
      value: "Launch dashboard",
    },
    status: {
      increment: "Increment",
      items: (count: number) => `${count} items`,
      selected: "Selected status",
      values: {
        Active: "Active",
        Blocked: "Blocked",
        Pending: "Pending",
        Reviewed: "Reviewed",
      },
    },
    toggle: {
      label: "Notifications",
      off: "Off",
      on: "On",
    },
  },
  ko: {
    accordion: {
      openPanel: "현재 패널이 열려 있습니다. 다른 행을 누르면 초점이 이동하고, 같은 행을 다시 누르면 접힙니다.",
      questions: {
        "Are accordions difficult to implement in Power Apps?": "Power Apps에서 아코디언 구현이 어려운가요?",
        "How do accordions improve mobile responsiveness?": "아코디언은 모바일 반응성을 어떻게 개선하나요?",
        "How do I import custom icons?": "커스텀 아이콘은 어떻게 가져오나요?",
        "Where can I learn more Power Apps design tricks?": "Power Apps 디자인 팁은 어디서 더 볼 수 있나요?",
        "Why do most Power Apps look outdated?": "많은 Power Apps 화면이 오래되어 보이는 이유는 무엇인가요?",
        "Why should I use accordions in my Power Apps?": "Power Apps에서 아코디언을 왜 써야 하나요?",
      },
    },
    buttons: {
      actions: {
        "Add New": "새로 추가",
        Confirm: "확인",
        Danger: "위험",
        Delete: "삭제",
        Primary: "주요",
        Secondary: "보조",
        Success: "성공",
      },
      lastAction: "마지막 동작",
    },
    input: {
      charactersReady: (count: number) => `${count}자 입력했습니다. 이 이름은 사용할 수 있습니다.`,
      label: "프로젝트 이름",
      placeholder: "프로젝트 이름 입력",
      tooShort: "식별하기 쉽도록 3자 이상 입력해주세요.",
      value: "대시보드 출시",
    },
    status: {
      increment: "증가",
      items: (count: number) => `${count}개 항목`,
      selected: "선택한 상태",
      values: {
        Active: "활성",
        Blocked: "차단됨",
        Pending: "대기",
        Reviewed: "검토 완료",
      },
    },
    toggle: {
      label: "알림",
      off: "끔",
      on: "켬",
    },
  },
} as const;

type ButtonAction = "Add New" | "Confirm" | "Danger" | "Delete" | "Primary" | "Secondary" | "Success";
type StatusKey = "Active" | "Blocked" | "Pending" | "Reviewed";

export function InteractiveAccordionPreview({ items, variant }: { items: string[]; variant: "plus" | "classic" }) {
  const { language } = useLanguage();
  const text = corePreviewText[language].accordion;
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <PreviewStack>
      {items.map((label, index) => {
        const isOpen = openIndex === index;

        return (
          <GhostPanel key={label}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex((current) => (current === index ? -1 : index))}
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <span className="font-medium text-gray-900 dark:text-white">{text.questions[label as keyof typeof text.questions] ?? label}</span>
              <span className="text-xl text-gray-500">{variant === "plus" ? (isOpen ? "-" : "+") : isOpen ? "v" : ">"}</span>
            </button>
            {isOpen ? (
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                {text.openPanel}
              </p>
            ) : null}
          </GhostPanel>
        );
      })}
    </PreviewStack>
  );
}

export function ButtonActionPreview({ variant }: { variant: "solid" | "outline" | "icon" }) {
  const { language } = useLanguage();
  const text = corePreviewText[language].buttons;
  const [activeAction, setActiveAction] = useState<ButtonAction>("Primary");
  const solidActions: ButtonAction[] = ["Primary", "Secondary", "Success", "Danger"];
  const outlineActions: ButtonAction[] = ["Primary", "Secondary", "Success"];
  const iconActions: ButtonAction[] = ["Add New", "Delete", "Confirm"];
  const actions = variant === "solid" ? solidActions : variant === "outline" ? outlineActions : iconActions;

  const baseClass = "rounded-md px-6 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-400";
  const solidClassMap: Record<ButtonAction, string> = {
    "Add New": "",
    Confirm: "",
    Danger: "bg-red-600 text-white",
    Delete: "",
    Primary: "bg-blue-600 text-white",
    Secondary: "bg-gray-600 text-white",
    Success: "bg-green-600 text-white",
  };
  const outlineClassMap: Record<ButtonAction, string> = {
    "Add New": "",
    Confirm: "",
    Danger: "",
    Delete: "",
    Primary: "border-2 border-blue-600 text-blue-600",
    Secondary: "border-2 border-gray-500 text-gray-600 dark:text-gray-300",
    Success: "border-2 border-green-600 text-green-600",
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {actions.map((action) => (
          <button
            key={action}
            type="button"
            onClick={() => setActiveAction(action)}
            className={[
              baseClass,
              variant === "solid" ? solidClassMap[action] : "",
              variant === "outline" ? outlineClassMap[action] : "",
              variant === "icon" ? "flex items-center gap-2 bg-blue-600 text-white" : "",
              activeAction === action ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900" : "",
            ].join(" ")}
          >
            {variant === "icon" ? <span aria-hidden="true">{action === "Add New" ? "+" : action === "Delete" ? "-" : "OK"}</span> : null}
            {text.actions[action]}
          </button>
        ))}
      </div>
      <p className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {text.lastAction}: <span className="font-semibold">{text.actions[activeAction]}</span>
      </p>
    </div>
  );
}

export function EditableInputPreview() {
  const { language } = useLanguage();
  const text = corePreviewText[language].input;
  const inputId = useId();
  const [value, setValue] = useState<string>(text.value);
  const isValid = value.trim().length >= 3;

  return (
    <div className="max-w-lg space-y-3">
      <div>
        <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{text.label}</label>
        <input
          id={inputId}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-gray-900 outline-none transition dark:bg-gray-900 dark:text-white ${
            isValid ? "border-green-500 focus:ring-2 focus:ring-green-200" : "border-red-500 focus:ring-2 focus:ring-red-200"
          }`}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={text.placeholder}
        />
      </div>
      <p className={`text-sm ${isValid ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
        {isValid ? text.charactersReady(value.trim().length) : text.tooShort}
      </p>
    </div>
  );
}

export function TogglePreview() {
  const { language } = useLanguage();
  const text = corePreviewText[language].toggle;
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600 dark:text-gray-300">{text.label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => setEnabled((current) => !current)}
        className={`flex h-8 w-14 items-center rounded-full px-1 transition ${enabled ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"}`}
      >
        <span className={`h-6 w-6 rounded-full bg-white transition ${enabled ? "translate-x-6" : "translate-x-0"}`} />
      </button>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{enabled ? text.on : text.off}</span>
    </div>
  );
}

export function StatusBadgePreview() {
  const { language } = useLanguage();
  const text = corePreviewText[language].status;
  const statuses: Array<{ className: string; key: StatusKey; label: string }> = [
    { key: "Active", label: text.values.Active, className: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" },
    { key: "Pending", label: text.values.Pending, className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300" },
    { key: "Blocked", label: text.values.Blocked, className: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300" },
    { key: "Reviewed", label: text.values.Reviewed, className: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" },
  ];
  const [activeStatus, setActiveStatus] = useState<StatusKey>("Active");
  const [reviewCount, setReviewCount] = useState(12);
  const activeStatusItem = statuses.find((status) => status.key === activeStatus) ?? statuses[0];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {statuses.map((status) => (
          <button
            key={status.key}
            type="button"
            onClick={() => setActiveStatus(status.key)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${status.className} ${
              activeStatus === status.key ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900" : ""
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>
      <GhostPanel className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{text.selected}</p>
          <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${activeStatusItem.className}`}>{activeStatusItem.label}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-gray-900 px-3 py-1 text-sm font-semibold text-white dark:bg-white dark:text-gray-900">
            {text.items(reviewCount)}
          </span>
          <button
            type="button"
            onClick={() => setReviewCount((count) => count + 1)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {text.increment}
          </button>
        </div>
      </GhostPanel>
    </div>
  );
}
