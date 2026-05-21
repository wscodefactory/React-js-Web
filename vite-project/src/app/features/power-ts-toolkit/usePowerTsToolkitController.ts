import { useMemo, useState } from 'react';
import { powerToolkitResources } from '../../data/showcase';
import { quickToolHelp, resourceToolMap, toolSamples } from './data';
import { processInput } from './processors';
import type { ConversionTarget, QuickToolValue } from './types';

export function usePowerTsToolkitController() {
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

  return {
    conversionTarget,
    handleClear,
    handleProcess,
    handleResourceSelect,
    handleTargetChange,
    handleToolChange,
    input,
    loadSample,
    result,
    selectedHelp,
    selectedResourceId,
    selectedTool,
    setInput,
  };
}
