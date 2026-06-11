import { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, Copy, Download, Heart, Home, Mail, Search, SearchX, Settings, ShoppingCart, Star, Trash2, Upload, UserCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import { PageIntro } from '../../components/showcase/PageIntro';
import { copyTextToClipboard } from '../../utils/clipboard';
import { createZipBlob } from '../../utils/zip';

export type IconAsset = {
  id: string;
  name: string;
  category: string;
  Icon?: LucideIcon;
  svg?: string;
};
type StoredIconAsset = Pick<IconAsset, 'category' | 'id' | 'name'> & {
  svg: string;
};
type SvgLibraryDraft = {
  color: string;
  customIcons: StoredIconAsset[];
  selectedCategory: string;
  size: number;
};

const iconAssets: IconAsset[] = [
  { id: 'user-circle', name: 'User Circle', category: 'Users', Icon: UserCircle },
  { id: 'shopping-cart', name: 'Shopping Cart', category: 'Commerce', Icon: ShoppingCart },
  { id: 'heart', name: 'Heart', category: 'Social', Icon: Heart },
  { id: 'star', name: 'Star', category: 'Rating', Icon: Star },
  { id: 'home', name: 'Home', category: 'Navigation', Icon: Home },
  { id: 'settings', name: 'Settings', category: 'System', Icon: Settings },
  { id: 'mail', name: 'Mail', category: 'Communication', Icon: Mail },
  { id: 'calendar', name: 'Calendar', category: 'Time', Icon: Calendar },
];
const customSvgLibraryStorageKey = 'web5:custom-svg-library:v1';
const svgSizeOptions = [16, 24, 32, 48];
const fallbackSvgLibraryDraft: SvgLibraryDraft = {
  color: '#16a34a',
  customIcons: [],
  selectedCategory: 'All',
  size: 32,
};

const lucidePaths: Record<string, string> = {
  'User Circle': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20c1.2-2.4 3-3.5 5-3.5s3.8 1.1 5 3.5"/>',
  'Shopping Cart': '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L23 6H6"/>',
  Heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>',
  Star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21 7 14.2 2 9.3l6.9-1z"/>',
  Home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
  Settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1h.2a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1z"/>',
  Mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  Calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
};

function createLucideSvg(name: string, color: string, size: number) {
  const paths = lucidePaths[name];
  if (!paths) return '';
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

function sanitizeSvg(content: string) {
  const parser = new DOMParser();
  const document = parser.parseFromString(content, 'image/svg+xml');
  const root = document.querySelector('svg');
  if (!root || document.querySelector('parsererror')) {
    return '';
  }

  root.querySelectorAll('script, foreignObject').forEach((node) => node.remove());
  root.querySelectorAll('*').forEach((node) => {
    Array.from(node.attributes).forEach((attribute) => {
      if (attribute.name.toLowerCase().startsWith('on')) {
        node.removeAttribute(attribute.name);
      }
    });
  });

  root.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  return new XMLSerializer().serializeToString(root);
}

function getAssetSvg(asset: IconAsset, color: string, size: number) {
  return asset.svg ?? createLucideSvg(asset.name, color, size);
}

function isStoredIconAsset(value: unknown): value is StoredIconAsset {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<StoredIconAsset>;
  return typeof candidate.id === 'string'
    && typeof candidate.name === 'string'
    && typeof candidate.category === 'string'
    && typeof candidate.svg === 'string';
}

function readStoredSvgLibrary() {
  if (typeof window === 'undefined') {
    return { restored: false, draft: fallbackSvgLibraryDraft };
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(customSvgLibraryStorageKey) ?? 'null') as Partial<SvgLibraryDraft> | null;

    if (!parsed || !Array.isArray(parsed.customIcons) || !parsed.customIcons.every(isStoredIconAsset)) {
      return { restored: false, draft: fallbackSvgLibraryDraft };
    }

    const customIcons = parsed.customIcons.flatMap((asset) => {
      const svg = sanitizeSvg(asset.svg);

      return svg ? [{ ...asset, svg }] : [];
    });
    const availableCategories = new Set(['All', ...iconAssets.map((asset) => asset.category), ...(customIcons.length > 0 ? ['Custom'] : [])]);
    const size = typeof parsed.size === 'number' && svgSizeOptions.includes(parsed.size) ? parsed.size : fallbackSvgLibraryDraft.size;

    return {
      restored: true,
      draft: {
        color: typeof parsed.color === 'string' ? parsed.color : fallbackSvgLibraryDraft.color,
        customIcons,
        selectedCategory: typeof parsed.selectedCategory === 'string' && availableCategories.has(parsed.selectedCategory)
          ? parsed.selectedCategory
          : fallbackSvgLibraryDraft.selectedCategory,
        size,
      },
    };
  } catch {
    return { restored: false, draft: fallbackSvgLibraryDraft };
  }
}

function downloadText(content: string, fileName: string) {
  const blob = new Blob([content], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
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

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function IconCard({
  asset,
  color,
  size,
  onCopy,
  onRemove,
}: {
  asset: IconAsset;
  color: string;
  size: number;
  onCopy: (asset: IconAsset) => void;
  onRemove?: (id: string) => void;
}) {
  const { Icon } = asset;
  const svg = getAssetSvg(asset, color, size);

  return (
    <Card hover>
      <CardContent className="space-y-4 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-green-50 dark:bg-green-900/20">
          {Icon ? <Icon style={{ color }} size={size} strokeWidth={2} /> : <div className="max-h-14 max-w-14" dangerouslySetInnerHTML={{ __html: svg }} />}
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">{asset.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{asset.category} - {asset.svg ? 'imported' : `${size}px`}</p>
        </div>
        <div className="flex justify-center gap-2">
          <Button variant="secondary" onClick={() => onCopy(asset)} aria-label={`Copy ${asset.name} SVG`}><Copy className="h-4 w-4" /></Button>
          <Button variant="secondary" onClick={() => downloadText(svg, `${asset.id}.svg`)} aria-label={`Download ${asset.name} SVG`}><Download className="h-4 w-4" /></Button>
          {onRemove ? (
            <Button variant="secondary" onClick={() => onRemove(asset.id)} aria-label={`Remove ${asset.name}`}>Remove</Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function CustomSvgLibraryPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [storedLibrary] = useState(() => readStoredSvgLibrary());
  const [customIcons, setCustomIcons] = useState<IconAsset[]>(storedLibrary.draft.customIcons);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(storedLibrary.draft.selectedCategory);
  const [color, setColor] = useState(storedLibrary.draft.color);
  const [size, setSize] = useState(storedLibrary.draft.size);
  const [copied, setCopied] = useState<string | null>(null);
  const [status, setStatus] = useState(storedLibrary.restored
    ? 'Custom SVG library restored from local storage.'
    : 'Import SVG files or use the built-in icon set.');

  const allIcons = useMemo(() => [...customIcons, ...iconAssets], [customIcons]);
  const categories = useMemo(() => ['All', ...Array.from(new Set(allIcons.map((asset) => asset.category)))], [allIcons]);
  const customCount = customIcons.length;
  const builtInCount = iconAssets.length;

  const filteredIcons = useMemo(() => {
    return allIcons.filter((asset) => {
      const matchesCategory = category === 'All' || asset.category === category;
      const matchesQuery = asset.name.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [allIcons, category, query]);

  useEffect(() => {
    const draft: SvgLibraryDraft = {
      color,
      customIcons: customIcons.flatMap((asset) => (asset.svg ? [{
        category: asset.category,
        id: asset.id,
        name: asset.name,
        svg: asset.svg,
      }] : [])),
      selectedCategory: category,
      size,
    };

    window.localStorage.setItem(customSvgLibraryStorageKey, JSON.stringify(draft));
  }, [category, color, customIcons, size]);

  const copySvg = async (asset: IconAsset) => {
    const wasCopied = await copyTextToClipboard(getAssetSvg(asset, color, size));

    if (!wasCopied) {
      setCopied(null);
      setStatus('Clipboard copy failed. Use SVG download instead.');
      return;
    }

    setCopied(asset.id);
    setStatus(`${asset.name} SVG copied to clipboard.`);
    window.setTimeout(() => setCopied(null), 1200);
  };

  const handleSvgUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const svg = sanitizeSvg(String(reader.result ?? ''));
        if (!svg) {
          setStatus(`${file.name} could not be imported as a valid SVG.`);
          return;
        }

        const id = `${file.name}-${file.lastModified}`;
        const name = file.name.replace(/\.svg$/i, '').replace(/[-_]+/g, ' ');
        setCustomIcons((current) => [{ id, name, category: 'Custom', svg }, ...current.filter((asset) => asset.id !== id)]);
        setCategory('Custom');
        setStatus(`${file.name} imported into the custom library.`);
      };
      reader.readAsText(file, 'UTF-8');
    });
    event.target.value = '';
  };

  const clearFilters = () => {
    setQuery('');
    setCategory('All');
  };

  const removeCustomIcon = (id: string) => {
    const removedIcon = customIcons.find((asset) => asset.id === id);
    setCustomIcons((current) => current.filter((item) => item.id !== id));
    setStatus(removedIcon ? `${removedIcon.name} removed from the custom library.` : 'Custom icon removed.');
  };

  const clearCustomIcons = () => {
    if (customIcons.length === 0) {
      setStatus('There are no imported SVG icons to clear.');
      return;
    }

    setCustomIcons([]);
    setCategory('All');
    setStatus('Imported SVG icons were cleared from this session.');
  };

  const downloadVisibleIcons = () => {
    if (filteredIcons.length === 0) {
      setStatus('No visible icons are available to download.');
      return;
    }

    const files = filteredIcons.map((asset, index) => {
      const categoryFolder = slugify(asset.category) || 'icons';
      const fileName = slugify(asset.name) || asset.id || `icon-${index + 1}`;

      return {
        content: getAssetSvg(asset, color, size),
        path: `${categoryFolder}/${String(index + 1).padStart(2, '0')}-${fileName}.svg`,
      };
    });

    downloadBlob(createZipBlob(files), 'custom-svg-visible-icons.zip');
    setStatus(`${filteredIcons.length} visible SVG files were bundled into a ZIP download.`);
  };

  return (
    <main className="p-4 md:p-8">
      <PageIntro highlight="Custom SVG" title="Library" description="Manage reusable icon assets with typed filters, import controls, and export actions." />

      <Card className="mb-8">
        <CardContent className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_180px_150px_120px_auto]">
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search icons" className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
          </label>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
          <input type="color" value={color} onChange={(event) => setColor(event.target.value)} className="h-10 w-full rounded-lg border border-gray-300 bg-white dark:border-gray-700" aria-label="Icon color" />
          <select value={size} onChange={(event) => setSize(Number(event.target.value))} className="rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white" aria-label="Icon size">
            {svgSizeOptions.map((value) => <option key={value} value={value}>{value}px</option>)}
          </select>
          <div>
            <input ref={inputRef} type="file" accept=".svg,image/svg+xml" multiple onChange={handleSvgUpload} className="hidden" />
            <Button onClick={() => inputRef.current?.click()} className="w-full justify-center">
              <Upload className="h-4 w-4" />
              Import
            </Button>
          </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-900">{builtInCount} built-in</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-900">{customCount} imported</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-900">{filteredIcons.length} visible</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={downloadVisibleIcons} className="gap-2">
                <Download className="h-4 w-4" />
                Download ZIP
              </Button>
              <Button variant="secondary" onClick={clearCustomIcons} className="gap-2 text-red-600 dark:text-red-300">
                <Trash2 className="h-4 w-4" />
                Clear imports
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">
          {copied ? 'SVG copied to clipboard.' : status}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{filteredIcons.length} of {allIcons.length} icons</p>
      </div>

      {filteredIcons.length > 0 ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredIcons.map((asset) => (
            <IconCard
              key={asset.id}
              asset={asset}
              color={color}
              size={size}
              onCopy={copySvg}
              onRemove={asset.category === 'Custom' ? removeCustomIcon : undefined}
            />
          ))}
        </section>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <SearchX className="mb-4 h-10 w-10 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">No icons found</h2>
            <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">Adjust the query or reset the selected category.</p>
            <Button variant="secondary" onClick={clearFilters} className="mt-5">Clear filters</Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
