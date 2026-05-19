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
import { routeSections, searchItems } from '../config/navigation';
import { Button, Card, CardContent } from '../components/common';
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
    title: '구조가 보이는 쇼케이스',
    description: '컴포넌트, 페이지, 앱 데모를 한 라우팅 체계 안에 묶어 필요한 예시를 빠르게 찾을 수 있습니다.',
    icon: Sparkles,
  },
  {
    title: '완성형 앱 데모',
    description: '단일 UI 조각을 넘어 실제 업무 흐름처럼 확인할 수 있는 전체 화면 예제를 함께 제공합니다.',
    icon: MonitorSmartphone,
  },
  {
    title: '이어 만들기 쉬운 기반',
    description: '공용 카드, 버튼, 섹션, 검색, 내비게이션 패턴을 재사용해 다음 화면 제작 속도를 높입니다.',
    icon: CheckCircle2,
  },
] as const;

const suggestedSearches = ['Buttons', 'Chrome Extensions', 'SVG Editor', 'Form Builder'] as const;

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
    <div className="absolute left-0 right-0 top-full z-20 mt-3 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
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
              <div className="mt-0.5 rounded-lg bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
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
  const totalPages = searchItems.length;

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

  const handleSearchSubmit = () => {
    if (filteredResults.length === 0) {
      return;
    }

    handleSelect(filteredResults[0]);
  };

  return (
    <main className="container-page mx-auto max-w-7xl space-y-14 md:space-y-18">
      <section className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="px-6 py-12 md:px-10 md:py-16">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300">
              <Compass className="h-4 w-4" />
              React + TypeScript 제작 허브
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-gray-950 dark:text-white md:text-5xl">
              솔루시오네모스 제작 현황을 한눈에
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600 dark:text-gray-400 md:text-xl">
              컴포넌트, 풀 앱, 라이브러리, 툴, MCP 자료를 하나의 쇼케이스로 정리했습니다.
              지금 만들어진 화면을 빠르게 확인하고 다음 작업 지점으로 바로 이어갈 수 있습니다.
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
                    placeholder="컴포넌트, 페이지, 도구를 검색해보세요"
                    className="w-full bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
                  />
                </div>
                <Button
                  type="button"
                  className="shrink-0 justify-center disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleSearchSubmit}
                  disabled={!query.trim() || filteredResults.length === 0}
                >
                  바로 이동
                </Button>
              </div>
              <SearchResultList query={query} results={filteredResults} onSelect={handleSelect} onClear={() => setQuery('')} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {suggestedSearches.map((keyword) => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => setQuery(keyword)}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-emerald-700 dark:hover:text-emerald-300"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 bg-gray-950 p-6 text-white dark:border-gray-800 md:p-8 lg:border-l lg:border-t-0">
            <div className="flex h-full min-h-[420px] flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-300">Project map</p>
                    <h2 className="mt-1 text-2xl font-bold">현재 구성</h2>
                  </div>
                  <div className="rounded-xl bg-emerald-400/15 p-3 text-emerald-300">
                    <Blocks className="h-6 w-6" />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                    <p className="text-3xl font-bold">{quickLinks.length}</p>
                    <p className="mt-1 text-sm text-gray-300">핵심 섹션</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                    <p className="text-3xl font-bold">{totalPages}</p>
                    <p className="mt-1 text-sm text-gray-300">검색 가능 화면</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                    <p className="text-3xl font-bold">5</p>
                    <p className="mt-1 text-sm text-gray-300">콘텐츠 그룹</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {quickLinks.slice(0, 4).map((section) => {
                    const Icon = quickLinkIcons[section.key as keyof typeof quickLinkIcons] ?? Blocks;

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
                            <span className="block font-semibold">{section.label}</span>
                            <span className="block truncate text-sm text-gray-400">{section.landingDescription}</span>
                          </span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-gray-500 transition group-hover:translate-x-0.5 group-hover:text-emerald-300" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
                홈, 라우팅, 카탈로그, 검색, 다크모드 기반이 연결되어 있어 다음 단계는 개별 앱 데모와 툴 화면의 완성도를 높이는 흐름이 좋습니다.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">빠른 이동</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">핵심 섹션으로 바로 이동해 전체 구조를 살펴보세요.</p>
          </div>
          <Link to="/components" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200">
            컴포넌트부터 보기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((section) => {
            const Icon = quickLinkIcons[section.key as keyof typeof quickLinkIcons] ?? Blocks;
            return (
              <Link key={section.key} to={section.basePath} className="group">
                <Card hover className="h-full">
                  <CardContent className="h-full p-6 md:p-7">
                    <div className="mb-5 flex items-center gap-4">
                      <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
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
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 opacity-0 transition group-hover:opacity-100 dark:text-emerald-300">
                      열기
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">제작 기준</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            지금 단계에서는 페이지를 많이 늘리는 것보다, 찾기 쉽고 확장하기 쉬운 기본 구조를 안정적으로 만드는 데 초점을 맞췄습니다.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {featureCards.map((feature) => {
            const Icon = feature.icon;
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
    </main>
  );
}
