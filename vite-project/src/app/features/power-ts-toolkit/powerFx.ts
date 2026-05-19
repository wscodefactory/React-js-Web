import type { ConversionTarget, ToolProcessResult } from './types';

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

export function convertPowerFx(input: string, target: ConversionTarget): ToolProcessResult {
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
