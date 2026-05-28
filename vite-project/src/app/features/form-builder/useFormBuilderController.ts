import { useEffect, useMemo, useState } from 'react';
import { fieldTypeLabels, initialFields } from './data';
import { buildExportCode } from './exportCode';
import type { MetricItem } from '../../types/showcase';
import type { BuilderField, BuilderFieldType, BuilderFieldValue, BuilderMode, FormBuilderDraft, MoveDirection } from './types';

const formBuilderDraftStorageKey = 'web5:form-builder-draft:v1';

const fallbackDraft: FormBuilderDraft = {
  fields: initialFields,
  formName: 'Contact Form',
  showLabels: true,
  submitText: 'Submit',
};

function isBuilderField(value: unknown): value is BuilderField {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<BuilderField>;
  return (
    typeof candidate.id === 'number'
    && typeof candidate.label === 'string'
    && typeof candidate.required === 'boolean'
    && Boolean(candidate.type)
    && Object.keys(fieldTypeLabels).includes(candidate.type as BuilderFieldType)
  );
}

function isFormBuilderDraft(value: unknown): value is FormBuilderDraft {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<FormBuilderDraft>;
  return (
    typeof candidate.formName === 'string'
    && typeof candidate.submitText === 'string'
    && typeof candidate.showLabels === 'boolean'
    && Array.isArray(candidate.fields)
    && candidate.fields.every(isBuilderField)
  );
}

function readStoredDraft() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(formBuilderDraftStorageKey) ?? 'null');
    return isFormBuilderDraft(parsed) ? parsed : fallbackDraft;
  } catch {
    return fallbackDraft;
  }
}

function downloadText(content: string, fileName: string) {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function useFormBuilderController() {
  const [draftStatus, setDraftStatus] = useState('Draft is autosaved locally.');
  const [storedDraft] = useState(() => readStoredDraft());
  const [formName, setFormName] = useState(storedDraft.formName);
  const [submitText, setSubmitText] = useState(storedDraft.submitText);
  const [showLabels, setShowLabels] = useState(storedDraft.showLabels);
  const [fields, setFields] = useState<BuilderField[]>(storedDraft.fields);
  const [fieldValues, setFieldValues] = useState<Record<number, BuilderFieldValue>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<number, string>>({});
  const [selectedType, setSelectedType] = useState<BuilderFieldType>('text');
  const [mode, setMode] = useState<BuilderMode>('build');
  const [submitStatus, setSubmitStatus] = useState('');

  const metrics = useMemo<MetricItem[]>(() => [
    { label: 'Total Fields', value: fields.length, accent: 'green' },
    { label: 'Required', value: fields.filter((field) => field.required).length, accent: 'blue' },
    { label: 'Optional', value: fields.filter((field) => !field.required).length, accent: 'gray' },
  ], [fields]);

  const exportCode = useMemo(() => buildExportCode(formName, submitText, showLabels, fields), [fields, formName, showLabels, submitText]);
  const exportSchema = useMemo(() => JSON.stringify({
    formName,
    submitText,
    showLabels,
    fields,
  }, null, 2), [fields, formName, showLabels, submitText]);

  useEffect(() => {
    window.localStorage.setItem(formBuilderDraftStorageKey, exportSchema);
  }, [exportSchema]);

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
    setFieldValues((current) => {
      const nextValues = { ...current };
      delete nextValues[id];
      return nextValues;
    });
    setFieldErrors((current) => {
      const nextErrors = { ...current };
      delete nextErrors[id];
      return nextErrors;
    });
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

  const moveField = (id: number, direction: MoveDirection) => {
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
    setFieldValues({});
    setFieldErrors({});
    setFormName(fallbackDraft.formName);
    setShowLabels(fallbackDraft.showLabels);
    setSubmitText(fallbackDraft.submitText);
    setSelectedType('text');
    setMode('build');
    setSubmitStatus('Builder reset to the starter form.');
    setDraftStatus('Starter form saved as the current draft.');
  };

  const toggleRequired = (id: number) => {
    setFields((current) => current.map((field) => (field.id === id ? { ...field, required: !field.required } : field)));
    setFieldErrors((current) => {
      const nextErrors = { ...current };
      delete nextErrors[id];
      return nextErrors;
    });
  };

  const updateFieldLabel = (id: number, label: string) => {
    setFields((current) => current.map((field) => (field.id === id ? { ...field, label } : field)));
  };

  const updateFieldValue = (fieldId: number, value: BuilderFieldValue) => {
    setFieldValues((current) => ({ ...current, [fieldId]: value }));
    setFieldErrors((current) => {
      const nextErrors = { ...current };
      delete nextErrors[fieldId];
      return nextErrors;
    });
    setSubmitStatus('');
  };

  const validateRequiredFields = () => {
    const nextErrors = fields.reduce<Record<number, string>>((errors, field) => {
      if (!field.required) {
        return errors;
      }

      const value = fieldValues[field.id];
      const hasValue = field.type === 'checkbox' || field.type === 'radio'
        ? value === true
        : typeof value === 'string' && value.trim().length > 0;

      if (!hasValue) {
        errors[field.id] = `${field.label} is required.`;
      }

      return errors;
    }, {});

    setFieldErrors(nextErrors);
    return nextErrors;
  };

  const submitForm = () => {
    const errors = validateRequiredFields();
    const errorCount = Object.keys(errors).length;

    if (errorCount > 0) {
      setMode('preview');
      setSubmitStatus(`Complete ${errorCount} required field${errorCount === 1 ? '' : 's'} before submitting.`);
      return;
    }

    const responseCount = fields.filter((field) => {
      const value = fieldValues[field.id];
      return field.type === 'checkbox' || field.type === 'radio'
        ? value === true
        : typeof value === 'string' && value.trim().length > 0;
    }).length;

    setSubmitStatus(`${formName || 'Untitled Form'} submitted with ${responseCount} responses.`);
  };

  const downloadSchema = () => {
    downloadText(exportSchema, `${formName.trim().toLowerCase().replace(/[^a-z0-9]+/gi, '-') || 'form'}-schema.json`);
    setDraftStatus('Form schema queued for download.');
  };

  return {
    addField,
    duplicateField,
    downloadSchema,
    draftStatus,
    exportCode,
    exportSchema,
    fieldErrors,
    fieldValues,
    fields,
    formName,
    metrics,
    mode,
    moveField,
    removeField,
    resetFields,
    selectedType,
    setFormName,
    setMode,
    setSelectedType,
    setShowLabels,
    setSubmitText,
    showLabels,
    submitForm,
    submitStatus,
    submitText,
    toggleRequired,
    updateFieldLabel,
    updateFieldValue,
  };
}
