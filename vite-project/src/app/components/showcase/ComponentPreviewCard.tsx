import { BookOpen, Check, Code2, Copy, Eye, FolderOpen, Link2, LockKeyhole, MoreVertical, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/app/context/AuthContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { componentShowcaseText, localizeBadge } from "@/app/i18n";
import type { ComponentPreviewItem } from "@/app/types/component-showcase";
import { copyTextToClipboard } from "@/app/utils/clipboard";
import {
  hydrateSavedPreviewEntry,
  readSavedPreviewIds,
  recordRecentPreview,
  removeSavedPreviewEntry,
  savePreviewEntry,
  savedPreviewChangeEvent,
} from "./savedPreviews";

const badgeToneClasses = {
  free: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  pro: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  new: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  featured: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
} as const;

export interface ComponentPreviewCardProps {
  item: ComponentPreviewItem;
}

type PreviewTab = "preview" | "code" | "usage";

export function getPreviewSectionId(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Reusable card for component demo pages.
 * Keeps the layout consistent while individual previews remain flexible.
 * Includes a lightweight action menu so each showcase block can expose a shareable deep link.
 */
export function ComponentPreviewCard({ item }: ComponentPreviewCardProps) {
  const auth = useAuth();
  const { language } = useLanguage();
  const text = componentShowcaseText[language];
  const isProItem = item.badge?.tone === "pro";
  const isProLocked = isProItem && !auth.canUseProContent;
  const accessTone = isProItem ? "pro" : "free";
  const statusTone = item.badge?.tone;
  const showsStatusBadge = statusTone === "new" || statusTone === "featured";
  const sectionId = useMemo(() => getPreviewSectionId(item.id ?? item.title), [item.id, item.title]);
  const [activeTab, setActiveTab] = useState<PreviewTab>("preview");
  const [isSourceLoading, setIsSourceLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [sourceCode, setSourceCode] = useState(item.sourceCode ?? "");
  const [toastMessage, setToastMessage] = useState("");
  const menuRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const hideToastTimeoutRef = useRef<number | null>(null);

  const getLibraryEntry = () => ({
    accessTier: isProItem ? "pro" as const : "general" as const,
    description: item.description,
    id: sectionId,
    path: `${window.location.pathname}#${sectionId}`,
    title: item.title,
  });

  useEffect(() => {
    const syncSavedState = () => setIsSaved(readSavedPreviewIds().includes(sectionId));
    syncSavedState();
    hydrateSavedPreviewEntry(getLibraryEntry());

    window.addEventListener(savedPreviewChangeEvent, syncSavedState);
    window.addEventListener("storage", syncSavedState);
    return () => {
      window.removeEventListener(savedPreviewChangeEvent, syncSavedState);
      window.removeEventListener("storage", syncSavedState);
    };
  }, [item.description, item.title, isProItem, sectionId]);

  useEffect(() => {
    const sectionElement = sectionRef.current;
    if (!sectionElement) return undefined;

    const recordView = () => recordRecentPreview(getLibraryEntry());

    if (!("IntersectionObserver" in window)) {
      recordView();
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        recordView();
        observer.disconnect();
      }
    }, { threshold: 0.35 });

    observer.observe(sectionElement);
    return () => observer.disconnect();
  }, [item.description, item.title, isProItem, sectionId]);

  useEffect(() => {
    if (activeTab !== "code" || isProLocked || sourceCode || !item.loadSourceCode) return undefined;

    let isActive = true;
    setIsSourceLoading(true);

    void item.loadSourceCode()
      .then((loadedSource) => {
        if (isActive) setSourceCode(loadedSource);
      })
      .catch(() => {
        if (isActive) setSourceCode("");
      })
      .finally(() => {
        if (isActive) setIsSourceLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [activeTab, isProLocked, item.loadSourceCode, sourceCode]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);

      if (hideToastTimeoutRef.current) {
        window.clearTimeout(hideToastTimeoutRef.current);
      }
    };
  }, []);

  function showToast(message: string) {
    setToastMessage(message);

    if (hideToastTimeoutRef.current) {
      window.clearTimeout(hideToastTimeoutRef.current);
    }

    hideToastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage("");
    }, 1800);
  }

  async function handleCopyLink() {
    const baseUrl = window.location.href.split("#")[0];
    const shareUrl = `${baseUrl}#${sectionId}`;

    try {
      const copied = await copyTextToClipboard(shareUrl);

      if (!copied) {
        throw new Error("Clipboard unavailable.");
      }

      setIsMenuOpen(false);
      showToast(text.linkCopied);
    } catch {
      setIsMenuOpen(false);
      showToast(text.copyFailed);
    }
  }

  async function handleCopyCode() {
    if (!sourceCode) return;

    try {
      const copied = await copyTextToClipboard(sourceCode);
      if (!copied) throw new Error("Clipboard unavailable.");
      showToast(text.codeCopied);
    } catch {
      showToast(text.copyFailed);
    }
  }

  function handleToggleSave() {
    if (isProLocked && !isSaved) {
      return;
    }

    try {
      if (isSaved) {
        removeSavedPreviewEntry(sectionId);
      } else {
        savePreviewEntry(getLibraryEntry());
      }
      setIsSaved(!isSaved);
      setIsMenuOpen(false);
      showToast(isSaved ? text.previewRemoved : text.previewSaved);
    } catch {
      setIsMenuOpen(false);
      showToast(text.saveFailed);
    }
  }

  return (
    <section
      ref={sectionRef}
      id={sectionId}
      className="min-w-0 scroll-mt-24 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeToneClasses[accessTone]}`}>
              {isProItem ? text.proMembership : text.generalMembership}
            </span>
            {item.badge && showsStatusBadge && statusTone ? (
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeToneClasses[statusTone]}`}>
                {localizeBadge(language, item.badge.label)}
              </span>
            ) : null}
            {isSaved ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                <Star className="h-3 w-3 fill-current" />
                {text.saved}
              </span>
            ) : null}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
        </div>

        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            aria-label={text.moreOptions}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {isMenuOpen ? (
            <div className="absolute right-0 top-12 z-20 min-w-[180px] overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
              <button
                type="button"
                onClick={handleToggleSave}
                disabled={isProLocked && !isSaved}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <Star className={`h-4 w-4 ${isSaved ? "fill-current text-amber-500" : ""}`} />
                <span>{isSaved ? text.removeSaved : text.savePreview}</span>
              </button>
              <Link
                to="/collections"
                onClick={() => setIsMenuOpen(false)}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <FolderOpen className="h-4 w-4" />
                <span>내 컬렉션</span>
              </Link>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <Link2 className="h-4 w-4" />
                <span>{text.copyLink}</span>
              </button>
            </div>
          ) : null}

          {toastMessage ? (
            <div className="pointer-events-none fixed bottom-6 right-6 z-[100] rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl transition-all duration-300 dark:bg-white dark:text-gray-900">
              {toastMessage}
            </div>
          ) : null}
        </div>
      </div>

      <div className="min-w-0 border-t border-gray-200 pt-4 dark:border-gray-700">
        <div className="mb-4 inline-flex max-w-full overflow-x-auto rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-900">
          {([
            { icon: Eye, id: "preview" as const, label: text.previewTab },
            { icon: Code2, id: "code" as const, label: text.codeTab },
            { icon: BookOpen, id: "usage" as const, label: text.usageTab },
          ]).map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                <TabIcon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {isProLocked && activeTab !== "usage" ? (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-xl bg-white px-4 py-8 text-center dark:bg-gray-900">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
              <LockKeyhole className="h-5 w-5" />
            </span>
            <h4 className="mt-4 text-base font-semibold text-gray-950 dark:text-white">{text.proOnlyTitle}</h4>
            <p className="mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">{text.proOnlyDescription}</p>
            <Link
              to={auth.isAuthenticated ? "/account" : "/auth/login"}
              className="btn btn-secondary mt-5"
            >
              {text.checkMembership}
            </Link>
          </div>
        ) : activeTab === "preview" ? (
          <div className="min-w-0 overflow-x-auto rounded-xl bg-white p-4 dark:bg-gray-900">{item.preview}</div>
        ) : activeTab === "code" ? (
          <div className="min-w-0 rounded-xl bg-gray-950 text-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 px-4 py-3">
              <p className="min-w-0 break-all text-xs text-gray-400">
                {item.sourcePath ? `${text.sourceFile}: ${item.sourcePath}` : text.codeTab}
              </p>
              <button
                type="button"
                onClick={() => void handleCopyCode()}
                disabled={!sourceCode || isSourceLoading}
                className="inline-flex h-8 shrink-0 items-center gap-2 rounded-md border border-gray-700 px-3 text-xs font-semibold text-gray-200 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {toastMessage === text.codeCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {text.copyCode}
              </button>
            </div>
            {isSourceLoading ? (
              <p className="px-4 py-8 text-sm text-gray-400">{text.codeLoading}</p>
            ) : sourceCode ? (
              <pre className="max-h-[520px] overflow-auto p-4 text-xs leading-6"><code>{sourceCode}</code></pre>
            ) : (
              <p className="px-4 py-8 text-sm text-gray-400">{text.sourceUnavailable}</p>
            )}
          </div>
        ) : (
          <div className="rounded-xl bg-white px-4 py-5 dark:bg-gray-900">
            <ol className="space-y-4">
              {text.usageSteps.map((step, index) => (
                <li key={step} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-200">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700 dark:bg-green-900/50 dark:text-green-300">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
