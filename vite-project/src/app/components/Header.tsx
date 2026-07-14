/**
 * Top navigation bar for the showcase.
 * Handles primary navigation, dark-mode toggle, and the global search modal shortcut.
 */
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useLocation } from "react-router";
import { Menu } from "lucide-react";
import { useDarkMode } from "../context/DarkModeContext";
import { useLanguage } from "../context/LanguageContext";
import { topNavigationItems } from "../config/navigation";
import { localizeRouteLabel, shellText } from "../i18n";
import { IconButton } from "./common";
import { SearchModal } from "./SearchModal";
import { BrandLogo } from "./header/BrandLogo";
import { HeaderActions } from "./header/HeaderActions";
import { HeaderMenuDropdown } from "./header/HeaderMenuDropdown";
import { HeaderNavLink } from "./header/HeaderNavLink";
import { isPathActive } from "./header/headerUtils";
import { exportWorkspaceBackup, importWorkspaceBackup } from "../utils/workspaceBackup";

export function Header() {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { language, toggleLanguage } = useLanguage();
  const restoreInputRef = useRef<HTMLInputElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const text = shellText[language];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
      }

      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleRestoreWorkspace = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const restoredCount = await importWorkspaceBackup(file);
      window.alert(`Workspace restored (${restoredCount} items). Reopen a tool to load restored drafts.`);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Workspace restore failed.");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <>
      <input
        ref={restoreInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleRestoreWorkspace}
        className="hidden"
      />

      <header className="header">
        <div className="header-container">
          <IconButton
            icon={<Menu className="icon" />}
            label={text.menu}
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-expanded={isMenuOpen}
            aria-controls="header-mobile-menu"
            className="header-menu-btn"
          />

          <BrandLogo brand={text.brand} />

          <nav className="header-nav">
            {topNavigationItems.map((item) => (
              <HeaderNavLink
                key={item.path}
                item={item}
                isActive={isPathActive(location.pathname, item.path)}
                label={localizeRouteLabel(language, item.path.slice(1), item.name)}
              />
            ))}
          </nav>

          <HeaderActions
            isDarkMode={isDarkMode}
            onBackupWorkspace={exportWorkspaceBackup}
            onOpenSearch={() => setIsSearchOpen(true)}
            onRestoreWorkspace={() => restoreInputRef.current?.click()}
            onToggleDarkMode={toggleDarkMode}
            onToggleLanguage={toggleLanguage}
            text={text}
          />
        </div>

        {isMenuOpen ? (
          <HeaderMenuDropdown currentPath={location.pathname} language={language} onNavigate={() => setIsMenuOpen(false)} />
        ) : null}
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
