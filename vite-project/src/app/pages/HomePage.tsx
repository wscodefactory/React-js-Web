import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Compass } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { homeText } from "../i18n";
import { HomeProjectMapPanel } from "../features/home/HomeProjectMapPanel";
import { HomeQuickActionsSection } from "../features/home/HomeQuickActionsSection";
import { HomeSearchBox } from "../features/home/HomeSearchBox";
import { HomeWorkPrinciplesSection } from "../features/home/HomeWorkPrinciplesSection";
import {
  countReadySections,
  getLocalizedSearchResults,
  getMainRouteSections,
  searchablePageCount,
} from "../features/home/homeUtils";
import type { SearchItem } from "../types/navigation";

export function HomePage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const text = homeText[language];
  const [searchQuery, setSearchQuery] = useState("");

  const mainSections = useMemo(getMainRouteSections, []);
  const readySectionCount = useMemo(() => countReadySections(mainSections), [mainSections]);
  const searchResults = useMemo(
    () => getLocalizedSearchResults(searchQuery, language),
    [language, searchQuery],
  );

  function handleSelectResult(item: SearchItem) {
    navigate(item.path);
    setSearchQuery("");
  }

  function handleSearchSubmit() {
    if (searchResults.length === 0) {
      return;
    }

    handleSelectResult(searchResults[0]);
  }

  return (
    <div className="container-page mx-auto w-full max-w-7xl space-y-14 md:space-y-18">
      <section className="w-full max-w-full overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="grid min-w-0 gap-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="min-w-0 px-5 py-12 sm:px-6 md:px-10 md:py-16">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300">
              <Compass className="h-4 w-4" />
              {text.eyebrow}
            </div>

            <h1 className="max-w-full break-words text-3xl font-bold leading-tight text-gray-950 [overflow-wrap:anywhere] dark:text-white sm:text-4xl md:text-5xl">
              {text.title}
            </h1>
            <p className="mt-5 max-w-full break-words text-base leading-8 text-gray-600 [overflow-wrap:anywhere] dark:text-gray-400 md:max-w-2xl md:text-xl">
              {text.description.map((paragraph) => (
                <span key={paragraph} className="block">
                  {paragraph}
                </span>
              ))}
            </p>

            <HomeSearchBox
              onClear={() => setSearchQuery("")}
              onQueryChange={setSearchQuery}
              onSelectResult={handleSelectResult}
              onSubmit={handleSearchSubmit}
              query={searchQuery}
              results={searchResults}
              text={text}
            />
          </div>

          <HomeProjectMapPanel
            language={language}
            readySectionCount={readySectionCount}
            sections={mainSections}
            text={text}
            totalPages={searchablePageCount}
          />
        </div>
      </section>

      <HomeQuickActionsSection language={language} sections={mainSections} text={text} />
      <HomeWorkPrinciplesSection text={text} />
    </div>
  );
}
