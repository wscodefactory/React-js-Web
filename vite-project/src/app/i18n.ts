import type { AppLanguage } from './context/LanguageContext';
import type { CatalogItem } from './types/catalog';
import type { ComponentShowcaseConfig } from './types/component-showcase';
import type { SearchItem } from './types/navigation';

type LocalizedRouteCopy = {
  description?: string;
  keywords?: string[];
  label?: string;
};

type YamlTemplateLike = {
  code: string;
  description: string;
  id: string;
  title: string;
};

export const shellText = {
  en: {
    brand: 'Solucioneomos',
    closeSidebar: 'Close sidebar',
    darkMode: 'Toggle dark mode',
    language: 'Switch language',
    languageShort: 'EN',
    menu: 'Toggle menu',
    mobileNav: 'Mobile navigation',
    nextLanguageTitle: 'Switch to Korean',
  },
  ko: {
    brand: '솔루시오모스',
    closeSidebar: '사이드바 닫기',
    darkMode: '다크 모드 전환',
    language: '언어 전환',
    languageShort: 'KO',
    menu: '메뉴 열기',
    mobileNav: '모바일 내비게이션',
    nextLanguageTitle: '영어로 전환',
  },
} as const;

export const searchModalText = {
  en: {
    clearAll: 'Clear all',
    clearSearch: 'Clear search',
    closeSearch: 'Close search',
    closeSearchModal: 'Close search modal',
    empty: 'Type to search for pages and components...',
    noRecent: 'No recent searches',
    noResults: (query: string) => `No results found for "${query}"`,
    placeholder: 'Search for components, pages...',
    recent: 'Recent Searches',
    removeRecent: (name: string) => `Remove ${name} from recent searches`,
    tryDifferent: 'Try searching with different keywords',
    tryExamples: 'Try "button", "modal", "svg", or "project"',
  },
  ko: {
    clearAll: '전체 삭제',
    clearSearch: '검색어 지우기',
    closeSearch: '검색 닫기',
    closeSearchModal: '검색 창 닫기',
    empty: '페이지와 컴포넌트를 검색해보세요...',
    noRecent: '최근 검색이 없습니다',
    noResults: (query: string) => `"${query}"에 대한 결과가 없습니다`,
    placeholder: '컴포넌트, 페이지 검색...',
    recent: '최근 검색',
    removeRecent: (name: string) => `${name} 최근 검색에서 제거`,
    tryDifferent: '다른 키워드로 다시 검색해보세요',
    tryExamples: '"버튼", "모달", "svg", "프로젝트"로 검색해보세요',
  },
} as const;

export const catalogText = {
  en: {
    all: 'All',
    clearAll: 'Clear all',
    clearFilters: 'Clear filters',
    clearSearch: 'Clear search',
    count: (visible: number, total: number) => `${visible} of ${total} items`,
    noMatching: 'No matching items',
    noRecent: 'No recent searches',
    noRecentHelp: 'Start searching to see your history',
    noResults: (query: string) => `No results found for "${query}"`,
    preview: 'Preview',
    recent: 'Recent Searches',
    resetHint: 'Try a different keyword or reset the category filter.',
    searchAgain: 'Try searching with different keywords',
  },
  ko: {
    all: '전체',
    clearAll: '전체 삭제',
    clearFilters: '필터 초기화',
    clearSearch: '검색어 지우기',
    count: (visible: number, total: number) => `총 ${total}개 중 ${visible}개 표시`,
    noMatching: '일치하는 항목이 없습니다',
    noRecent: '최근 검색이 없습니다',
    noRecentHelp: '검색을 시작하면 기록이 표시됩니다',
    noResults: (query: string) => `"${query}"에 대한 결과가 없습니다`,
    preview: '미리보기',
    recent: '최근 검색',
    resetHint: '다른 키워드를 입력하거나 카테고리 필터를 초기화해보세요.',
    searchAgain: '다른 키워드로 검색해보세요',
  },
} as const;

export const catalogPageText = {
  en: {
    components: {
      description: 'Browse and search through our collection of pre-built components.',
      searchPlaceholder: 'Search components...',
      title: 'Library',
      titleHighlight: 'Component',
    },
    libraries: {
      description: 'Discover and manage reusable libraries, asset packs, and shared building blocks.',
      searchPlaceholder: 'Search libraries...',
      title: 'Libraries',
      titleHighlight: 'Your',
    },
    tools: {
      description: 'Use focused generators and editors to speed up implementation work across the library.',
      searchPlaceholder: 'Search tools...',
      title: 'Tools',
    },
  },
  ko: {
    components: {
      description: '미리 만들어진 컴포넌트를 검색하고 바로 탐색하세요.',
      searchPlaceholder: '컴포넌트 검색...',
      title: '라이브러리',
      titleHighlight: '컴포넌트',
    },
    libraries: {
      description: '재사용 가능한 라이브러리, 에셋 팩, 공용 빌딩 블록을 관리하세요.',
      searchPlaceholder: '라이브러리 검색...',
      title: '라이브러리',
      titleHighlight: '내',
    },
    tools: {
      description: '생성기와 편집 도구로 구현 작업 속도를 높이세요.',
      searchPlaceholder: '도구 검색...',
      title: '도구',
    },
  },
} as const;

