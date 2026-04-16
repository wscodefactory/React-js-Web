import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Blocks, FolderKanban, Library, Search, Sparkles, Wrench, Zap, MonitorSmartphone, SlidersHorizontal, X } from 'lucide-react';
import { routeSections, searchItems } from '../config/navigation';
import { Card, CardContent, Button } from '../components/common';
import type { SearchItem } from '../types/navigation';

const quickLinkIcons = {
  components: Blocks,
  'full-apps': FolderKanban,
  libraries: Library,
  tools: Wrench,
  mcp: Zap,
} as const;

const featureCards = [
  {
    title: 'ex1',
    description: 'ex1',
    icon: Sparkles,
  },
  {
    title: 'ex2',
    description: 'ex2',
    icon: SlidersHorizontal,
  },
  {
    title: 'ex3',
    description: 'ex3',
    icon: MonitorSmartphone,
  },
] as const;

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
  if (!query.trim()) {
    return null;
  }

  return (
    <div className="absolute left-0 right-0 top-full mt-3 z-20 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 text-sm dark:border-gray-800">
        <span className="text-gray-500 dark:text-gray-400">검색 결과</span>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
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
              <div className="mt-0.5 rounded-lg bg-green-100 p-2 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <Search className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                  <span className="badge badge-success">{item.category}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>검색 결과가 없습니다.</p>
          <p className="mt-1">다른 키워드로 다시 검색해보세요.</p>
        </div>
      )}
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const quickLinks = routeSections.filter((section) => section.key !== 'home');

  const filteredResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return [];
    }

    return searchItems.filter((item) => {
      const haystacks = [item.name, item.description, item.category, ...item.keywords]
        .join(' ')
        .toLowerCase();
      return haystacks.includes(normalizedQuery);
    }).slice(0, 8);
  }, [query]);

  const handleSelect = (item: SearchItem) => {
    navigate(item.path);
    setQuery('');
  };

  return (
    <main className="container-page mx-auto max-w-7xl space-y-16 md:space-y-20">
      <section className="rounded-[32px] border border-gray-200 bg-white px-6 py-12 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:px-10 md:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <span className="badge badge-success mb-4">Curated React + TypeScript Showcase</span>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl">
            Welcome to <span className="text-green-600 dark:text-green-400">솔루시오네모스</span>
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base text-gray-600 dark:text-gray-400 md:text-xl">
            컴포넌트, 풀 앱, 라이브러리, 툴, MCP 자료를 한 번에 탐색할 수 있는 허브입니다.
            지금까지 정리한 구조를 바탕으로 홈 화면도 같은 방식으로 통합했습니다.
          </p>

          <div className="relative mx-auto mt-8 max-w-3xl">
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800/80">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="컴포넌트, 페이지, 도구를 검색해보세요"
                className="w-full bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
              />
              <Button type="button" className="shrink-0" onClick={() => query.trim() && handleSelect(filteredResults[0] as SearchItem)} disabled={!query.trim()}>
                바로 이동
              </Button>
            </div>
            <SearchResultList query={query} results={filteredResults} onSelect={handleSelect} onClear={() => setQuery('')} />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">빠른 이동</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">핵심 섹션으로 바로 이동해 전체 구조를 살펴보세요.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((section) => {
            const Icon = quickLinkIcons[section.key as keyof typeof quickLinkIcons] ?? Blocks;
            return (
              <Link key={section.key} to={section.basePath} className="group">
                <Card hover className="h-full rounded-2xl">
                  <CardContent className="h-full p-6 md:p-8">
                    <div className="mb-5 flex items-center gap-4">
                      <div className="rounded-2xl bg-green-100 p-3 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{section.label}</h3>
                        {section.children?.length ? (
                          <p className="text-sm text-gray-500 dark:text-gray-400">{section.children.length}개의 하위 항목</p>
                        ) : null}
                      </div>
                    </div>
                    <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">{section.landingDescription}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">why</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">--</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featureCards.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="rounded-2xl">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
