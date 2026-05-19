import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Code, Copy, Eye, Plus, RotateCcw, Settings, Trash2 } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, FormField, Input } from '@/app/components/common';
import { MetricGrid } from '@/app/components/showcase/MetricGrid';
import { PageIntro } from '@/app/components/showcase/PageIntro';
import { formCanvasFields, formFieldTemplates } from '@/app/data/showcase';
import type { MetricItem } from '@/app/types/showcase';

type BuilderFieldType = 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date';

interface BuilderField {
  id: number;
  label: string;
  type: BuilderFieldType;
  required: boolean;
}

const initialFields: BuilderField[] = formCanvasFields.map((field) => ({
  ...field,
  type: field.type as BuilderFieldType,
}));

const fieldTypeLabels: Record<BuilderFieldType, string> = {
  text: 'Text Input',
  email: 'Email',
  number: 'Number',
  select: 'Dropdown',
  checkbox: 'Checkbox',
  radio: 'Radio',
  textarea: 'Text Area',
  date: 'Date Picker',
};

function fieldTypeFromTemplate(id: string): BuilderFieldType {
  return id as BuilderFieldType;
}

function buildExportCode(formName: string, submitText: string, showLabels: boolean, fields: BuilderField[]) {
  const fieldMarkup = fields.map((field) => {
    const label = showLabels ? `      <label>${field.label}${field.required ? ' *' : ''}</label>\n` : '';
    const required = field.required ? ' required' : '';

    if (field.type === 'textarea') {
      return `${label}      <textarea name="${field.label}"${required} />`;
    }

    if (field.type === 'select') {
      return `${label}      <select name="${field.label}"${required}>
        <option>Option 1</option>
        <option>Option 2</option>
      </select>`;
    }

    if (field.type === 'checkbox' || field.type === 'radio') {
      return `      <label><input type="${field.type}" name="${field.label}"${required} /> ${field.label}</label>`;
    }

    return `${label}      <input type="${field.type}" name="${field.label}"${required} />`;
  }).join('\n\n');

  return `<form aria-label="${formName}">
${fieldMarkup}

      <button type="submit">${submitText}</button>
    </form>`;
}