export const fullAppsPageText = {
  en: {
    description: 'Explore production-style application pages built from reusable React components and shared catalog data.',
    highlight: 'Full',
    title: 'Apps',
  },
  ko: {
    description: '재사용 가능한 React 컴포넌트와 공용 카탈로그 데이터로 구성한 완성형 화면을 살펴보세요.',
    highlight: '전체',
    title: '앱',
  },
} as const;

export const fullAppsUiText = {
  en: {
    addFavorite: (name: string) => `Add ${name} favorite`,
    clearFilters: 'Clear filters',
    count: (filtered: number, total: number, saved: number) => `${filtered} of ${total} apps / ${saved} saved`,
    emptyDescription: 'Try a broader keyword or clear the current search.',
    emptyTitle: 'No apps found',
    grid: 'Grid',
    initialStatus: 'Choose an app to open or save it for later.',
    list: 'List',
    opened: (name: string, time: string) => `${name} opened at ${time}.`,
    openedAt: (time: string) => `Opened ${time}`,
    removeFavorite: (name: string) => `Remove ${name} favorite`,
    removed: (name: string) => `${name} removed from saved apps.`,
    save: 'Save',
    saved: 'Saved',
    savedForQuickAccess: (name: string) => `${name} saved for quick access.`,
    searchPlaceholder: 'Search full apps',
    viewApp: 'View app',
  },
  ko: {
    addFavorite: (name: string) => `${name} 즐겨찾기 추가`,
    clearFilters: '필터 초기화',
    count: (filtered: number, total: number, saved: number) => `총 ${total}개 중 ${filtered}개 표시 / 저장 ${saved}개`,
    emptyDescription: '더 넓은 키워드로 검색하거나 현재 검색을 초기화해보세요.',
    emptyTitle: '앱을 찾을 수 없습니다',
    grid: '그리드',
    initialStatus: '앱을 열거나 나중에 볼 수 있게 저장해보세요.',
    list: '목록',
    opened: (name: string, time: string) => `${name}을 ${time}에 열었습니다.`,
    openedAt: (time: string) => `${time}에 열림`,
    removeFavorite: (name: string) => `${name} 즐겨찾기 제거`,
    removed: (name: string) => `${name}을 저장 목록에서 제거했습니다.`,
    save: '저장',
    saved: '저장됨',
    savedForQuickAccess: (name: string) => `${name}을 빠른 접근용으로 저장했습니다.`,
    searchPlaceholder: '전체 앱 검색',
    viewApp: '앱 보기',
  },
} as const;

export const componentShowcaseText = {
  en: {
    clearPreviewSearch: 'Clear preview search',
    copyFailed: 'Copy failed.',
    copyLink: 'Copy Link',
    lastUpdated: (date: string) => `Last updated: ${date}`,
    linkCopied: 'Link copied.',
    moreOptions: 'More options',
    noSavedDescription: 'Save a preview from the card menu to keep it visible in this filtered view.',
    noSavedTitle: 'No saved previews here',
    noSearchDescription: 'Clear the search or try another component name.',
    noSearchTitle: 'No previews match this search',
    previewRemoved: 'Preview removed.',
    previewSaved: 'Preview saved.',
    removeSaved: 'Remove Saved',
    saveFailed: 'Save failed.',
    savePreview: 'Save Preview',
    saved: 'Saved',
    savedCount: (count: number) => `${count} saved`,
    savedOnly: 'Saved only',
    searchPlaceholder: 'Search previews',
    showAllPreviews: 'Show all previews',
    showingCount: (count: number) => `${count} showing`,
  },
  ko: {
    clearPreviewSearch: '미리보기 검색어 지우기',
    copyFailed: '복사에 실패했습니다.',
    copyLink: '링크 복사',
    lastUpdated: (date: string) => `마지막 업데이트: ${date}`,
    linkCopied: '링크를 복사했습니다.',
    moreOptions: '더보기',
    noSavedDescription: '카드 메뉴에서 미리보기를 저장하면 이 필터에서 계속 볼 수 있습니다.',
    noSavedTitle: '저장된 미리보기가 없습니다',
    noSearchDescription: '검색어를 지우거나 다른 컴포넌트 이름으로 검색해보세요.',
    noSearchTitle: '검색과 일치하는 미리보기가 없습니다',
    previewRemoved: '미리보기를 저장 목록에서 제거했습니다.',
    previewSaved: '미리보기를 저장했습니다.',
    removeSaved: '저장 해제',
    saveFailed: '저장에 실패했습니다.',
    savePreview: '미리보기 저장',
    saved: '저장됨',
    savedCount: (count: number) => `${count}개 저장됨`,
    savedOnly: '저장 항목만',
    searchPlaceholder: '미리보기 검색',
    showAllPreviews: '모든 미리보기 보기',
    showingCount: (count: number) => `${count}개 표시 중`,
  },
} as const;

