/**
 * Top navigation bar for the showcase.
 * Handles primary navigation, dark-mode toggle, and the global search modal shortcut.
 */
import { Link, useLocation } from 'react-router';
import { Moon, Sun, Menu } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';
import { useSidebar } from '../context/SidebarContext';
import { useState, useEffect } from 'react';
import { SearchModal } from './SearchModal';
import { IconButton } from './common';
import { topNavigationItems } from '../config/navigation';
import type { NavigationLinkItem } from '../types/navigation';

function BrandLogo() {
  return (
    <Link to="/" className="header-brand">
      <div className="header-brand-icon" />
      <span className="header-brand-text">솔루시오네모스</span>
    </Link>
  );
}

interface NavLinkProps {
  item: NavigationLinkItem;
  isActive: boolean;
}

function NavLink({ item, isActive }: NavLinkProps) {
  const activeClass = isActive ? 'header-nav-link-active' : 'header-nav-link-inactive';

  return (
    <Link to={item.path} className={`header-nav-link ${activeClass}`}>
      {item.name}
    </Link>
  );
}

export function Header() {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { toggleSidebar } = useSidebar();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="header">
        <div className="header-container">
          <IconButton
            icon={<Menu className="icon" />}
            label="Toggle menu"
            onClick={toggleSidebar}
            className="header-menu-btn"
          />

          <BrandLogo />

          <nav className="header-nav">
            {topNavigationItems.map((item) => (
              <NavLink
                key={item.path}
                item={item}
                isActive={item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)}
              />
            ))}
          </nav>

          <IconButton
            icon={isDarkMode ? <Sun className="icon" /> : <Moon className="icon" />}
            label="Toggle dark mode"
            onClick={toggleDarkMode}
            className="header-theme-toggle"
          />
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
