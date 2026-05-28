import { useEffect, useState } from 'react';
import { Card, CardContent, FormField } from '../../components/common';
import { SVG_CANVAS_HEIGHT, SVG_CANVAS_WIDTH, SVG_MIN_SHAPE_SIZE } from './constants';
import type { SvgShape } from './types';

type PropertiesPanelProps = {
  onUpdateSelected: (updates: Partial<SvgShape>) => void;
  selectedShape?: SvgShape;
};

export function PropertiesPanel({
  onUpdateSelected,
  selectedShape,
}: PropertiesPanelProps) {
  const [widthDraft, setWidthDraft] = useState('');
  const [heightDraft, setHeightDraft] = useState('');

  useEffect(() => {
    if (!selectedShape) {
      setWidthDraft('');
      setHeightDraft('');
      return;
    }

    setWidthDraft(String(selectedShape.width));
    setHeightDraft(String(selectedShape.height));
  }, [selectedShape?.height, selectedShape?.id, selectedShape?.width]);

  const updateWidthDraft = (value: string) => {
    setWidthDraft(value);
    const nextWidth = Number(value);

    if (Number.isFinite(nextWidth) && nextWidth >= SVG_MIN_SHAPE_SIZE && nextWidth <= SVG_CANVAS_WIDTH) {
      onUpdateSelected({ width: nextWidth });
    }
  };

  const updateHeightDraft = (value: string) => {
    setHeightDraft(value);
    const nextHeight = Number(value);

    if (Number.isFinite(nextHeight) && nextHeight >= SVG_MIN_SHAPE_SIZE && nextHeight <= SVG_CANVAS_HEIGHT) {
      onUpdateSelected({ height: nextHeight });
    }
  };

  const commitWidthDraft = () => {
    const nextWidth = Math.min(Math.max(Number(widthDraft) || SVG_MIN_SHAPE_SIZE, SVG_MIN_SHAPE_SIZE), SVG_CANVAS_WIDTH);
    setWidthDraft(String(nextWidth));
    onUpdateSelected({ width: nextWidth });
  };

  const commitHeightDraft = () => {
    const nextHeight = Math.min(Math.max(Number(heightDraft) || SVG_MIN_SHAPE_SIZE, SVG_MIN_SHAPE_SIZE), SVG_CANVAS_HEIGHT);
    setHeightDraft(String(nextHeight));
    onUpdateSelected({ height: nextHeight });
  };

  return (
    <Card>
      <CardContent>
        <h2 className="card-title">Properties</h2>
        {selectedShape ? (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Width">
                <input
                  type="number"
                  min={SVG_MIN_SHAPE_SIZE}
                  max={SVG_CANVAS_WIDTH}
                  value={widthDraft}
                  onBlur={commitWidthDraft}
                  onFocus={(event) => event.currentTarget.select()}
                  onChange={(event) => updateWidthDraft(event.target.value)}
                  className="form-input"
                />
              </FormField>
              <FormField label="Height">
                <input
                  type="number"
                  min={SVG_MIN_SHAPE_SIZE}
                  max={SVG_CANVAS_HEIGHT}
                  value={heightDraft}
                  onBlur={commitHeightDraft}
                  onFocus={(event) => event.currentTarget.select()}
                  onChange={(event) => updateHeightDraft(event.target.value)}
                  className="form-input"
                />
              </FormField>
            </div>

            {selectedShape.type !== 'path' ? (
              <FormField label="Fill Color">
                <div className="form-color-group">
                  <input type="color" value={selectedShape.fill} onChange={(event) => onUpdateSelected({ fill: event.target.value })} className="form-color-picker" />
                  <input value={selectedShape.fill} onChange={(event) => onUpdateSelected({ fill: event.target.value })} className="form-input" />
                </div>
              </FormField>
            ) : null}
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
