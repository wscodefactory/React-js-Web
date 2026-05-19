import { useMemo, useRef, useState } from 'react';
import { Button, Card, CardContent, FormField, SectionHeader, Select } from '@/app/components/common';
import { CanvasStatGrid } from '@/app/components/showcase/CanvasStatGrid';
import { svgEditorTools, svgExportFormats, svgQualityOptions, svgScaleOptions } from '@/app/data/showcase';
import type { CanvasStatItem, SvgToolItem } from '@/app/types/showcase';
import { Copy, Download, Layers, Lock, Trash2, Unlock, Upload } from 'lucide-react';

type SvgShapeType = 'rect' | 'circle' | 'path';
type ExportFormat = 'svg' | 'png' | 'jpg' | 'webp';
type ExportQuality = 'high' | 'medium' | 'low';
type ExportScale = '1x' | '2x' | '3x';

interface SvgShape {
  id: number;
  name: string;
  type: SvgShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
}

const initialShapes: SvgShape[] = [
  { id: 1, name: 'Rectangle', type: 'rect', x: 50, y: 50, width: 150, height: 100, fill: '#16a34a', stroke: '#000000', strokeWidth: 2, opacity: 100, visible: true, locked: false },
  { id: 2, name: 'Circle', type: 'circle', x: 240, y: 90, width: 120, height: 120, fill: '#3b82f6', stroke: '#000000', strokeWidth: 2, opacity: 100, visible: true, locked: false },
];

function buildSvgMarkup(shapes: SvgShape[]) {
  const shapeMarkup = shapes
    .filter((shape) => shape.visible)
    .map((shape) => {
      const common = `fill="${shape.fill}" stroke="${shape.stroke}" stroke-width="${shape.strokeWidth}" opacity="${shape.opacity / 100}"`;
      if (shape.type === 'circle') {
        return `<circle cx="${shape.x + shape.width / 2}" cy="${shape.y + shape.height / 2}" r="${shape.width / 2}" ${common} />`;
      }
      if (shape.type === 'path') {
        return `<path d="M${shape.x} ${shape.y + shape.height} C${shape.x + 40} ${shape.y}, ${shape.x + shape.width - 40} ${shape.y}, ${shape.x + shape.width} ${shape.y + shape.height}" ${common} fill="none" />`;
      }
      return `<rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" ${common} />`;
    })
    .join('\n  ');

  return `<svg width="800" height="600" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  ${shapeMarkup}
</svg>`;
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function exportAsset(svgMarkup: string, format: ExportFormat, scale: ExportScale, quality: ExportQuality) {
  if (format === 'svg') {
    downloadBlob(new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' }), 'canvas-export.svg');
    return;
  }

  const scaleValue = Number(scale.replace('x', ''));
  const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const image = new Image();
  image.src = url;

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Could not render SVG for export.'));
  });

  const canvas = document.createElement('canvas');
  canvas.width = 800 * scaleValue;
  canvas.height = 600 * scaleValue;
  const context = canvas.getContext('2d');
  if (!context) {
    URL.revokeObjectURL(url);
    throw new Error('Canvas export is not supported in this browser.');
  }

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(url);

  const qualityValue = quality === 'high' ? 0.95 : quality === 'medium' ? 0.75 : 0.55;
  const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mimeType, qualityValue));
  if (!blob) {
    throw new Error('Export failed.');
  }

  downloadBlob(blob, `canvas-export.${format}`);
}

