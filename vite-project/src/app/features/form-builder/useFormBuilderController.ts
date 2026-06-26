import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import type { MetricItem } from "../../types/showcase";
import { buildExportCode } from "./exportCode";
import { formBuilderCopy, getFormBuilderFieldTypeLabel } from "./copy";
import { createFallbackDraft, readStoredFormBuilderDraft, saveFormBuilderDraft } from "./draftStorage";
import {
  countRequiredFields,
  duplicateBuilderField,
  getNextFieldId,
  getSchemaFileName,
  hasBuilderFieldValue,
  moveBuilderField,
  removeRecordKey,
} from "./fieldUtils";
import { downloadSchemaJson } from "./schemaExport";
import type { BuilderField, BuilderFieldType, BuilderFieldValue, BuilderMode, MoveDirection } from "./types";

export function useFormBuilderController() {
  const { language } = useLanguage();
  const text = formBuilderCopy[language];
  const fallbackDraft = useMemo(() => createFallbackDraft(language), [language]);
  const [draftStatus, setDraftStatus] = useState(text.status.autosaved);
  const [storedDraft] = useState(() => readStoredFormBuilderDraft(fallbackDraft));
  const [formName, setFormName] = useState(storedDraft.formName);
  const [submitText, setSubmitText] = useState(storedDraft.submitText);
  const [showLabels, setShowLabels] = useState(storedDraft.showLabels);
  const [fields, setFields] = useState<BuilderField[]>(storedDraft.fields);
  const [fieldValues, setFieldValues] = useState<Record<number, BuilderFieldValue>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<number, string>>({});
  const [selectedType, setSelectedType] = useState<BuilderFieldType>("text");
  const [mode, setMode] = useState<BuilderMode>("build");
  const [submitStatus, setSubmitStatus] = useState("");

  const metrics = useMemo<MetricItem[]>(() => {
    const requiredFieldCount = countRequiredFields(fields);

    return [
      { label: text.metrics.total, value: fields.length, accent: "green" },
      { label: text.metrics.required, value: requiredFieldCount, accent: "blue" },
      { label: text.metrics.optional, value: fields.length - requiredFieldCount, accent: "gray" },
    ];
  }, [fields, text.metrics.optional, text.metrics.required, text.metrics.total]);

  const exportCode = useMemo(() => buildExportCode(formName, submitText, showLabels, fields), [fields, formName, showLabels, submitText]);
  const exportSchema = useMemo(() => JSON.stringify({
    fields,
    formName,
    showLabels,
    submitText,
  }, null, 2), [fields, formName, showLabels, submitText]);

  useEffect(() => {
    saveFormBuilderDraft({ fields, formName, showLabels, submitText });
  }, [fields, formName, showLabels, submitText]);

  const addField = (type = selectedType) => {
    const nextId = getNextFieldId(fields);

    setFields((current) => [
      ...current,
      {
        id: nextId,
        label: getFormBuilderFieldTypeLabel(language, type),
        required: false,
        type,
      },
    ]);
    setSelectedType(type);
    setMode("build");
    setSubmitStatus("");
  };

  const removeField = (id: number) => {
    setFields((current) => current.filter((field) => field.id !== id));
    setFieldValues((current) => removeRecordKey(current, id));
    setFieldErrors((current) => removeRecordKey(current, id));
    setSubmitStatus("");
  };

  const duplicateField = (id: number) => {
    setFields((current) => duplicateBuilderField(current, id, language === "ko" ? "복사본" : "Copy"));
    setMode("build");
    setSubmitStatus("");
  };

  const moveField = (id: number, direction: MoveDirection) => {
    setFields((current) => moveBuilderField(current, id, direction));
    setSubmitStatus("");
  };

  const resetFields = () => {
    setFields(fallbackDraft.fields);
    setFieldValues({});
    setFieldErrors({});
    setFormName(fallbackDraft.formName);
    setShowLabels(fallbackDraft.showLabels);
    setSubmitText(fallbackDraft.submitText);
    setSelectedType("text");
    setMode("build");
    setSubmitStatus(text.status.reset);
    setDraftStatus(text.status.draftSaved);
  };

  const toggleRequired = (id: number) => {
    setFields((current) => current.map((field) => (field.id === id ? { ...field, required: !field.required } : field)));
    setFieldErrors((current) => removeRecordKey(current, id));
  };

  const updateFieldLabel = (id: number, label: string) => {
    setFields((current) => current.map((field) => (field.id === id ? { ...field, label } : field)));
  };

  const updateFieldValue = (fieldId: number, value: BuilderFieldValue) => {
    setFieldValues((current) => ({ ...current, [fieldId]: value }));
    setFieldErrors((current) => removeRecordKey(current, fieldId));
    setSubmitStatus("");
  };

  const validateRequiredFields = () => {
    const nextErrors = fields.reduce<Record<number, string>>((errors, field) => {
      if (field.required && !hasBuilderFieldValue(field, fieldValues[field.id])) {
        errors[field.id] = text.status.required(field.label);
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
      setMode("preview");
      setSubmitStatus(text.status.submitBlocked(errorCount));
      return;
    }

    let responseCount = 0;

    for (const field of fields) {
      if (hasBuilderFieldValue(field, fieldValues[field.id])) {
        responseCount += 1;
      }
    }

    setSubmitStatus(text.status.submitted(formName || text.canvas.untitled, responseCount));
  };

  const downloadSchema = () => {
    downloadSchemaJson(exportSchema, getSchemaFileName(formName));
    setDraftStatus(text.status.schemaReady);
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
