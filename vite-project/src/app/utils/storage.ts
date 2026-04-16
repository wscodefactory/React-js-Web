export function loadStoredList<T>(storageKey: string, isItem: (value: unknown) => value is T): T[] {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.removeItem(storageKey);
      return [];
    }

    const items = parsed.filter(isItem);
    if (items.length !== parsed.length) {
      localStorage.removeItem(storageKey);
      return [];
    }

    return items;
  } catch {
    localStorage.removeItem(storageKey);
    return [];
  }
}

export function saveStoredList<T>(storageKey: string, items: T[]): void {
  localStorage.setItem(storageKey, JSON.stringify(items));
}
