import { Copy, Download, RotateCcw, Trash2 } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import type { AppLanguage } from '../../context/LanguageContext';
import { getLocalizedOptionLabel } from './logoAsset';
import type { LogoGeneratorCopy, SavedLogo } from './types';

type SavedLogoCardProps = {
  copy: LogoGeneratorCopy;
  language: AppLanguage;
  logo: SavedLogo;
  onCopy: (logo: SavedLogo) => void;
  onDownload: (logo: SavedLogo) => void;
  onLoad: (logo: SavedLogo) => void;
  onRemove: (id: string) => void;
};

export function SavedLogoCard({
  copy,
  language,
  logo,
  onCopy,
  onDownload,
  onLoad,
  onRemove,
}: SavedLogoCardProps) {
  const displayLabel = getLocalizedOptionLabel(copy, logo.label);

  return (
    <Card>
      <CardContent className="grid gap-4 md:grid-cols-[120px_minmax(0,1fr)_auto] md:items-center">
        <div className="flex aspect-square items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-900">
          <div className="scale-50" dangerouslySetInnerHTML={{ __html: logo.svg }} />
        </div>
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">{displayLabel}</h3>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-300">{copy.styleLabels[logo.style]}</span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-300">{copy.paletteLabels[logo.palette]}</span>
          </div>
          <p className="truncate text-sm text-gray-600 dark:text-gray-400">{logo.brandName}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">{new Date(logo.createdAt).toLocaleString(language === 'ko' ? 'ko-KR' : 'en-US')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => onLoad(logo)} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            {copy.useSettings}
          </Button>
          <Button variant="secondary" onClick={() => onCopy(logo)} aria-label={copy.aria.savedCopy(displayLabel)}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="secondary" onClick={() => onDownload(logo)} aria-label={copy.aria.savedDownload(displayLabel)}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="secondary" onClick={() => onRemove(logo.id)} aria-label={copy.aria.removeSaved(displayLabel)} className="text-red-600 dark:text-red-300">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
