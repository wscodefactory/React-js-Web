export function loadStoredList<T>(storageKey: string, isValidItem: (value: unknown) => value is T): T[] {
  return loadStoredJson<T[]>(storageKey, [], (value): value is T[] => (
    Array.isArray(value) && value.every(isValidItem)
  ));
}

export function saveStoredList<T>(storageKey: string, items: T[]): void {
  saveStoredJson(storageKey, items);
}

export function loadStoredJson<T>(storageKey: string, fallbackValue: T, isValidValue: (value: unknown) => value is T): T {
  if (typeof window === 'undefined') {
    return fallbackValue;
  }

  try {
    const storedJson = localStorage.getItem(storageKey);
    if (!storedJson) {
      return fallbackValue;
    }

    const parsedValue: unknown = JSON.parse(storedJson);
    if (!isValidValue(parsedValue)) {
      removeStoredValue(storageKey);
      return fallbackValue;
    }

    return parsedValue;
  } catch {
    removeStoredValue(storageKey);
    return fallbackValue;
  }
}

export function saveStoredJson<T>(storageKey: string, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // Browsers can block localStorage in private mode or when quota is exceeded.
  }
}

export function removeStoredValue(storageKey: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(storageKey);
  } catch {
    // Keep callers resilient when storage access is unavailable.
  }
}
