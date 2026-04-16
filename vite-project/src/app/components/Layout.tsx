/**
 * Shell component that renders the global header and page layout regions.
 * Non-home routes receive a sidebar and supporting aside panel for browsing content.
 */
import { Outlet, useLocation } from 'react-router';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Card, CardContent } from './common';
import type { AsideItem } from '../types/common';

const asideItems: AsideItem[] = [
  { title: 'Accolate Ad library', description: 'Additional content area' },
  { title: 'What User Say', description: 'User feedback section' },
  { title: 'Features', description: 'Feature highlights' },
  { title: 'Resources', description: 'Resource links' },
  { title: 'Community', description: 'Community updates' },
  { title: 'Latest News', description: 'Recent announcements' },
  { title: 'Documentation', description: 'Getting started guides' },
  { title: 'Support', description: 'Help and support' },
];

interface AsideCardProps extends AsideItem {}

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
  return (
    <aside className="layout-aside">
      <div className="space-y-4">
        {asideItems.map((item) => (
          <AsideCard key={item.title} title={item.title} description={item.description} />
        ))}
      </div>
    </aside>
  );
}

export function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="layout-root">
      <Header />
      <div className="layout-content">
        {isHomePage ? (
          <main className="min-h-screen">
            <Outlet />
          </main>
        ) : (
          <div className="min-h-screen">
            <div className="layout-grid">
              <div className="layout-spacer" />
              
              <Sidebar />
              
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
