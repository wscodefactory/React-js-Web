import { Link } from "react-router";
import { ArrowRight, Blocks } from "lucide-react";
import type { AppLanguage } from "@/app/context/LanguageContext";
import type { RouteSectionDefinition } from "@/app/types/navigation";
import { fallbackQuickLinkIcon, quickLinkIcons } from "./homeIcons";
import { getLocalizedRouteSectionCopy } from "./homeUtils";
import type { HomeText } from "./types";

type HomeProjectMapPanelProps = {
  language: AppLanguage;
  readySectionCount: number;
  sections: RouteSectionDefinition[];
  text: HomeText;
  totalPages: number;
};

export function HomeProjectMapPanel({
  language,
  readySectionCount,
  sections,
  text,
  totalPages,
}: HomeProjectMapPanelProps) {
  return (
    <div className="min-w-0 border-t border-gray-200 bg-gray-950 p-5 text-white dark:border-gray-800 sm:p-6 md:p-8 lg:border-l lg:border-t-0">
      <div className="flex h-full min-h-[420px] min-w-0 flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
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
              <p className="text-3xl font-bold">{sections.length}</p>
              <p className="mt-1 text-sm text-gray-300">{text.majorSections}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
              <p className="text-3xl font-bold">{totalPages}</p>
              <p className="mt-1 text-sm text-gray-300">{text.searchablePages}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
              <p className="text-3xl font-bold">{readySectionCount}</p>
              <p className="mt-1 text-sm text-gray-300">{text.connectedGroups}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {sections.slice(0, 4).map((section) => {
              const Icon = quickLinkIcons[section.key] ?? fallbackQuickLinkIcon;
              const sectionCopy = getLocalizedRouteSectionCopy(language, section);

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
                      <span className="block font-semibold">{sectionCopy.label}</span>
                      <span className="block truncate text-sm text-gray-400">{sectionCopy.description}</span>
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
  );
}
