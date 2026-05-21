type ParsedYamlLine = {
  indent: number;
  text: string;
};

export function getLineCount(value: string) {
  return value.split('\n').length;
}

function parseScalar(value: string) {
  const trimmed = value.trim();

  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed === 'null') return null;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);

  return trimmed.replace(/^["']|["']$/g, '');
}

function splitYamlKeyValue(value: string) {
  const separatorIndex = value.indexOf(':');

  if (separatorIndex === -1) return [value.trim(), ''] as const;

  return [value.slice(0, separatorIndex).trim(), value.slice(separatorIndex + 1).trim()] as const;
}

function parseYamlBlock(lines: ParsedYamlLine[], startIndex: number, indent: number): [unknown, number] {
  const firstLine = lines[startIndex];
  const isArray = firstLine?.indent === indent && firstLine.text.startsWith('- ');

  if (isArray) {
    const result: unknown[] = [];
    let index = startIndex;

    while (index < lines.length && lines[index].indent === indent && lines[index].text.startsWith('- ')) {
      const itemText = lines[index].text.slice(2).trim();

      if (!itemText) {
        const [nested, nextIndex] = parseYamlBlock(lines, index + 1, indent + 2);
        result.push(nested);
        index = nextIndex;
        continue;
      }

      if (itemText.includes(':')) {
        const [key, rawValue] = splitYamlKeyValue(itemText);
        const item: Record<string, unknown> = { [key]: rawValue ? parseScalar(rawValue) : {} };
        index += 1;

        if (index < lines.length && lines[index].indent > indent) {
          const [nested, nextIndex] = parseYamlBlock(lines, index, indent + 2);

          if (typeof nested === 'object' && nested && !Array.isArray(nested)) {
            Object.assign(item, nested);
          }

          index = nextIndex;
        }

        result.push(item);
        continue;
      }

      result.push(parseScalar(itemText));
      index += 1;
    }

    return [result, index];
  }

  const result: Record<string, unknown> = {};
  let index = startIndex;

  while (index < lines.length && lines[index].indent >= indent) {
    const line = lines[index];

    if (line.indent > indent || line.text.startsWith('- ')) break;

    const [key, rawValue] = splitYamlKeyValue(line.text);

    if (!key) {
      index += 1;
      continue;
    }

    if (rawValue) {
      result[key] = parseScalar(rawValue);
      index += 1;
      continue;
    }

    if (index + 1 < lines.length && lines[index + 1].indent > indent) {
      const [nested, nextIndex] = parseYamlBlock(lines, index + 1, lines[index + 1].indent);
      result[key] = nested;
      index = nextIndex;
    } else {
      result[key] = {};
      index += 1;
    }
  }

  return [result, index];
}

export function yamlToJson(input: string) {
  const lines = input
    .split('\n')
    .map((line) => ({ indent: line.match(/^\s*/)?.[0].length ?? 0, text: line.trim() }))
    .filter((line) => line.text && !line.text.startsWith('#'));

  if (lines.length === 0) {
    throw new Error('Add YAML content before converting.');
  }

  const [parsed] = parseYamlBlock(lines, 0, lines[0].indent);

  return JSON.stringify(parsed, null, 2);
}

function shouldQuoteYamlString(value: string) {
  return value.includes(':') || value.includes('#') || value.includes('\n') || value.trim() !== value;
}

function formatYamlScalar(value: unknown) {
  if (typeof value === 'string') {
    return shouldQuoteYamlString(value) ? JSON.stringify(value) : value;
  }

  return String(value);
}

export function jsonToYaml(value: unknown, indent = 0): string {
  const space = ' '.repeat(indent);

  if (Array.isArray(value)) {
    return value.map((item) => {
      if (item && typeof item === 'object') {
        return `${space}-\n${jsonToYaml(item, indent + 2)}`;
      }

      return `${space}- ${formatYamlScalar(item)}`;
    }).join('\n');
  }

  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).map(([key, entry]) => {
      if (entry && typeof entry === 'object') {
        return `${space}${key}:\n${jsonToYaml(entry, indent + 2)}`;
      }

      return `${space}${key}: ${formatYamlScalar(entry)}`;
    }).join('\n');
  }

  return `${space}${formatYamlScalar(value)}`;
}