function parseImportedSvg(content: string, nextId: number): SvgShape[] {
  const documentNode = new DOMParser().parseFromString(content, 'image/svg+xml');
  const parserError = documentNode.querySelector('parsererror');
  if (parserError) {
    return [];
  }

  const rects = Array.from(documentNode.querySelectorAll('rect')).slice(0, 4).map((rect, index) => ({
    id: nextId + index,
    name: `Imported Rect ${index + 1}`,
    type: 'rect' as const,
    x: Number(rect.getAttribute('x') ?? 40 + index * 24),
    y: Number(rect.getAttribute('y') ?? 40 + index * 24),
    width: Number(rect.getAttribute('width') ?? 120),
    height: Number(rect.getAttribute('height') ?? 80),
    fill: rect.getAttribute('fill') ?? '#16a34a',
    stroke: rect.getAttribute('stroke') ?? '#000000',
    strokeWidth: Number(rect.getAttribute('stroke-width') ?? 2),
    opacity: Number(rect.getAttribute('opacity') ?? 1) * 100,
    visible: true,
    locked: false,
  }));

  const circles = Array.from(documentNode.querySelectorAll('circle')).slice(0, 4).map((circle, index) => {
    const radius = Number(circle.getAttribute('r') ?? 40);
    return {
      id: nextId + rects.length + index,
      name: `Imported Circle ${index + 1}`,
      type: 'circle' as const,
      x: Number(circle.getAttribute('cx') ?? 160) - radius,
      y: Number(circle.getAttribute('cy') ?? 120) - radius,
      width: radius * 2,
      height: radius * 2,
      fill: circle.getAttribute('fill') ?? '#3b82f6',
      stroke: circle.getAttribute('stroke') ?? '#000000',
      strokeWidth: Number(circle.getAttribute('stroke-width') ?? 2),
      opacity: Number(circle.getAttribute('opacity') ?? 1) * 100,
      visible: true,
      locked: false,
    };
  });

  return [...rects, ...circles];
}

