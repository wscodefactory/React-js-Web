import type { BuilderField, BuilderFieldValue, MoveDirection } from "./types";

export function countRequiredFields(fields: BuilderField[]) {
  return fields.reduce((count, field) => count + (field.required ? 1 : 0), 0);
}

export function getNextFieldId(fields: BuilderField[]) {
  return Math.max(0, ...fields.map((field) => field.id)) + 1;
}

export function duplicateBuilderField(fields: BuilderField[], fieldId: number, copySuffix: string) {
  const sourceIndex = fields.findIndex((field) => field.id === fieldId);

  if (sourceIndex === -1) {
    return fields;
  }

  const source = fields[sourceIndex];
  const duplicate = {
    ...source,
    id: getNextFieldId(fields),
    label: `${source.label} ${copySuffix}`,
  };

  return [
    ...fields.slice(0, sourceIndex + 1),
    duplicate,
    ...fields.slice(sourceIndex + 1),
  ];
}

export function moveBuilderField(fields: BuilderField[], fieldId: number, direction: MoveDirection) {
  const currentIndex = fields.findIndex((field) => field.id === fieldId);
  const nextIndex = currentIndex + direction;

  if (currentIndex === -1 || nextIndex < 0 || nextIndex >= fields.length) {
    return fields;
  }

  const nextFields = [...fields];
  const [field] = nextFields.splice(currentIndex, 1);
  nextFields.splice(nextIndex, 0, field);
  return nextFields;
}

export function removeRecordKey<T>(record: Record<number, T>, key: number) {
  const nextRecord = { ...record };
  delete nextRecord[key];
  return nextRecord;
}

export function hasBuilderFieldValue(field: BuilderField, value: BuilderFieldValue | undefined) {
  if (field.type === "checkbox" || field.type === "radio") {
    return value === true;
  }

  return typeof value === "string" && value.trim().length > 0;
}

export function getSchemaFileName(formName: string) {
  return `${formName.trim().toLowerCase().replace(/[^a-z0-9]+/gi, "-") || "form"}-schema.json`;
}
