import type { ComponentShowcaseConfig } from '@/app/types/component-showcase';

export const mediaComponentShowcases = {
  gallery: {
    eyebrow: "Media Layouts",
    title: "Gallery",
    titleHighlight: "Component",
    description: "Responsive gallery layouts for media-heavy dashboards and portfolios.",
    sections: [
      {
        title: "Photo Grid",
        description: "A grid-based gallery for evenly sized preview tiles.",
        preview: (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-gray-200 dark:bg-gray-700" />
            ))}
          </div>
        ),
      },
    ],
  },
} satisfies Record<string, ComponentShowcaseConfig>;
