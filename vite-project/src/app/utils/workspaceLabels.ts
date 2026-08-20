const workspaceItemLabels: Array<[string, string]> = [
  ['web5:project-management', '프로젝트 관리'],
  ['web5:cleaning-confirmation', '청소 확인'],
  ['web5:feedback-workspace', '피드백 앱'],
  ['web5:custom-svg-library', '커스텀 SVG 라이브러리'],
  ['web5:form-builder', '폼 빌더'],
  ['web5:mock-api-studio', 'Mock API Studio'],
  ['web5:theme-builder', '테마 빌더'],
  ['web5:logo-generator', '로고 생성기'],
  ['web5:yaml-library', 'YAML 라이브러리'],
  ['web5:powerts-toolkit', 'PowerT 툴킷'],
  ['web5:mcp-import', 'MCP 가져오기 기록'],
  ['web5:calendar', '캘린더'],
  ['web5:full-app', '전체 앱 설정'],
  ['web5:saved-component', '저장한 컴포넌트'],
  ['web5:component-preview', '컴포넌트 미리보기'],
  ['web5:chrome-extension', '크롬 확장 체크리스트'],
];

export function getWorkspaceItemLabel(storageKey: string) {
  return workspaceItemLabels.find(([prefix]) => storageKey.startsWith(prefix))?.[1] ?? '기타 작업 데이터';
}

export function isProjectWorkspaceItem(storageKey: string) {
  return workspaceItemLabels.some(([prefix]) => storageKey.startsWith(prefix));
}
