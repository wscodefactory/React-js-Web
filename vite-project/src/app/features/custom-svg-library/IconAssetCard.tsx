import { Copy, Download } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import type { AppLanguage } from '../../context/LanguageContext';
import { getLocalizedCategory, getLocalizedIconName } from './copy';
import { downloadSvgText, getAssetSvg } from './svgAsset';
import type { CustomSvgLibraryText, IconAsset } from './types';

type IconAssetCardProps = {
  asset: IconAsset;
  color: string;
  language: AppLanguage;
  size: number;
  text: CustomSvgLibraryText;
  onCopy: (asset: IconAsset) => void;
  onRemove?: (id: string) => void;
};

export function IconAssetCard({
  asset,
  color,
  language,
  size,
  text,
  onCopy,
  onRemove,
}: IconAssetCardProps) {
  const { Icon } = asset;
  const svg = getAssetSvg(asset, color, size);
  const displayName = getLocalizedIconName(language, asset.name);
  const displayCategory = getLocalizedCategory(language, asset.category);
  const detailLabel = asset.svg ? text.importedBadge : `${size}px`;

  return (
    <Card hover>
      <CardContent className="space-y-4 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-green-50 dark:bg-green-900/20">
          {Icon ? <Icon style={{ color }} size={size} strokeWidth={2} /> : <div className="max-h-14 max-w-14" dangerouslySetInnerHTML={{ __html: svg }} />}
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">{displayName}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{displayCategory} - {detailLabel}</p>
        </div>
        <div className="flex justify-center gap-2">
          <Button variant="secondary" onClick={() => onCopy(asset)} aria-label={text.aria.copy(displayName)}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="secondary" onClick={() => downloadSvgText(svg, `${asset.id}.svg`)} aria-label={text.aria.download(displayName)}>
            <Download className="h-4 w-4" />
          </Button>
          {onRemove ? (
            <Button variant="secondary" onClick={() => onRemove(asset.id)} aria-label={text.aria.remove(displayName)}>
              {text.remove}
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
