import { useEffect, useMemo, useState } from 'react';
import { Check, Copy, Download, ImageDown, RefreshCw, RotateCcw, Sparkles, Star, Trash2 } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import { PageIntro } from '../../components/showcase/PageIntro';
import { copyTextToClipboard } from '../../utils/clipboard';
import { createZipBlob } from '../../utils/zip';

export type LogoStyle = 'Minimal' | 'Modern' | 'Geometric' | 'Badge';
export type PaletteName = 'Forest' | 'Ocean' | 'Sunset' | 'Mono';

export interface LogoOption {
  id: string;
  label: string;
  svg: string;
}
export interface SavedLogo {
  brandName: string;
  createdAt: string;
  id: string;
  label: string;
  palette: PaletteName;
  seed: number;
  style: LogoStyle;
  svg: string;
}
type LogoGeneratorDraft = {
  brandName: string;
  favorites: SavedLogo[];
  palette: PaletteName;
  seed: number;
  style: LogoStyle;
};

const styles: LogoStyle[] = ['Minimal', 'Modern', 'Geometric', 'Badge'];
const palettes: Record<PaletteName, [string, string, string]> = {
  Forest: ['#16a34a', '#22c55e', '#dcfce7'],
  Ocean: ['#0284c7', '#38bdf8', '#e0f2fe'],
  Sunset: ['#ea580c', '#f97316', '#ffedd5'],
  Mono: ['#111827', '#6b7280', '#f3f4f6'],
};
const paletteNames = Object.keys(palettes) as PaletteName[];
const logoGeneratorStorageKey = 'web5:logo-generator:v1';
const defaultLogoGeneratorDraft: LogoGeneratorDraft = {
  brandName: 'Powerlibs',
  favorites: [],
  palette: 'Forest',
  seed: 0,
  style: 'Modern',
};

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9\uac00-\ud7a3]+/gi, '-').replace(/^-|-$/g, '') || 'logo';
}

function escapeSvgText(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function isSavedLogo(value: unknown): value is SavedLogo {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<SavedLogo>;
  return typeof candidate.id === 'string'
    && typeof candidate.label === 'string'
    && typeof candidate.brandName === 'string'
    && typeof candidate.createdAt === 'string'
    && typeof candidate.svg === 'string'
    && typeof candidate.seed === 'number'
    && styles.includes(candidate.style as LogoStyle)
    && paletteNames.includes(candidate.palette as PaletteName);
}

function readStoredLogoDraft() {
  if (typeof window === 'undefined') {
    return { draft: defaultLogoGeneratorDraft, restored: false };
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(logoGeneratorStorageKey) ?? 'null') as Partial<LogoGeneratorDraft> | null;

    if (!parsed) {
      return { draft: defaultLogoGeneratorDraft, restored: false };
    }

    return {
      draft: {
        brandName: typeof parsed.brandName === 'string' ? parsed.brandName : defaultLogoGeneratorDraft.brandName,
        favorites: Array.isArray(parsed.favorites) ? parsed.favorites.filter(isSavedLogo).slice(0, 12) : [],
        palette: paletteNames.includes(parsed.palette as PaletteName) ? parsed.palette as PaletteName : defaultLogoGeneratorDraft.palette,
        seed: typeof parsed.seed === 'number' ? parsed.seed : defaultLogoGeneratorDraft.seed,
        style: styles.includes(parsed.style as LogoStyle) ? parsed.style as LogoStyle : defaultLogoGeneratorDraft.style,
      },
      restored: true,
    };
  } catch {
    return { draft: defaultLogoGeneratorDraft, restored: false };
  }
}

