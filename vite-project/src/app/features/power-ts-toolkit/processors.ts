import { convertPowerFx } from './powerFx';
import type { ConversionTarget, QuickToolValue, ToolProcessResult } from './types';

function parseKeyValueEntries(input: string) {
  return input.split('\n').reduce<Record<string, string>>((result, line) => {
    const [key, ...rest] = line.split('=');
    if (!key || rest.length === 0) {
      return result;
    }

    result[key.trim()] = rest.join('=').trim();
    return result;
  }, {});
}

function toEnvKey(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase();
}

function generateCommand(input: string): ToolProcessResult {
  const entries = parseKeyValueEntries(input);
  const rawCommand = entries.command || input.split('\n').find((line) => line.trim() && !line.includes('='))?.trim();

  if (!rawCommand) {
    return { status: 'No command found.', output: 'Add command=vite build or paste a shell command.' };
  }

  const task = entries.task || 'task';
  const packageManager = entries.packageManager || 'npm';
  const scripts: Record<string, string> = { [task]: rawCommand };

  if (entries.watch === 'true') {
    scripts[`${task}:watch`] = `${rawCommand} --watch`;
  }

  return {
    status: `Generated ${Object.keys(scripts).length} script${Object.keys(scripts).length === 1 ? '' : 's'} for ${packageManager}.`,
    output: [
      JSON.stringify({ scripts }, null, 2),
      '',
      `Run: ${packageManager} run ${task}`,
      entries.watch === 'true' ? `Watch: ${packageManager} run ${task}:watch` : '',
    ].filter(Boolean).join('\n'),
  };
}

function buildConfig(input: string): ToolProcessResult {
  const entries = parseKeyValueEntries(input);

  if (Object.keys(entries).length === 0) {
    return { status: 'No config pairs found.', output: 'Try input like: appName=Power Tools' };
  }

  const envBlock = Object.entries(entries)
    .map(([key, value]) => `${toEnvKey(key)}=${value}`)
    .join('\n');
  const typedConfig = `export const appConfig = ${JSON.stringify(entries, null, 2)} as const;`;

  return {
    status: `Built config from ${Object.keys(entries).length} setting${Object.keys(entries).length === 1 ? '' : 's'}.`,
    output: ['# .env', envBlock, '', '// config.ts', typedConfig].join('\n'),
  };
}

function analyzePerformance(input: string): ToolProcessResult {
  const lines = input.split('\n').filter((line) => line.trim());
  const consoleCount = (input.match(/console\./g) ?? []).length;
  const loopCount = (input.match(/\b(for|while)\s*\(|\.map\(|\.filter\(|\.reduce\(/g) ?? []).length;
  const fetchCount = (input.match(/\bfetch\(|axios\.|useEffect\(/g) ?? []).length;
  const memoSignals = (input.match(/useMemo\(|useCallback\(|React\.memo/g) ?? []).length;
  const suggestions = [
    lines.length > 80 ? 'Split long snippets before profiling user-facing renders.' : '',
    consoleCount > 0 ? 'Remove console calls from production paths.' : '',
    loopCount > 2 && memoSignals === 0 ? 'Memoize expensive derived collections when inputs are stable.' : '',
    fetchCount > 0 ? 'Check request cancellation and loading states around async effects.' : '',
  ].filter(Boolean);

  return {
    status: `Analyzed ${lines.length} code line${lines.length === 1 ? '' : 's'} with ${suggestions.length} recommendation${suggestions.length === 1 ? '' : 's'}.`,
    output: [
      'Performance scan',
      `- Lines: ${lines.length}`,
      `- Console calls: ${consoleCount}`,
      `- Loop/collection passes: ${loopCount}`,
      `- Async/effect signals: ${fetchCount}`,
      `- Memoization signals: ${memoSignals}`,
      '',
      'Recommendations',
      ...(suggestions.length > 0 ? suggestions.map((item) => `- ${item}`) : ['- No obvious hot spots found in this snippet.']),
    ].join('\n'),
  };
}

export function processInput(tool: QuickToolValue, input: string, target: ConversionTarget): ToolProcessResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return { status: 'Add input before processing.', output: '' };
  }

  if (tool === 'formatter') {
    try {
      return { status: 'JSON formatted successfully.', output: JSON.stringify(JSON.parse(trimmed), null, 2) };
    } catch {
      const output = trimmed
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .join('\n');
      return { status: 'Whitespace normalized. JSON parsing was not applied.', output };
    }
  }

  if (tool === 'validator') {
    try {
      JSON.parse(trimmed);
      return { status: 'Valid JSON.', output: 'No syntax issues found.' };
    } catch (error) {
      return { status: 'Invalid JSON.', output: error instanceof Error ? error.message : 'Unknown parsing error.' };
    }
  }

  if (tool === 'powerfx') {
    return convertPowerFx(trimmed, target);
  }

  if (tool === 'command') {
    return generateCommand(trimmed);
  }

  if (tool === 'config') {
    return buildConfig(trimmed);
  }

  if (tool === 'performance') {
    return analyzePerformance(trimmed);
  }

  const entries = parseKeyValueEntries(trimmed);

  if (Object.keys(entries).length === 0) {
    return { status: 'No key=value pairs found.', output: 'Try input like: appName=Power Tools' };
  }

  return { status: 'Converted key=value pairs to JSON.', output: JSON.stringify(entries, null, 2) };
}
