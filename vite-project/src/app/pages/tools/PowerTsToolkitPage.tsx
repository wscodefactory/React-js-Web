import { useMemo, useState } from 'react';
import { ActivityList } from '@/app/components/showcase/ActivityList';
import { MetricGrid } from '@/app/components/showcase/MetricGrid';
import { PageIntro } from '@/app/components/showcase/PageIntro';
import { ResourceGrid } from '@/app/components/showcase/ResourceGrid';
import { Button } from '@/app/components/common';
import { powerToolkitMetrics, powerToolkitRecentActivity, powerToolkitResources, quickToolOptions } from '@/app/data/showcase';

type QuickToolValue = 'formatter' | 'validator' | 'converter' | 'command' | 'config' | 'performance' | 'powerfx';
type ConversionTarget = 'react' | 'javascript';

const quickToolHelp: Record<QuickToolValue, string> = {
  formatter: 'Formats JSON or lightly normalizes TypeScript-style whitespace.',
  validator: 'Checks whether the pasted content is valid JSON.',
  converter: 'Converts key=value lines into a JSON object.',
  command: 'Generates package scripts and run commands from task settings.',
  config: 'Builds typed app config and environment values from key=value lines.',
  performance: 'Scans React or TypeScript snippets for common performance signals.',
  powerfx: 'Converts common Power Fx actions into React handlers or plain JavaScript.',
};

const toolSamples: Record<QuickToolValue, string> = {
  formatter: '{\n  "name": "Power Toolkit",\n  "enabled": true\n}',
  validator: '{\n  "name": "Power Toolkit",\n  "enabled": true\n}',
  converter: 'appName=Power Tools\nenabled=true\nowner=Design Ops',
  command: 'task=build\ncommand=vite build\npackageManager=npm\nwatch=true',
  config: 'appName=Power Tools\napiUrl=https://api.example.com\nenableAnalytics=true\ntimeout=5000',
  performance: 'const rows = items.map((item) => expensiveFormat(item));\nconsole.log(rows);\nuseEffect(() => {\n  fetch("/api/projects").then(loadProjects);\n}, [loadProjects]);',
  powerfx: 'Set(varSaving, true);\nNotify("Saved successfully", NotificationType.Success);\nCollect(colRequests, { Title: "New request", Priority: "High" });\nNavigate(ReviewScreen)',
};

const toolPlaceholders: Record<QuickToolValue, string> = {
  formatter: 'Paste JSON or TypeScript-style text here...',
  validator: 'Paste JSON to validate...',
  converter: 'appName=Power Tools\nenabled=true',
  command: 'task=build\ncommand=vite build\npackageManager=npm',
  config: 'appName=Power Tools\napiUrl=https://api.example.com',
  performance: 'Paste React or TypeScript code here...',
  powerfx: 'Set(varSaving, true); Notify("Saved", NotificationType.Success)',
};

const resourceToolMap: Record<string, QuickToolValue> = {
  'Code Formatter': 'formatter',
  'Data Converter': 'converter',
  'JSON Validator': 'validator',
  'Command Generator': 'command',
  'Config Builder': 'config',
  'Performance Analyzer': 'performance',
};

