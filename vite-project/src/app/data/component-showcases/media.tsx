import type { ComponentShowcaseConfig } from '@/app/types/component-showcase';
import { useState } from 'react';

function GalleryPreview() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const palette = [
    'bg-blue-200 dark:bg-blue-900/60',
    'bg-green-200 dark:bg-green-900/60',
    'bg-purple-200 dark:bg-purple-900/60',
    'bg-amber-200 dark:bg-amber-900/60',
    'bg-rose-200 dark:bg-rose-900/60',
    'bg-cyan-200 dark:bg-cyan-900/60',
    'bg-slate-200 dark:bg-slate-700',
    'bg-lime-200 dark:bg-lime-900/60',
  ];

  return (
    <div className="space-y-4">
      <div className={`flex aspect-video items-end rounded-2xl p-4 ${palette[selectedIndex]}`}>
        <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-gray-800 shadow-sm dark:bg-gray-950/80 dark:text-gray-100">
          Preview {selectedIndex + 1}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {palette.map((className, index) => (
          <button
            key={className}
            type="button"
            onClick={() => setSelectedIndex(index)}
            aria-label={`Select image ${index + 1}`}
            className={`aspect-square rounded-xl border-2 transition ${className} ${
              selectedIndex === index ? 'border-blue-600 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

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
        preview: <GalleryPreview />,
      },
    ],
  },
} satisfies Record<string, ComponentShowcaseConfig>;
