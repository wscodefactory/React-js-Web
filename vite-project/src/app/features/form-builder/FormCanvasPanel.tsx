import { Plus } from 'lucide-react';
import { Button, Card, CardContent, CardHeader } from '../../components/common';
import { CanvasFieldCard } from './CanvasFieldCard';
import type { BuilderField, BuilderFieldValue, MoveDirection } from './types';

type FormCanvasPanelProps = {
  fieldErrors: Record<number, string>;
  fieldValues: Record<number, BuilderFieldValue>;
  fields: BuilderField[];
  formName: string;
  isPreview: boolean;
  onAddField: () => void;
  onDuplicateField: (id: number) => void;
  onFieldValueChange: (fieldId: number, value: BuilderFieldValue) => void;
  onMoveField: (id: number, direction: MoveDirection) => void;
  onRemoveField: (id: number) => void;
  onSubmit: () => void;
  onToggleRequired: (id: number) => void;
  onUpdateFieldLabel: (id: number, label: string) => void;
  showLabels: boolean;
  submitStatus: string;
  submitText: string;
};

export function FormCanvasPanel({
  fieldErrors,
  fieldValues,
  fields,
  formName,
  isPreview,
  onAddField,
  onDuplicateField,
  onFieldValueChange,
  onMoveField,
  onRemoveField,
  onSubmit,
  onToggleRequired,
  onUpdateFieldLabel,
  showLabels,
  submitStatus,
  submitText,
}: FormCanvasPanelProps) {
  return (
    <Card>
      <CardHeader
        title={isPreview ? 'Form Preview' : 'Form Canvas'}
        description={isPreview ? 'Test the generated form before exporting.' : 'Arrange fields visually and review the final submission flow.'}
        badge={
          <Button className="gap-2 px-4 py-2 text-sm" onClick={onAddField}>
            <Plus className="h-4 w-4" />
            Add Field
          </Button>
        }
      />
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">{formName || 'Untitled Form'}</h3>
          <p className="text-gray-600 dark:text-gray-400">Please fill out the form below.</p>
        </div>

        {fields.map((field, index) => (
          <CanvasFieldCard
            key={field.id}
            error={fieldErrors[field.id]}
            field={field}
            fieldValue={fieldValues[field.id]}
            canMoveDown={index < fields.length - 1}
            canMoveUp={index > 0}
            showLabel={showLabels}
            isPreview={isPreview}
            onDuplicate={onDuplicateField}
            onFieldValueChange={onFieldValueChange}
            onMove={onMoveField}
            onRemove={onRemoveField}
            onToggleRequired={onToggleRequired}
            onUpdateLabel={onUpdateFieldLabel}
          />
        ))}

        {!isPreview ? (
          <button
            type="button"
            onClick={onAddField}
            className="w-full rounded-lg border-2 border-dashed border-gray-300 p-8 text-gray-500 transition-colors hover:border-green-500 hover:text-green-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-green-400 dark:hover:text-green-400"
          >
            <Plus className="mx-auto mb-2 h-6 w-6" />
            <span>Click to add the selected field type</span>
          </button>
        ) : null}

        <Button className="w-full justify-center" onClick={onSubmit}>
          {submitText || 'Submit'}
        </Button>
        {submitStatus ? (
          <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">{submitStatus}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
