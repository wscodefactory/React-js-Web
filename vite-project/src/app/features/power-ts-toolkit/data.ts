import type { QuickToolValue } from './types';

export const quickToolHelp: Record<QuickToolValue, string> = {
  formatter: 'Formats JSON or lightly normalizes TypeScript-style whitespace.',
  validator: 'Checks whether the pasted content is valid JSON.',
  converter: 'Converts key=value lines into a JSON object.',
  command: 'Generates package scripts and run commands from task settings.',
  config: 'Builds typed app config and environment values from key=value lines.',
  performance: 'Scans React or TypeScript snippets for common performance signals.',
  powerfx: 'Converts common Power Fx actions into React handlers or plain JavaScript.',
};

export const toolSamples: Record<QuickToolValue, string> = {
  formatter: '{\n  "name": "Power Toolkit",\n  "enabled": true\n}',
  validator: '{\n  "name": "Power Toolkit",\n  "enabled": true\n}',
  converter: 'appName=Power Tools\nenabled=true\nowner=Design Ops',
  command: 'task=build\ncommand=vite build\npackageManager=npm\nwatch=true',
  config: 'appName=Power Tools\napiUrl=https://api.example.com\nenableAnalytics=true\ntimeout=5000',
  performance: 'const rows = items.map((item) => expensiveFormat(item));\nconsole.log(rows);\nuseEffect(() => {\n  fetch("/api/projects").then(loadProjects);\n}, [loadProjects]);',
  powerfx: 'Set(varSaving, true);\nNotify("Saved successfully", NotificationType.Success);\nCollect(colRequests, { Title: "New request", Priority: "High" });\nNavigate(ReviewScreen)',
};

export const toolPlaceholders: Record<QuickToolValue, string> = {
  formatter: 'Paste JSON or TypeScript-style text here...',
  validator: 'Paste JSON to validate...',
  converter: 'appName=Power Tools\nenabled=true',
  command: 'task=build\ncommand=vite build\npackageManager=npm',
  config: 'appName=Power Tools\napiUrl=https://api.example.com',
  performance: 'Paste React or TypeScript code here...',
  powerfx: 'Set(varSaving, true); Notify("Saved", NotificationType.Success)',
};

export const resourceToolMap: Record<string, QuickToolValue> = {
  'Code Formatter': 'formatter',
  'Data Converter': 'converter',
  'JSON Validator': 'validator',
  'Command Generator': 'command',
  'Config Builder': 'config',
  'Performance Analyzer': 'performance',
};