export function FormBuilderPage() {
  const [formName, setFormName] = useState('Contact Form');
  const [submitText, setSubmitText] = useState('Submit');
  const [showLabels, setShowLabels] = useState(true);
  const [fields, setFields] = useState<BuilderField[]>(initialFields);
  const [selectedType, setSelectedType] = useState<BuilderFieldType>('text');
  const [mode, setMode] = useState<'build' | 'preview' | 'code'>('build');
  const [submitStatus, setSubmitStatus] = useState('');

  const metrics = useMemo<MetricItem[]>(() => [
    { label: 'Total Fields', value: fields.length, accent: 'green' },
    { label: 'Required', value: fields.filter((field) => field.required).length, accent: 'blue' },
    { label: 'Optional', value: fields.filter((field) => !field.required).length, accent: 'gray' },
  ], [fields]);

  const exportCode = useMemo(() => buildExportCode(formName, submitText, showLabels, fields), [fields, formName, showLabels, submitText]);

  const addField = (type = selectedType) => {
    const nextId = Math.max(0, ...fields.map((field) => field.id)) + 1;
    setFields((current) => [
      ...current,
      {
        id: nextId,
        label: fieldTypeLabels[type],
        type,
        required: false,
      },
    ]);
    setSelectedType(type);
    setMode('build');
    setSubmitStatus('');
  };

  const removeField = (id: number) => {
    setFields((current) => current.filter((field) => field.id !== id));
    setSubmitStatus('');
  };

  const duplicateField = (id: number) => {
    setFields((current) => {
      const sourceIndex = current.findIndex((field) => field.id === id);
      if (sourceIndex === -1) return current;

      const source = current[sourceIndex];
      const nextId = Math.max(0, ...current.map((field) => field.id)) + 1;
      const duplicate = {
        ...source,
        id: nextId,
        label: `${source.label} Copy`,
      };

      return [
        ...current.slice(0, sourceIndex + 1),
        duplicate,
        ...current.slice(sourceIndex + 1),
      ];
    });
    setMode('build');
    setSubmitStatus('');
  };

  const moveField = (id: number, direction: -1 | 1) => {
    setFields((current) => {
      const currentIndex = current.findIndex((field) => field.id === id);
      const nextIndex = currentIndex + direction;
      if (currentIndex === -1 || nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const nextFields = [...current];
      const [field] = nextFields.splice(currentIndex, 1);
      nextFields.splice(nextIndex, 0, field);
      return nextFields;
    });
    setSubmitStatus('');
  };

  const resetFields = () => {
    setFields(initialFields);
    setSelectedType('text');
    setMode('build');
    setSubmitStatus('Builder reset to the starter form.');
  };

  const toggleRequired = (id: number) => {
    setFields((current) => current.map((field) => field.id === id ? { ...field, required: !field.required } : field));
  };

  const updateFieldLabel = (id: number, label: string) => {
    setFields((current) => current.map((field) => field.id === id ? { ...field, label } : field));
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      <PageIntro
        highlight="Form"
        title="Builder"
        description="Create custom forms with drag-and-drop simplicity"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <FieldTypePanel selectedType={selectedType} onAddField={addField} onSelectType={setSelectedType} />
          <FormSettingsPanel
            formName={formName}
            submitText={submitText}
            showLabels={showLabels}
            onFormNameChange={setFormName}
            onSubmitTextChange={setSubmitText}
            onShowLabelsChange={setShowLabels}
          />
          <BuilderActions mode={mode} onModeChange={setMode} onReset={resetFields} />
        </div>

        <div className="space-y-6 lg:col-span-2">
          {mode === 'code' ? (
            <ExportCodePanel code={exportCode} />
          ) : (
            <FormCanvasPanel
              fields={fields}
              formName={formName}
              submitText={submitText}
              showLabels={showLabels}
              isPreview={mode === 'preview'}
              submitStatus={submitStatus}
              onAddField={() => addField()}
              onDuplicateField={duplicateField}
              onMoveField={moveField}
              onRemoveField={removeField}
              onSubmit={() => setSubmitStatus(`${formName} submitted with ${fields.length} fields.`)}
              onToggleRequired={toggleRequired}
              onUpdateFieldLabel={updateFieldLabel}
            />
          )}
          <MetricGrid items={metrics} columnsClassName="grid-cols-3" />
        </div>
      </div>
    </div>
  );
}

function FieldTypePanel({
  selectedType,
  onSelectType,
  onAddField,
}: {
  selectedType: BuilderFieldType;
  onSelectType: (type: BuilderFieldType) => void;
  onAddField: (type: BuilderFieldType) => void;
}) {
  return (
    <Card>
      <CardHeader title="Field Types" description="Click a field type to add it to the canvas." />
      <CardContent className="space-y-2">
        {formFieldTemplates.map((field) => {
          const type = fieldTypeFromTemplate(field.id);
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
                <span>{field.icon}</span>
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

function FormSettingsPanel({
  formName,
  submitText,
  showLabels,
  onFormNameChange,
  onSubmitTextChange,
  onShowLabelsChange,
}: {
  formName: string;
  submitText: string;
  showLabels: boolean;
  onFormNameChange: (value: string) => void;
  onSubmitTextChange: (value: string) => void;
  onShowLabelsChange: (value: boolean) => void;
}) {
  return (
    <Card>
      <CardHeader title="Form Settings" description="Configure the base behavior before publishing." />
      <CardContent className="space-y-4">
        <FormField label="Form Name">
          <Input type="text" value={formName} onChange={(event) => onFormNameChange(event.target.value)} />
        </FormField>
        <FormField label="Submit Button Text">
          <Input type="text" value={submitText} onChange={(event) => onSubmitTextChange(event.target.value)} />
        </FormField>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input type="checkbox" checked={showLabels} onChange={(event) => onShowLabelsChange(event.target.checked)} className="rounded border-gray-300 dark:border-gray-600" />
          Show field labels
        </label>
      </CardContent>
    </Card>
  );
}

function BuilderActions({
  mode,
  onModeChange,
  onReset,
}: {
  mode: 'build' | 'preview' | 'code';
  onModeChange: (mode: 'build' | 'preview' | 'code') => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-2">
      <Button variant={mode === 'preview' ? 'primary' : 'secondary'} className="w-full justify-center gap-2" onClick={() => onModeChange(mode === 'preview' ? 'build' : 'preview')}>
        <Eye className="h-4 w-4" />
        {mode === 'preview' ? 'Edit Form' : 'Preview Form'}
      </Button>
      <Button variant={mode === 'code' ? 'primary' : 'secondary'} className="w-full justify-center gap-2" onClick={() => onModeChange(mode === 'code' ? 'build' : 'code')}>
        <Code className="h-4 w-4" />
        {mode === 'code' ? 'Back to Builder' : 'Export Code'}
      </Button>
      <Button variant="secondary" className="w-full justify-center gap-2" onClick={onReset}>
        <RotateCcw className="h-4 w-4" />
        Reset Builder
      </Button>
    </div>
  );
}

function FormCanvasPanel({
  fields,
  formName,
  submitText,
  showLabels,
  isPreview,
  submitStatus,
  onAddField,
  onDuplicateField,
  onMoveField,
  onRemoveField,
  onSubmit,
  onToggleRequired,
  onUpdateFieldLabel,
}: {
  fields: BuilderField[];
  formName: string;
  submitText: string;
  showLabels: boolean;
  isPreview: boolean;
  submitStatus: string;
  onAddField: () => void;
  onDuplicateField: (id: number) => void;
  onMoveField: (id: number, direction: -1 | 1) => void;
  onRemoveField: (id: number) => void;
  onSubmit: () => void;
  onToggleRequired: (id: number) => void;
  onUpdateFieldLabel: (id: number, label: string) => void;
}) {
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
            field={field}
            canMoveDown={index < fields.length - 1}
            canMoveUp={index > 0}
            showLabel={showLabels}
            isPreview={isPreview}
            onDuplicate={onDuplicateField}
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

        <Button className="w-full justify-center" onClick={onSubmit}>{submitText || 'Submit'}</Button>
        {submitStatus ? <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">{submitStatus}</p> : null}
      </CardContent>
    </Card>
  );
}

function CanvasFieldCard({
  field,
  canMoveDown,
  canMoveUp,
  showLabel,
  isPreview,
  onDuplicate,
  onMove,
  onRemove,
  onToggleRequired,
  onUpdateLabel,
}: {
  field: BuilderField;
  canMoveDown: boolean;
  canMoveUp: boolean;
  showLabel: boolean;
  isPreview: boolean;
  onDuplicate: (id: number) => void;
  onMove: (id: number, direction: -1 | 1) => void;
  onRemove: (id: number) => void;
  onToggleRequired: (id: number) => void;
  onUpdateLabel: (id: number, label: string) => void;
}) {
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

function FieldInput({ field }: { field: BuilderField }) {
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

function ExportCodePanel({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <Card>
      <CardHeader
        title="Export Code"
        description="Generated HTML-style form markup based on the current builder state."
        badge={<Button variant="secondary" onClick={copyCode}>{copied ? 'Copied' : 'Copy Code'}</Button>}
      />
      <CardContent>
        <pre className="max-h-[520px] overflow-auto rounded-xl bg-gray-950 p-4 text-sm text-gray-100"><code>{code}</code></pre>
      </CardContent>
    </Card>
  );
}
