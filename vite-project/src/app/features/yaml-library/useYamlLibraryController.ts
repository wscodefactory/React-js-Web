import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { copyTextToClipboard } from '../../utils/clipboard';
import { jsonConverterSample, yamlTemplates } from './data';
import { getLineCount, jsonToYaml, yamlToJson } from './yamlConverter';
import type { ConverterMode, UploadedYaml, YamlLibraryDraft } from './types';

const yamlLibraryStorageKey = 'web5:yaml-library-draft:v1';

const fallbackDraft: YamlLibraryDraft = {
  converterInput: yamlTemplates[0].code,
  converterMode: 'yaml-to-json',
  converterOutput: '',
  files: [],
};

function isUploadedYaml(value: unknown): value is UploadedYaml {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<UploadedYaml>;
  return typeof candidate.id === 'string'
    && typeof candidate.name === 'string'
    && typeof candidate.content === 'string';
}

function isYamlLibraryDraft(value: unknown): value is YamlLibraryDraft {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<YamlLibraryDraft>;
  return (
    typeof candidate.converterInput === 'string'
    && (candidate.converterMode === 'yaml-to-json' || candidate.converterMode === 'json-to-yaml')
    && typeof candidate.converterOutput === 'string'
    && Array.isArray(candidate.files)
    && candidate.files.every(isUploadedYaml)
  );
}

function readStoredDraft() {
  if (typeof window === 'undefined') {
    return fallbackDraft;
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(yamlLibraryStorageKey) ?? 'null');
    return isYamlLibraryDraft(parsed) ? parsed : fallbackDraft;
  } catch {
    return fallbackDraft;
  }
}

function downloadText(content: string, fileName: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function useYamlLibraryController() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [storedDraft] = useState(() => readStoredDraft());
  const [files, setFiles] = useState<UploadedYaml[]>(storedDraft.files);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [templateQuery, setTemplateQuery] = useState('');
  const [converterMode, setConverterMode] = useState<ConverterMode>(storedDraft.converterMode);
  const [converterInput, setConverterInput] = useState(storedDraft.converterInput);
  const [converterOutput, setConverterOutput] = useState(storedDraft.converterOutput);
  const [status, setStatus] = useState(storedDraft.files.length > 0
    ? `Restored ${storedDraft.files.length} uploaded YAML file${storedDraft.files.length === 1 ? '' : 's'} from local storage.`
    : 'Upload YAML files or copy a starter template.');

  const visibleTemplates = useMemo(() => {
    const query = templateQuery.trim().toLowerCase();

    if (!query) return yamlTemplates;

    return yamlTemplates.filter((template) => `${template.title} ${template.description} ${template.code}`.toLowerCase().includes(query));
  }, [templateQuery]);

  const draft = useMemo<YamlLibraryDraft>(() => ({
    converterInput,
    converterMode,
    converterOutput,
    files,
  }), [converterInput, converterMode, converterOutput, files]);

  useEffect(() => {
    window.localStorage.setItem(yamlLibraryStorageKey, JSON.stringify(draft));
  }, [draft]);

  const copyText = async (id: string, text: string) => {
    try {
      const copied = await copyTextToClipboard(text);

      if (!copied) {
        throw new Error('Clipboard copy failed.');
      }

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

  const downloadUploadedFile = (file: UploadedYaml) => {
    downloadText(file.content, file.name);
    setStatus(`${file.name} queued for download.`);
  };

  const downloadUploads = () => {
    if (files.length === 0) {
      setStatus('Upload YAML files before downloading them.');
      return;
    }

    files.forEach((file) => downloadText(file.content, file.name));
    setStatus(`${files.length} uploaded YAML file${files.length === 1 ? '' : 's'} queued for download.`);
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

  const downloadConverterOutput = () => {
    if (!converterOutput.trim()) {
      setStatus('Convert content before downloading output.');
      return;
    }

    const extension = converterMode === 'yaml-to-json' ? 'json' : 'yaml';
    downloadText(converterOutput, `converted-output.${extension}`);
    setStatus(`Converted ${extension.toUpperCase()} output queued for download.`);
  };

  return {
    changeConverterMode,
    clearUploads,
    converterInput,
    converterMode,
    converterOutput,
    copiedId,
    copyText,
    downloadConverterOutput,
    downloadUploadedFile,
    downloadUploads,
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