type ComponentShowcaseCopy = {
  description: string;
  eyebrow?: string;
  sections: Record<string, { description: string; title: string }>;
  title: string;
  titleHighlight: string;
};

const componentShowcaseCopy: Record<AppLanguage, Record<string, ComponentShowcaseCopy>> = {
  en: {},
  ko: {
    'Power Apps|Accordion Components': {
      description: 'FAQ, 설정 패널, 정리된 정보 레이아웃에 쓰기 좋은 접이식 콘텐츠 섹션입니다.',
      eyebrow: 'Power Apps UI',
      title: 'Power Apps',
      titleHighlight: '아코디언 컴포넌트',
      sections: {
        'Accordion Plus': {
          description: '설정이나 도움말처럼 밀도 높은 콘텐츠에 어울리는 플러스/마이너스 아코디언입니다.',
          title: '플러스 아코디언',
        },
        'Classic Accordion': {
          description: '문서와 답변을 단순한 스택 형태로 정리하는 기본 아코디언입니다.',
          title: '클래식 아코디언',
        },
      },
    },
    'Power Apps|Animation Components': {
      description: '대시보드형 인터페이스에 어울리는 진행 상태와 피드백 애니메이션 패턴입니다.',
      eyebrow: '모션 라이브러리',
      title: 'Power Apps',
      titleHighlight: '애니메이션 컴포넌트',
      sections: {
        'Animated Line Chart': {
          description: 'KPI 또는 추세 위젯에 활용하기 좋은 그라디언트 차트 미리보기입니다.',
          title: '애니메이션 라인 차트',
        },
        'Animated Toggle': {
          description: '필터와 모드 전환에 쓰기 좋은 상태 전환 애니메이션 세그먼트 컨트롤입니다.',
          title: '애니메이션 토글',
        },
      },
    },
    'App Shells|Component': {
      description: '내비게이션, 유틸리티 패널, 콘텐츠 영역을 갖춘 애플리케이션 셸 패턴입니다.',
      eyebrow: '레이아웃 시스템',
      title: '앱 셸',
      titleHighlight: '컴포넌트',
      sections: {
        'Dashboard Shell': {
          description: '관리 도구와 내부 대시보드에 사용할 수 있는 기본 레이아웃입니다.',
          title: '대시보드 셸',
        },
      },
    },
    'Badge|Component': {
      description: '우선순위, 시스템 상태, 릴리스 마커를 표현하는 작은 상태 라벨입니다.',
      eyebrow: '상태 표시',
      title: '배지',
      titleHighlight: '컴포넌트',
      sections: {
        'Status Badges': {
          description: '성공, 경고, 초안, 검토 완료 상태를 표현하는 재사용 배지입니다.',
          title: '상태 배지',
        },
      },
    },
    'Power Apps|Button Components': {
      description: '주요 액션, 보조 액션, 아이콘 액션에 맞춘 버튼 패턴입니다.',
      eyebrow: '액션 라이브러리',
      title: 'Power Apps',
      titleHighlight: '버튼 컴포넌트',
      sections: {
        'Primary Button': {
          description: '우선순위가 높은 주요 액션을 명확하게 보여주는 버튼입니다.',
          title: '주요 버튼',
        },
        'Outline Buttons': {
          description: '보조 흐름에 어울리는 가벼운 강조 버튼입니다.',
          title: '아웃라인 버튼',
        },
        'Icon Buttons': {
          description: '아이콘 힌트와 액션 라벨을 함께 보여주는 버튼입니다.',
          title: '아이콘 버튼',
        },
      },
    },
    'Button Group|Component': {
      description: '모드 전환, 세그먼트 필터, 압축 액션을 위한 묶음 컨트롤입니다.',
      eyebrow: '액션 클러스터',
      title: '버튼 그룹',
      titleHighlight: '컴포넌트',
      sections: {
        'Segmented Controls': {
          description: '서로 가까운 옵션 사이를 전환하는 연결형 버튼 그룹입니다.',
          title: '세그먼트 컨트롤',
        },
      },
    },
    'Calendars|Component': {
      description: '예약, 일정, 팀 계획 화면에 사용할 수 있는 인터랙티브 캘린더 레이아웃입니다.',
      eyebrow: '날짜 선택',
      title: '캘린더',
      titleHighlight: '컴포넌트',
      sections: {
        'Date Picker': {
          description: '폼 안에서 날짜를 선택하기 좋은 가벼운 월간 보기입니다.',
          title: '날짜 선택기',
        },
        'Date Picker Plus': {
          description: '월 이동, 날짜 선택, 연결된 상세 패널을 갖춘 월간 날짜 선택기입니다.',
          title: '날짜 선택기 플러스',
        },
        'Schedule Board': {
          description: '빠른 날짜 선택과 간단한 일정 목록을 함께 제공하는 주간 캘린더입니다.',
          title: '스케줄 보드',
        },
      },
    },
  },
};

