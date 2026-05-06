import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, LayoutGrid, ListFilter, Search } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button, Card, CardContent } from '../components/common';
import { PageIntro } from '../components/showcase/PageIntro';
import { fullAppCatalog } from '../data/catalog/full-apps';

export type ViewMode = 'grid' | 'list';

const appHighlights: Record<string, string[]> = {
  'Chrome Extensions': ['Manifest planning', 'Popup preview', 'Permission checklist'],
  'Feedback App': ['Ratings dashboard', 'Review workflow', 'Response tracking'],
  'Project Management App': ['Task board', 'Timeline metrics', 'Team overview'],
  'Cleaning Confirmation': ['Booking details', 'Service status', 'Customer confirmation'],
};

function AppCard({ app, viewMode, onOpen }: { app: (typeof fullAppCatalog)[number]; viewMode: ViewMode; onOpen: () => void }) {
  const highlights = appHighlights[app.name] ?? ['Reusable sections', 'Typed data', 'Responsive layout'];

  return (
    <Card hover onClick={onOpen} className={viewMode === 'list' ? 'cursor-pointer' : ''}>
      <CardContent className={viewMode === 'list' ? 'flex flex-col gap-4 md:flex-row md:items-center md:justify-between' : 'space-y-5'}>
        <div className="space-y-3">
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">{app.category}</span>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{app.name}</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{app.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {highlights.map((highlight) => (
              <span key={highlight} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                <CheckCircle2 className="h-3 w-3 text-green-600" /> {highlight}
              </span>
            ))}
          </div>
        </div>
        <Button variant="secondary" className="shrink-0">
          View app <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

export function FullAppsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filteredApps = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return fullAppCatalog;
    return fullAppCatalog.filter((app) => `${app.name} ${app.description} ${app.category}`.toLowerCase().includes(keyword));
  }, [query]);

  return (
    <main className="p-4 md:p-8">
      <PageIntro highlight="Full" title="Apps" description="Explore production-style application pages built from reusable React components and shared catalog data." />

      <Card className="mb-8">
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search full apps" className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
          </label>
          <div className="flex gap-2">
            <Button variant={viewMode === 'grid' ? 'primary' : 'secondary'} onClick={() => setViewMode('grid')}><LayoutGrid className="h-4 w-4" /> Grid</Button>
            <Button variant={viewMode === 'list' ? 'primary' : 'secondary'} onClick={() => setViewMode('list')}><ListFilter className="h-4 w-4" /> List</Button>
          </div>
        </CardContent>
      </Card>

      <section className={viewMode === 'grid' ? 'grid gap-5 lg:grid-cols-2' : 'space-y-4'}>
        {filteredApps.map((app) => (
          <AppCard key={app.path} app={app} viewMode={viewMode} onOpen={() => navigate(app.path)} />
        ))}
      </section>
    </main>
  );
}
