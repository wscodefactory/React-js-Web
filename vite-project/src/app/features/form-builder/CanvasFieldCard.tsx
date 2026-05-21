import { ChevronDown, ChevronUp, Copy, Settings, Trash2 } from 'lucide-react';
import { FieldInput } from './FieldInput';
import type { BuilderField, MoveDirection } from './types';

type CanvasFieldCardProps = {
  canMoveDown: boolean;
  canMoveUp: boolean;
  field: BuilderField;
  isPreview: boolean;
  onDuplicate: (id: number) => void;
  onMove: (id: number, direction: MoveDirection) => void;
  onRemove: (id: number) => void;
  onToggleRequired: (id: number) => void;
  onUpdateLabel: (id: number, label: string) => void;
  showLabel: boolean;
};

export function CanvasFieldCard({
  canMoveDown,
  canMoveUp,
  field,
  isPreview,
  onDuplicate,
  onMove,
  onRemove,
  onToggleRequired,
  onUpdateLabel,
  showLabel,
}: CanvasFieldCardProps) {
  return (
    <div className="group rounded-lg border-2 border-dashed border-gray-200 p-4 transition-colors hover:border-green-500 dark:border-gray-700 dark:hover:border-green-400">
      <div className="mb-2 flex items-start justify-between gap-3">
        {showLabel ? (
          <label className="block flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            {isPreview ? (
              field.label
            ) : (
              <input
                value={field.label}
                onChange={(event) => onUpdateLabel(field.id, event.target.value)}
                className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 outline-none transition focus:border-green-500 dark:text-gray-200"
              />
            )}
            {field.required ? <span className="ml-1 text-red-500">*</span> : null}
          </label>
        ) : null}
        {!isPreview ? (
          <div className="flex gap-1 opacity-100 transition-opacity">
            <button type="button" onClick={() => onMove(field.id, -1)} disabled={!canMoveUp} className="rounded p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-35 dark:hover:bg-gray-700" aria-label={`Move ${field.label} up`}>
              <ChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button type="button" onClick={() => onMove(field.id, 1)} disabled={!canMoveDown} className="rounded p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-35 dark:hover:bg-gray-700" aria-label={`Move ${field.label} down`}>
              <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button type="button" onClick={() => onDuplicate(field.id)} className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={`Duplicate ${field.label}`}>
              <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button type="button" onClick={() => onToggleRequired(field.id)} className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={`Toggle required for ${field.label}`}>
              <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button type="button" onClick={() => onRemove(field.id)} className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={`Delete ${field.label}`}>
              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
            </button>
          </div>
        ) : null}
      </div>

      <FieldInput field={field} />
    </div>
  );
}
