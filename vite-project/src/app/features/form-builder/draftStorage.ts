import type { AppLanguage } from "@/app/context/LanguageContext";
import { loadStoredJson, saveStoredJson } from "@/app/utils/storage";
import { formBuilderCopy, getStarterFields } from "./copy";
import { fieldTypeLabels, initialFields } from "./data";
import type { BuilderField, BuilderFieldType, FormBuilderDraft } from "./types";

const formBuilderDraftStorageKey = "web5:form-builder-draft:v1";

export function createFallbackDraft(language: AppLanguage): FormBuilderDraft {
  const text = formBuilderCopy[language];

  return {
    fields: getStarterFields(language, initialFields),
    formName: text.starter.formName,
    showLabels: true,
    submitText: text.starter.submitText,
  };
}

function isBuilderField(value: unknown): value is BuilderField {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<BuilderField>;
  return (
    typeof candidate.id === "number"
    && typeof candidate.label === "string"
    && typeof candidate.required === "boolean"
    && Boolean(candidate.type)
    && Object.keys(fieldTypeLabels).includes(candidate.type as BuilderFieldType)
  );
}

function isFormBuilderDraft(value: unknown): value is FormBuilderDraft {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<FormBuilderDraft>;
  return (
    typeof candidate.formName === "string"
    && typeof candidate.submitText === "string"
    && typeof candidate.showLabels === "boolean"
    && Array.isArray(candidate.fields)
    && candidate.fields.every(isBuilderField)
  );
}

export function readStoredFormBuilderDraft(fallbackDraft: FormBuilderDraft) {
  return loadStoredJson(formBuilderDraftStorageKey, fallbackDraft, isFormBuilderDraft);
}

export function saveFormBuilderDraft(draft: FormBuilderDraft) {
  saveStoredJson(formBuilderDraftStorageKey, draft);
}