export const yamlLibraryText = {
  en: {
    clearSearch: 'Clear search',
    clearUploads: 'Clear uploads',
    clipboardBlocked: 'Clipboard access was blocked by the browser.',
    copiedToClipboard: 'YAML copied to clipboard.',
    converterDescription: 'Convert common YAML maps and arrays into JSON, or format JSON back into YAML.',
    converterModeLabel: 'Converter mode',
    converterTitle: 'YAML / JSON Converter',
    convertedOutputQueued: (extension: string) => `Converted ${extension.toUpperCase()} output queued for download.`,
    convertedPlaceholder: 'Converted output will appear here.',
    convert: 'Convert',
    convertBeforeDownload: 'Convert content before downloading output.',
    copy: (name: string) => `Copy ${name}`,
    copyOutput: 'Copy output',
    description: 'Upload, preview, and reuse configuration snippets in a React-friendly asset library.',
    download: 'Download',
    downloadAll: 'Download all',
    downloadFile: (name: string) => `Download ${name}`,
    featureCards: ['Typed upload state', 'Reusable template cards', 'Clipboard feedback'],
    fileImported: (name: string, lines: number) => `${name} imported with ${lines} lines.`,
    fileQueued: (name: string) => `${name} queued for download.`,
    filesQueued: (count: number) => `${count} uploaded YAML file${count === 1 ? '' : 's'} queued for download.`,
    highlight: 'YAML',
    importedLines: (lines: number) => `${lines} lines imported`,
    jsonConverted: 'JSON converted to YAML.',
    jsonSampleLoaded: 'JSON sample loaded.',
    loadSample: 'Load sample',
    noTemplatesDescription: 'Clear the query to see all starter templates.',
    noTemplatesTitle: 'No templates found',
    outputDownload: 'Download',
    pasteJson: 'Paste JSON here',
    pasteYaml: 'Paste YAML here',
    remove: (name: string) => `Remove ${name}`,
    restoredFiles: (count: number) => `Restored ${count} uploaded YAML file${count === 1 ? '' : 's'} from local storage.`,
    searchTemplates: 'Search templates',
    starterTemplates: 'Starter templates',
    title: 'Library',
    uploadFirst: 'Upload YAML files before downloading them.',
    uploadPrompt: 'Upload YAML files or copy a starter template.',
    uploadYaml: 'Upload YAML',
    uploadedFiles: 'Uploaded files',
    uploadsCleared: 'Uploaded YAML list cleared.',
    uploadRemoved: 'Uploaded YAML removed.',
    yamlConverted: 'YAML converted to JSON.',
    yamlSampleLoaded: 'YAML sample loaded.',
  },
  ko: {
    clearSearch: '검색어 지우기',
    clearUploads: '업로드 비우기',
    clipboardBlocked: '브라우저에서 클립보드 접근이 차단되었습니다.',
    copiedToClipboard: 'YAML을 클립보드에 복사했습니다.',
    converterDescription: '자주 쓰는 YAML 맵과 배열을 JSON으로 바꾸거나 JSON을 다시 YAML 형식으로 정리합니다.',
    converterModeLabel: '변환 모드',
    converterTitle: 'YAML / JSON 변환기',
    convertedOutputQueued: (extension: string) => `변환된 ${extension.toUpperCase()} 출력을 다운로드 대기열에 추가했습니다.`,
    convertedPlaceholder: '변환 결과가 여기에 표시됩니다.',
    convert: '변환',
    convertBeforeDownload: '출력을 다운로드하기 전에 내용을 변환하세요.',
    copy: (name: string) => `${name} 복사`,
    copyOutput: '출력 복사',
    description: '설정 스니펫을 업로드하고 미리 본 뒤 React 작업에 맞게 재사용하세요.',
    download: '다운로드',
    downloadAll: '전체 다운로드',
    downloadFile: (name: string) => `${name} 다운로드`,
    featureCards: ['타입 기반 업로드 상태', '재사용 템플릿 카드', '클립보드 피드백'],
    fileImported: (name: string, lines: number) => `${name} 파일을 ${lines}줄로 가져왔습니다.`,
    fileQueued: (name: string) => `${name} 다운로드를 준비했습니다.`,
    filesQueued: (count: number) => `업로드된 YAML 파일 ${count}개 다운로드를 준비했습니다.`,
    highlight: 'YAML',
    importedLines: (lines: number) => `${lines}줄 가져옴`,
    jsonConverted: 'JSON을 YAML로 변환했습니다.',
    jsonSampleLoaded: 'JSON 샘플을 불러왔습니다.',
    loadSample: '샘플 불러오기',
    noTemplatesDescription: '검색어를 지우면 모든 시작 템플릿을 볼 수 있습니다.',
    noTemplatesTitle: '템플릿을 찾을 수 없습니다',
    outputDownload: '다운로드',
    pasteJson: 'JSON을 여기에 붙여넣기',
    pasteYaml: 'YAML을 여기에 붙여넣기',
    remove: (name: string) => `${name} 제거`,
    restoredFiles: (count: number) => `로컬 저장소에서 업로드된 YAML 파일 ${count}개를 복원했습니다.`,
    searchTemplates: '템플릿 검색',
    starterTemplates: '시작 템플릿',
    title: '라이브러리',
    uploadFirst: '다운로드하기 전에 YAML 파일을 업로드하세요.',
    uploadPrompt: 'YAML 파일을 업로드하거나 시작 템플릿을 복사해보세요.',
    uploadYaml: 'YAML 업로드',
    uploadedFiles: '업로드한 파일',
    uploadsCleared: '업로드된 YAML 목록을 비웠습니다.',
    uploadRemoved: '업로드한 YAML을 제거했습니다.',
    yamlConverted: 'YAML을 JSON으로 변환했습니다.',
    yamlSampleLoaded: 'YAML 샘플을 불러왔습니다.',
  },
} as const;

