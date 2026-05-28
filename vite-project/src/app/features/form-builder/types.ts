export type BuilderFieldType = 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date';
export type BuilderMode = 'build' | 'preview' | 'code';
export type MoveDirection = -1 | 1;
export type BuilderFieldValue = boolean | string;

export type BuilderField = {
  id: number;
  label: string;
  type: BuilderFieldType;
  required: boolean;
};

export type FormBuilderDraft = {
  fields: BuilderField[];
  formName: string;
  showLabels: boolean;
  submitText: string;
};
