import { ChevronRight, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { useSidebar } from '../context/SidebarContext';
import { useEffect } from 'react';
import { IconButton } from './common';
import { getSidebarItems } from '../config/navigation';
import { localizeBadge, localizeRouteLabel, shellText } from '../i18n';
import type { SidebarItem } from '../types/navigation';

export interface SidebarLinkProps {
  item: SidebarItem;
  isActive: boolean;
  onClose?: () => void;
}

function SidebarLink({ item, isActive, onClose }: SidebarLinkProps) {
  const navigate = useNavigate();
  const activeClass = isActive ? 'sidebar-link-active' : 'sidebar-link-inactive';

  const handleNavigate = () => {
    navigate(item.path);
    onClose?.();
  };

  return (
    <button
      type="button"
      onClick={handleNavigate}
      aria-current={isActive ? 'page' : undefined}
      className={`sidebar-link w-full text-left ${activeClass}`}
    >
      <span className="flex items-center justify-between w-full">
        <span className="flex min-w-0 items-center gap-2">
          <ChevronRight className="icon-sm" />
          <span className="truncate">{item.name}</span>
        </span>
        {item.badge && <span className="badge badge-success shrink-0">{item.badge}</span>}
      </span>
    </button>
  );
}

export interface SidebarContentProps {
  items: SidebarItem[];
  currentPath: string;
  onClose?: () => void;
}

function SidebarContent({ items, currentPath, onClose }: SidebarContentProps) {
  const { language } = useLanguage();
  const text = shellText[language];

  return (
    <nav className="sidebar-nav">
      {onClose && (
        <div className="flex justify-end mb-4 md:hidden">
          <IconButton icon={<X className="icon" />} label={text.closeSidebar} onClick={onClose} />
        </div>
      )}
      <div className="space-y-1">
        {items.map((item) => {
          const localizedItem = {
            ...item,
            badge: localizeBadge(language, item.badge),
            name: localizeRouteLabel(language, item.path, item.name),
          };

          return (
            <SidebarLink key={item.path} item={localizedItem} isActive={currentPath === item.path} onClose={onClose} />
          );
        })}
      </div>
    </nav>
  );
}

export interface SidebarProps {
  items?: SidebarItem[];
  mobileOnly?: boolean;
}

export function Sidebar({ items, mobileOnly = false }: SidebarProps) {
  const location = useLocation();
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const sidebarItems = items ?? getSidebarItems(location.pathname);

  useEffect(() => {
    closeSidebar();
  }, [location.pathname, closeSidebar]);

  if (!sidebarItems.length) {
    return null;
  }

  return (
    <>
      {isSidebarOpen && (
        <>
          <div className="sidebar-mobile-overlay" onClick={closeSidebar} />
          <aside className="sidebar-mobile translate-x-0">
            <div className="sidebar-scrollable">
              <SidebarContent items={sidebarItems} currentPath={location.pathname} onClose={closeSidebar} />
            </div>
          </aside>
        </>
      )}

      {!mobileOnly && (
        <aside className="hidden md:block sidebar">
          <div className="sidebar-scrollable">
            <SidebarContent items={sidebarItems} currentPath={location.pathname} />
          </div>
        </aside>
      )}
    </>
  );
}
