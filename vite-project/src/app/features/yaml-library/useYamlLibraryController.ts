import { useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { jsonConverterSample, yamlTemplates } from './data';
import { getLineCount, jsonToYaml, yamlToJson } from './yamlConverter';
import type { ConverterMode, UploadedYaml } from './types';

export function useYamlLibraryController() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedYaml[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [templateQuery, setTemplateQuery] = useState('');
  const [converterMode, setConverterMode] = useState<ConverterMode>('yaml-to-json');
  const [converterInput, setConverterInput] = useState(yamlTemplates[0].code);
  const [converterOutput, setConverterOutput] = useState('');
  const [status, setStatus] = useState('Upload YAML files or copy a starter template.');

  const visibleTemplates = useMemo(() => {
    const query = templateQuery.trim().toLowerCase();

    if (!query) return yamlTemplates;

    return yamlTemplates.filter((template) => `${template.title} ${template.description} ${template.code}`.toLowerCase().includes(query));
  }, [templateQuery]);

  const copyText = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setStatus('YAML copied to clipboard.');
      window.setTimeout(() => setCopiedId(null), 1400);
    } catch {
      setStatus('Clipboard access was blocked by the browser.');
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    selectedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        const content = String(reader.result ?? '');
        const id = `${file.name}-${file.lastModified}`;

        setFiles((current) => [
          { id, name: file.name, content },
          ...current.filter((item) => item.id !== id),
        ]);
        setStatus(`${file.name} imported with ${getLineCount(content)} lines.`);
      };

      reader.readAsText(file, 'UTF-8');
    });

    event.target.value = '';
  };

  const removeFile = (id: string) => {
    setFiles((current) => current.filter((file) => file.id !== id));
    setStatus('Uploaded YAML removed.');
  };

  const clearUploads = () => {
    setFiles([]);
    setStatus('Uploaded YAML list cleared.');
  };

  const handleConvert = () => {
    try {
      const output = converterMode === 'yaml-to-json'
        ? yamlToJson(converterInput)
        : jsonToYaml(JSON.parse(converterInput));

      setConverterOutput(output);
      setStatus(converterMode === 'yaml-to-json' ? 'YAML converted to JSON.' : 'JSON converted to YAML.');
    } catch (error) {
      setConverterOutput('');
      setStatus(error instanceof Error ? error.message : 'Conversion failed.');
    }
  };

  const loadConverterSample = () => {
    if (converterMode === 'yaml-to-json') {
      setConverterInput(yamlTemplates[0].code);
      setConverterOutput('');
      setStatus('YAML sample loaded.');
      return;
    }

    setConverterInput(JSON.stringify(jsonConverterSample, null, 2));
    setConverterOutput('');
    setStatus('JSON sample loaded.');
  };

  const changeConverterMode = (mode: ConverterMode) => {
    setConverterMode(mode);
    setConverterOutput('');
  };

  return {
    changeConverterMode,
    clearUploads,
    converterInput,
    converterMode,
    converterOutput,
    copiedId,
    copyText,
    files,
    handleConvert,
    handleFileChange,
    inputRef,
    loadConverterSample,
    removeFile,
    setConverterInput,
    setTemplateQuery,
    status,
    templateQuery,
    visibleTemplates,
  };
}
