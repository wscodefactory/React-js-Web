import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { getYamlTemplateSearchText, yamlLibraryText } from "../../i18n";
import { copyTextToClipboard } from "../../utils/clipboard";
import { jsonConverterSample, yamlTemplates } from "./data";
import { readStoredYamlLibraryDraft, saveYamlLibraryDraft } from "./draftStorage";
import { downloadTextFile } from "./fileExport";
import { getLineCount, jsonToYaml, yamlToJson } from "./yamlConverter";
import type { ConverterMode, UploadedYaml, YamlLibraryDraft } from "./types";

const emptyYamlErrorMessage = "Add YAML content before converting.";
const emptyYamlErrorMessageKo = "변환하기 전에 YAML 내용을 입력하세요.";

export function useYamlLibraryController() {
  const { language } = useLanguage();
  const text = yamlLibraryText[language];
  const inputRef = useRef<HTMLInputElement>(null);
  const [storedDraft] = useState(readStoredYamlLibraryDraft);
  const [files, setFiles] = useState<UploadedYaml[]>(storedDraft.files);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [templateQuery, setTemplateQuery] = useState("");
  const [converterMode, setConverterMode] = useState<ConverterMode>(storedDraft.converterMode);
  const [converterInput, setConverterInput] = useState(storedDraft.converterInput);
  const [converterOutput, setConverterOutput] = useState(storedDraft.converterOutput);
  const [status, setStatus] = useState(storedDraft.files.length > 0
    ? text.restoredFiles(storedDraft.files.length)
    : text.uploadPrompt);

  const visibleTemplates = useMemo(() => {
    const query = templateQuery.trim().toLowerCase();

    if (!query) {
      return yamlTemplates;
    }

    return yamlTemplates.filter((template) => getYamlTemplateSearchText(language, template).join(" ").toLowerCase().includes(query));
  }, [language, templateQuery]);

  const draft = useMemo<YamlLibraryDraft>(() => ({
    converterInput,
    converterMode,
    converterOutput,
    files,
  }), [converterInput, converterMode, converterOutput, files]);

  useEffect(() => {
    saveYamlLibraryDraft(draft);
  }, [draft]);

  const copyText = async (id: string, content: string) => {
    try {
      const copied = await copyTextToClipboard(content);

      if (!copied) {
        throw new Error("Clipboard copy failed.");
      }

      setCopiedId(id);
      setStatus(text.copiedToClipboard);
      window.setTimeout(() => setCopiedId(null), 1400);
    } catch {
      setStatus(text.clipboardBlocked);
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
        const content = String(reader.result ?? "");
        const id = `${file.name}-${file.lastModified}`;

        setFiles((current) => [
          { id, name: file.name, content },
          ...current.filter((item) => item.id !== id),
        ]);
        setStatus(text.fileImported(file.name, getLineCount(content)));
      };

      reader.readAsText(file, "UTF-8");
    });

    event.target.value = "";
  };

  const removeFile = (id: string) => {
    setFiles((current) => current.filter((file) => file.id !== id));
    setStatus(text.uploadRemoved);
  };

  const clearUploads = () => {
    setFiles([]);
    setStatus(text.uploadsCleared);
  };

  const downloadUploadedFile = (file: UploadedYaml) => {
    downloadTextFile(file.content, file.name);
    setStatus(text.fileQueued(file.name));
  };

  const downloadUploads = () => {
    if (files.length === 0) {
      setStatus(text.uploadFirst);
      return;
    }

    files.forEach((file) => downloadTextFile(file.content, file.name));
    setStatus(text.filesQueued(files.length));
  };

  const handleConvert = () => {
    try {
      const output = converterMode === "yaml-to-json"
        ? yamlToJson(converterInput)
        : jsonToYaml(JSON.parse(converterInput));

      setConverterOutput(output);
      setStatus(converterMode === "yaml-to-json" ? text.yamlConverted : text.jsonConverted);
    } catch (error) {
      setConverterOutput("");
      setStatus(language === "ko" && error instanceof Error && error.message === emptyYamlErrorMessage
        ? emptyYamlErrorMessageKo
        : error instanceof Error ? error.message : "Conversion failed.");
    }
  };

  const loadConverterSample = () => {
    if (converterMode === "yaml-to-json") {
      setConverterInput(yamlTemplates[0].code);
      setConverterOutput("");
      setStatus(text.yamlSampleLoaded);
      return;
    }

    setConverterInput(JSON.stringify(jsonConverterSample, null, 2));
    setConverterOutput("");
    setStatus(text.jsonSampleLoaded);
  };

  const changeConverterMode = (mode: ConverterMode) => {
    setConverterMode(mode);
    setConverterOutput("");
  };

  const downloadConverterOutput = () => {
    if (!converterOutput.trim()) {
      setStatus(text.convertBeforeDownload);
      return;
    }

    const extension = converterMode === "yaml-to-json" ? "json" : "yaml";
    downloadTextFile(converterOutput, `converted-output.${extension}`);
    setStatus(text.convertedOutputQueued(extension));
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