const yamlTemplateCopy: Record<AppLanguage, Record<string, { description: string; title: string }>> = {
  en: {},
  ko: {
    'app-config': {
      description: '환경, 기능 플래그, API 엔드포인트 예시입니다.',
      title: '애플리케이션 설정',
    },
    'docker-compose': {
      description: '로컬 개발을 위한 작은 웹/데이터베이스 스택입니다.',
      title: 'Docker Compose 서비스',
    },
    'github-action': {
      description: '푸시 시 의존성 설치, 타입체크, 빌드를 실행합니다.',
      title: 'GitHub Actions 워크플로',
    },
  },
};

const fullAppHighlightCopy: Record<AppLanguage, Record<string, string[]>> = {
  en: {},
  ko: {
    'Chrome Extensions': ['매니페스트 설계', '팝업 미리보기', '권한 체크리스트'],
    'Feedback App': ['평점 대시보드', '리뷰 워크플로', '응답 추적'],
    'Project Management App': ['작업 보드', '타임라인 지표', '팀 현황'],
    'Cleaning Confirmation': ['예약 상세', '서비스 상태', '고객 확인'],
    default: ['재사용 섹션', '타입 데이터', '반응형 레이아웃'],
  },
};

export const homeText = {
  en: {
    childrenCount: (count: number) => `${count} child pages`,
    clearSearch: 'Clear search',
    connectedGroups: 'Connected groups',
    currentStructure: 'Current structure',
    description: [
      'Components, full apps, libraries, tools, and MCP resources are organized into one workspace.',
      'Find implemented screens quickly and jump directly into the next area of work.',
    ],
    eyebrow: 'React + TypeScript work hub',
    featureCards: [
      {
        description: 'Components, apps, libraries, tools, and MCP screens are searchable from one flow.',
        title: 'Visible structure for work',
      },
      {
        description: 'The pages are real interfaces with search, saved state, uploads, exports, and interaction flows.',
        title: 'Demo surfaces with real behavior',
      },
      {
        description: 'Shared cards, buttons, sections, search, and navigation patterns keep the next page fast to build.',
        title: 'Easy foundation to extend',
      },
    ],
    majorSections: 'Major sections',
    note: [
      'Routing, catalog data, search, dark mode, and sidebar navigation are connected.',
      'The next step is to keep filling each demo with production-like behavior and QA coverage.',
    ],
    open: 'Open',
    projectMap: 'Project map',
    quickActions: 'Quick actions',
    quickActionsDescription: 'Jump into a major section and scan the current structure.',
    searchButton: 'Go now',
    searchNoResults: 'No search results.',
    searchPlaceholder: 'Search components, pages, or tools...',
    searchResults: 'Search results',
    searchTryDifferent: 'Try another keyword.',
    searchablePages: 'Searchable pages',
    suggestedSearches: [
      { label: 'Buttons', query: 'Buttons' },
      { label: 'Chrome Extensions', query: 'Chrome Extensions' },
      { label: 'SVG Editor', query: 'SVG Editor' },
      { label: 'Form Builder', query: 'Form Builder' },
    ],
    title: 'Check the Solucioneomos build progress at a glance',
    viewComponents: 'Start with components',
    workPrinciples: 'Work principles',
    workPrinciplesDescription: 'The structure favors pages that are easy to find, extend, and verify while sharing the same common components and layout data.',
  },
  ko: {
    childrenCount: (count: number) => `${count}개의 하위 페이지`,
    clearSearch: '검색어 지우기',
    connectedGroups: '연결된 그룹',
    currentStructure: '현재 구성',
    description: [
      '컴포넌트, 전체 앱, 라이브러리, 도구, MCP 자료를 하나의 작업 공간으로 정리했습니다.',
      '구현된 화면을 빠르게 찾고 다음 작업 지점으로 바로 이동할 수 있습니다.',
    ],
    eyebrow: 'React + TypeScript 작업 허브',
    featureCards: [
      {
        description: '컴포넌트, 앱, 라이브러리, 도구, MCP 화면을 하나의 흐름에서 검색하고 이동할 수 있습니다.',
        title: '구조가 보이는 작업 허브',
      },
      {
        description: '검색, 저장 상태, 업로드, 내보내기, 상태 변경까지 확인할 수 있는 실제 화면을 목표로 합니다.',
        title: '실제 동작 중심 데모',
      },
      {
        description: '공용 카드, 버튼, 섹션, 검색, 내비게이션 패턴을 재사용해 다음 화면 제작 속도를 높입니다.',
        title: '확장하기 쉬운 기반',
      },
    ],
    majorSections: '주요 섹션',
    note: [
      '라우팅, 카탈로그 데이터, 검색, 다크 모드, 사이드바 이동 흐름이 연결되어 있습니다.',
      '다음 단계는 각 데모에 실제 기능과 브라우저 QA 범위를 계속 채워 넣는 작업입니다.',
    ],
    open: '열기',
    projectMap: '프로젝트 맵',
    quickActions: '빠른 이동',
    quickActionsDescription: '주요 섹션으로 바로 이동해 전체 구조를 둘러보세요.',
    searchButton: '바로 이동',
    searchNoResults: '검색 결과가 없습니다.',
    searchPlaceholder: '컴포넌트, 페이지, 도구를 검색해보세요...',
    searchResults: '검색 결과',
    searchTryDifferent: '다른 키워드로 다시 검색해보세요.',
    searchablePages: '검색 가능한 화면',
    suggestedSearches: [
      { label: '버튼', query: '버튼' },
      { label: '크롬 확장', query: '크롬 확장' },
      { label: 'SVG 에디터', query: 'svg 에디터' },
      { label: '폼 빌더', query: '폼 빌더' },
    ],
    title: '솔루시오모스 제작 현황을 한눈에 확인하세요',
    viewComponents: '컴포넌트부터 보기',
    workPrinciples: '작업 기준',
    workPrinciplesDescription: '화면을 찾기 쉽고 확장하기 쉬운 구조로 유지하면서, 각 섹션이 같은 공용 컴포넌트와 라우트 데이터를 공유하도록 정리했습니다.',
  },
} as const;

