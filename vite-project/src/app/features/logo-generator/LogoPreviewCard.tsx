import { Check, Copy, Download, ImageDown, Star } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import { downloadSvgAsset, getLocalizedOptionLabel } from './logoAsset';
import type { LogoGeneratorCopy, LogoOption } from './types';

type LogoPreviewCardProps = {
  brandName: string;
  copied: boolean;
  copy: LogoGeneratorCopy;
  onCopy: (option: LogoOption) => void;
  onDownloadPng: (option: LogoOption) => void;
  onToggleFavorite: (option: LogoOption) => void;
  option: LogoOption;
  saved: boolean;
};

export function LogoPreviewCard({
  brandName,
  copied,
  copy,
  onCopy,
  onDownloadPng,
  onToggleFavorite,
  option,
  saved,
}: LogoPreviewCardProps) {
  const displayLabel = getLocalizedOptionLabel(copy, option.label);

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-4">
        <div className="flex aspect-square items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-900">
          <div dangerouslySetInnerHTML={{ __html: option.svg }} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{displayLabel}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{copy.optionDescription}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => onToggleFavorite(option)} aria-label={copy.aria.saveToggle(saved, displayLabel)}>
              <Star className={`h-4 w-4 ${saved ? 'fill-yellow-400 text-yellow-500' : ''}`} />
            </Button>
            <Button variant="secondary" onClick={() => onCopy(option)} aria-label={copy.aria.copy(displayLabel)}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button variant="secondary" onClick={() => downloadSvgAsset(option.svg, `${brandName}-${option.label}`)} aria-label={copy.aria.downloadSvg(displayLabel)}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="secondary" onClick={() => onDownloadPng(option)} aria-label={copy.aria.downloadPng(displayLabel)}>
              <ImageDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