function createLogoSvg(brandName: string, style: LogoStyle, colors: [string, string, string], variant = 0) {
  const initial = escapeSvgText((brandName.trim()[0] ?? 'L').toUpperCase());
  const [primary, secondary, soft] = colors;

  const templates: Record<LogoStyle, string> = {
    Minimal: `<circle cx="100" cy="100" r="58" fill="none" stroke="${primary}" stroke-width="5"/><text x="100" y="121" text-anchor="middle" font-family="Inter, Arial" font-size="58" font-weight="700" fill="${primary}">${initial}</text>`,
    Modern: `<rect x="42" y="42" width="116" height="116" rx="30" fill="${primary}"/><path d="M70 126 L100 66 L130 126" fill="none" stroke="white" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><circle cx="100" cy="100" r="14" fill="${secondary}"/>`,
    Geometric: `<path d="M100 34 L158 76 L136 146 H64 L42 76 Z" fill="${soft}" stroke="${primary}" stroke-width="7"/><path d="M100 62 L126 100 L100 138 L74 100 Z" fill="${secondary}"/><text x="100" y="111" text-anchor="middle" font-family="Inter, Arial" font-size="34" font-weight="800" fill="white">${initial}</text>`,
    Badge: `<rect x="38" y="52" width="124" height="96" rx="22" fill="${primary}"/><circle cx="100" cy="100" r="34" fill="${soft}"/><text x="100" y="113" text-anchor="middle" font-family="Inter, Arial" font-size="38" font-weight="800" fill="${primary}">${initial}</text>`,
  };

  const rotation = variant * 8;
  return `<svg width="240" height="240" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(${rotation} 100 100)">${templates[style]}</g></svg>`;
}

