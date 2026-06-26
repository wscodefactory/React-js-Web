/**
 * Top navigation bar for the showcase.
 * Handles primary navigation, dark-mode toggle, and the global search modal shortcut.
 */
import { useEffect, useState } from "react";
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

export function Header() {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { language, toggleLanguage } = useLanguage();
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

  return (
    <>
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
