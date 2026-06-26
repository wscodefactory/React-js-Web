import type { ComponentShowcaseConfig } from '@/app/types/component-showcase';
import { useLanguage } from '@/app/context/LanguageContext';
import { useState } from 'react';

const galleryPreviewText = {
  en: {
    previewLabel: (index: number) => `Image ${index}`,
    selectImage: (index: number) => `Select image ${index}`,
    selected: 'Selected',
  },
  ko: {
    previewLabel: (index: number) => `${index}번 이미지`,
    selectImage: (index: number) => `${index}번 이미지 선택`,
    selected: '선택됨',
  },
} as const;

function GalleryPreview() {
  const { language } = useLanguage();
  const text = galleryPreviewText[language];
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
      <div className={`flex aspect-video min-h-48 items-end rounded-2xl p-4 ${palette[selectedIndex]}`}>
        <span className="max-w-full rounded-full bg-white/85 px-3 py-1 text-sm font-semibold text-gray-800 shadow-sm dark:bg-gray-950/85 dark:text-gray-100">
          {text.previewLabel(selectedIndex + 1)}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {palette.map((className, index) => (
          <button
            key={className}
            type="button"
            onClick={() => setSelectedIndex(index)}
            aria-current={selectedIndex === index}
            aria-label={text.selectImage(index + 1)}
            className={`relative aspect-square rounded-xl border-2 transition ${className} ${
              selectedIndex === index ? 'border-blue-600 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-300'
            }`}
          >
            {selectedIndex === index ? (
              <span className="absolute bottom-2 left-2 rounded-full bg-white/85 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-gray-950/85 dark:text-blue-200">
                {text.selected}
              </span>
            ) : null}
          </button>
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
    description: "Gallery layouts for browsing and comparing visual assets.",
    sections: [
      {
        title: "Photo Grid",
        description: "A gallery with one large preview and quick thumbnail choices.",
        preview: <GalleryPreview />,
      },
    ],
  },
} satisfies Record<string, ComponentShowcaseConfig>;
