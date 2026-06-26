import { useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { GhostPanel } from "./helpers";
import { isBoolean, isStringOption, useStoredPreviewState } from "./previewState";

const segmentedOptions = ["Overview", "Activity", "Files"] as const;
const dropdownActions = ["Rename", "Duplicate", "Share", "Archive"] as const;
const dropdownActionStates = ["No action selected", ...dropdownActions] as const;
const navLinks = ["Components", "Templates", "Pricing"] as const;
const tabItems = ["Overview", "Details", "History"] as const;

const buttonGroupPreviewText = {
  en: {
    options: {
      Activity: "Activity",
      Files: "Files",
      Overview: "Overview",
    },
    selectedSegment: "Selected segment",
  },
  ko: {
    options: {
      Activity: "활동",
      Files: "파일",
      Overview: "개요",
    },
    selectedSegment: "선택한 세그먼트",
  },
} as const;

const dropdownPreviewText = {
  en: {
    actionLabel: "Actions",
    actions: {
      Archive: "Archive",
      Duplicate: "Duplicate",
      Rename: "Rename",
      Share: "Share",
    },
    noActionSelected: "No action selected",
    selectedAction: "Selected action",
  },
  ko: {
    actionLabel: "작업",
    actions: {
      Archive: "보관",
      Duplicate: "복제",
      Rename: "이름 변경",
      Share: "공유",
    },
    noActionSelected: "선택한 작업 없음",
    selectedAction: "선택한 작업",
  },
} as const;

const navigationBarPreviewText = {
  en: {
    currentRoute: "Current route",
    getStarted: "Get started",
    links: {
      Components: "Components",
      Pricing: "Pricing",
      Templates: "Templates",
    },
    productName: "Power UI",
    started: "Started",
  },
  ko: {
    currentRoute: "현재 경로",
    getStarted: "시작하기",
    links: {
      Components: "컴포넌트",
      Pricing: "가격",
      Templates: "템플릿",
    },
    productName: "Power UI",
    started: "시작됨",
  },
} as const;

const tabsPreviewText = {
  en: {
    content: {
      Details: "Owner notes, settings, and useful details appear here.",
      History: "Recent updates and activity history appear here.",
      Overview: "Summary cards and key signals appear here.",
    },
    labels: {
      Details: "Details",
      History: "History",
      Overview: "Overview",
    },
  },
  ko: {
    content: {
      Details: "담당자 메모, 설정, 필요한 상세 정보가 여기에 표시됩니다.",
      History: "최근 업데이트와 활동 기록이 여기에 표시됩니다.",
      Overview: "요약 카드와 핵심 정보가 여기에 표시됩니다.",
    },
    labels: {
      Details: "상세",
      History: "기록",
      Overview: "개요",
    },
  },
} as const;

type SegmentedOption = typeof segmentedOptions[number];
type DropdownActionState = typeof dropdownActionStates[number];
type NavLink = typeof navLinks[number];
type TabLabel = typeof tabItems[number];

export function SegmentedControlsPreview() {
  const { language } = useLanguage();
  const text = buttonGroupPreviewText[language];
  const [active, setActive] = useStoredPreviewState<SegmentedOption>(
    "web5:component-preview:button-group-active:v1",
    segmentedOptions[0],
    (value): value is SegmentedOption => isStringOption(segmentedOptions, value),
  );

  return (
    <div className="space-y-4">
      <div className="inline-flex overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        {segmentedOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setActive(option)}
            className={`px-5 py-2 text-sm font-medium transition ${
              active === option
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            {text.options[option]}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{text.selectedSegment}: {text.options[active]}</p>
    </div>
  );
}

export function DropdownPreview() {
  const { language } = useLanguage();
  const text = dropdownPreviewText[language];
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useStoredPreviewState<DropdownActionState>(
    "web5:component-preview:dropdown-action:v1",
    "No action selected",
    (value): value is DropdownActionState => isStringOption(dropdownActionStates, value),
  );
  const selectedLabel = selectedAction === "No action selected" ? text.noActionSelected : text.actions[selectedAction];

  return (
    <div className="w-full max-w-sm space-y-3">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
      >
        <span>{text.actionLabel}</span>
        <span aria-hidden="true" className="text-gray-400">{isOpen ? "^" : "v"}</span>
      </button>
      {isOpen ? (
        <GhostPanel className="w-full space-y-2 bg-white shadow-xl dark:bg-gray-900">
          {dropdownActions.map((action) => (
            <button
              key={action}
              type="button"
              role="menuitem"
              onClick={() => {
                setSelectedAction(action);
                setIsOpen(false);
              }}
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {text.actions[action]}
            </button>
          ))}
        </GhostPanel>
      ) : null}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {text.selectedAction}: <span className="font-medium text-gray-800 dark:text-gray-200">{selectedLabel}</span>
      </p>
    </div>
  );
}

export function NavigationBarPreview() {
  const { language } = useLanguage();
  const text = navigationBarPreviewText[language];
  const [activeLink, setActiveLink] = useStoredPreviewState<NavLink>(
    "web5:component-preview:navigation-link:v1",
    navLinks[0],
    (value): value is NavLink => isStringOption(navLinks, value),
  );
  const [started, setStarted] = useStoredPreviewState(
    "web5:component-preview:navigation-started:v1",
    false,
    isBoolean,
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
        <span className="font-semibold text-gray-900 dark:text-white">{text.productName}</span>
        <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-300">
          {navLinks.map((link) => (
            <button
              key={link}
              type="button"
              onClick={() => setActiveLink(link)}
              className={`rounded-lg px-3 py-2 transition ${activeLink === link ? "bg-white text-blue-600 shadow-sm dark:bg-gray-900" : "hover:bg-white/70 dark:hover:bg-gray-900"}`}
            >
              {text.links[link]}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setStarted((current) => !current)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
        >
          {started ? text.started : text.getStarted}
        </button>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {text.currentRoute}: <span className="font-medium text-gray-800 dark:text-gray-200">{text.links[activeLink]}</span>
      </p>
    </div>
  );
}

export function TabsPreview() {
  const { language } = useLanguage();
  const text = tabsPreviewText[language];
  const [activeTab, setActiveTab] = useStoredPreviewState<TabLabel>(
    "web5:component-preview:tabs-active:v1",
    tabItems[0],
    (value): value is TabLabel => isStringOption(tabItems, value),
  );
  const activeContent = text.content[activeTab];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2 dark:border-gray-700">
        {tabItems.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === tab ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            {text.labels[tab]}
          </button>
        ))}
      </div>
      <GhostPanel>{activeContent}</GhostPanel>
    </div>
  );
}
