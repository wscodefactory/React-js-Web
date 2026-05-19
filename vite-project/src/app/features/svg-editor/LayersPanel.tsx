import { Copy, Layers, Lock, Trash2, Unlock } from 'lucide-react';
import { Card, CardContent } from '../../components/common';
import type { SvgShape } from './types';

type LayersPanelProps = {
  onDeleteShape: (id: number) => void;
  onDuplicateShape: (id: number) => void;
  onSelectShape: (id: number) => void;
  onToggleLock: (id: number) => void;
  onToggleVisibility: (id: number) => void;
  selectedShapeId: number | null;
  shapes: SvgShape[];
};

export function LayersPanel({
  onDeleteShape,
  onDuplicateShape,
  onSelectShape,
  onToggleLock,
  onToggleVisibility,
  selectedShapeId,
  shapes,
}: LayersPanelProps) {
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
