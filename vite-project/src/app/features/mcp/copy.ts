import type { AppLanguage } from '@/app/context/LanguageContext';
import { supportedPlatforms } from './data';
import type { PlatformId, SupportedPlatform } from './types';

export type McpCopy = {
  explainer: {
    body: string;
    title: string;
  };
  features: {
    description: string;
    items: Record<string, { description: string; title: string }>;
    title: string;
  };
  hero: {
    description: string;
    importButton: string;
    importedAt: (protocol: string, importedAt: string) => string;
    importUrl: string;
    placeholder: string;
    sourceFrom: (name: string, host: string) => string;
    sourceTitle: string;
    title: string;
    titleHighlight: string;
  };
  history: {
    clear: string;
    empty: string;
    remove: (name: string) => string;
    restore: string;
    title: string;
  };
  manifest: {
    copy: string;
    copied: string;
    json: string;
    package: string;
    subtitle: (platform: string) => string;
    title: string;
  };
  platforms: Record<PlatformId, Pick<SupportedPlatform, 'assets' | 'description' | 'label' | 'status'>>;
  status: {
    copied: string;
    copyFailed: string;
    historyCleared: string;
    importFirst: string;
    invalidUrl: string;
    manifestReady: string;
    metadataRestored: string;
    metadataUpdated: string;
    notImported: string;
    packageReady: string;
    pendingHost: string;
    pendingSource: string;
  };
  checklist: {
    mapAssets: (platform: string) => string;
    publish: string;
    review: (name: string) => string;
    verify: string;
  };
  worksWith: string;
};

