import type { FormCanvasField, FormFieldTemplate, MetricItem } from '@/app/types/showcase';

export const formFieldTemplates: FormFieldTemplate[] = [
  { id: 'text', label: 'Text Input', icon: '📝' },
  { id: 'email', label: 'Email', icon: '📧' },
  { id: 'number', label: 'Number', icon: '🔢' },
  { id: 'select', label: 'Dropdown', icon: '⬇️' },
  { id: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { id: 'radio', label: 'Radio', icon: '🔘' },
  { id: 'textarea', label: 'Text Area', icon: '📄' },
  { id: 'date', label: 'Date Picker', icon: '📅' },
];

export const formCanvasFields: FormCanvasField[] = [
  { id: 1, label: 'Full Name', type: 'text', required: true },
  { id: 2, label: 'Email Address', type: 'email', required: true },
  { id: 3, label: 'Project Details', type: 'textarea', required: false },
];

export const formMetrics: MetricItem[] = [
  { label: 'Total Fields', value: formCanvasFields.length, accent: 'green' },
  { label: 'Required', value: formCanvasFields.filter((field) => field.required).length, accent: 'blue' },
  { label: 'Optional', value: formCanvasFields.filter((field) => !field.required).length, accent: 'gray' },
];
