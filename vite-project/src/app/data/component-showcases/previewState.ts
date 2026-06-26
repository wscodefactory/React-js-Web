import { useEffect, useState } from "react";

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function isStringOption<T extends string>(options: readonly T[], value: unknown): value is T {
  return typeof value === "string" && options.includes(value as T);
}

export function useStoredPreviewState<T>(
  storageKey: string,
  fallbackValue: T,
  isValue: (value: unknown) => value is T,
) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return fallbackValue;
    }

    try {
      const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? "null") as unknown;
      return isValue(parsed) ? parsed : fallbackValue;
    } catch {
      window.localStorage.removeItem(storageKey);
      return fallbackValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  }, [storageKey, value]);

  return [value, setValue] as const;
}
