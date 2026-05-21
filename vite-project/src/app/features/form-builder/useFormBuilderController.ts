import { useMemo, useState } from 'react';
import { fieldTypeLabels, initialFields } from './data';
import { buildExportCode } from './exportCode';
import type { MetricItem } from '../../types/showcase';
import type { BuilderField, BuilderFieldType, BuilderMode, MoveDirection } from './types';

export function useFormBuilderController() {
  const [formName, setFormName] = useState('Contact Form');
  const [submitText, setSubmitText] = useState('Submit');
  const [showLabels, setShowLabels] = useState(true);
  const [fields, setFields] = useState<BuilderField[]>(initialFields);
  const [selectedType, setSelectedType] = useState<BuilderFieldType>('text');
  const [mode, setMode] = useState<BuilderMode>('build');
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
    setSelectedType('text');
    setMode('build');
    setSubmitStatus('Builder reset to the starter form.');
  };

  const toggleRequired = (id: number) => {
    setFields((current) => current.map((field) => (field.id === id ? { ...field, required: !field.required } : field)));
  };

  const updateFieldLabel = (id: number, label: string) => {
    setFields((current) => current.map((field) => (field.id === id ? { ...field, label } : field)));
  };

  const submitForm = () => {
    setSubmitStatus(`${formName} submitted with ${fields.length} fields.`);
  };

  return {
    addField,
    duplicateField,
    exportCode,
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
  };
}