function SvgToolPalette({ activeTool, onSelectTool }: { activeTool: string; onSelectTool: (tool: string) => void }) {
  return (
    <Card>
      <CardContent>
        <h2 className="card-title">Tools</h2>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {svgEditorTools.map((tool: SvgToolItem) => {
            const Icon = tool.icon;
            const selected = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => onSelectTool(tool.id)}
                className={`flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors ${
                  selected
                    ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                    : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="icon" />
                <span className="text-xs">{tool.label}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function PropertiesPanel({
  selectedShape,
  onUpdateSelected,
}: {
  selectedShape?: SvgShape;
  onUpdateSelected: (updates: Partial<SvgShape>) => void;
}) {
  return (
    <Card>
      <CardContent>
        <h2 className="card-title">Properties</h2>
        {selectedShape ? (
          <div className="mt-4 space-y-4">
            <FormField label="Fill Color">
              <div className="form-color-group">
                <input type="color" value={selectedShape.fill} onChange={(event) => onUpdateSelected({ fill: event.target.value })} className="form-color-picker" />
                <input value={selectedShape.fill} onChange={(event) => onUpdateSelected({ fill: event.target.value })} className="form-input" />
              </div>
            </FormField>
            <FormField label="Stroke Color">
              <div className="form-color-group">
                <input type="color" value={selectedShape.stroke} onChange={(event) => onUpdateSelected({ stroke: event.target.value })} className="form-color-picker" />
                <input value={selectedShape.stroke} onChange={(event) => onUpdateSelected({ stroke: event.target.value })} className="form-input" />
              </div>
            </FormField>

            <FormField label="Stroke Width">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={selectedShape.strokeWidth}
                  onChange={(event) => onUpdateSelected({ strokeWidth: Number(event.target.value) })}
                  className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-green-600 dark:bg-gray-700"
                />
                <span className="w-8 text-right text-sm text-gray-700 dark:text-gray-300">{selectedShape.strokeWidth}px</span>
              </div>
            </FormField>

            <FormField label="Opacity">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={selectedShape.opacity}
                  onChange={(event) => onUpdateSelected({ opacity: Number(event.target.value) })}
                  className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-green-600 dark:bg-gray-700"
                />
                <span className="w-10 text-right text-sm text-gray-700 dark:text-gray-300">{selectedShape.opacity}%</span>
              </div>
            </FormField>
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Select a shape to edit its properties.</p>
        )}
      </CardContent>
    </Card>
  );
}

function LayersPanel({
  shapes,
  selectedShapeId,
  onSelectShape,
  onToggleVisibility,
  onToggleLock,
  onDuplicateShape,
  onDeleteShape,
}: {
  shapes: SvgShape[];
  selectedShapeId: number | null;
  onSelectShape: (id: number) => void;
  onToggleVisibility: (id: number) => void;
  onToggleLock: (id: number) => void;
  onDuplicateShape: (id: number) => void;
  onDeleteShape: (id: number) => void;
}) {
  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="card-title">Layers</h2>
          <Layers className="icon-sm text-gray-600 dark:text-gray-400" />
        </div>
        <div className="space-y-2">
          {shapes.map((shape) => (
            <div key={shape.id} className={`rounded-lg p-2 ${selectedShapeId === shape.id ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-900'}`}>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={shape.visible}
                  onChange={() => onToggleVisibility(shape.id)}
                  className="rounded"
                  aria-label={`Toggle ${shape.name} visibility`}
                />
                <button type="button" onClick={() => onSelectShape(shape.id)} className="min-w-0 flex-1 truncate text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  {shape.name}
                </button>
                <span className="text-xs text-gray-400">{shape.locked ? 'Locked' : 'Editable'}</span>
              </div>
              <div className="mt-2 flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => onToggleLock(shape.id)}
                  className="rounded-md p-1.5 text-gray-500 transition hover:bg-white hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                  aria-label={`${shape.locked ? 'Unlock' : 'Lock'} ${shape.name}`}
                >
                  {shape.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => onDuplicateShape(shape.id)}
                  className="rounded-md p-1.5 text-gray-500 transition hover:bg-white hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                  aria-label={`Duplicate ${shape.name}`}
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteShape(shape.id)}
                  className="rounded-md p-1.5 text-gray-500 transition hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                  aria-label={`Delete ${shape.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ActionsPanel({
  onExport,
  onImportClick,
}: {
  onExport: () => void;
  onImportClick: () => void;
}) {
  return (
    <div className="space-y-2">
      <Button onClick={onExport} className="flex w-full items-center justify-center gap-2">
        <Download className="icon-sm" />
        Export SVG
      </Button>
      <Button variant="secondary" onClick={onImportClick} className="flex w-full items-center justify-center gap-2">
        <Upload className="icon-sm" />
        Import SVG
      </Button>
    </div>
  );
}

function CanvasPreview({
  shapes,
  selectedShapeId,
  showGrid,
  showGuides,
  onToggleGrid,
  onToggleGuides,
  onSelectShape,
}: {
  shapes: SvgShape[];
  selectedShapeId: number | null;
  showGrid: boolean;
  showGuides: boolean;
  onToggleGrid: () => void;
  onToggleGuides: () => void;
  onSelectShape: (id: number) => void;
}) {
  const selectedShape = shapes.find((shape) => shape.id === selectedShapeId);
  const stats: CanvasStatItem[] = [
    { label: 'Position', value: selectedShape ? `X: ${selectedShape.x}, Y: ${selectedShape.y}` : 'X: 0, Y: 0' },
    { label: 'Size', value: selectedShape ? `W: ${selectedShape.width}, H: ${selectedShape.height}` : 'W: 0, H: 0' },
    { label: 'Selected', value: selectedShape?.name ?? 'None' },
    { label: 'Zoom', value: '100%' },
  ];

  return (
    <Card>
      <header className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-700 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Canvas</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>800 x 600</span>
            <span>•</span>
            <span>100%</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={onToggleGrid} className={`rounded-lg border px-3 py-2 text-sm ${showGrid ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 dark:border-gray-700'}`}>Grid</button>
          <button type="button" onClick={onToggleGuides} className={`rounded-lg border px-3 py-2 text-sm ${showGuides ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 dark:border-gray-700'}`}>Guides</button>
        </div>
      </header>

      <div className="p-8">
        <div
          className="flex aspect-video w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900"
          style={showGrid ? {
            backgroundImage:
              'linear-gradient(45deg, #f3f4f6 25%, transparent 25%, transparent 75%, #f3f4f6 75%, #f3f4f6), linear-gradient(45deg, #f3f4f6 25%, transparent 25%, transparent 75%, #f3f4f6 75%, #f3f4f6)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px',
          } : undefined}
        >
          <svg width="400" height="300" viewBox="0 0 400 300">
            {showGuides ? (
              <g stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1">
                <line x1="200" y1="0" x2="200" y2="300" />
                <line x1="0" y1="150" x2="400" y2="150" />
              </g>
            ) : null}
            {shapes.filter((shape) => shape.visible).map((shape) => (
              <ShapeElement key={shape.id} shape={shape} selected={selectedShapeId === shape.id} onSelect={onSelectShape} />
            ))}
          </svg>
        </div>
      </div>

      <footer className="border-t border-gray-200 p-4 dark:border-gray-700">
        <CanvasStatGrid items={stats} />
      </footer>
    </Card>
  );
}

function ShapeElement({ shape, selected, onSelect }: { shape: SvgShape; selected: boolean; onSelect: (id: number) => void }) {
  const commonProps = {
    fill: shape.fill,
    stroke: selected ? '#f59e0b' : shape.stroke,
    strokeWidth: selected ? shape.strokeWidth + 2 : shape.strokeWidth,
    opacity: shape.opacity / 100,
    onClick: () => onSelect(shape.id),
    style: { cursor: 'pointer' },
  };

  if (shape.type === 'circle') {
    return <circle cx={shape.x + shape.width / 2} cy={shape.y + shape.height / 2} r={shape.width / 2} {...commonProps} />;
  }

  if (shape.type === 'path') {
    return <path d={`M${shape.x} ${shape.y + shape.height} C${shape.x + 40} ${shape.y}, ${shape.x + shape.width - 40} ${shape.y}, ${shape.x + shape.width} ${shape.y + shape.height}`} {...commonProps} fill="none" />;
  }

  return <rect x={shape.x} y={shape.y} width={shape.width} height={shape.height} {...commonProps} />;
}

function ExportSettings({
  format,
  quality,
  scale,
  onFormatChange,
  onQualityChange,
  onScaleChange,
}: {
  format: ExportFormat;
  quality: ExportQuality;
  scale: ExportScale;
  onFormatChange: (value: ExportFormat) => void;
  onQualityChange: (value: ExportQuality) => void;
  onScaleChange: (value: ExportScale) => void;
}) {
  return (
    <Card>
      <CardContent>
        <h3 className="card-title">Export Settings</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField label="Format">
            <Select options={svgExportFormats} value={format} onChange={(event) => onFormatChange(event.target.value as ExportFormat)} />
          </FormField>
          <FormField label="Quality">
            <Select options={svgQualityOptions} value={quality} onChange={(event) => onQualityChange(event.target.value as ExportQuality)} />
          </FormField>
          <FormField label="Scale">
            <Select options={svgScaleOptions} value={scale} onChange={(event) => onScaleChange(event.target.value as ExportScale)} />
          </FormField>
        </div>
      </CardContent>
    </Card>
  );
}

export function SvgEditorPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [shapes, setShapes] = useState(initialShapes);
  const [selectedShapeId, setSelectedShapeId] = useState<number | null>(initialShapes[0].id);
  const [activeTool, setActiveTool] = useState('select');
  const [showGrid, setShowGrid] = useState(true);
  const [showGuides, setShowGuides] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('svg');
  const [quality, setQuality] = useState<ExportQuality>('high');
  const [scale, setScale] = useState<ExportScale>('1x');
  const [status, setStatus] = useState('Select a shape or add a new one with the tool palette.');

  const selectedShape = shapes.find((shape) => shape.id === selectedShapeId);
  const svgMarkup = useMemo(() => buildSvgMarkup(shapes), [shapes]);

  const addShape = (tool: string) => {
    setActiveTool(tool);
    if (tool === 'select') {
      setStatus('Select mode enabled. Click a layer or shape to edit it.');
      return;
    }

    const nextId = Math.max(0, ...shapes.map((shape) => shape.id)) + 1;
    const shapeType: SvgShapeType = tool === 'circle' ? 'circle' : tool === 'pen' ? 'path' : 'rect';
    const nextShape: SvgShape = {
      id: nextId,
      name: shapeType === 'circle' ? `Circle ${nextId}` : shapeType === 'path' ? `Path ${nextId}` : `Rectangle ${nextId}`,
      type: shapeType,
      x: 40 + (nextId * 18) % 180,
      y: 40 + (nextId * 14) % 120,
      width: shapeType === 'circle' ? 90 : 120,
      height: shapeType === 'circle' ? 90 : 80,
      fill: shapeType === 'path' ? 'none' : '#16a34a',
      stroke: '#000000',
      strokeWidth: 2,
      opacity: 100,
      visible: true,
      locked: false,
    };

    setShapes((current) => [...current, nextShape]);
    setSelectedShapeId(nextId);
    setStatus(`${nextShape.name} added to canvas.`);
  };

  const updateSelectedShape = (updates: Partial<SvgShape>) => {
    if (!selectedShapeId) return;
    const shape = shapes.find((item) => item.id === selectedShapeId);
    if (shape?.locked) {
      setStatus(`${shape.name} is locked. Unlock it before editing properties.`);
      return;
    }
    setShapes((current) => current.map((shape) => shape.id === selectedShapeId ? { ...shape, ...updates } : shape));
  };

  const toggleVisibility = (id: number) => {
    setShapes((current) => current.map((shape) => shape.id === id ? { ...shape, visible: !shape.visible } : shape));
  };

  const toggleLock = (id: number) => {
    setShapes((current) => current.map((shape) => shape.id === id ? { ...shape, locked: !shape.locked } : shape));
    const shape = shapes.find((item) => item.id === id);
    if (shape) {
      setStatus(`${shape.name} ${shape.locked ? 'unlocked' : 'locked'}.`);
    }
  };

  const duplicateShape = (id: number) => {
    const shape = shapes.find((item) => item.id === id);
    if (!shape) return;
    if (shape.locked) {
      setStatus(`${shape.name} is locked. Unlock it before duplicating.`);
      return;
    }

    const nextId = Math.max(0, ...shapes.map((item) => item.id)) + 1;
    const duplicate: SvgShape = {
      ...shape,
      id: nextId,
      name: `${shape.name} Copy`,
      x: Math.min(shape.x + 24, 320),
      y: Math.min(shape.y + 24, 220),
      locked: false,
    };

    setShapes((current) => [...current, duplicate]);
    setSelectedShapeId(nextId);
    setStatus(`${duplicate.name} added to layers.`);
  };

  const deleteShape = (id: number) => {
    const shape = shapes.find((item) => item.id === id);
    if (!shape) return;
    if (shape.locked) {
      setStatus(`${shape.name} is locked. Unlock it before deleting.`);
      return;
    }

    const remainingShapes = shapes.filter((item) => item.id !== id);
    setShapes(remainingShapes);
    setSelectedShapeId((current) => current === id ? remainingShapes[0]?.id ?? null : current);
    setStatus(`${shape.name} removed from canvas.`);
  };

  const handleExport = async () => {
    try {
      await exportAsset(svgMarkup, format, scale, quality);
      setStatus(`Canvas exported as ${format.toUpperCase()}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Export failed.');
    }
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const importedShapes = parseImportedSvg(String(reader.result ?? ''), Math.max(0, ...shapes.map((shape) => shape.id)) + 1);
      if (importedShapes.length === 0) {
        setStatus('Imported SVG, but no supported rect or circle elements were found.');
        return;
      }
      setShapes((current) => [...current, ...importedShapes]);
      setSelectedShapeId(importedShapes[0].id);
      setStatus(`${importedShapes.length} shapes imported from ${file.name}.`);
    };
    reader.readAsText(file, 'UTF-8');
    event.target.value = '';
  };

  return (
    <div className="container-page">
      <SectionHeader
        titleHighlight="SVG"
        title="Editor"
        description="Create and edit scalable vector graphics with professional tools"
      />

      <input ref={fileInputRef} type="file" accept=".svg,image/svg+xml" onChange={handleImportFile} className="hidden" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-section">
          <SvgToolPalette activeTool={activeTool} onSelectTool={addShape} />
          <PropertiesPanel selectedShape={selectedShape} onUpdateSelected={updateSelectedShape} />
          <LayersPanel
            shapes={shapes}
            selectedShapeId={selectedShapeId}
            onSelectShape={setSelectedShapeId}
            onToggleVisibility={toggleVisibility}
            onToggleLock={toggleLock}
            onDuplicateShape={duplicateShape}
            onDeleteShape={deleteShape}
          />
          <ActionsPanel onExport={handleExport} onImportClick={() => fileInputRef.current?.click()} />
        </aside>

        <section className="space-y-6">
          <CanvasPreview
            shapes={shapes}
            selectedShapeId={selectedShapeId}
            showGrid={showGrid}
            showGuides={showGuides}
            onToggleGrid={() => setShowGrid((current) => !current)}
            onToggleGuides={() => setShowGuides((current) => !current)}
            onSelectShape={setSelectedShapeId}
          />
          <ExportSettings
            format={format}
            quality={quality}
            scale={scale}
            onFormatChange={setFormat}
            onQualityChange={setQuality}
            onScaleChange={setScale}
          />
          <Card>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">{status}</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
