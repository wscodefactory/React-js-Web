import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { AppLanguage } from "@/app/context/LanguageContext";
import { routeSections } from "@/app/config/navigation";
import { localizeBadge, localizeRouteLabel, shellText } from "@/app/i18n";
import type { RouteSectionKey } from "@/app/types/navigation";
import { isPathActive } from "./headerUtils";

type HeaderMenuDropdownProps = {
  currentPath: string;
  language: AppLanguage;
  onNavigate: () => void;
};

export function HeaderMenuDropdown({ currentPath, language, onNavigate }: HeaderMenuDropdownProps) {
  const text = shellText[language];
  const activeSection = routeSections.find((section) => isPathActive(currentPath, section.basePath));
  const [openSectionKey, setOpenSectionKey] = useState<RouteSectionKey | "">(activeSection?.key ?? "components");

  useEffect(() => {
    if (activeSection?.key) {
      setOpenSectionKey(activeSection.key);
    }
  }, [activeSection?.key]);

  return (
    <nav id="header-mobile-menu" className="header-menu-dropdown" aria-label={text.mobileNav}>
      <div className="header-menu-dropdown-inner">
        {routeSections.map((section) => {
          const sectionActive = isPathActive(currentPath, section.basePath);
          const sectionCurrent = currentPath === section.basePath;
          const children = section.children ?? [];
          const hasChildren = children.length > 0;
          const isExpanded = hasChildren && openSectionKey === section.key;
          const sectionLabel = localizeRouteLabel(language, section.key, section.label);
          const sectionPanelId = `header-mobile-menu-${section.key}`;

          return (
            <section key={section.key} className="header-menu-section">
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => setOpenSectionKey((current) => (current === section.key ? "" : section.key))}
                  aria-expanded={isExpanded}
                  aria-controls={sectionPanelId}
                  className={`header-menu-section-link w-full ${sectionActive ? "header-menu-section-link-active" : ""}`}
                >
                  <span>{sectionLabel}</span>
                  <ChevronDown className={`icon-sm transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>
              ) : (
                <Link
                  to={section.basePath}
                  onClick={onNavigate}
                  aria-current={sectionCurrent ? "page" : undefined}
                  className={`header-menu-section-link ${sectionActive ? "header-menu-section-link-active" : ""}`}
                >
                  <span>{sectionLabel}</span>
                  <ChevronRight className="icon-sm" />
                </Link>
              )}

              {hasChildren && isExpanded ? (
                <div id={sectionPanelId} className="header-menu-child-list">
                  <Link
                    to={section.basePath}
                    onClick={onNavigate}
                    aria-current={sectionCurrent ? "page" : undefined}
                    className={`header-menu-child-link ${sectionCurrent ? "header-menu-child-link-active" : ""}`}
                  >
                    <ChevronRight className="icon-sm shrink-0" />
                    <span className="min-w-0 flex-1 truncate">{text.sectionOverview}</span>
                  </Link>
                  {children.flatMap((child) => {
                    if (!child.slug) {
                      return [];
                    }

                    const childPath = `/${child.slug}`;
                    const childActive = currentPath === childPath;

                    return [(
                      <Link
                        key={childPath}
                        to={childPath}
                        onClick={onNavigate}
                        aria-current={childActive ? "page" : undefined}
                        className={`header-menu-child-link ${childActive ? "header-menu-child-link-active" : ""}`}
                      >
                        <ChevronRight className="icon-sm shrink-0" />
                        <span className="min-w-0 flex-1 truncate">{localizeRouteLabel(language, childPath, child.label)}</span>
                        {child.badge ? <span className="badge badge-success shrink-0">{localizeBadge(language, child.badge)}</span> : null}
                      </Link>
                    )];
                  })}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </nav>
  );
}
