export type BuilderFieldType = 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date';
export type BuilderMode = 'build' | 'preview' | 'code';
export type MoveDirection = -1 | 1;

export type BuilderField = {
  id: number;
  label: string;
  type: BuilderFieldType;
  required: boolean;
};