export const asideItems = {
  en: [
    { title: 'Build note', description: 'Home, routing, search, and dark mode are connected.' },
    { title: 'Suggested path', description: 'Start with Components or Tools to inspect reusable patterns.' },
    { title: 'Next work', description: 'Keep improving copy, interactions, and responsive QA by page.' },
    { title: 'Verification', description: 'Typecheck and production build should stay green after each batch.' },
    { title: 'Content rule', description: 'Replace placeholder copy with sentences that reveal purpose and flow.' },
    { title: 'Resources', description: 'Shared components and catalog data make it easier to expand pages.' },
  ],
  ko: [
    { title: '시작 메모', description: '홈, 라우팅, 검색, 다크 모드 구조가 연결된 상태입니다.' },
    { title: '추천 탐색', description: 'Components 또는 Tools 섹션에서 재사용 패턴을 먼저 확인하세요.' },
    { title: '다음 작업', description: '페이지별 문구, 인터랙션, 반응형 상태를 순서대로 다듬으면 좋습니다.' },
    { title: '검증 상태', description: '작업 단위마다 타입체크와 프로덕션 빌드가 통과하도록 유지합니다.' },
    { title: '콘텐츠 기준', description: '임시 문구는 목적과 사용 흐름이 드러나는 문장으로 정리합니다.' },
    { title: '리소스', description: '공용 컴포넌트와 카탈로그 데이터를 기반으로 페이지를 확장합니다.' },
  ],
} as const;

