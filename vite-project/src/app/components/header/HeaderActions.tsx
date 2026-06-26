import { Languages, Moon, Sun } from "lucide-react";
import { IconButton } from "@/app/components/common";
import type { HeaderShellText } from "./types";

type HeaderActionsProps = {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleLanguage: () => void;
  text: HeaderShellText;
};

export function HeaderActions({ isDarkMode, onToggleDarkMode, onToggleLanguage, text }: HeaderActionsProps) {
  return (
    <div className="header-actions">
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
