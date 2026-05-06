import { useMemo, useState } from 'react';
import { Calendar, Copy, Download, Heart, Home, Mail, Search, Settings, ShoppingCart, Star, UserCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import { PageIntro } from '../../components/showcase/PageIntro';

export type IconAsset = {
  id: string;
  name: string;
  category: string;
  Icon: LucideIcon;
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

const categories = ['All', ...Array.from(new Set(iconAssets.map((asset) => asset.category)))];

function createLucideSvg(name: string, color: string, size: number) {
  const asset = iconAssets.find((icon) => icon.name === name);
  if (!asset) return '';
  const paths: Record<string, string> = {
    'User Circle': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20c1.2-2.4 3-3.5 5-3.5s3.8 1.1 5 3.5"/>',
    'Shopping Cart': '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L23 6H6"/>',
    Heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>',
    Star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21 7 14.2 2 9.3l6.9-1z"/>',
    Home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
    Settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1h.2a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1z"/>',
    Mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    Calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
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

function IconCard({ asset, color, size, onCopy }: { asset: IconAsset; color: string; size: number; onCopy: (asset: IconAsset) => void }) {
  const { Icon } = asset;
  const svg = createLucideSvg(asset.name, color, size);
  return (
    <Card hover>
      <CardContent className="space-y-4 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-green-50 dark:bg-green-900/20">
          <Icon style={{ color }} size={size} strokeWidth={2} />
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">{asset.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{asset.category} · {size}px</p>
        </div>
        <div className="flex justify-center gap-2">
          <Button variant="secondary" onClick={() => onCopy(asset)}><Copy className="h-4 w-4" /></Button>
          <Button variant="secondary" onClick={() => downloadText(svg, `${asset.id}.svg`)}><Download className="h-4 w-4" /></Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function CustomSvgLibraryPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [color, setColor] = useState('#16a34a');
  const [size, setSize] = useState(32);
  const [copied, setCopied] = useState<string | null>(null);

  const filteredIcons = useMemo(() => {
    return iconAssets.filter((asset) => {
      const matchesCategory = category === 'All' || asset.category === category;
      const matchesQuery = asset.name.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const copySvg = async (asset: IconAsset) => {
    await navigator.clipboard.writeText(createLucideSvg(asset.name, color, size));
    setCopied(asset.id);
    window.setTimeout(() => setCopied(null), 1200);
  };

  return (
    <main className="p-4 md:p-8">
      <PageIntro highlight="Custom SVG" title="Library" description="Manage reusable icon assets with typed filters, export controls, and focused React components." />

      <Card className="mb-8">
        <CardContent className="grid gap-4 lg:grid-cols-[1fr_180px_150px_120px]">
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search icons" className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
          </label>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
          <input type="color" value={color} onChange={(event) => setColor(event.target.value)} className="h-10 w-full rounded-lg border border-gray-300 bg-white dark:border-gray-700" />
          <select value={size} onChange={(event) => setSize(Number(event.target.value))} className="rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
            {[16, 24, 32, 48].map((value) => <option key={value} value={value}>{value}px</option>)}
          </select>
        </CardContent>
      </Card>

      {copied && <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">SVG copied to clipboard.</div>}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filteredIcons.map((asset) => <IconCard key={asset.id} asset={asset} color={color} size={size} onCopy={copySvg} />)}
      </section>
    </main>
  );
}