const routeCopy: Record<AppLanguage, Record<string, LocalizedRouteCopy>> = {
  en: {},
  ko: {
    home: { label: '홈', description: '전체 쇼케이스와 검색 경험을 위한 통합 시작 화면입니다.', keywords: ['시작', '메인'] },
    components: { label: '컴포넌트', description: '재사용 가능한 인터페이스 빌딩 블록과 인터랙션 패턴입니다.', keywords: ['구성 요소', 'ui'] },
    'full-apps': { label: '전체 앱', description: '여러 UI 블록을 조합한 완성형 워크플로 데모입니다.', keywords: ['데모', '업무 앱'] },
    libraries: { label: '라이브러리', description: '재사용 가능한 에셋 모음과 큐레이션 리소스입니다.', keywords: ['자료', '에셋'] },
    tools: { label: '도구', description: '프로토타입, 변환, 에셋 편집을 위한 집중형 유틸리티입니다.', keywords: ['툴', '유틸리티'] },
    mcp: { label: 'MCP', description: 'Model Context Protocol 개요와 쇼케이스 진입점입니다.', keywords: ['모델 컨텍스트'] },
    '/': { label: '홈', description: '전체 쇼케이스와 검색 경험을 위한 통합 시작 화면입니다.', keywords: ['시작', '메인'] },
    '/components': { label: '컴포넌트', description: '재사용 가능한 인터페이스 빌딩 블록과 인터랙션 패턴입니다.', keywords: ['구성 요소', 'ui'] },
    '/components/accordions': { label: '아코디언', description: '펼치고 접는 인터랙티브 아코디언 컴포넌트입니다.', keywords: ['접기', '펼치기'] },
    '/components/animations': { label: '애니메이션', description: '전환 효과와 모션 패턴입니다.', keywords: ['모션', '전환'] },
    '/components/app-shells': { label: '앱 셸', description: '애플리케이션 기본 레이아웃 템플릿입니다.', keywords: ['레이아웃', '셸'] },
    '/components/badge': { label: '배지', description: '상태와 태그를 표현하는 컴포넌트입니다.', keywords: ['태그', '상태'] },
    '/components/buttons': { label: '버튼', description: '버튼 스타일과 변형 패턴입니다.', keywords: ['액션', 'cta'] },
    '/components/button-group': { label: '버튼 그룹', description: '묶음 버튼과 세그먼트 컨트롤 컴포넌트입니다.', keywords: ['세그먼트', '컨트롤'] },
    '/components/calendars': { label: '캘린더', description: '캘린더와 날짜 선택 컴포넌트입니다.', keywords: ['날짜', '일정'] },
    '/components/cards': { label: '카드', description: '카드형 레이아웃 컴포넌트입니다.', keywords: ['패널', '표면'] },
    '/components/drawer': { label: '드로어', description: '드로어와 사이드 패널 컴포넌트입니다.', keywords: ['패널', '시트'] },
    '/components/dropdowns': { label: '드롭다운', description: '드롭다운 메뉴 컴포넌트입니다.', keywords: ['메뉴', '선택'] },
    '/components/gallery': { label: '갤러리', description: '이미지 갤러리 컴포넌트입니다.', keywords: ['이미지', '미디어'] },
    '/components/input-fields': { label: '입력 필드', description: '폼 입력 필드 컴포넌트입니다.', keywords: ['폼', '입력'] },
    '/components/modals': { label: '모달', description: '모달과 다이얼로그 컴포넌트입니다.', keywords: ['대화상자', '오버레이'] },
    '/components/navigation-bars': { label: '내비게이션 바', description: '상단 내비게이션 컴포넌트입니다.', keywords: ['헤더', '메뉴'] },
    '/components/sidebar': { label: '사이드바', description: '사이드바 레이아웃 컴포넌트입니다.', keywords: ['사이드 내비', '탐색'] },
    '/components/steppers': { label: '스테퍼', description: '단계 진행과 프로그레스 컴포넌트입니다.', keywords: ['단계', '진행'] },
    '/components/tabs': { label: '탭', description: '탭 전환 컴포넌트입니다.', keywords: ['탭', '전환'] },
    '/components/toggles': { label: '토글', description: '토글과 스위치 컴포넌트입니다.', keywords: ['스위치', '설정'] },
    '/full-apps': { label: '전체 앱', description: '여러 UI 블록을 조합한 완성형 워크플로 데모입니다.', keywords: ['데모', '업무 앱'] },
    '/full-apps/chrome-extensions': { label: '크롬 확장', description: '크롬 확장 템플릿과 Power Apps 설치 워크플로입니다.', keywords: ['확장', '크롬'] },
    '/full-apps/cleaning-confirmation': { label: '청소 확인', description: '서비스 확인과 일정 관리 애플리케이션입니다.', keywords: ['청소', '방문', '서비스'] },
    '/full-apps/feedback-app': { label: '피드백 앱', description: '고객 피드백과 평점을 관리하는 완성형 앱입니다.', keywords: ['후기', '리뷰', '고객 의견'] },
    '/full-apps/project-management': { label: '프로젝트 관리', description: '분석과 작업 관리를 포함한 프로젝트 추적 앱입니다.', keywords: ['프로젝트', '작업', '칸반'] },
    '/libraries': { label: '라이브러리', description: '재사용 가능한 에셋 모음과 큐레이션 리소스입니다.', keywords: ['자료', '에셋'] },
    '/libraries/custom-svg-library': { label: '커스텀 SVG 라이브러리', description: '커스텀 SVG 아이콘을 가져오고 정리하는 도구입니다.', keywords: ['아이콘', '벡터'] },
    '/libraries/yaml-library': { label: 'YAML 라이브러리', description: '재사용 가능한 YAML 자산을 저장하고 관리합니다.', keywords: ['설정', '스키마'] },
    '/mcp': { label: 'MCP', description: 'Model Context Protocol 개요와 쇼케이스 진입점입니다.', keywords: ['모델 컨텍스트'] },
    '/tools': { label: '도구', description: '프로토타입, 변환, 에셋 편집을 위한 집중형 유틸리티입니다.', keywords: ['툴', '유틸리티'] },
    '/tools/form-builder': { label: '폼 빌더', description: '시각적 워크플로로 폼을 만드는 도구입니다.', keywords: ['폼', '양식'] },
    '/tools/logo-generator': { label: '로고 생성기', description: '빠른 브랜드 콘셉트를 위한 로고 제작 워크플로입니다.', keywords: ['로고', '브랜드'] },
    '/tools/powerts-toolkit': { label: 'PowerT 툴킷', description: 'PowerT 코드를 React 또는 JavaScript 구현으로 변환합니다.', keywords: ['변환', '타입스크립트'] },
    '/tools/svg-editor': { label: 'SVG 에디터', description: 'SVG 에셋을 편집하고 미리보기, 내보내기까지 처리합니다.', keywords: ['svg', '벡터', '편집'] },
  },
};

