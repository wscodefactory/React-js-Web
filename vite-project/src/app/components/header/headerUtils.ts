export function isPathActive(currentPath: string, path: string) {
  return path === "/" ? currentPath === "/" : currentPath === path || currentPath.startsWith(`${path}/`);
}
