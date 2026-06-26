import { Input } from '../../components/common';
import { useLanguage } from '../../context/LanguageContext';
import { formBuilderCopy } from './copy';
import type { BuilderField, BuilderFieldValue } from './types';

type FieldInputProps = {
  error?: string;
  field: BuilderField;
  onValueChange: (fieldId: number, value: BuilderFieldValue) => void;
  value?: BuilderFieldValue;
};

function stringValue(value: BuilderFieldValue | undefined) {
  return typeof value === 'string' ? value : '';
}

export function FieldInput({
  error,
  field,
  onValueChange,
  value,
}: FieldInputProps) {
  const { language } = useLanguage();
  const text = formBuilderCopy[language].fieldInput;
  const inputClassName = `w-full rounded-lg border bg-white px-3 py-2 text-gray-900 dark:bg-gray-800 dark:text-white ${
    error ? 'border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-950' : 'border-gray-300 dark:border-gray-600'
  }`;

  if (field.type === 'textarea') {
    return (
      <>
        <textarea
          placeholder={text.placeholder(field.label)}
          rows={3}
          value={stringValue(value)}
          onChange={(event) => onValueChange(field.id, event.target.value)}
          className={inputClassName}
        />
        {error ? <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      </>
    );
  }

  if (field.type === 'select') {
    return (
      <>
        <select
          value={stringValue(value)}
          onChange={(event) => onValueChange(field.id, event.target.value)}
          className={inputClassName}
        >
          <option value="">{text.selectOption}</option>
          <option value="Option 1">{text.option1}</option>
          <option value="Option 2">{text.option2}</option>
        </select>
        {error ? <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      </>
    );
  }

  if (field.type === 'checkbox' || field.type === 'radio') {
    return (
      <>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type={field.type}
            name={`field-${field.id}`}
            checked={value === true}
            onChange={(event) => onValueChange(field.id, event.target.checked)}
            className="rounded border-gray-300"
          />
          {field.label}
        </label>
        {error ? <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      </>
    );
  }

  return (
    <>
      <Input
        type={field.type}
        placeholder={text.placeholder(field.label)}
        value={stringValue(value)}
        onChange={(event) => onValueChange(field.id, event.target.value)}
        aria-invalid={Boolean(error)}
        className={error ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-950' : ''}
      />
      {error ? <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
    </>
  );
}