const categoryCopy: Record<AppLanguage, Record<string, string>> = {
  en: {},
  ko: {
    Sections: '섹션',
    Components: '컴포넌트',
    'Full Apps': '전체 앱',
    Libraries: '라이브러리',
    Tools: '도구',
    MCP: 'MCP',
    assets: '에셋',
    builder: '빌더',
    conversion: '변환',
    extension: '확장',
    feedback: '피드백',
    'field service': '현장 서비스',
    forms: '폼',
    fundamentals: '기본',
    generator: '생성기',
    graphics: '그래픽',
    layout: '레이아웃',
    media: '미디어',
    motion: '모션',
    navigation: '내비게이션',
    operations: '운영',
    workflow: '워크플로',
  },
};

const badgeCopy: Record<AppLanguage, Record<string, string>> = {
  en: {},
  ko: {
    FEATURED: '추천',
    FREE: '무료',
    New: '신규',
    NEW: '신규',
    PRO: '프로',
  },
};

export function localizeBadge(language: AppLanguage, badge: string | undefined) {
  if (!badge) {
    return badge;
  }

  return badgeCopy[language][badge] ?? badge;
}

export function localizeCategory(language: AppLanguage, category: string | undefined) {
  if (!category) {
    return category;
  }

  return categoryCopy[language][category] ?? category;
}

export function localizeRouteLabel(language: AppLanguage, keyOrPath: string, fallback: string) {
  return routeCopy[language][keyOrPath]?.label ?? fallback;
}

export function localizeRouteDescription(language: AppLanguage, keyOrPath: string, fallback: string) {
  return routeCopy[language][keyOrPath]?.description ?? fallback;
}

export function localizeSearchItem(language: AppLanguage, item: SearchItem): SearchItem {
  const copy = routeCopy[language][item.path] ?? {};

  return {
    ...item,
    category: localizeCategory(language, item.category) ?? item.category,
    description: copy.description ?? item.description,
    keywords: [...item.keywords, ...(copy.keywords ?? [])],
    name: copy.label ?? item.name,
  };
}

export function getCatalogItemCopy(language: AppLanguage, item: CatalogItem) {
  const copy = routeCopy[language][item.path] ?? {};

  return {
    category: localizeCategory(language, item.category),
    description: copy.description ?? item.description,
    name: copy.label ?? item.name,
  };
}

export function getCatalogSearchText(language: AppLanguage, item: CatalogItem) {
  const copy = routeCopy[language][item.path] ?? {};

  return [
    item.name,
    item.description,
    item.category ?? '',
    copy.label ?? '',
    copy.description ?? '',
    ...(copy.keywords ?? []),
    localizeCategory(language, item.category) ?? '',
  ];
}

export function getFullAppHighlights(language: AppLanguage, appName: string, fallback: string[]) {
  return fullAppHighlightCopy[language][appName] ?? fullAppHighlightCopy[language].default ?? fallback;
}

export function getYamlTemplateCopy<TTemplate extends YamlTemplateLike>(language: AppLanguage, template: TTemplate) {
  const copy = yamlTemplateCopy[language][template.id];

  return {
    ...template,
    description: copy?.description ?? template.description,
    title: copy?.title ?? template.title,
  };
}

export function getYamlTemplateSearchText(language: AppLanguage, template: YamlTemplateLike) {
  const copy = yamlTemplateCopy[language][template.id];

  return [
    template.title,
    template.description,
    template.code,
    copy?.title ?? '',
    copy?.description ?? '',
  ];
}

export function getComponentShowcaseConfigCopy(language: AppLanguage, config: ComponentShowcaseConfig): ComponentShowcaseConfig {
  const copy = componentShowcaseCopy[language][`${config.title}|${config.titleHighlight}`];

  if (!copy) {
    return config;
  }

  return {
    ...config,
    description: copy.description,
    eyebrow: copy.eyebrow ?? config.eyebrow,
    sections: config.sections.map((section) => {
      const sectionCopy = copy.sections[section.title];

      return {
        ...section,
        description: sectionCopy?.description ?? section.description,
        id: section.id ?? section.title,
        title: sectionCopy?.title ?? section.title,
      };
    }),
    title: copy.title,
    titleHighlight: copy.titleHighlight,
  };
}
