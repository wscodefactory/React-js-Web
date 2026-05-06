import { useMemo, useState } from 'react';
import { Download, RefreshCw, Sparkles } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import { PageIntro } from '../../components/showcase/PageIntro';

export type LogoStyle = 'Minimal' | 'Modern' | 'Geometric' | 'Badge';
export type PaletteName = 'Forest' | 'Ocean' | 'Sunset' | 'Mono';

export interface LogoOption {
  id: string;
  label: string;
  svg: string;
}

const styles: LogoStyle[] = ['Minimal', 'Modern', 'Geometric', 'Badge'];
const palettes: Record<PaletteName, [string, string, string]> = {
  Forest: ['#16a34a', '#22c55e', '#dcfce7'],
  Ocean: ['#0284c7', '#38bdf8', '#e0f2fe'],
  Sunset: ['#ea580c', '#f97316', '#ffedd5'],
  Mono: ['#111827', '#6b7280', '#f3f4f6'],
};

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9가-힣]+/gi, '-').replace(/^-|-$/g, '') || 'logo';
}

function createLogoSvg(brandName: string, style: LogoStyle, colors: [string, string, string], variant = 0) {
  const initial = (brandName.trim()[0] ?? 'L').toUpperCase();
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

function LogoPreview({ option, brandName }: { option: LogoOption; brandName: string }) {
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
          <Button variant="secondary" onClick={() => downloadSvg(option.svg, `${brandName}-${option.label}`)}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function LogoGeneratorPage() {
  const [brandName, setBrandName] = useState('Powerlibs');
  const [style, setStyle] = useState<LogoStyle>('Modern');
  const [palette, setPalette] = useState<PaletteName>('Forest');
  const [seed, setSeed] = useState(0);

  const options = useMemo<LogoOption[]>(() => {
    const colors = palettes[palette];
    return [0, 1, 2].map((variant) => ({
      id: `${style}-${palette}-${variant}-${seed}`,
      label: variant === 0 ? 'Primary' : `Variation ${variant}`,
      svg: createLogoSvg(brandName, style, colors, variant + seed),
    }));
  }, [brandName, palette, seed, style]);

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
                  <button key={item} onClick={() => setStyle(item)} className={`rounded-lg border px-3 py-2 text-sm transition ${style === item ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'}`}>{item}</button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Palette</span>
              <div className="space-y-2">
                {(Object.keys(palettes) as PaletteName[]).map((name) => (
                  <button key={name} onClick={() => setPalette(name)} className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm ${palette === name ? 'border-green-500' : 'border-gray-300 dark:border-gray-700'}`}>
                    <span>{name}</span>
                    <span className="flex gap-1">{palettes[name].map((color) => <span key={color} className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: color }} />)}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={() => setSeed((value) => value + 1)} className="w-full justify-center">
              <RefreshCw className="h-4 w-4" /> Refresh variations
            </Button>
          </CardContent>
        </Card>

        <section className="space-y-4">
          <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-900/60 dark:bg-green-900/20 dark:text-green-200">
            <Sparkles className="h-4 w-4" />
            Generated locally as SVG with clean React state and reusable preview cards.
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {options.map((option) => <LogoPreview key={option.id} option={option} brandName={brandName} />)}
          </div>
        </section>
      </div>
    </main>
  );
}
