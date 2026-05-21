import { Card, CardContent, FormField } from '../../components/common';
import type { SvgShape } from './types';

type PropertiesPanelProps = {
  onUpdateSelected: (updates: Partial<SvgShape>) => void;
  selectedShape?: SvgShape;
};

export function PropertiesPanel({
  onUpdateSelected,
  selectedShape,
}: PropertiesPanelProps) {
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
