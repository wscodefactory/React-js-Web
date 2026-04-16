/**
 * Section-aware navigation sidebar.
 * The rendered links change with the active route group so the menu stays relevant.
 */
import { ChevronRight, X } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useSidebar } from '../context/SidebarContext';
import { useEffect } from 'react';
import { IconButton } from './common';
import { getSidebarItems } from '../config/navigation';
import type { SidebarItem } from '../types/navigation';

interface SidebarLinkProps {
  item: SidebarItem;
  isActive: boolean;
}

function SidebarLink({ item, isActive }: SidebarLinkProps) {
  const activeClass = isActive ? 'sidebar-link-active' : 'sidebar-link-inactive';

  return (
    <Link to={item.path} className={`sidebar-link ${activeClass}`}>
      <span className="flex items-center justify-between w-full">
        <span className="flex items-center gap-2">
          <ChevronRight className="icon-sm" />
          {item.name}
        </span>
        {item.badge && <span className="badge badge-success">{item.badge}</span>}
      </span>
    </Link>
  );
}

interface SidebarContentProps {
  items: SidebarItem[];
  currentPath: string;
  onClose?: () => void;
}

function SidebarContent({ items, currentPath, onClose }: SidebarContentProps) {
  return (
    <nav className="sidebar-nav">
      {onClose && (
        <div className="flex justify-end mb-4 md:hidden">
          <IconButton icon={<X className="icon" />} label="Close sidebar" onClick={onClose} />
        </div>
      )}
      <div className="space-y-1">
        {items.map((item) => (
          <SidebarLink key={item.path} item={item} isActive={currentPath === item.path} />
        ))}
      </div>
    </nav>
  );
}

export function Sidebar() {
  const location = useLocation();
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const sidebarItems = getSidebarItems(location.pathname);

  useEffect(() => {
    closeSidebar();
  }, [location.pathname, closeSidebar]);

  return (
    <>
      {isSidebarOpen && <div className="sidebar-mobile-overlay" onClick={closeSidebar} />}

      <aside
        className={`sidebar-mobile ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:block`}
      >
        <div className="sidebar-scrollable">
          <SidebarContent items={sidebarItems} currentPath={location.pathname} onClose={closeSidebar} />
        </div>
      </aside>

      <aside className="hidden md:block sidebar">
        <div className="sidebar-scrollable">
          <SidebarContent items={sidebarItems} currentPath={location.pathname} />
        </div>
      </aside>
    </>
  );
}
