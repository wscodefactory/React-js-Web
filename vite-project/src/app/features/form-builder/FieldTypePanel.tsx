import type { ComponentType } from 'react';
import {
  AlignLeft,
  CalendarDays,
  CheckSquare,
  CircleDot,
  Hash,
  ListChecks,
  Mail,
  Plus,
  Type,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/common';
import { formFieldTemplates } from '../../data/showcase';
import { fieldTypeFromTemplate } from './data';
import type { BuilderFieldType } from './types';

const fieldTypeIcons: Record<BuilderFieldType, ComponentType<{ className?: string }>> = {
  checkbox: CheckSquare,
  date: CalendarDays,
  email: Mail,
  number: Hash,
  radio: CircleDot,
  select: ListChecks,
  text: Type,
  textarea: AlignLeft,
};

type FieldTypePanelProps = {
  onAddField: (type: BuilderFieldType) => void;
  onSelectType: (type: BuilderFieldType) => void;
  selectedType: BuilderFieldType;
};

export function FieldTypePanel({
  onAddField,
  onSelectType,
  selectedType,
}: FieldTypePanelProps) {
  return (
    <Card>
      <CardHeader title="Field Types" description="Click a field type to add it to the canvas." />
      <CardContent className="space-y-2">
        {formFieldTemplates.map((field) => {
          const type = fieldTypeFromTemplate(field.id);
          const Icon = fieldTypeIcons[type];
          const isSelected = selectedType === type;

          return (
            <button
              key={field.id}
              type="button"
              onClick={() => {
                onSelectType(type);
                onAddField(type);
              }}
              className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition ${
                isSelected
                  ? 'border-green-500 bg-green-50 text-green-700 dark:border-green-400 dark:bg-green-900/20 dark:text-green-300'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{field.label}</span>
              </span>
              <Plus className="h-4 w-4" />
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
