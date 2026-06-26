export function clampSearchIndex(index: number, length: number) {
  if (length === 0) {
    return -1;
  }

  if (index < 0) {
    return length - 1;
  }

  if (index >= length) {
    return 0;
  }

  return index;
}