export const mcpCopy: Record<AppLanguage, McpCopy> = {
  en: {
    checklist: {
      mapAssets: (platform) => `Map imported assets to ${platform}.`,
      publish: 'Publish the package manifest after review.',
      review: (name) => `Review ${name} source before publishing.`,
      verify: 'Verify usage notes, permissions, and preview metadata.',
    },
    explainer: {
      body: 'MCP gives teams a single place to publish, discover, version, and reuse component knowledge. It works like a curated registry for app building blocks.',
      title: 'What is MCP?',
    },
    features: {
      description: 'Build, govern, and distribute reusable assets with a clearer delivery workflow.',
      items: {
        'Build custom components': { title: 'Build custom components', description: 'Create UI modules your team can reuse with confidence.' },
        'Combine common UIs': { title: 'Combine common UIs', description: 'Turn calendars, builders, and forms into larger templates.' },
        'Create with governance': { title: 'Create with governance', description: 'Package assets with shared standards and team conventions.' },
        'Generate full apps': { title: 'Generate full apps', description: 'Start from structured templates and grow with shared assets.' },
        'Integrate native controls': { title: 'Integrate native controls', description: 'Blend custom modules with the controls teams already use.' },
        'Launch a product': { title: 'Launch a product', description: 'Move from reusable pieces to complete product screens.' },
      },
      title: 'What MCP helps you do',
    },
    hero: {
      description: 'Build and share a component library platform for Power Apps style workflows, with a community-driven distribution model.',
      importButton: 'Import',
      importedAt: (protocol, importedAt) => `${protocol.toUpperCase()} at ${importedAt}`,
      importUrl: 'Import URL',
      placeholder: 'Paste an import URL',
      sourceFrom: (name, host) => `${name} from ${host}`,
      sourceTitle: 'Imported Source',
      title: 'MCP',
      titleHighlight: 'PowerLibs',
    },
    history: {
      clear: 'Clear',
      empty: 'No imports yet.',
      remove: (name) => `Remove ${name} import`,
      restore: 'Restore',
      title: 'Import History',
    },
    manifest: {
      copied: 'Copied',
      copy: 'Copy',
      json: 'JSON',
      package: 'Package',
      subtitle: (platform) => `${platform} package metadata`,
      title: 'Manifest Preview',
    },
    platforms: {
      canvas: {
        assets: ['Screen schema', 'Theme tokens', 'Usage notes'],
        description: 'Package reusable canvas patterns and component notes.',
        label: 'Canvas',
        status: 'Design-ready',
      },
      github: {
        assets: ['Repository URL', 'Import summary', 'Review checklist'],
        description: 'Track external source repositories before library publishing.',
        label: 'GitHub',
        status: 'Source-ready',
      },
      'ui-library': {
        assets: ['Component manifest', 'Preview entries', 'Variant map'],
        description: 'Publish preview metadata, examples, and implementation status.',
        label: 'UI Library',
        status: 'Component-ready',
      },
    },
    status: {
      copied: 'Manifest copied to clipboard.',
      copyFailed: 'Clipboard copy failed. Use JSON download instead.',
      historyCleared: 'Import history cleared.',
      importFirst: 'Import a source before downloading an MCP package.',
      invalidUrl: 'Enter a valid https:// or file URL before importing.',
      manifestReady: 'Manifest metadata is ready to copy.',
      metadataRestored: 'Manifest metadata restored.',
      metadataUpdated: 'Manifest metadata updated.',
      notImported: 'Not imported',
      packageReady: 'MCP package is ready to download.',
      pendingHost: 'pending-host',
      pendingSource: 'pending-source',
    },
    worksWith: 'Works with',
  },
  ko: {
    checklist: {
      mapAssets: (platform) => `가져온 에셋을 ${platform}에 맞게 매핑하세요.`,
      publish: '검토 후 패키지 매니페스트를 게시하세요.',
      review: (name) => `게시 전에 ${name} 소스를 검토하세요.`,
      verify: '사용 메모, 권한, 미리보기 메타데이터를 확인하세요.',
    },
    explainer: {
      body: 'MCP는 팀이 컴포넌트 지식을 게시, 탐색, 버전 관리, 재사용할 수 있는 단일 공간입니다. 앱 빌딩 블록을 위한 큐레이션 레지스트리처럼 작동합니다.',
      title: 'MCP란?',
    },
    features: {
      description: '재사용 에셋을 더 명확한 전달 흐름으로 만들고 관리하며 배포하세요.',
      items: {
        'Build custom components': { title: '커스텀 컴포넌트 만들기', description: '팀이 안심하고 재사용할 수 있는 UI 모듈을 만드세요.' },
        'Combine common UIs': { title: '공통 UI 결합', description: '캘린더, 빌더, 폼을 더 큰 템플릿으로 묶으세요.' },
        'Create with governance': { title: '거버넌스와 함께 제작', description: '공유 표준과 팀 컨벤션으로 에셋을 패키징하세요.' },
        'Generate full apps': { title: '전체 앱 생성', description: '구조화된 템플릿에서 시작해 공유 에셋으로 확장하세요.' },
        'Integrate native controls': { title: '네이티브 컨트롤 통합', description: '팀이 이미 쓰는 컨트롤과 커스텀 모듈을 자연스럽게 섞으세요.' },
        'Launch a product': { title: '제품 출시', description: '재사용 조각에서 완성된 제품 화면으로 확장하세요.' },
      },
      title: 'MCP로 할 수 있는 일',
    },
    hero: {
      description: 'Power Apps 스타일 워크플로를 위한 컴포넌트 라이브러리 플랫폼을 만들고 공유하세요.',
      importButton: '가져오기',
      importedAt: (protocol, importedAt) => `${protocol.toUpperCase()} / ${importedAt}`,
      importUrl: '가져오기 URL',
      placeholder: '가져오기 URL 붙여넣기',
      sourceFrom: (name, host) => `${host}에서 가져온 ${name}`,
      sourceTitle: '가져온 소스',
      title: 'MCP',
      titleHighlight: 'PowerLibs',
    },
    history: {
      clear: '비우기',
      empty: '아직 가져온 항목이 없습니다.',
      remove: (name) => `${name} 가져오기 항목 삭제`,
      restore: '복원',
      title: '가져오기 기록',
    },
    manifest: {
      copied: '복사됨',
      copy: '복사',
      json: 'JSON',
      package: '패키지',
      subtitle: (platform) => `${platform} 패키지 메타데이터`,
      title: '매니페스트 미리보기',
    },
    platforms: {
      canvas: {
        assets: ['화면 스키마', '테마 토큰', '사용 메모'],
        description: '재사용 가능한 캔버스 패턴과 컴포넌트 메모를 패키징합니다.',
        label: '캔버스',
        status: '디자인 준비',
      },
      github: {
        assets: ['저장소 URL', '가져오기 요약', '검토 체크리스트'],
        description: '라이브러리 게시 전에 외부 소스 저장소를 추적합니다.',
        label: 'GitHub',
        status: '소스 준비',
      },
      'ui-library': {
        assets: ['컴포넌트 매니페스트', '미리보기 항목', '변형 맵'],
        description: '미리보기 메타데이터, 예시, 구현 상태를 게시합니다.',
        label: 'UI 라이브러리',
        status: '컴포넌트 준비',
      },
    },
    status: {
      copied: '매니페스트를 클립보드에 복사했습니다.',
      copyFailed: '클립보드 복사에 실패했습니다. JSON 다운로드를 사용하세요.',
      historyCleared: '가져오기 기록을 비웠습니다.',
      importFirst: 'MCP 패키지를 다운로드하려면 먼저 소스를 가져오세요.',
      invalidUrl: '가져오기 전에 올바른 https:// 또는 file URL을 입력하세요.',
      manifestReady: '매니페스트 메타데이터를 복사할 준비가 되었습니다.',
      metadataRestored: '매니페스트 메타데이터를 복원했습니다.',
      metadataUpdated: '매니페스트 메타데이터를 업데이트했습니다.',
      notImported: '가져오지 않음',
      packageReady: 'MCP 패키지를 다운로드할 준비가 되었습니다.',
      pendingHost: '대기 중인 호스트',
      pendingSource: '대기 중인 소스',
    },
    worksWith: '연동 플랫폼',
  },
};

export function getLocalizedPlatform(language: AppLanguage, platform: SupportedPlatform): SupportedPlatform {
  const platformCopy = mcpCopy[language].platforms[platform.id];

  return {
    ...platform,
    ...platformCopy,
  };
}

export function getLocalizedPlatforms(language: AppLanguage) {
  return supportedPlatforms.map((platform) => getLocalizedPlatform(language, platform));
}
