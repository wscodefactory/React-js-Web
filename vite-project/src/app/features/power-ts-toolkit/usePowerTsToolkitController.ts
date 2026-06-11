import { useEffect, useMemo, useState } from 'react';
import { powerToolkitResources } from '../../data/showcase';
import { quickToolHelp, resourceToolMap, toolSamples } from './data';
import { processInput } from './processors';
import type { ConversionTarget, QuickToolValue, ToolHistoryItem, ToolProcessResult } from './types';

const historyStorageKey = 'web5:powerts-toolkit-history:v1';
const historyLimit = 8;
const quickToolValues: QuickToolValue[] = ['formatter', 'validator', 'converter', 'command', 'config', 'performance', 'powerfx'];
const conversionTargets: ConversionTarget[] = ['react', 'javascript'];

function isToolProcessResult(value: unknown): value is ToolProcessResult {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<ToolProcessResult>;
  return typeof candidate.status === 'string' && typeof candidate.output === 'string';
}

function isToolHistoryItem(value: unknown): value is ToolHistoryItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<ToolHistoryItem>;
  return typeof candidate.id === 'string'
    && typeof candidate.createdAt === 'string'
    && typeof candidate.input === 'string'
    && quickToolValues.includes(candidate.tool as QuickToolValue)
    && conversionTargets.includes(candidate.target as ConversionTarget)
    && isToolProcessResult(candidate.result);
}

function readStoredHistory(): ToolHistoryItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(historyStorageKey) ?? '[]') as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isToolHistoryItem).slice(0, historyLimit);
  } catch {
    return [];
  }
}

export function usePowerTsToolkitController() {
  const [selectedTool, setSelectedTool] = useState<QuickToolValue>('formatter');
  const [conversionTarget, setConversionTarget] = useState<ConversionTarget>('react');
  const [input, setInput] = useState(toolSamples.formatter);
  const [result, setResult] = useState(() => processInput('formatter', toolSamples.formatter, 'react'));
  const [history, setHistory] = useState<ToolHistoryItem[]>(() => readStoredHistory());

  const selectedHelp = useMemo(() => quickToolHelp[selectedTool], [selectedTool]);
  const selectedResourceId = useMemo(
    () => powerToolkitResources.find((item) => resourceToolMap[item.title] === selectedTool)?.id,
    [selectedTool],
  );

  useEffect(() => {
    window.localStorage.setItem(historyStorageKey, JSON.stringify(history));
  }, [history]);

  const addHistoryItem = (nextResult: ToolProcessResult) => {
    if (!input.trim()) {
      return;
    }

    const nextItem: ToolHistoryItem = {
      createdAt: new Date().toISOString(),
      id: `${Date.now()}-${selectedTool}`,
      input,
      result: nextResult,
      target: conversionTarget,
      tool: selectedTool,
    };

    setHistory((current) => [
      nextItem,
      ...current.filter((item) => !(item.tool === nextItem.tool && item.target === nextItem.target && item.input === nextItem.input)),
    ].slice(0, historyLimit));
  };

  const handleProcess = () => {
    const nextResult = processInput(selectedTool, input, conversionTarget);
    setResult(nextResult);
    addHistoryItem(nextResult);
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

  const loadHistoryItem = (item: ToolHistoryItem) => {
    setSelectedTool(item.tool);
    setConversionTarget(item.target);
    setInput(item.input);
    setResult(item.result);
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((current) => current.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return {
    clearHistory,
    conversionTarget,
    deleteHistoryItem,
    handleClear,
    handleProcess,
    handleResourceSelect,
    handleTargetChange,
    handleToolChange,
    history,
    input,
    loadHistoryItem,
    loadSample,
    result,
    selectedHelp,
    selectedResourceId,
    selectedTool,
    setInput,
  };
}
