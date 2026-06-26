import { loadStoredList, saveStoredList } from "@/app/utils/storage";
import { supportedPlatforms } from "./data";
import type { ImportedSource } from "./types";

const importHistoryStorageKey = "web5:mcp-import-history:v1";

function isImportedSource(value: unknown): value is ImportedSource {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Partial<ImportedSource>;
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.host === "string" &&
    typeof item.protocol === "string" &&
    typeof item.url === "string" &&
    typeof item.importedAt === "string" &&
    supportedPlatforms.some((platform) => platform.id === item.platform)
  );
}

export function readStoredImportHistory() {
  return loadStoredList(importHistoryStorageKey, isImportedSource);
}

export function saveStoredImportHistory(importHistory: ImportedSource[]) {
  saveStoredList(importHistoryStorageKey, importHistory);
}
