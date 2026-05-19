import { Input } from '../../components/common';
import type { BuilderField } from './types';

type FieldInputProps = {
  field: BuilderField;
};

export function FieldInput({ field }: FieldInputProps) {
  if (field.type === 'textarea') {
    return (
      <textarea
        placeholder={`Enter ${field.label.toLowerCase()}`}
        rows={3}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      />
    );
  }

  if (field.type === 'select') {
    return (
      <select className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
        <option>Select an option</option>
        <option>Option 1</option>
        <option>Option 2</option>
      </select>
    );
  }

  if (field.type === 'checkbox' || field.type === 'radio') {
    return (
      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input type={field.type} name={`field-${field.id}`} className="rounded border-gray-300" />
        {field.label}
      </label>
    );
  }

  return <Input type={field.type} placeholder={`Enter ${field.label.toLowerCase()}`} />;
}
