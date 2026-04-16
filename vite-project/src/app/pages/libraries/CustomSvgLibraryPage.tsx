import { Download, Image, Search, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, Button, FormField, Input, Select } from '@/app/components/common';
import { MetricGrid } from '@/app/components/showcase/MetricGrid';
import { PageIntro } from '@/app/components/showcase/PageIntro';
import { svgCategories, svgIcons, svgMetrics } from '@/app/data/showcase';

const sizeOptions = [
  { value: '16', label: '16x16' },
  { value: '24', label: '24x24' },
  { value: '32', label: '32x32' },
  { value: '48', label: '48x48' },
];

const formatOptions = [
  { value: 'svg', label: 'SVG' },
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WebP' },
];

export function CustomSvgLibraryPage() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <PageIntro
        highlight="Custom SVG"
        title="Library"
        description="Browse, customize, and download scalable vector graphics for your projects"
      />

      <SearchAndUploadBar />
      <CategoryFilter />
      <MetricGrid items={svgMetrics} />
      <IconLibrarySection />
      <CustomizationPanel />
    </div>
  );
}

function SearchAndUploadBar() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input type="text" placeholder="Search SVG icons..." className="pl-10" />
      </div>
      <Button className="gap-2">
        <Upload className="w-4 h-4" />
        Upload SVG
      </Button>
    </div>
  );
}

function CategoryFilter() {
  return (
    <div className="flex flex-wrap gap-2">
      {svgCategories.map((category) => {
        const selected = category === 'All';
        return (
          <button
            key={category}
            className={`rounded-lg px-4 py-2 text-sm transition-colors ${
              selected
                ? 'bg-green-600 text-white'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

function IconLibrarySection() {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Icon Library</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {svgIcons.map((icon) => (
          <Card key={icon.id} hover className="group">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-lg bg-green-100 transition-colors group-hover:bg-green-200 dark:bg-green-900/30 dark:group-hover:bg-green-900/50">
                <Image className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-1 text-sm font-medium text-gray-900 dark:text-white">{icon.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{icon.size}</p>
              <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">{icon.category}</span>
              <Button className="mt-3 w-full gap-1 px-2 py-1 text-xs opacity-0 group-hover:opacity-100">
                <Download className="w-3 h-3" />
                Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function CustomizationPanel() {
  return (
    <Card>
      <CardHeader title="Customization Options" description="Adjust output settings before exporting your icon set." />
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <FormField label="Size">
          <Select options={sizeOptions} />
        </FormField>
        <FormField label="Color">
          <Input type="color" defaultValue="#16a34a" className="h-10 w-full rounded-lg border border-gray-300 dark:border-gray-600" />
        </FormField>
        <FormField label="Format">
          <Select options={formatOptions} />
        </FormField>
      </CardContent>
    </Card>
  );
}
