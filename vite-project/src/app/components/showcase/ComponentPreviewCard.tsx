import { Link2, MoreVertical, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { componentShowcaseText, localizeBadge } from "@/app/i18n";
import type { ComponentPreviewItem } from "@/app/types/component-showcase";
import { copyTextToClipboard } from "@/app/utils/clipboard";
import { readSavedPreviewIds, toggleSavedPreviewId } from "./savedPreviews";

const badgeToneClasses = {
  free: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  pro: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  new: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  featured: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
} as const;

export interface ComponentPreviewCardProps {
  item: ComponentPreviewItem;
}

export function getPreviewSectionId(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Reusable card for component demo pages.
 * Keeps the layout consistent while individual previews remain flexible.
 * Includes a lightweight action menu so each showcase block can expose a shareable deep link.
 */
export function ComponentPreviewCard({ item }: ComponentPreviewCardProps) {
  const { language } = useLanguage();
  const text = componentShowcaseText[language];
  const tone = item.badge?.tone ?? "free";
  const sectionId = useMemo(() => getPreviewSectionId(item.id ?? item.title), [item.id, item.title]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const menuRef = useRef<HTMLDivElement | null>(null);
  const hideToastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setIsSaved(readSavedPreviewIds().includes(sectionId));
  }, [sectionId]);

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

  function handleToggleSave() {
    try {
      toggleSavedPreviewId(sectionId, isSaved);
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
      id={sectionId}
      className="min-w-0 scroll-mt-24 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
            {item.badge ? (
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeToneClasses[tone]}`}>
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
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <Star className={`h-4 w-4 ${isSaved ? "fill-current text-amber-500" : ""}`} />
                <span>{isSaved ? text.removeSaved : text.savePreview}</span>
              </button>
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
        <div className="min-w-0 overflow-x-auto rounded-xl bg-white p-4 dark:bg-gray-900">{item.preview}</div>
      </div>
    </section>
  );
}
