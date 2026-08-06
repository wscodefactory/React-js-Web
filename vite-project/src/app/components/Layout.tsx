import { Outlet, useLocation } from 'react-router';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Card, CardContent } from './common';
import { getSidebarItems } from '../config/navigation';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { asideItems } from '../i18n';
import type { AsideItem } from '../types/common';

export interface AsideCardProps extends AsideItem {}

function AsideCard({ title, description }: AsideCardProps) {
  return (
    <Card>
      <CardContent>
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
      </CardContent>
    </Card>
  );
}

function AsidePanel() {
  const { language } = useLanguage();

  return (
    <aside className="layout-aside">
      <div className="space-y-4">
        {asideItems[language].map((item) => (
          <AsideCard key={item.title} title={item.title} description={item.description} />
        ))}
      </div>
    </aside>
  );
}

export function Layout() {
  const auth = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const sidebarItems = getSidebarItems(location.pathname, {
    isAuthenticated: auth.isLoading || Boolean(auth.user),
  });
  const hasSidebarItems = sidebarItems.length > 0;

  return (
    <div className="layout-root">
      <Header />
      <div className="layout-content">
        {isHomePage ? (
          <main className="min-h-screen w-full max-w-full overflow-x-hidden">
            <Outlet />
          </main>
        ) : (
          <div className="min-h-screen w-full max-w-full overflow-x-hidden">
            <div className={`layout-grid ${hasSidebarItems ? '' : 'layout-grid-no-sidebar'}`}>
              <div className="layout-spacer" />

              {hasSidebarItems ? <Sidebar items={sidebarItems} /> : null}

              <main className="layout-main">
                <Outlet />
              </main>

              <AsidePanel />

              <div className="layout-spacer" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
