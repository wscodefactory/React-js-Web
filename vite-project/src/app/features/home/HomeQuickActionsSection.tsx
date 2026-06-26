import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import type { AppLanguage } from "@/app/context/LanguageContext";
import { Card, CardContent } from "@/app/components/common";
import type { RouteSectionDefinition } from "@/app/types/navigation";
import { fallbackQuickLinkIcon, quickLinkIcons } from "./homeIcons";
import { getLocalizedRouteSectionCopy } from "./homeUtils";
import type { HomeText } from "./types";

type HomeQuickActionsSectionProps = {
  language: AppLanguage;
  sections: RouteSectionDefinition[];
  text: HomeText;
};

export function HomeQuickActionsSection({ language, sections, text }: HomeQuickActionsSectionProps) {
  return (
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
        {sections.map((section) => {
          const Icon = quickLinkIcons[section.key] ?? fallbackQuickLinkIcon;
          const sectionCopy = getLocalizedRouteSectionCopy(language, section);

          return (
            <Link key={section.key} to={section.basePath} className="group">
              <Card hover className="h-full">
                <CardContent className="h-full p-6 md:p-7">
                  <div className="mb-5 flex items-center gap-4">
                    <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-xl font-semibold text-gray-900 dark:text-white">{sectionCopy.label}</h3>
                      {section.children?.length ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{text.childrenCount(section.children.length)}</p>
                      ) : null}
                    </div>
                  </div>
                  <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">{sectionCopy.description}</p>
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
  );
}
