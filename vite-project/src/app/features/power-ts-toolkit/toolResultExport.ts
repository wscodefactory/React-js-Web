import type { ConversionTarget, QuickToolValue } from "./types";

export function getToolResultExtension(selectedTool: QuickToolValue) {
  if (selectedTool === "formatter" || selectedTool === "validator" || selectedTool === "converter") {
    return "json";
  }

  return selectedTool === "config" ? "txt" : "ts";
}

export function downloadToolResult(output: string, selectedTool: QuickToolValue, conversionTarget: ConversionTarget) {
  const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `powerts-${selectedTool}-${conversionTarget}.${getToolResultExtension(selectedTool)}`;
  anchor.click();
  URL.revokeObjectURL(url);
}
