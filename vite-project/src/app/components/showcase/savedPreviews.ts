export const savedPreviewStorageKey = "web5:saved-component-previews";
export const savedPreviewChangeEvent = "web5:saved-preview-change";

export function readSavedPreviewIds() {
  try {
    return JSON.parse(window.localStorage.getItem(savedPreviewStorageKey) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function writeSavedPreviewIds(ids: string[]) {
  window.localStorage.setItem(savedPreviewStorageKey, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent(savedPreviewChangeEvent, { detail: ids }));
}

export function toggleSavedPreviewId(sectionId: string, isSaved: boolean) {
  const savedPreviewIds = readSavedPreviewIds();
  const nextSavedPreviewIds = isSaved
    ? savedPreviewIds.filter((id) => id !== sectionId)
    : [...new Set([...savedPreviewIds, sectionId])];

  writeSavedPreviewIds(nextSavedPreviewIds);
  return nextSavedPreviewIds;
}
