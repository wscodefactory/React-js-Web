import { formCanvasFields } from '../../data/showcase';
import type { BuilderField, BuilderFieldType } from './types';

export const initialFields: BuilderField[] = formCanvasFields.map((field) => ({
  ...field,
  type: field.type as BuilderFieldType,
}));

export const fieldTypeLabels: Record<BuilderFieldType, string> = {
  text: 'Text Input',
  email: 'Email',
  number: 'Number',
  select: 'Dropdown',
  checkbox: 'Checkbox',
  radio: 'Radio',
  textarea: 'Text Area',
  date: 'Date Picker',
};

export function fieldTypeFromTemplate(id: string): BuilderFieldType {
  return id as BuilderFieldType;
}
