import type { AppLanguage } from "../../context/LanguageContext";
import { powerToolkitCopy } from "./copy";
import { convertPowerFx } from "./powerFx";
import type { ConversionTarget, QuickToolValue, ToolProcessResult } from "./types";

function parseKeyValueEntries(input: string) {
  return input.split("\n").reduce<Record<string, string>>((result, line) => {
    const [key, ...rest] = line.split("=");
    if (!key || rest.length === 0) {
      return result;
    }

    result[key.trim()] = rest.join("=").trim();
    return result;
  }, {});
}

function toEnvKey(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();
}

function generateCommand(input: string, language: AppLanguage): ToolProcessResult {
  const text = powerToolkitCopy[language].processor;
  const entries = parseKeyValueEntries(input);
  const rawCommand = entries.command || input.split("\n").find((line) => line.trim() && !line.includes("="))?.trim();

  if (!rawCommand) {
    return { status: text.commandMissing, output: text.commandMissingOutput };
  }

  const task = entries.task || "task";
  const packageManager = entries.packageManager || "npm";
  const scripts: Record<string, string> = { [task]: rawCommand };

  if (entries.watch === "true") {
    scripts[`${task}:watch`] = `${rawCommand} --watch`;
  }

  const scriptCount = Object.keys(scripts).length;

  return {
    status: text.commandReady(scriptCount, packageManager),
    output: [
      JSON.stringify({ scripts }, null, 2),
      "",
      `Run: ${packageManager} run ${task}`,
      entries.watch === "true" ? `Watch: ${packageManager} run ${task}:watch` : "",
    ].filter(Boolean).join("\n"),
  };
}

function buildConfig(input: string, language: AppLanguage): ToolProcessResult {
  const text = powerToolkitCopy[language].processor;
  const entries = parseKeyValueEntries(input);

  if (Object.keys(entries).length === 0) {
    return { status: text.configMissing, output: text.configMissingOutput };
  }

  const envBlock = Object.entries(entries)
    .map(([key, value]) => `${toEnvKey(key)}=${value}`)
    .join("\n");
  const typedConfig = `export const appConfig = ${JSON.stringify(entries, null, 2)} as const;`;
  const settingCount = Object.keys(entries).length;

  return {
    status: text.configReady(settingCount),
    output: ["# .env", envBlock, "", "// config.ts", typedConfig].join("\n"),
  };
}

function analyzePerformance(input: string, language: AppLanguage): ToolProcessResult {
  const text = powerToolkitCopy[language].processor;
  const lines = input.split("\n").filter((line) => line.trim());
  const consoleCount = (input.match(/console\./g) ?? []).length;
  const loopCount = (input.match(/\b(for|while)\s*\(|\.map\(|\.filter\(|\.reduce\(/g) ?? []).length;
  const fetchCount = (input.match(/\bfetch\(|axios\.|useEffect\(/g) ?? []).length;
  const memoSignals = (input.match(/useMemo\(|useCallback\(|React\.memo/g) ?? []).length;
  const suggestions = [
    lines.length > 80 ? (language === "ko" ? "사용자에게 보이는 렌더를 프로파일링하기 전에 긴 스니펫을 나누세요." : "Split long snippets before profiling user-facing renders.") : "",
    consoleCount > 0 ? (language === "ko" ? "프로덕션 경로에서는 console 호출을 제거하세요." : "Remove console calls from production paths.") : "",
    loopCount > 2 && memoSignals === 0 ? (language === "ko" ? "입력이 안정적이면 비용이 큰 파생 컬렉션을 메모이즈하세요." : "Memoize expensive derived collections when inputs are stable.") : "",
    fetchCount > 0 ? (language === "ko" ? "비동기 effect 주변의 요청 취소와 로딩 상태를 확인하세요." : "Check request cancellation and loading states around async effects.") : "",
  ].filter(Boolean);

  return {
    status: text.performanceReady(lines.length, suggestions.length),
    output: [
      text.performanceOutputTitle,
      `- ${language === "ko" ? "줄 수" : "Lines"}: ${lines.length}`,
      `- ${language === "ko" ? "Console 호출" : "Console calls"}: ${consoleCount}`,
      `- ${language === "ko" ? "반복/컬렉션 처리" : "Loop/collection passes"}: ${loopCount}`,
      `- ${language === "ko" ? "비동기/effect 신호" : "Async/effect signals"}: ${fetchCount}`,
      `- ${language === "ko" ? "메모화 신호" : "Memoization signals"}: ${memoSignals}`,
      "",
      text.performanceRecommendations,
      ...(suggestions.length > 0 ? suggestions.map((item) => `- ${item}`) : [`- ${text.noHotspots}`]),
    ].join("\n"),
  };
}

export function processInput(tool: QuickToolValue, input: string, target: ConversionTarget, language: AppLanguage = "en"): ToolProcessResult {
  const text = powerToolkitCopy[language].processor;
  const trimmed = input.trim();

  if (!trimmed) {
    return { status: text.addInput, output: "" };
  }

  if (tool === "formatter") {
    try {
      return { status: text.formatterSuccess, output: JSON.stringify(JSON.parse(trimmed), null, 2) };
    } catch {
      const output = trimmed
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join("\n");
      return { status: text.formatterFallback, output };
    }
  }

  if (tool === "validator") {
    try {
      JSON.parse(trimmed);
      return { status: text.validJson, output: text.validJsonOutput };
    } catch (error) {
      return { status: text.invalidJson, output: error instanceof Error ? error.message : text.unknownParsingError };
    }
  }

  if (tool === "powerfx") {
    return convertPowerFx(trimmed, target, language);
  }

  if (tool === "command") {
    return generateCommand(trimmed, language);
  }

  if (tool === "config") {
    return buildConfig(trimmed, language);
  }

  if (tool === "performance") {
    return analyzePerformance(trimmed, language);
  }

  const entries = parseKeyValueEntries(trimmed);

  if (Object.keys(entries).length === 0) {
    return { status: text.noPairs, output: text.configMissingOutput };
  }

  return { status: text.convertedPairs, output: JSON.stringify(entries, null, 2) };
}