function downloadSvg(svg: string, fileName: string) {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${slugify(fileName)}.svg`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function downloadPng(svg: string, fileName: string, outputSize = 1024) {
  const svgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));

  try {
    const image = new Image();
    const loaded = new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Unable to render SVG preview.'));
    });

    image.src = svgUrl;
    await loaded;

    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Canvas is not available.');
    }

    context.clearRect(0, 0, outputSize, outputSize);
    context.drawImage(image, 0, 0, outputSize, outputSize);

    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error('PNG export failed.'));
      }, 'image/png');
    });

    const pngUrl = URL.createObjectURL(pngBlob);
    const anchor = document.createElement('a');
    anchor.href = pngUrl;
    anchor.download = `${slugify(fileName)}.png`;
    anchor.click();
    URL.revokeObjectURL(pngUrl);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

function LogoPreview({
  option,
  brandName,
  copied,
  onCopy,
  onDownloadPng,
  onToggleFavorite,
  saved,
}: {
  option: LogoOption;
  brandName: string;
  copied: boolean;
  onCopy: (option: LogoOption) => void;
  onDownloadPng: (option: LogoOption) => void;
  onToggleFavorite: (option: LogoOption) => void;
  saved: boolean;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-4">
        <div className="flex aspect-square items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-900">
          <div dangerouslySetInnerHTML={{ __html: option.svg }} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{option.label}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">SVG export ready</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => onToggleFavorite(option)} aria-label={`${saved ? 'Remove' : 'Save'} ${option.label} logo`}>
              <Star className={`h-4 w-4 ${saved ? 'fill-yellow-400 text-yellow-500' : ''}`} />
            </Button>
            <Button variant="secondary" onClick={() => onCopy(option)} aria-label={`Copy ${option.label} SVG`}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button variant="secondary" onClick={() => downloadSvg(option.svg, `${brandName}-${option.label}`)} aria-label={`Download ${option.label} SVG`}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="secondary" onClick={() => onDownloadPng(option)} aria-label={`Download ${option.label} PNG`}>
              <ImageDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SavedLogoCard({
  logo,
  onCopy,
  onDownload,
  onLoad,
  onRemove,
}: {
  logo: SavedLogo;
  onCopy: (logo: SavedLogo) => void;
  onDownload: (logo: SavedLogo) => void;
  onLoad: (logo: SavedLogo) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <Card>
      <CardContent className="grid gap-4 md:grid-cols-[120px_minmax(0,1fr)_auto] md:items-center">
        <div className="flex aspect-square items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-900">
          <div className="scale-50" dangerouslySetInnerHTML={{ __html: logo.svg }} />
        </div>
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">{logo.label}</h3>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-300">{logo.style}</span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-300">{logo.palette}</span>
          </div>
          <p className="truncate text-sm text-gray-600 dark:text-gray-400">{logo.brandName}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">{new Date(logo.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => onLoad(logo)} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Load
          </Button>
          <Button variant="secondary" onClick={() => onCopy(logo)} aria-label={`Copy saved ${logo.label} SVG`}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="secondary" onClick={() => onDownload(logo)} aria-label={`Download saved ${logo.label} SVG`}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="secondary" onClick={() => onRemove(logo.id)} aria-label={`Remove saved ${logo.label}`} className="text-red-600 dark:text-red-300">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function LogoGeneratorPage() {
  const [storedDraft] = useState(() => readStoredLogoDraft());
  const [brandName, setBrandName] = useState(storedDraft.draft.brandName);
  const [style, setStyle] = useState<LogoStyle>(storedDraft.draft.style);
  const [palette, setPalette] = useState<PaletteName>(storedDraft.draft.palette);
  const [seed, setSeed] = useState(storedDraft.draft.seed);
  const [favorites, setFavorites] = useState<SavedLogo[]>(storedDraft.draft.favorites);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [status, setStatus] = useState(storedDraft.restored
    ? 'Logo generator workspace restored from local storage.'
    : 'Choose a style and export the SVG concept you like.');

  const options = useMemo<LogoOption[]>(() => {
    const colors = palettes[palette];
    return [0, 1, 2].map((variant) => ({
      id: `${style}-${palette}-${variant}-${seed}`,
      label: variant === 0 ? 'Primary' : `Variation ${variant}`,
      svg: createLogoSvg(brandName, style, colors, variant + seed),
    }));
  }, [brandName, palette, seed, style]);

  useEffect(() => {
    window.localStorage.setItem(logoGeneratorStorageKey, JSON.stringify({
      brandName,
      favorites,
      palette,
      seed,
      style,
    }));
  }, [brandName, favorites, palette, seed, style]);

  const copyLogo = async (option: LogoOption) => {
    const wasCopied = await copyTextToClipboard(option.svg);

    if (!wasCopied) {
      setCopiedId(null);
      setStatus('Clipboard copy failed. Use SVG download instead.');
      return;
    }

    setCopiedId(option.id);
    setStatus(`${option.label} SVG copied to clipboard.`);
    window.setTimeout(() => setCopiedId(null), 1200);
  };

  const refreshVariations = () => {
    setSeed((value) => value + 1);
    setStatus('Generated a fresh set of SVG variations.');
  };

  const downloadAll = () => {
    const files = options.map((option) => ({
      content: option.svg,
      path: `${slugify(brandName)}/${slugify(option.label)}.svg`,
    }));

    downloadBlob(createZipBlob(files), `${slugify(brandName)}-logo-svg-set.zip`);
    setStatus('All current SVG variations were bundled into a ZIP download.');
  };

  const toggleFavorite = (option: LogoOption) => {
    const existing = favorites.find((logo) => logo.id === option.id);

    if (existing) {
      setFavorites((current) => current.filter((logo) => logo.id !== option.id));
      setStatus(`${option.label} removed from saved logos.`);
      return;
    }

    const savedLogo: SavedLogo = {
      brandName,
      createdAt: new Date().toISOString(),
      id: option.id,
      label: option.label,
      palette,
      seed,
      style,
      svg: option.svg,
    };

    setFavorites((current) => [savedLogo, ...current].slice(0, 12));
    setStatus(`${option.label} saved to favorites.`);
  };

  const copySavedLogo = async (logo: SavedLogo) => {
    const wasCopied = await copyTextToClipboard(logo.svg);
    setStatus(wasCopied ? `${logo.label} saved SVG copied to clipboard.` : 'Clipboard copy failed. Use SVG download instead.');
  };

  const loadSavedLogo = (logo: SavedLogo) => {
    setBrandName(logo.brandName);
    setPalette(logo.palette);
    setSeed(logo.seed);
    setStyle(logo.style);
    setStatus(`${logo.label} settings loaded from saved logos.`);
  };

  const removeSavedLogo = (id: string) => {
    const removed = favorites.find((logo) => logo.id === id);
    setFavorites((current) => current.filter((logo) => logo.id !== id));
    setStatus(removed ? `${removed.label} removed from saved logos.` : 'Saved logo removed.');
  };

  const downloadFavorites = () => {
    if (favorites.length === 0) {
      setStatus('Save a logo before downloading favorites.');
      return;
    }

    const files = favorites.map((logo, index) => ({
      content: logo.svg,
      path: `saved/${String(index + 1).padStart(2, '0')}-${slugify(`${logo.brandName}-${logo.label}`)}.svg`,
    }));

    downloadBlob(createZipBlob(files), 'saved-logo-favorites.zip');
    setStatus(`${favorites.length} saved logo${favorites.length === 1 ? '' : 's'} bundled into a ZIP download.`);
  };

  const downloadLogoPng = async (option: LogoOption) => {
    setIsExporting(true);
    try {
      await downloadPng(option.svg, `${brandName}-${option.label}`);
      setStatus(`${option.label} PNG export was queued for download.`);
    } catch {
      setStatus('PNG export failed. Try another logo variation.');
    } finally {
      setIsExporting(false);
    }
  };

  const downloadAllPng = async () => {
    setIsExporting(true);
    try {
      for (const option of options) {
        await downloadPng(option.svg, `${brandName}-${option.label}`);
      }
      setStatus('All current PNG variations were queued for download.');
    } catch {
      setStatus('PNG export failed. Try a smaller batch or another browser.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className="p-4 md:p-8">
      <PageIntro highlight="Logo" title="Generator" description="Create simple SVG logo concepts with typed React state and reusable preview cards." />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardContent className="space-y-6">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Brand name</span>
              <input className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white" value={brandName} onChange={(event) => setBrandName(event.target.value)} />
            </label>

            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Style</span>
              <div className="grid grid-cols-2 gap-2">
                {styles.map((item) => (
                  <button key={item} type="button" onClick={() => setStyle(item)} className={`rounded-lg border px-3 py-2 text-sm transition ${style === item ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'}`}>{item}</button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Palette</span>
              <div className="space-y-2">
                {(Object.keys(palettes) as PaletteName[]).map((name) => (
                  <button key={name} type="button" onClick={() => setPalette(name)} className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm ${palette === name ? 'border-green-500' : 'border-gray-300 dark:border-gray-700'}`}>
                    <span>{name}</span>
                    <span className="flex gap-1">{palettes[name].map((color) => <span key={color} className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: color }} />)}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={refreshVariations} className="w-full justify-center">
              <RefreshCw className="h-4 w-4" /> Refresh variations
            </Button>
            <Button variant="secondary" onClick={downloadAll} className="w-full justify-center">
              <Download className="h-4 w-4" /> Download SVG ZIP
            </Button>
            <Button variant="secondary" onClick={downloadAllPng} disabled={isExporting} className="w-full justify-center">
              <ImageDown className="h-4 w-4" /> Download PNG set
            </Button>
            <Button variant="secondary" onClick={downloadFavorites} disabled={favorites.length === 0} className="w-full justify-center disabled:cursor-not-allowed disabled:opacity-50">
              <Star className="h-4 w-4" /> Download saved
            </Button>
          </CardContent>
        </Card>

        <section className="space-y-4">
          <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-900/60 dark:bg-green-900/20 dark:text-green-200">
            <Sparkles className="h-4 w-4" />
            {status}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {options.map((option) => (
              <LogoPreview
                key={option.id}
                option={option}
                brandName={brandName}
                copied={copiedId === option.id}
                onCopy={copyLogo}
                onDownloadPng={downloadLogoPng}
                onToggleFavorite={toggleFavorite}
                saved={favorites.some((logo) => logo.id === option.id)}
              />
            ))}
          </div>

          <section className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Saved Logos</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Keep favorite SVG concepts and reload their settings later.</p>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                {favorites.length} saved
              </span>
            </div>

            {favorites.length > 0 ? (
              <div className="space-y-3">
                {favorites.map((logo) => (
                  <SavedLogoCard
                    key={logo.id}
                    logo={logo}
                    onCopy={copySavedLogo}
                    onDownload={(savedLogo) => downloadSvg(savedLogo.svg, `${savedLogo.brandName}-${savedLogo.label}`)}
                    onLoad={loadSavedLogo}
                    onRemove={removeSavedLogo}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  Save a logo variation to keep it here.
                </CardContent>
              </Card>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
