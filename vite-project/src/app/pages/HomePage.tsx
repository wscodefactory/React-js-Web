import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  ArrowRight,
  Blocks,
  CheckCircle2,
  Compass,
  FolderKanban,
  Library,
  MonitorSmartphone,
  Search,
  Sparkles,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { Button, Card, CardContent } from '../components/common';
import { routeSections, searchItems } from '../config/navigation';
import { useLanguage } from '../context/LanguageContext';
import { homeText, localizeRouteDescription, localizeRouteLabel, localizeSearchItem } from '../i18n';
import type { SearchItem } from '../types/navigation';

const quickLinkIcons = {
  components: Blocks,
  'full-apps': FolderKanban,
  libraries: Library,
  tools: Wrench,
  mcp: Zap,
} as const;

const featureCardIcons = [Sparkles, MonitorSmartphone, CheckCircle2] as const;

function SearchResultList({
  query,
  results,
  onSelect,
  onClear,
}: {
  query: string;
  results: SearchItem[];
  onSelect: (item: SearchItem) => void;
  onClear: () => void;
}) {
  const { language } = useLanguage();
  const text = homeText[language];

  if (!query.trim()) {
    return null;
  }

  return (
    <div className="absolute left-0 right-0 top-full z-20 mt-3 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 text-sm dark:border-gray-800">
        <span className="text-gray-500 dark:text-gray-400">{text.searchResults}</span>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          aria-label={text.clearSearch}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {results.length > 0 ? (
        <div className="max-h-[360px] overflow-y-auto p-2">
          {results.map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => onSelect(item)}
              className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="mt-0.5 rounded-lg bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Search className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate font-medium text-gray-900 dark:text-white">{item.name}</span>
                  <span className="badge badge-success shrink-0">{item.category}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>{text.searchNoResults}</p>
          <p className="mt-1">{text.searchTryDifferent}</p>
        </div>
      )}
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const text = homeText[language];
  const [query, setQuery] = useState('');

  const quickLinks = routeSections.filter((section) => section.key !== 'home');
  const totalPages = searchItems.length;
  const readySections = quickLinks.filter((section) => section.children?.length || section.basePath === '/mcp').length;

  const filteredResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return [];
    }

    return searchItems.flatMap((item) => {
      const localizedItem = localizeSearchItem(language, item);
      const haystacks = [
        item.name,
        item.description,
        item.category,
        ...item.keywords,
        localizedItem.name,
        localizedItem.description,
        localizedItem.category,
        ...localizedItem.keywords,
      ].map((value) => value.toLowerCase());

      return haystacks.some((value) => value.includes(normalizedQuery)) ? [localizedItem] : [];
    }).slice(0, 8);
  }, [language, query]);

  const handleSelect = (item: SearchItem) => {
    navigate(item.path);
    setQuery('');
  };

  const handleSearchSubmit = () => {
    if (filteredResults.length === 0) {
      return;
    }

    handleSelect(filteredResults[0]);
  };

  return (
    <div className="container-page mx-auto max-w-7xl space-y-14 md:space-y-18">
      <section className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="px-6 py-12 md:px-10 md:py-16">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300">
              <Compass className="h-4 w-4" />
              {text.eyebrow}
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-gray-950 dark:text-white md:text-5xl">
              {text.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600 dark:text-gray-400 md:text-xl">
              {text.description.map((paragraph) => (
                <span key={paragraph} className="block">
                  {paragraph}
                </span>
              ))}
            </p>

            <div className="relative mt-8 max-w-3xl">
              <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800/80 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3 px-1">
                  <Search className="h-5 w-5 shrink-0 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handleSearchSubmit();
                      }
                    }}
                    placeholder={text.searchPlaceholder}
                    className="w-full bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
                  />
                </div>
                <Button
                  type="button"
                  className="shrink-0 justify-center disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleSearchSubmit}
                  disabled={!query.trim() || filteredResults.length === 0}
                >
                  {text.searchButton}
                </Button>
              </div>
              <SearchResultList query={query} results={filteredResults} onSelect={handleSelect} onClear={() => setQuery('')} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {text.suggestedSearches.map((item) => (
                <button
                  key={item.query}
                  type="button"
                  onClick={() => setQuery(item.query)}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-emerald-700 dark:hover:text-emerald-300"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 bg-gray-950 p-6 text-white dark:border-gray-800 md:p-8 lg:border-l lg:border-t-0">
            <div className="flex h-full min-h-[420px] flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-300">{text.projectMap}</p>
                    <h2 className="mt-1 text-2xl font-bold">{text.currentStructure}</h2>
                  </div>
                  <div className="rounded-xl bg-emerald-400/15 p-3 text-emerald-300">
                    <Blocks className="h-6 w-6" />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                    <p className="text-3xl font-bold">{quickLinks.length}</p>
                    <p className="mt-1 text-sm text-gray-300">{text.majorSections}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                    <p className="text-3xl font-bold">{totalPages}</p>
                    <p className="mt-1 text-sm text-gray-300">{text.searchablePages}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                    <p className="text-3xl font-bold">{readySections}</p>
                    <p className="mt-1 text-sm text-gray-300">{text.connectedGroups}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {quickLinks.slice(0, 4).map((section) => {
                    const Icon = quickLinkIcons[section.key as keyof typeof quickLinkIcons] ?? Blocks;
                    const sectionLabel = localizeRouteLabel(language, section.key, section.label);
                    const sectionDescription = localizeRouteDescription(language, section.basePath, section.landingDescription);

                    return (
                      <Link
                        key={section.key}
                        to={section.basePath}
                        className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 transition hover:border-emerald-300/50 hover:bg-emerald-400/10"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="rounded-lg bg-white/10 p-2 text-emerald-300">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block font-semibold">{sectionLabel}</span>
                            <span className="block truncate text-sm text-gray-400">{sectionDescription}</span>
                          </span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-gray-500 transition group-hover:translate-x-0.5 group-hover:text-emerald-300" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
                {text.note.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">{text.quickActions}</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{text.quickActionsDescription}</p>
          </div>
          <Link to="/components" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200">
            {text.viewComponents}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((section) => {
            const Icon = quickLinkIcons[section.key as keyof typeof quickLinkIcons] ?? Blocks;
            const sectionLabel = localizeRouteLabel(language, section.key, section.label);
            const sectionDescription = localizeRouteDescription(language, section.basePath, section.landingDescription);

            return (
              <Link key={section.key} to={section.basePath} className="group">
                <Card hover className="h-full">
                  <CardContent className="h-full p-6 md:p-7">
                    <div className="mb-5 flex items-center gap-4">
                      <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-xl font-semibold text-gray-900 dark:text-white">{sectionLabel}</h3>
                        {section.children?.length ? (
                          <p className="text-sm text-gray-500 dark:text-gray-400">{text.childrenCount(section.children.length)}</p>
                        ) : null}
                      </div>
                    </div>
                    <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">{sectionDescription}</p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 opacity-0 transition group-hover:opacity-100 dark:text-emerald-300">
                      {text.open}
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">{text.workPrinciples}</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">{text.workPrinciplesDescription}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {text.featureCards.map((feature, index) => {
            const Icon = featureCardIcons[index] ?? Sparkles;

            return (
              <Card key={feature.title}>
                <CardContent className="p-7">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
