import { Download, Palette, RefreshCw, Wand2 } from 'lucide-react';
import { Card, CardContent, CardHeader, Button, FormField, Input } from '@/app/components/common';
import { PageIntro } from '@/app/components/showcase/PageIntro';
import { SelectionGrid } from '@/app/components/showcase/SelectionGrid';
import { colorSchemes, logoStyles } from '@/app/data/showcase';
import type { OptionCardItem } from '@/app/types/showcase';

const logoStyleItems: OptionCardItem[] = logoStyles.map((style, index) => ({
  id: style.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  label: style,
  selected: index === 0,
}));

export function LogoGeneratorPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <PageIntro
        highlight="Logo"
        title="Generator"
        description="Create professional logos with AI-powered design tools"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <BrandDetailsPanel />
          <StylePanel />
          <ColorSchemePanel />
          <GeneratorActions />
        </div>

        <div className="lg:col-span-2">
          <PreviewPanel />
        </div>
      </div>
    </div>
  );
}

function BrandDetailsPanel() {
  return (
    <Card>
      <CardHeader title="Brand Details" description="Define the brand voice before generating variations." />
      <CardContent className="space-y-4">
        <FormField label="Brand Name">
          <Input type="text" placeholder="Enter brand name" />
        </FormField>
        <FormField label="Tagline (Optional)">
          <Input type="text" placeholder="Enter tagline" />
        </FormField>
      </CardContent>
    </Card>
  );
}

function StylePanel() {
  return (
    <Card>
      <CardHeader title="Logo Style" description="Choose a visual direction to guide the generated concepts." />
      <CardContent>
        <SelectionGrid items={logoStyleItems} columnsClassName="grid-cols-2" />
      </CardContent>
    </Card>
  );
}

function ColorSchemePanel() {
  return (
    <Card>
      <CardHeader title="Color Scheme" description="Pick a palette or explore multiple directions at once." />
      <CardContent className="space-y-3">
        {colorSchemes.map((scheme, index) => (
          <button
            key={scheme.name}
            className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors ${
              index === 1
                ? 'border-green-500 dark:border-green-400'
                : 'border-gray-200 hover:border-green-500 dark:border-gray-700 dark:hover:border-green-400'
            }`}
          >
            <span className="text-sm text-gray-700 dark:text-gray-300">{scheme.name}</span>
            <div className="flex gap-1">
              {scheme.colors.map((color) => (
                <div
                  key={color}
                  className="h-6 w-6 rounded-full border border-gray-200 dark:border-gray-600"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

function GeneratorActions() {
  return (
    <div className="space-y-2">
      <Button className="w-full justify-center gap-2">
        <Wand2 className="w-4 h-4" />
        Generate Logo
      </Button>
      <Button variant="secondary" className="w-full justify-center gap-2">
        <RefreshCw className="w-4 h-4" />
        Regenerate
      </Button>
    </div>
  );
}

function PreviewPanel() {
  return (
    <Card className="h-full">
      <CardHeader
        title="Generated Concepts"
        description="Review logo candidates and export the strongest direction."
        badge={
          <Button variant="secondary" className="gap-2 px-3 py-2 text-sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
        }
      />
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((variant) => (
            <div key={variant} className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <Palette className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">BrandMark {variant}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Modern · Forest palette</p>
                </div>
              </div>
              <Button variant="secondary" className="w-full justify-center">Use this concept</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
