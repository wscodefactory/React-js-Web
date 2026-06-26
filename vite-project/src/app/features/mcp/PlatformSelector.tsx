import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '../../components/common';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedPlatforms, mcpCopy } from './copy';
import type { PlatformId } from './types';

type PlatformSelectorProps = {
  onSelectPlatform: (platform: PlatformId) => void;
  selectedPlatform: PlatformId;
};

export function PlatformSelector({
  onSelectPlatform,
  selectedPlatform,
}: PlatformSelectorProps) {
  const { language } = useLanguage();
  const text = mcpCopy[language];
  const platforms = getLocalizedPlatforms(language);

  return (
    <Card>
      <CardContent className="space-y-4">
        <h2 className="card-title">{text.worksWith}</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              type="button"
              onClick={() => onSelectPlatform(platform.id)}
              className={[
                'rounded-lg border p-4 text-left transition',
                selectedPlatform === platform.id
                  ? 'border-green-500 bg-green-50 shadow-sm dark:border-green-500 dark:bg-green-950/30'
                  : 'border-gray-200 bg-white hover:border-green-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-green-700',
              ].join(' ')}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="font-semibold text-gray-900 dark:text-white">{platform.label}</span>
                {selectedPlatform === platform.id ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <ShieldCheck className="h-5 w-5 text-gray-400" />}
              </span>
              <span className="mt-2 block text-sm text-gray-500 dark:text-gray-400">{platform.description}</span>
              <span className="mt-3 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {platform.status}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
