import { Code, Eye, Plus, Settings, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, Button, FormField, Input } from '@/app/components/common';
import { MetricGrid } from '@/app/components/showcase/MetricGrid';
import { PageIntro } from '@/app/components/showcase/PageIntro';
import { SelectionGrid } from '@/app/components/showcase/SelectionGrid';
import { formCanvasFields, formFieldTemplates, formMetrics } from '@/app/data/showcase';
import type { FormCanvasField, OptionCardItem } from '@/app/types/showcase';

const fieldTypeItems: OptionCardItem[] = formFieldTemplates.map((field) => ({
  id: field.id,
  label: field.label,
  icon: field.icon,
}));

/**
 * Form builder showcase page.
 * The page now composes reusable panels and typed data instead of embedding one large HTML-like block.
 */
export function FormBuilderPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <PageIntro
        highlight="Form"
        title="Builder"
        description="Create custom forms with drag-and-drop simplicity"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-1">
          <FieldTypePanel />
          <FormSettingsPanel />
          <BuilderActions />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <FormCanvasPanel />
          <MetricGrid items={formMetrics} columnsClassName="grid-cols-3" />
        </div>
      </div>
    </div>
  );
}

function FieldTypePanel() {
  return (
    <Card>
      <CardHeader title="Field Types" description="Reusable controls for your next form." />
      <CardContent>
        <SelectionGrid items={fieldTypeItems} columnsClassName="grid-cols-1" />
      </CardContent>
    </Card>
  );
}

function FormSettingsPanel() {
  return (
    <Card>
      <CardHeader title="Form Settings" description="Configure the base behavior before publishing." />
      <CardContent className="space-y-4">
        <FormField label="Form Name">
          <Input type="text" defaultValue="Contact Form" />
        </FormField>
        <FormField label="Submit Button Text">
          <Input type="text" defaultValue="Submit" />
        </FormField>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input type="checkbox" id="showLabels" defaultChecked className="rounded border-gray-300 dark:border-gray-600" />
          Show field labels
        </label>
      </CardContent>
    </Card>
  );
}

function BuilderActions() {
  return (
    <div className="space-y-2">
      <Button className="w-full justify-center gap-2">
        <Eye className="w-4 h-4" />
        Preview Form
      </Button>
      <Button variant="secondary" className="w-full justify-center gap-2">
        <Code className="w-4 h-4" />
        Export Code
      </Button>
    </div>
  );
}

function FormCanvasPanel() {
  return (
    <Card>
      <CardHeader
        title="Form Canvas"
        description="Arrange fields visually and review the final submission flow."
        badge={
          <Button className="gap-2 px-4 py-2 text-sm">
            <Plus className="w-4 h-4" />
            Add Field
          </Button>
        }
      />
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Contact Form</h3>
          <p className="text-gray-600 dark:text-gray-400">Please fill out the form below.</p>
        </div>

        {formCanvasFields.map((field) => (
          <CanvasFieldCard key={field.id} field={field} />
        ))}

        <button className="w-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 text-gray-500 transition-colors hover:border-green-500 hover:text-green-600 dark:text-gray-400 dark:hover:border-green-400 dark:hover:text-green-400">
          <Plus className="w-6 h-6 mx-auto mb-2" />
          <span>Click or drag a field type here</span>
        </button>

        <Button className="w-full justify-center">Submit</Button>
      </CardContent>
    </Card>
  );
}

function CanvasFieldCard({ field }: { field: FormCanvasField }) {
  return (
    <div className="group rounded-lg border-2 border-dashed border-gray-200 p-4 transition-colors hover:border-green-500 dark:border-gray-700 dark:hover:border-green-400">
      <div className="mb-2 flex items-start justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label}
          {field.required ? <span className="ml-1 text-red-500">*</span> : null}
        </label>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>

      {field.type === 'textarea' ? (
        <textarea
          placeholder={`Enter ${field.label.toLowerCase()}`}
          rows={3}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      ) : (
        <Input type={field.type} placeholder={`Enter ${field.label.toLowerCase()}`} />
      )}
    </div>
  );
}
