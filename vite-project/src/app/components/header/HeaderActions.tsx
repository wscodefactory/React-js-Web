import { useEffect, useRef, useState } from "react";
import { Download, Languages, MoreHorizontal, Moon, Search, Sun, Upload } from "lucide-react";
import { IconButton } from "@/app/components/common";
import type { HeaderShellText } from "./types";

type HeaderActionsProps = {
  isDarkMode: boolean;
  onBackupWorkspace: () => void;
  onOpenSearch: () => void;
  onRestoreWorkspace: () => void;
  onToggleDarkMode: () => void;
  onToggleLanguage: () => void;
  text: HeaderShellText;
};

export function HeaderActions({
  isDarkMode,
  onBackupWorkspace,
  onOpenSearch,
  onRestoreWorkspace,
  onToggleDarkMode,
  onToggleLanguage,
  text,
}: HeaderActionsProps) {
  const [isUtilityMenuOpen, setIsUtilityMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsUtilityMenuOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const runUtilityAction = (action: () => void) => {
    action();
    setIsUtilityMenuOpen(false);
  };

  return (
    <div className="header-actions">
      <div ref={menuRef} className="relative">
        <IconButton
          icon={<MoreHorizontal className="icon" />}
          label="Open workspace actions"
          onClick={() => setIsUtilityMenuOpen((current) => !current)}
          aria-expanded={isUtilityMenuOpen}
          className="header-theme-toggle"
        />
        {isUtilityMenuOpen ? (
          <div className="absolute right-0 top-12 z-40 w-60 overflow-hidden rounded-lg border border-gray-200 bg-white py-2 shadow-xl dark:border-gray-700 dark:bg-gray-900">
            <button
              type="button"
              onClick={() => runUtilityAction(onOpenSearch)}
              className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <span className="inline-flex items-center gap-2"><Search className="icon-sm" /> Search</span>
              <kbd className="rounded border border-gray-200 px-1.5 py-0.5 text-xs dark:border-gray-700">Ctrl K</kbd>
            </button>
            <button
              type="button"
              onClick={() => runUtilityAction(onBackupWorkspace)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <Download className="icon-sm" />
              Backup workspace
            </button>
            <button
              type="button"
              onClick={() => runUtilityAction(onRestoreWorkspace)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <Upload className="icon-sm" />
              Restore workspace
            </button>
          </div>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onToggleLanguage}
        className="header-language-toggle"
        aria-label={text.language}
        title={text.nextLanguageTitle}
      >
        <Languages className="icon-sm" />
        <span>{text.languageShort}</span>
      </button>
      <IconButton
        icon={isDarkMode ? <Sun className="icon" /> : <Moon className="icon" />}
        label={text.darkMode}
        onClick={onToggleDarkMode}
        className="header-theme-toggle"
      />
    </div>
  );
}
