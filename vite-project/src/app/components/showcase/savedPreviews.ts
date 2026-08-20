export const savedPreviewStorageKey = "web5:saved-component-previews";
export const savedPreviewDetailsStorageKey = "web5:saved-component-preview-details";
export const previewCollectionStorageKey = "web5:component-preview-collections";
export const recentPreviewStorageKey = "web5:recent-component-previews";
export const savedPreviewChangeEvent = "web5:saved-preview-change";
export const previewLibraryChangeEvent = "web5:preview-library-change";

export type PreviewAccessTier = "general" | "pro";

export type PreviewCollection = {
  createdAt: number;
  id: string;
  name: string;
};

export type PreviewLibraryEntry = {
  accessTier: PreviewAccessTier;
  collectionId: string;
  description: string;
  id: string;
  path: string;
  savedAt: number;
  title: string;
};

export type RecentPreviewEntry = Omit<PreviewLibraryEntry, "collectionId" | "savedAt"> & {
  viewedAt: number;
};

export const defaultPreviewCollection: PreviewCollection = {
  createdAt: 0,
  id: "default",
  name: "기본 컬렉션",
};

function readJsonArray(storageKey: string): unknown[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function dispatchLibraryChange() {
  window.dispatchEvent(new Event(previewLibraryChangeEvent));
}

export function readSavedPreviewIds() {
  return readJsonArray(savedPreviewStorageKey).filter((id): id is string => typeof id === "string");
}

export function writeSavedPreviewIds(ids: string[]) {
  const uniqueIds = [...new Set(ids)];
  window.localStorage.setItem(savedPreviewStorageKey, JSON.stringify(uniqueIds));
  window.dispatchEvent(new CustomEvent(savedPreviewChangeEvent, { detail: uniqueIds }));
  dispatchLibraryChange();
}

export function readSavedPreviewEntries(): PreviewLibraryEntry[] {
  return readJsonArray(savedPreviewDetailsStorageKey)
    .filter((entry): entry is Record<string, unknown> => Boolean(entry) && typeof entry === "object")
    .filter((entry) => typeof entry.id === "string" && typeof entry.title === "string" && typeof entry.path === "string")
    .map((entry) => ({
      accessTier: (entry.accessTier === "pro" ? "pro" : "general") as PreviewAccessTier,
      collectionId: typeof entry.collectionId === "string" ? entry.collectionId : defaultPreviewCollection.id,
      description: typeof entry.description === "string" ? entry.description : "",
      id: String(entry.id),
      path: String(entry.path),
      savedAt: typeof entry.savedAt === "number" ? entry.savedAt : 0,
      title: String(entry.title),
    }));
}

function writeSavedPreviewEntries(entries: PreviewLibraryEntry[]) {
  window.localStorage.setItem(savedPreviewDetailsStorageKey, JSON.stringify(entries));
  dispatchLibraryChange();
}

export function savePreviewEntry(
  entry: Omit<PreviewLibraryEntry, "collectionId" | "savedAt">,
  collectionId = defaultPreviewCollection.id,
) {
  const currentEntries = readSavedPreviewEntries();
  const existingEntry = currentEntries.find((item) => item.id === entry.id);
  const nextEntry: PreviewLibraryEntry = {
    ...entry,
    collectionId,
    savedAt: existingEntry?.savedAt ?? Date.now(),
  };
  const nextEntries = [nextEntry, ...currentEntries.filter((item) => item.id !== entry.id)];

  writeSavedPreviewEntries(nextEntries);
  writeSavedPreviewIds([...readSavedPreviewIds(), entry.id]);
  return nextEntry;
}

export function hydrateSavedPreviewEntry(entry: Omit<PreviewLibraryEntry, "collectionId" | "savedAt">) {
  if (!readSavedPreviewIds().includes(entry.id)) return;
  if (readSavedPreviewEntries().some((item) => item.id === entry.id)) return;
  savePreviewEntry(entry);
}

export function removeSavedPreviewEntry(previewId: string) {
  writeSavedPreviewEntries(readSavedPreviewEntries().filter((entry) => entry.id !== previewId));
  writeSavedPreviewIds(readSavedPreviewIds().filter((id) => id !== previewId));
}

export function moveSavedPreviewEntry(previewId: string, collectionId: string) {
  writeSavedPreviewEntries(readSavedPreviewEntries().map((entry) => (
    entry.id === previewId ? { ...entry, collectionId } : entry
  )));
}

export function toggleSavedPreviewId(sectionId: string, isSaved: boolean) {
  const savedPreviewIds = readSavedPreviewIds();
  const nextSavedPreviewIds = isSaved
    ? savedPreviewIds.filter((id) => id !== sectionId)
    : [...new Set([...savedPreviewIds, sectionId])];

  writeSavedPreviewIds(nextSavedPreviewIds);
  return nextSavedPreviewIds;
}

export function readPreviewCollections(): PreviewCollection[] {
  const storedCollections = readJsonArray(previewCollectionStorageKey)
    .filter((collection): collection is Record<string, unknown> => Boolean(collection) && typeof collection === "object")
    .filter((collection) => typeof collection.id === "string" && typeof collection.name === "string")
    .map((collection) => ({
      createdAt: typeof collection.createdAt === "number" ? collection.createdAt : 0,
      id: String(collection.id),
      name: String(collection.name),
    }))
    .filter((collection) => collection.id !== defaultPreviewCollection.id);

  return [defaultPreviewCollection, ...storedCollections];
}

function writePreviewCollections(collections: PreviewCollection[]) {
  window.localStorage.setItem(
    previewCollectionStorageKey,
    JSON.stringify(collections.filter((collection) => collection.id !== defaultPreviewCollection.id)),
  );
  dispatchLibraryChange();
}

export function createPreviewCollection(name: string) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error("컬렉션 이름을 입력해주세요.");
  }

  const collection: PreviewCollection = {
    createdAt: Date.now(),
    id: `collection-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    name: trimmedName.slice(0, 30),
  };

  writePreviewCollections([...readPreviewCollections(), collection]);
  return collection;
}

export function deletePreviewCollection(collectionId: string) {
  if (collectionId === defaultPreviewCollection.id) return;

  writeSavedPreviewEntries(readSavedPreviewEntries().map((entry) => (
    entry.collectionId === collectionId
      ? { ...entry, collectionId: defaultPreviewCollection.id }
      : entry
  )));
  writePreviewCollections(readPreviewCollections().filter((collection) => collection.id !== collectionId));
}

export function readRecentPreviews(): RecentPreviewEntry[] {
  return readJsonArray(recentPreviewStorageKey)
    .filter((entry): entry is Record<string, unknown> => Boolean(entry) && typeof entry === "object")
    .filter((entry) => typeof entry.id === "string" && typeof entry.title === "string" && typeof entry.path === "string")
    .map((entry) => ({
      accessTier: (entry.accessTier === "pro" ? "pro" : "general") as PreviewAccessTier,
      description: typeof entry.description === "string" ? entry.description : "",
      id: String(entry.id),
      path: String(entry.path),
      title: String(entry.title),
      viewedAt: typeof entry.viewedAt === "number" ? entry.viewedAt : 0,
    }))
    .sort((firstEntry, secondEntry) => secondEntry.viewedAt - firstEntry.viewedAt);
}

export function recordRecentPreview(entry: Omit<RecentPreviewEntry, "viewedAt">) {
  const nextEntries = [
    { ...entry, viewedAt: Date.now() },
    ...readRecentPreviews().filter((item) => item.id !== entry.id),
  ].slice(0, 20);

  window.localStorage.setItem(recentPreviewStorageKey, JSON.stringify(nextEntries));
  dispatchLibraryChange();
}
