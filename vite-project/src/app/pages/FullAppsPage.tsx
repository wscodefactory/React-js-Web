import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock3, LayoutGrid, ListFilter, Search, SearchX, Star } from 'lucide-react';
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

function AppCard({
  app,
  viewMode,
  favorite,
  lastOpened,
  onOpen,
  onToggleFavorite,
}: {
  app: (typeof fullAppCatalog)[number];
  viewMode: ViewMode;
  favorite: boolean;
  lastOpened?: string;
  onOpen: () => void;
  onToggleFavorite: () => void;
}) {
  const highlights = appHighlights[app.name] ?? ['Reusable sections', 'Typed data', 'Responsive layout'];

  return (
    <Card hover>
      <CardContent className={viewMode === 'list' ? 'flex flex-col gap-4 md:flex-row md:items-center md:justify-between' : 'space-y-5'}>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">{app.category}</span>
            {lastOpened ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                <Clock3 className="h-3 w-3" /> Opened {lastOpened}
              </span>
            ) : null}
          </div>
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
        <div className={viewMode === 'list' ? 'flex shrink-0 gap-2' : 'flex gap-2'}>
          <Button
            type="button"
            variant="secondary"
            onClick={onToggleFavorite}
            className={favorite ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300' : ''}
            aria-label={`${favorite ? 'Remove' : 'Add'} ${app.name} favorite`}
          >
            <Star className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`} />
            {favorite ? 'Saved' : 'Save'}
          </Button>
          <Button type="button" variant="secondary" onClick={onOpen} className="shrink-0">
            View app <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function FullAppsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [lastOpened, setLastOpened] = useState<Record<string, string>>({});
  const [statusMessage, setStatusMessage] = useState('Choose an app to open or save it for later.');

  const filteredApps = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return fullAppCatalog.filter((app) => {
      const matchesKeyword = !keyword || `${app.name} ${app.description} ${app.category}`.toLowerCase().includes(keyword);
      const matchesFavorite = !favoritesOnly || favorites.includes(app.path);
      return matchesKeyword && matchesFavorite;
    });
  }, [favorites, favoritesOnly, query]);

  const openApp = (app: (typeof fullAppCatalog)[number]) => {
    const openedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastOpened((current) => ({ ...current, [app.path]: openedAt }));
    setStatusMessage(`${app.name} opened at ${openedAt}.`);
    navigate(app.path);
  };

  const toggleFavorite = (app: (typeof fullAppCatalog)[number]) => {
    setFavorites((current) => {
      const exists = current.includes(app.path);
      setStatusMessage(exists ? `${app.name} removed from saved apps.` : `${app.name} saved for quick access.`);
      return exists ? current.filter((path) => path !== app.path) : [...current, app.path];
    });
  };

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
            <Button
              type="button"
              variant={favoritesOnly ? 'primary' : 'secondary'}
              onClick={() => setFavoritesOnly((current) => !current)}
            >
              <Star className={`h-4 w-4 ${favoritesOnly ? 'fill-current' : ''}`} /> Saved
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filteredApps.length} of {fullAppCatalog.length} apps / {favorites.length} saved
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{statusMessage}</p>
        </div>
        {(query.trim() || favoritesOnly) && filteredApps.length > 0 ? (
          <Button
            variant="secondary"
            onClick={() => {
              setQuery('');
              setFavoritesOnly(false);
            }}
          >
            Clear filters
          </Button>
        ) : null}
      </div>

      {filteredApps.length > 0 ? (
        <section className={viewMode === 'grid' ? 'grid gap-5 lg:grid-cols-2' : 'space-y-4'}>
          {filteredApps.map((app) => (
            <AppCard
              key={app.path}
              app={app}
              viewMode={viewMode}
              favorite={favorites.includes(app.path)}
              lastOpened={lastOpened[app.path]}
              onOpen={() => openApp(app)}
              onToggleFavorite={() => toggleFavorite(app)}
            />
          ))}
        </section>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <SearchX className="mb-4 h-10 w-10 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">No apps found</h2>
            <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">Try a broader keyword or clear the current search.</p>
            <Button
              variant="secondary"
              onClick={() => {
                setQuery('');
                setFavoritesOnly(false);
              }}
              className="mt-5"
            >
              Clear filters
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