function splitTopLevelArgs(value: string) {
  const args: string[] = [];
  let current = '';
  let depth = 0;
  let quote: string | null = null;

  for (const char of value) {
    if ((char === '"' || char === "'") && !quote) {
      quote = char;
      current += char;
      continue;
    }

    if (quote === char) {
      quote = null;
      current += char;
      continue;
    }

    if (!quote && (char === '(' || char === '{' || char === '[')) depth += 1;
    if (!quote && (char === ')' || char === '}' || char === ']')) depth -= 1;

    if (char === ',' && depth === 0 && !quote) {
      args.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  if (current.trim()) {
    args.push(current.trim());
  }

  return args;
}

function toSetterName(name: string) {
  const cleanName = name.replace(/[^a-zA-Z0-9_]/g, ' ').trim();
  const pascalName = cleanName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  return `set${pascalName || 'Value'}`;
}

function toRoute(value: string) {
  return `/${value.replace(/["']/g, '').replace(/Screen$/i, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;
}

function parseFunctionCall(statement: string) {
  const match = statement.match(/^([A-Za-z]+)\((.*)\)$/s);
  if (!match) return null;
  return {
    name: match[1].toLowerCase(),
    args: splitTopLevelArgs(match[2]),
  };
}

function convertPowerFxStatement(statement: string, target: ConversionTarget) {
  const call = parseFunctionCall(statement);
  if (!call) {
    return `// Review manually: ${statement}`;
  }

  if (call.name === 'set') {
    const [name = 'value', value = 'undefined'] = call.args;
    return target === 'react'
      ? `${toSetterName(name)}(${value});`
      : `state.${name} = ${value};`;
  }

  if (call.name === 'navigate') {
    const [screen = 'Home'] = call.args;
    return target === 'react'
      ? `navigate("${toRoute(screen)}");`
      : `window.location.assign("${toRoute(screen)}");`;
  }

  if (call.name === 'notify') {
    const [message = '"Done"', type = 'NotificationType.Information'] = call.args;
    const tone = type.toLowerCase().includes('success') ? 'success' : type.toLowerCase().includes('error') ? 'error' : 'info';
    return target === 'react'
      ? `toast.${tone}(${message});`
      : `window.alert(${message}); // ${tone}`;
  }

  if (call.name === 'collect') {
    const [collection = 'items', record = '{}'] = call.args;
    return target === 'react'
      ? `${toSetterName(collection)}((current) => [...current, ${record}]);`
      : `${collection}.push(${record});`;
  }

  return `// Unsupported Power Fx function "${call.name}": ${statement}`;
}

function convertPowerFx(input: string, target: ConversionTarget) {
  const statements = input
    .split(/;|\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (statements.length === 0) {
    return { status: 'No Power Fx statements found.', output: 'Try Set(varName, true); Notify("Saved", NotificationType.Success)' };
  }

  const converted = statements.map((statement) => convertPowerFxStatement(statement, target));
  const imports = target === 'react'
    ? [
        '// Expected app helpers:',
        '// const navigate = useNavigate();',
        '// const [varSaving, setVarSaving] = useState(false);',
        '// const [colRequests, setColRequests] = useState([]);',
        '',
      ].join('\n')
    : 'const state = {};\nconst colRequests = [];\n\n';

  return {
    status: `Converted ${statements.length} Power Fx statement${statements.length === 1 ? '' : 's'} to ${target === 'react' ? 'React' : 'JavaScript'}.`,
    output: `${imports}${converted.join('\n')}`,
  };
}

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

function generateCommand(input: string) {
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

function buildConfig(input: string) {
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
    output: [`# .env`, envBlock, '', '// config.ts', typedConfig].join('\n'),
  };
}

function analyzePerformance(input: string) {
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

function processInput(tool: QuickToolValue, input: string, target: ConversionTarget) {
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

export function PowerTsToolkitPage() {
  const [selectedTool, setSelectedTool] = useState<QuickToolValue>('formatter');
  const [conversionTarget, setConversionTarget] = useState<ConversionTarget>('react');
  const [input, setInput] = useState(toolSamples.formatter);
  const [result, setResult] = useState(() => processInput('formatter', toolSamples.formatter, 'react'));

  const selectedHelp = useMemo(() => quickToolHelp[selectedTool], [selectedTool]);
  const selectedResourceId = useMemo(
    () => powerToolkitResources.find((item) => resourceToolMap[item.title] === selectedTool)?.id,
    [selectedTool],
  );

  const handleProcess = () => {
    setResult(processInput(selectedTool, input, conversionTarget));
  };

  const handleClear = () => {
    setInput('');
    setResult({ status: 'Input cleared.', output: '' });
  };

  const handleToolChange = (value: QuickToolValue) => {
    setSelectedTool(value);
    setInput(toolSamples[value]);
    setResult(processInput(value, toolSamples[value], conversionTarget));
  };

  const handleResourceSelect = (title: string) => {
    const tool = resourceToolMap[title];
    if (tool) {
      handleToolChange(tool);
    }
  };

  const handleTargetChange = (value: ConversionTarget) => {
    setConversionTarget(value);
    if (selectedTool === 'powerfx') {
      setResult(processInput(selectedTool, input, value));
    }
  };

  const loadSample = () => {
    setInput(toolSamples[selectedTool]);
    setResult(processInput(selectedTool, toolSamples[selectedTool], conversionTarget));
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <PageIntro
        highlight="PowerT's"
        title="Toolkit"
        description="Essential tools for TypeScript developers and power users"
      />

      <MetricGrid items={powerToolkitMetrics} columnsClassName="grid-cols-1 sm:grid-cols-3" />

      <ActivityList title="Recently Used" items={powerToolkitRecentActivity} />

      <ResourceGrid
        title="All Tools"
        items={powerToolkitResources}
        selectedItemId={selectedResourceId}
        onSelect={(item) => handleResourceSelect(item.title)}
      />

      <section className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-700 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Tool</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{selectedHelp}</p>
          </div>
          <select
            value={selectedTool}
            onChange={(event) => handleToolChange(event.target.value as QuickToolValue)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            {quickToolOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 p-4 xl:grid-cols-2">
          <div>
            {selectedTool === 'powerfx' ? (
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Output target</span>
                <select
                  value={conversionTarget}
                  onChange={(event) => handleTargetChange(event.target.value as ConversionTarget)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  aria-label="Power Fx output target"
                >
                  <option value="react">React handler</option>
                  <option value="javascript">Plain JavaScript</option>
                </select>
              </div>
            ) : null}
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="h-56 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              placeholder={toolPlaceholders[selectedTool]}
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={loadSample}>Load Sample</Button>
              <Button variant="secondary" onClick={handleClear}>Clear</Button>
              <Button onClick={handleProcess}>Process</Button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Result</h3>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                {selectedTool}
              </span>
            </div>
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{result.status}</p>
            <pre className="min-h-40 overflow-auto whitespace-pre-wrap rounded-lg bg-gray-950 p-4 text-sm text-gray-100">
              <code>{result.output || 'Processed output will appear here.'}</code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
