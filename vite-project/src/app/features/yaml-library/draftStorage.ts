import { loadStoredJson, saveStoredJson } from "@/app/utils/storage";
import { yamlTemplates } from "./data";
import type { ConverterMode, UploadedYaml, YamlLibraryDraft } from "./types";

const yamlLibraryStorageKey = "web5:yaml-library-draft:v1";

export const fallbackYamlLibraryDraft: YamlLibraryDraft = {
  converterInput: yamlTemplates[0].code,
  converterMode: "yaml-to-json",
  converterOutput: "",
  files: [],
};

function isUploadedYaml(value: unknown): value is UploadedYaml {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<UploadedYaml>;
  return typeof candidate.id === "string"
    && typeof candidate.name === "string"
    && typeof candidate.content === "string";
}

function isConverterMode(value: unknown): value is ConverterMode {
  return value === "yaml-to-json" || value === "json-to-yaml";
}

function isYamlLibraryDraft(value: unknown): value is YamlLibraryDraft {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<YamlLibraryDraft>;
  return (
    typeof candidate.converterInput === "string"
    && isConverterMode(candidate.converterMode)
    && typeof candidate.converterOutput === "string"
    && Array.isArray(candidate.files)
    && candidate.files.every(isUploadedYaml)
  );
}

export function readStoredYamlLibraryDraft() {
  return loadStoredJson(yamlLibraryStorageKey, fallbackYamlLibraryDraft, isYamlLibraryDraft);
}

export function saveYamlLibraryDraft(draft: YamlLibraryDraft) {
  saveStoredJson(yamlLibraryStorageKey, draft);
}
