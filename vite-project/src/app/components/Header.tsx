/**
 * Top navigation bar for the showcase.
 * Handles primary navigation, dark-mode toggle, and the global search modal shortcut.
 */
import { Link, useLocation } from 'react-router';
import { ChevronDown, ChevronRight, Languages, Menu, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { SearchModal } from './SearchModal';
import { IconButton } from './common';
import { routeSections, topNavigationItems } from '../config/navigation';
import { localizeBadge, localizeRouteLabel, shellText } from '../i18n';
import type { NavigationLinkItem } from '../types/navigation';

function BrandLogo({ brand }: { brand: string }) {
  return (
    <Link to="/" className="header-brand">
      <div className="header-brand-icon" />
      <span className="header-brand-text">{brand}</span>
    </Link>
  );
}

export interface NavLinkProps {
  item: NavigationLinkItem;
  isActive: boolean;
  label: string;
}

function NavLink({ item, isActive, label }: NavLinkProps) {
  const activeClass = isActive ? 'header-nav-link-active' : 'header-nav-link-inactive';

  return (
    <Link to={item.path} className={`header-nav-link ${activeClass}`}>
      {label}
    </Link>
  );
}

function isPathActive(currentPath: string, path: string) {
  return path === '/' ? currentPath === '/' : currentPath === path || currentPath.startsWith(`${path}/`);
}

export interface HeaderMenuDropdownProps {
  currentPath: string;
  language: ReturnType<typeof useLanguage>['language'];
  onNavigate: () => void;
}

function HeaderMenuDropdown({ currentPath, language, onNavigate }: HeaderMenuDropdownProps) {
  const text = shellText[language];

  return (
    <nav id="header-mobile-menu" className="header-menu-dropdown" aria-label={text.mobileNav}>
      <div className="header-menu-dropdown-inner">
        {routeSections.map((section) => {
          const sectionActive = isPathActive(currentPath, section.basePath);
          const sectionCurrent = currentPath === section.basePath;
          const children = section.children ?? [];

          return (
            <section key={section.key} className="header-menu-section">
              <Link
                to={section.basePath}
                onClick={onNavigate}
                aria-current={sectionCurrent ? 'page' : undefined}
                className={`header-menu-section-link ${sectionActive ? 'header-menu-section-link-active' : ''}`}
              >
                <span>{localizeRouteLabel(language, section.key, section.label)}</span>
                <ChevronDown className="icon-sm" />
              </Link>

              {children.length > 0 && (
                <div className="header-menu-child-list">
                  {children.flatMap((child) => {
                    if (!child.slug) {
                      return [];
                    }

                    const childPath = `/${child.slug}`;
                    const childActive = currentPath === childPath;

                    return [(
                      <Link
                        key={childPath}
                        to={childPath}
                        onClick={onNavigate}
                        aria-current={childActive ? 'page' : undefined}
                        className={`header-menu-child-link ${childActive ? 'header-menu-child-link-active' : ''}`}
                      >
                        <ChevronRight className="icon-sm shrink-0" />
                        <span className="min-w-0 flex-1 truncate">{localizeRouteLabel(language, childPath, child.label)}</span>
                        {child.badge && <span className="badge badge-success shrink-0">{localizeBadge(language, child.badge)}</span>}
                      </Link>
                    )];
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </nav>
  );
}

export function Header() {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { language, toggleLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const text = shellText[language];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }

      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
              <NavLink
                key={item.path}
                item={item}
                isActive={item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)}
                label={localizeRouteLabel(language, item.path.slice(1), item.name)}
              />
            ))}
          </nav>

          <div className="header-actions">
            <button
              type="button"
              onClick={toggleLanguage}
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
              onClick={toggleDarkMode}
              className="header-theme-toggle"
            />
          </div>
        </div>

        {isMenuOpen && <HeaderMenuDropdown currentPath={location.pathname} language={language} onNavigate={() => setIsMenuOpen(false)} />}
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
