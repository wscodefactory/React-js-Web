import { Button, Card, CardContent, ColorInput, FormField, SectionHeader, Select } from '@/app/components/common';
import { CanvasStatGrid } from '@/app/components/showcase/CanvasStatGrid';
import { SelectionGrid } from '@/app/components/showcase/SelectionGrid';
import {
  svgActionButtons,
  svgCanvasStats,
  svgEditorLayers,
  svgEditorTools,
  svgExportFormats,
  svgQualityOptions,
  svgScaleOptions,
} from '@/app/data/showcase';
import type { SvgLayerItem, SvgToolItem } from '@/app/types/showcase';
import { Layers } from 'lucide-react';

function SvgToolPalette() {
  const items = svgEditorTools.map((tool) => ({
    id: tool.id,
    label: tool.label,
    description: 'Canvas tool',
    selected: tool.id === 'select',
  }));

  return (
    <Card>
      <CardContent>
        <h2 className="card-title">Tools</h2>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {svgEditorTools.map((tool: SvgToolItem) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <Icon className="icon" />
                <span className="text-xs text-gray-700 dark:text-gray-300">{tool.label}</span>
              </button>
            );
          })}
        </div>
        <div className="sr-only">{items.length} tools available</div>
      </CardContent>
    </Card>
  );
}

function PropertiesPanel() {
  return (
    <Card>
      <CardContent>
        <h2 className="card-title">Properties</h2>
        <div className="mt-4 space-y-4">
          <ColorInput label="Fill Color" defaultValue="#16a34a" />
          <ColorInput label="Stroke Color" defaultValue="#000000" />

          <FormField label="Stroke Width">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="10"
                defaultValue="2"
                className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-green-600 dark:bg-gray-700"
              />
              <span className="w-8 text-right text-sm text-gray-700 dark:text-gray-300">2px</span>
            </div>
          </FormField>

          <FormField label="Opacity">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="100"
                className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-green-600 dark:bg-gray-700"
              />
              <span className="w-10 text-right text-sm text-gray-700 dark:text-gray-300">100%</span>
            </div>
          </FormField>
        </div>
      </CardContent>
    </Card>
  );
}

function LayersPanel() {
  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="card-title">Layers</h2>
          <Layers className="icon-sm text-gray-600 dark:text-gray-400" />
        </div>
        <div className="space-y-2">
          {svgEditorLayers.map((layer: SvgLayerItem) => (
            <label key={layer.id} className="flex items-center gap-2 rounded-lg bg-gray-50 p-2 dark:bg-gray-900">
              <input type="checkbox" defaultChecked={layer.visible} className="rounded" />
              <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{layer.name}</span>
              <span className="text-xs text-gray-400">{layer.locked ? 'Locked' : 'Editable'}</span>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ActionsPanel() {
  return (
    <div className="space-y-2">
      {svgActionButtons.map((action) => {
        const Icon = action.icon;
        return (
          <Button key={action.id} variant={action.variant} className="flex w-full items-center justify-center gap-2">
            <Icon className="icon-sm" />
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}

function CanvasPreview() {
  return (
    <Card>
      <header className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Canvas</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>800 x 600</span>
            <span>•</span>
            <span>100%</span>
          </div>
        </div>
        <SelectionGrid
          items={[
            { id: 'grid', label: 'Grid', selected: true },
            { id: 'guides', label: 'Guides', selected: false },
          ]}
          columnsClassName="grid-cols-2"
        />
      </header>

      <div className="p-8">
        <div
          className="flex aspect-video w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900"
          style={{
            backgroundImage:
              'linear-gradient(45deg, #f3f4f6 25%, transparent 25%, transparent 75%, #f3f4f6 75%, #f3f4f6), linear-gradient(45deg, #f3f4f6 25%, transparent 25%, transparent 75%, #f3f4f6 75%, #f3f4f6)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px',
          }}
        >
          <svg width="400" height="300" viewBox="0 0 400 300">
            <rect x="50" y="50" width="150" height="100" fill="#16a34a" stroke="#000000" strokeWidth="2" />
            <circle cx="300" cy="150" r="60" fill="#3b82f6" stroke="#000000" strokeWidth="2" />
          </svg>
        </div>
      </div>

      <footer className="border-t border-gray-200 p-4 dark:border-gray-700">
        <CanvasStatGrid items={svgCanvasStats} />
      </footer>
    </Card>
  );
}

function ExportSettings() {
  return (
    <Card>
      <CardContent>
        <h3 className="card-title">Export Settings</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField label="Format">
            <Select options={svgExportFormats} />
          </FormField>
          <FormField label="Quality">
            <Select options={svgQualityOptions} />
          </FormField>
          <FormField label="Scale">
            <Select options={svgScaleOptions} />
          </FormField>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * SVG editor page split into focused panels.
 * The page now separates the palette, canvas, and export controls into clearer React units.
 */
export function SvgEditorPage() {
  return (
    <div className="container-page">
      <SectionHeader
        titleHighlight="SVG"
        title="Editor"
        description="Create and edit scalable vector graphics with professional tools"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <aside className="space-y-section lg:col-span-1">
          <SvgToolPalette />
          <PropertiesPanel />
          <LayersPanel />
          <ActionsPanel />
        </aside>

        <section className="space-y-6 lg:col-span-3">
          <CanvasPreview />
          <ExportSettings />
        </section>
      </div>
    </div>
  );
}
