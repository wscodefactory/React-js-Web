/**
 * Section-aware navigation sidebar.
 *
 * 역할:
 * - 현재 URL이 속한 섹션을 기준으로 관련 메뉴만 노출한다.
 * - 모바일에서는 오버레이 및 닫기 버튼을 제공한다.
 * - 데스크톱에서는 항상 보이는 보조 탐색 패널로 동작한다.
 *
 * 핵심 포인트는 "모든 메뉴를 항상 보여주는 것이 아니라,
 * 현재 사용자가 들어와 있는 섹션에 맞는 하위 탐색만 제공한다"는 점이다.
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

/**
 * 사이드바의 개별 링크 1개를 렌더링한다.
 *
 * `isActive`는 현재 경로와 이 링크의 경로가 같은지를 의미하며,
 * 선택된 메뉴와 선택되지 않은 메뉴의 시각적 상태를 분리하는 데 사용된다.
 */
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

/**
 * 실제 메뉴 리스트를 렌더링하는 내부 표현 컴포넌트.
 *
 * 모바일과 데스크톱이 같은 메뉴 내용을 공유하도록 분리해 두었다.
 * `onClose`가 전달된 경우에만 닫기 버튼을 표시하므로,
 * 하나의 컴포넌트로 두 환경을 모두 처리할 수 있다.
 */
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

/**
 * 프로젝트의 좌측 섹션형 사이드바.
 *
 * 동작 방식:
 * 1. 현재 location.pathname을 읽는다.
 * 2. `getSidebarItems()`로 현재 섹션에 맞는 메뉴만 계산한다.
 * 3. 라우트가 바뀌면 모바일 사이드바를 자동으로 닫는다.
 * 4. 모바일/데스크톱 전용 aside를 각각 렌더링한다.
 *
 * 이렇게 나누는 이유:
 * - 모바일은 슬라이드 패널이 필요함
 * - 데스크톱은 항상 보이는 고정형 패널이 필요함
 */
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
