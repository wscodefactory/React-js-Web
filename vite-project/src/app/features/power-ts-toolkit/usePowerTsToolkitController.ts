import { useEffect, useMemo, useState } from 'react';
import { powerToolkitResources } from '../../data/showcase';
import { useLanguage } from '../../context/LanguageContext';
import { loadStoredList, saveStoredList } from '../../utils/storage';
import { resourceToolMap, toolSamples } from './data';
import { processInput } from './processors';
import { powerToolkitCopy } from './copy';
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

  return loadStoredList(historyStorageKey, isToolHistoryItem).slice(0, historyLimit);
}

export function usePowerTsToolkitController() {
  const { language } = useLanguage();
  const text = powerToolkitCopy[language];
  const [selectedTool, setSelectedTool] = useState<QuickToolValue>('formatter');
  const [conversionTarget, setConversionTarget] = useState<ConversionTarget>('react');
  const [input, setInput] = useState(toolSamples.formatter);
  const [result, setResult] = useState(() => processInput('formatter', toolSamples.formatter, 'react', language));
  const [history, setHistory] = useState<ToolHistoryItem[]>(() => readStoredHistory());

  const selectedHelp = useMemo(() => text.quick.help[selectedTool], [selectedTool, text.quick.help]);
  const selectedResourceId = useMemo(
    () => powerToolkitResources.find((item) => resourceToolMap[item.title] === selectedTool)?.id,
    [selectedTool],
  );

  useEffect(() => {
    saveStoredList(historyStorageKey, history);
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
    const nextResult = processInput(selectedTool, input, conversionTarget, language);
    setResult(nextResult);
    addHistoryItem(nextResult);
  };

  const handleClear = () => {
    setInput('');
    setResult({ status: language === 'ko' ? '입력을 지웠습니다.' : 'Input cleared.', output: '' });
  };

  const handleToolChange = (value: QuickToolValue) => {
    setSelectedTool(value);
    setInput(toolSamples[value]);
    setResult(processInput(value, toolSamples[value], conversionTarget, language));
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
      setResult(processInput(selectedTool, input, value, language));
    }
  };

  const loadSample = () => {
    setInput(toolSamples[selectedTool]);
    setResult(processInput(selectedTool, toolSamples[selectedTool], conversionTarget, language));
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
