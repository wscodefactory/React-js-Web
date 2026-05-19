import { Card } from '../../components/common';
import { CanvasStatGrid } from '../../components/showcase/CanvasStatGrid';
import type { CanvasStatItem } from '../../types/showcase';
import { ShapeElement } from './ShapeElement';
import type { SvgShape } from './types';

type CanvasPreviewProps = {
  onSelectShape: (id: number) => void;
  onToggleGrid: () => void;
  onToggleGuides: () => void;
  selectedShapeId: number | null;
  shapes: SvgShape[];
  showGrid: boolean;
  showGuides: boolean;
};

export function CanvasPreview({
  onSelectShape,
  onToggleGrid,
  onToggleGuides,
  selectedShapeId,
  shapes,
  showGrid,
  showGuides,
}: CanvasPreviewProps) {
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
            <span>|</span>
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
