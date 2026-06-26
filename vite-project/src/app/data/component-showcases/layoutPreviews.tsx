import { useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { GhostPanel } from "./helpers";

const appShellPreviewText = {
  en: {
    comfortShell: "Comfort shell",
    compact: "Compact",
    compactShell: "Compact shell",
    navItems: {
      Dashboard: "Dashboard",
      Reports: "Reports",
      Settings: "Settings",
      Team: "Team",
    },
    wide: "Wide",
  },
  ko: {
    comfortShell: "여유 셸",
    compact: "압축",
    compactShell: "압축 셸",
    navItems: {
      Dashboard: "대시보드",
      Reports: "보고서",
      Settings: "설정",
      Team: "팀",
    },
    wide: "넓게",
  },
} as const;

const productCardPreviewText = {
  en: {
    details: "Includes KPI cards, chart areas, activity feeds, and dashboard spacing that adapts to the screen.",
    hideDetails: "Hide details",
    price: "$49",
    productDescription: "Dashboard sections and onboarding templates you can reuse right away.",
    productTitle: "Analytics Starter Kit",
    viewDetails: "View details",
  },
  ko: {
    details: "KPI 카드, 차트 영역, 활동 피드, 화면 크기에 맞는 대시보드 간격을 포함합니다.",
    hideDetails: "상세 닫기",
    price: "49,000원",
    productDescription: "바로 재사용할 수 있는 대시보드 섹션과 온보딩 템플릿입니다.",
    productTitle: "분석 스타터 키트",
    viewDetails: "상세 보기",
  },
} as const;

const drawerPreviewText = {
  en: {
    closeDrawer: "Close drawer",
    openDrawer: "Open drawer",
    panelTitle: "Team settings",
  },
  ko: {
    closeDrawer: "드로어 닫기",
    openDrawer: "드로어 열기",
    panelTitle: "팀 설정",
  },
} as const;

const sidebarPreviewText = {
  en: {
    activeSection: "Active section",
    collapse: "Collapse sidebar",
    expand: "Expand sidebar",
    items: {
      Overview: "Overview",
      Projects: "Projects",
      Reports: "Reports",
      Settings: "Settings",
    },
  },
  ko: {
    activeSection: "활성 섹션",
    collapse: "사이드바 접기",
    expand: "사이드바 펼치기",
    items: {
      Overview: "개요",
      Projects: "프로젝트",
      Reports: "보고서",
      Settings: "설정",
    },
  },
} as const;

export function AppShellPreview() {
  const navItems = ["Dashboard", "Reports", "Team", "Settings"] as const;
  const { language } = useLanguage();
  const text = appShellPreviewText[language];
  const [activeNav, setActiveNav] = useState<typeof navItems[number]>(navItems[0]);
  const [compact, setCompact] = useState(false);

  return (
    <div className={`grid gap-4 ${compact ? "md:grid-cols-[160px_1fr]" : "md:grid-cols-[220px_1fr]"}`}>
      <GhostPanel className="space-y-2">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="h-8 w-20 rounded-lg bg-gray-200 dark:bg-gray-700" />
          <button
            type="button"
            onClick={() => setCompact((current) => !current)}
            className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-300"
          >
            {compact ? text.wide : text.compact}
          </button>
        </div>
        {navItems.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setActiveNav(item)}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
              activeNav === item ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {text.navItems[item]}
          </button>
        ))}
      </GhostPanel>
      <GhostPanel className="space-y-3">
        <div className="flex h-12 items-center justify-between rounded-xl bg-gray-200 px-4 dark:bg-gray-700">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{text.navItems[activeNav]}</span>
          <span className="rounded-full bg-white px-3 py-1 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-300">
            {compact ? text.compactShell : text.comfortShell}
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-24 rounded-xl bg-gray-200 p-3 dark:bg-gray-700">
              <div className="h-3 w-16 rounded bg-white/70 dark:bg-gray-900/70" />
            </div>
          ))}
        </div>
      </GhostPanel>
    </div>
  );
}

export function ProductCardPreview() {
  const { language } = useLanguage();
  const text = productCardPreviewText[language];
  const [showDetails, setShowDetails] = useState(false);

  return (
    <GhostPanel className="w-full max-w-md space-y-3">
      <div className="flex h-40 items-end rounded-xl bg-gradient-to-br from-blue-100 via-slate-100 to-emerald-100 p-4 dark:from-blue-950/70 dark:via-gray-800 dark:to-emerald-950/50">
        <div className="h-10 w-28 rounded-lg bg-white/75 shadow-sm dark:bg-gray-950/75" />
      </div>
      <div className="min-w-0">
        <h4 className="truncate font-semibold text-gray-900 dark:text-white">{text.productTitle}</h4>
        <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">{text.productDescription}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-lg font-semibold text-gray-900 dark:text-white">{text.price}</span>
        <button
          type="button"
          onClick={() => setShowDetails((current) => !current)}
          aria-expanded={showDetails}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          {showDetails ? text.hideDetails : text.viewDetails}
        </button>
      </div>
      {showDetails ? (
        <div className="rounded-xl bg-white p-3 text-sm leading-6 text-gray-600 dark:bg-gray-900 dark:text-gray-300">
          {text.details}
        </div>
      ) : null}
    </GhostPanel>
  );
}

export function DrawerPreview() {
  const { language } = useLanguage();
  const text = drawerPreviewText[language];
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        {isOpen ? text.closeDrawer : text.openDrawer}
      </button>
      <div className={isOpen ? "grid overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 md:grid-cols-[minmax(0,1fr)_280px]" : "grid"}>
        <div className={`min-h-56 bg-gray-100 dark:bg-gray-800 ${isOpen ? "" : "rounded-xl"}`} />
        {isOpen ? (
          <div className="min-h-56 border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 md:border-l md:border-t-0">
            <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">{text.panelTitle}</h4>
            <div className="space-y-2">
              <div className="h-10 rounded-lg bg-gray-100 dark:bg-gray-800" />
              <div className="h-10 rounded-lg bg-gray-100 dark:bg-gray-800" />
              <div className="h-10 rounded-lg bg-gray-100 dark:bg-gray-800" />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function SidebarPreview() {
  const items = ["Overview", "Projects", "Reports", "Settings"] as const;
  const { language } = useLanguage();
  const text = sidebarPreviewText[language];
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState<typeof items[number]>(items[0]);
  const activeLabel = text.items[activeItem];

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setIsCollapsed((current) => !current)}
        aria-expanded={!isCollapsed}
        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300"
      >
        {isCollapsed ? text.expand : text.collapse}
      </button>
      <div className={`grid gap-4 ${isCollapsed ? "md:grid-cols-[88px_minmax(0,1fr)]" : "md:grid-cols-[240px_minmax(0,1fr)]"}`}>
        <GhostPanel className="space-y-2">
          {items.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActiveItem(item)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                activeItem === item ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {isCollapsed ? text.items[item].slice(0, 1) : text.items[item]}
            </button>
          ))}
        </GhostPanel>
        <GhostPanel className="h-56">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {text.activeSection}: <span className="font-medium text-gray-800 dark:text-gray-200">{activeLabel}</span>
          </p>
        </GhostPanel>
      </div>
    </div>
  );
}
