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
    sectionOverview: 'View section overview',
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
    sectionOverview: '섹션 전체 보기',
  },
} as const;

export const searchModalText = {
  en: {
    clearAll: 'Clear all',
    clearSearch: 'Clear search',
    closeSearch: 'Close search',
    closeSearchModal: 'Close search modal',
    empty: 'Search any page or component to jump there quickly.',
    noRecent: 'No recent searches',
    noResults: (query: string) => `No results found for "${query}"`,
    placeholder: 'Search pages, components, and tools...',
    recent: 'Recent Searches',
    removeRecent: (name: string) => `Remove ${name} from recent searches`,
    tryDifferent: 'Try a simpler keyword or a different page name.',
    tryExamples: 'Try "button", "modal", "svg", or "project".',
  },
  ko: {
    clearAll: '전체 삭제',
    clearSearch: '검색어 지우기',
    closeSearch: '검색 닫기',
    closeSearchModal: '검색 창 닫기',
    empty: '찾고 싶은 화면이나 컴포넌트를 바로 검색해보세요.',
    noRecent: '최근 검색이 없습니다',
    noResults: (query: string) => `"${query}"에 대한 결과가 없습니다`,
    placeholder: '페이지, 컴포넌트, 도구 검색...',
    recent: '최근 검색',
    removeRecent: (name: string) => `${name} 최근 검색에서 제거`,
    tryDifferent: '더 짧은 키워드나 다른 화면 이름으로 다시 찾아보세요',
    tryExamples: '"버튼", "모달", "svg", "프로젝트"처럼 입력해보세요',
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
    searchAgain: 'Try a different keyword.',
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
      description: 'Browse ready-to-use UI pieces and open the exact pattern you need.',
      searchPlaceholder: 'Search components...',
      title: 'Library',
      titleHighlight: 'Component',
    },
    libraries: {
      description: 'Keep shared assets, snippets, and reusable building blocks easy to find.',
      searchPlaceholder: 'Search libraries...',
      title: 'Libraries',
      titleHighlight: 'Your',
    },
    tools: {
      description: 'Open small, focused tools for editing assets and speeding up build work.',
      searchPlaceholder: 'Search tools...',
      title: 'Tools',
    },
  },
  ko: {
    components: {
      description: '필요한 UI 조각을 빠르게 찾고, 바로 열어 확인하세요.',
      searchPlaceholder: '컴포넌트 검색...',
      title: '라이브러리',
      titleHighlight: '컴포넌트',
    },
    libraries: {
      description: '공용 에셋과 스니펫을 한곳에 모아 다시 쓰기 쉽게 정리하세요.',
      searchPlaceholder: '라이브러리 검색...',
      title: '라이브러리',
      titleHighlight: '내',
    },
    tools: {
      description: '에셋 편집과 제작 보조 도구를 열어 작업 속도를 높이세요.',
      searchPlaceholder: '도구 검색...',
      title: '도구',
    },
  },
} as const;

export const fullAppsPageText = {
  en: {
    description: 'Open complete app-style screens and see how the shared pieces work together.',
    highlight: 'Full',
    title: 'Apps',
  },
  ko: {
    description: '공용 컴포넌트를 조합한 완성형 화면을 열어 실제 흐름을 확인하세요.',
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
    noSavedDescription: 'Use the card menu to pin previews you want to revisit.',
    noSavedTitle: 'No saved previews yet',
    noSearchDescription: 'Clear the search or try the name of another component.',
    noSearchTitle: 'No previews match this search',
    previewRemoved: 'Preview removed.',
    previewSaved: 'Preview saved.',
    removeSaved: 'Remove Saved',
    saveFailed: 'Save failed.',
    savePreview: 'Save Preview',
    saved: 'Saved',
    savedCount: (count: number) => `${count} saved`,
    savedOnly: 'Only saved',
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
    noSavedDescription: '다시 보고 싶은 미리보기는 카드 메뉴에서 저장해두세요.',
    noSavedTitle: '아직 저장한 미리보기가 없습니다',
    noSearchDescription: '검색어를 지우거나 다른 컴포넌트 이름으로 찾아보세요.',
    noSearchTitle: '검색어와 맞는 미리보기가 없습니다',
    previewRemoved: '미리보기를 저장 목록에서 제거했습니다.',
    previewSaved: '미리보기를 저장했습니다.',
    removeSaved: '저장 해제',
    saveFailed: '저장에 실패했습니다.',
    savePreview: '미리보기 저장',
    saved: '저장됨',
    savedCount: (count: number) => `${count}개 저장됨`,
    savedOnly: '저장한 것만',
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
      description: '긴 설명을 접어두고, 사용자가 필요한 내용만 차분히 열어볼 수 있게 합니다.',
      eyebrow: 'Power Apps UI',
      title: 'Power Apps',
      titleHighlight: '아코디언',
      sections: {
        'Accordion Plus': {
          description: '설정이나 도움말처럼 내용이 많은 화면에서 현재 열린 항목을 분명하게 보여줍니다.',
          title: '플러스 아코디언',
        },
        'Classic Accordion': {
          description: '문서, FAQ, 안내 문구를 가볍게 쌓아두고 필요할 때 펼쳐보는 기본형입니다.',
          title: '클래식 아코디언',
        },
      },
    },
    'Power Apps|Animation Components': {
      description: '숫자와 상태 변화가 갑자기 튀지 않도록 화면에 부드러운 흐름을 더합니다.',
      eyebrow: '모션 라이브러리',
      title: 'Power Apps',
      titleHighlight: '애니메이션',
      sections: {
        'Animated Line Chart': {
          description: '지표가 바뀌는 느낌을 자연스럽게 보여주는 간단한 차트 모션입니다.',
          title: '애니메이션 라인 차트',
        },
        'Animated Toggle': {
          description: '필터나 보기 모드를 바꿀 때 선택 상태가 부드럽게 이동합니다.',
          title: '애니메이션 토글',
        },
      },
    },
    'App Shells|Component': {
      description: '업무 화면의 기본 골격을 빠르게 잡을 수 있는 앱 레이아웃입니다.',
      eyebrow: '레이아웃 시스템',
      title: '앱 셸',
      titleHighlight: '컴포넌트',
      sections: {
        'Dashboard Shell': {
          description: '사이드 메뉴와 본문 영역이 필요한 관리자 화면에 바로 맞는 구조입니다.',
          title: '대시보드 셸',
        },
      },
    },
    'Badge|Component': {
      description: '상태와 우선순위를 짧은 라벨로 보여줘 화면을 빠르게 읽게 합니다.',
      eyebrow: '상태 표시',
      title: '배지',
      titleHighlight: '컴포넌트',
      sections: {
        'Status Badges': {
          description: '성공, 대기, 차단, 검토 완료처럼 자주 쓰는 상태를 한눈에 구분합니다.',
          title: '상태 배지',
        },
      },
    },
    'Power Apps|Button Components': {
      description: '사용자가 다음에 무엇을 누르면 되는지 명확하게 안내하는 버튼 모음입니다.',
      eyebrow: '액션 라이브러리',
      title: 'Power Apps',
      titleHighlight: '버튼',
      sections: {
        'Primary Button': {
          description: '저장, 확인, 시작처럼 가장 중요한 행동을 또렷하게 보여줍니다.',
          title: '주요 버튼',
        },
        'Outline Buttons': {
          description: '취소, 보조 선택, 덜 중요한 행동을 부담 없이 배치할 때 좋습니다.',
          title: '아웃라인 버튼',
        },
        'Icon Buttons': {
          description: '아이콘과 라벨을 함께 써서 작은 공간에서도 의미를 놓치지 않게 합니다.',
          title: '아이콘 버튼',
        },
      },
    },
    'Button Group|Component': {
      description: '서로 관련된 선택지를 가까이 묶어 빠르게 전환할 수 있게 합니다.',
      eyebrow: '액션 클러스터',
      title: '버튼 그룹',
      titleHighlight: '컴포넌트',
      sections: {
        'Segmented Controls': {
          description: '개요, 활동, 파일처럼 같은 레벨의 보기 옵션을 한 줄에서 전환합니다.',
          title: '세그먼트 컨트롤',
        },
      },
    },
    'Calendars|Component': {
      description: '예약, 일정, 팀 계획을 날짜 중심으로 편하게 살펴보는 화면입니다.',
      eyebrow: '날짜 선택',
      title: '캘린더',
      titleHighlight: '컴포넌트',
      sections: {
        'Date Picker': {
          description: '폼 안에서 날짜 하나를 빠르게 고를 수 있는 가벼운 월간 보기입니다.',
          title: '날짜 선택기',
        },
        'Date Picker Plus': {
          description: '월 이동과 날짜 상세를 함께 보여줘 예약 흐름에 바로 붙이기 좋습니다.',
          title: '날짜 선택기 플러스',
        },
        'Schedule Board': {
          description: '요일별 일정을 고르고 바로 아래에서 할 일을 확인하는 주간 보드입니다.',
          title: '스케줄 보드',
        },
      },
    },
    'Cards|Component': {
      description: '서로 다른 정보를 한 덩어리로 묶어 보기 좋게 정리합니다.',
      eyebrow: '콘텐츠 표면',
      title: '카드',
      titleHighlight: '컴포넌트',
      sections: {
        'Product Card': {
          description: '제품 설명, 가격, 상세 액션을 한 카드 안에서 자연스럽게 보여줍니다.',
          title: '제품 카드',
        },
      },
    },
    'Drawer|Component': {
      description: '화면을 떠나지 않고 설정이나 상세 내용을 옆에서 확인하게 합니다.',
      eyebrow: '패널과 오버레이',
      title: '드로어',
      titleHighlight: '컴포넌트',
      sections: {
        'Side Drawer': {
          description: '본문은 그대로 두고, 필요한 설정만 옆 패널에서 빠르게 다룹니다.',
          title: '사이드 드로어',
        },
      },
    },
    'Dropdowns|Component': {
      description: '자주 쓰는 작업을 접어두었다가 필요한 순간에 꺼내 씁니다.',
      eyebrow: '선택 메뉴',
      title: '드롭다운',
      titleHighlight: '컴포넌트',
      sections: {
        'Menu Dropdown': {
          description: '이름 변경, 복제, 공유처럼 항목별 작업을 깔끔하게 묶어둡니다.',
          title: '메뉴 드롭다운',
        },
      },
    },
    'Gallery|Component': {
      description: '이미지나 시각 자료를 고르고 비교하기 좋은 갤러리 레이아웃입니다.',
      eyebrow: '미디어 레이아웃',
      title: '갤러리',
      titleHighlight: '컴포넌트',
      sections: {
        'Photo Grid': {
          description: '큰 미리보기와 작은 썸네일을 함께 두어 선택 흐름을 분명하게 만듭니다.',
          title: '사진 그리드',
        },
      },
    },
    'Input Fields|Component': {
      description: '입력값을 받고 바로 검증 상태를 알려주는 기본 폼 요소입니다.',
      eyebrow: '폼 컨트롤',
      title: '입력 필드',
      titleHighlight: '컴포넌트',
      sections: {
        'Text Input': {
          description: '사용자가 입력하는 동안 바로 사용할 수 있는 값인지 안내합니다.',
          title: '텍스트 입력',
        },
      },
    },
    'Modals|Component': {
      description: '중요한 선택을 잠깐 멈춰 확인하게 만드는 집중형 창입니다.',
      eyebrow: '포커스 상태',
      title: '모달',
      titleHighlight: '컴포넌트',
      sections: {
        'Confirmation Modal': {
          description: '삭제처럼 되돌리기 어려운 행동을 실행하기 전에 한 번 더 확인합니다.',
          title: '확인 모달',
        },
      },
    },
    'Navigation Bars|Component': {
      description: '화면 상단에서 주요 이동 경로와 시작 액션을 함께 보여줍니다.',
      eyebrow: '전역 내비게이션',
      title: '내비게이션 바',
      titleHighlight: '컴포넌트',
      sections: {
        'Top Navigation': {
          description: '로고, 주요 링크, 시작 버튼을 한 줄에 배치해 첫 탐색을 쉽게 만듭니다.',
          title: '상단 내비게이션',
        },
      },
    },
    'Sidebar|Component': {
      description: '메뉴가 많은 업무 화면에서도 현재 위치를 잃지 않게 도와줍니다.',
      eyebrow: '내비게이션 패턴',
      title: '사이드바',
      titleHighlight: '컴포넌트',
      sections: {
        'Collapsible Sidebar': {
          description: '넓을 때는 펼쳐 쓰고, 공간이 부족할 때는 접어서 본문을 확보합니다.',
          title: '접이식 사이드바',
        },
      },
    },
    'Steppers|Component': {
      description: '여러 단계로 나뉜 작업에서 지금 어디까지 왔는지 알려줍니다.',
      eyebrow: '워크플로 진행',
      title: '스테퍼',
      titleHighlight: '컴포넌트',
      sections: {
        'Progress Stepper': {
          description: '입력, 설정, 검토, 출시처럼 순서가 있는 흐름에 잘 맞습니다.',
          title: '진행 스테퍼',
        },
      },
    },
    'Tabs|Component': {
      description: '같은 공간에서 관련 정보를 나눠 보여주고 빠르게 전환합니다.',
      eyebrow: '콘텐츠 전환',
      title: '탭',
      titleHighlight: '컴포넌트',
      sections: {
        'Horizontal Tabs': {
          description: '개요, 상세, 기록처럼 가까운 정보를 한 영역 안에서 오갈 수 있습니다.',
          title: '가로 탭',
        },
      },
    },
    'Toggles|Component': {
      description: '켜고 끄는 설정을 짧고 분명하게 바꿀 수 있게 합니다.',
      eyebrow: '이진 컨트롤',
      title: '토글',
      titleHighlight: '컴포넌트',
      sections: {
        'Switch Toggle': {
          description: '알림이나 기능 옵션처럼 즉시 바뀌는 설정에 잘 어울립니다.',
          title: '스위치 토글',
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
    convertedOutputQueued: (extension: string) => `${extension.toUpperCase()} output is ready to download.`,
    convertedPlaceholder: 'Converted output will appear here.',
    convert: 'Convert',
    convertBeforeDownload: 'Convert content before downloading output.',
    copy: (name: string) => `Copy ${name}`,
    copyOutput: 'Copy output',
    description: 'Upload, preview, convert, and reuse configuration snippets in one place.',
    download: 'Download',
    downloadAll: 'Download all',
    downloadFile: (name: string) => `Download ${name}`,
    featureCards: ['Safe upload history', 'Ready-made templates', 'Copy feedback'],
    fileImported: (name: string, lines: number) => `${name} imported with ${lines} lines.`,
    fileQueued: (name: string) => `${name} is ready to download.`,
    filesQueued: (count: number) => `${count} uploaded YAML file${count === 1 ? '' : 's'} ready to download.`,
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
    description: '자주 쓰는 YAML 설정을 업로드하고, 변환하고, 다시 꺼내 쓰세요.',
    download: '다운로드',
    downloadAll: '전체 다운로드',
    downloadFile: (name: string) => `${name} 다운로드`,
    featureCards: ['안전한 업로드 기록', '바로 쓰는 템플릿', '복사 상태 안내'],
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
      description: '환경값, 기능 플래그, API 주소를 한 번에 정리한 예시입니다.',
      title: '애플리케이션 설정',
    },
    'docker-compose': {
      description: '로컬에서 웹과 데이터베이스를 함께 띄우는 기본 구성입니다.',
      title: 'Docker Compose 서비스',
    },
    'github-action': {
      description: '푸시 후 설치, 타입체크, 빌드를 자동으로 확인하는 흐름입니다.',
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
    default: ['다시 쓰는 섹션', '정리된 데이터', '반응형 화면'],
  },
};

export const homeText = {
  en: {
    childrenCount: (count: number) => `${count} pages inside`,
    clearSearch: 'Clear search',
    connectedGroups: 'Connected groups',
    currentStructure: 'Current structure',
    description: [
      'Components, apps, libraries, tools, and MCP resources live in one practical workspace.',
      'Search what is already built, open it quickly, and keep the next improvement moving.',
    ],
    eyebrow: 'React + TypeScript work hub',
    featureCards: [
      {
        description: 'Every section can be searched from one place, so you can move without hunting through menus.',
        title: 'Find the right screen fast',
      },
      {
        description: 'The demos keep state, accept input, export files, and respond like working product screens.',
        title: 'More than static mockups',
      },
      {
        description: 'Shared cards, buttons, search, and navigation patterns make each next page easier to finish.',
        title: 'Built to keep growing',
      },
    ],
    majorSections: 'Major sections',
    note: [
      'Routing, catalog data, search, dark mode, and sidebar navigation are already connected.',
      'The next pass can focus on richer interactions, cleaner copy, and visual QA by page.',
    ],
    open: 'Open',
    projectMap: 'Project map',
    quickActions: 'Quick actions',
    quickActionsDescription: 'Open a major section and see what is ready to improve next.',
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
    title: 'See the Solucioneomos workspace in one clear view',
    viewComponents: 'Start with components',
    workPrinciples: 'Work principles',
    workPrinciplesDescription: 'The workspace is shaped around screens that are easy to find, extend, and verify while sharing the same layout and catalog data.',
  },
  ko: {
    childrenCount: (count: number) => `${count}개의 하위 페이지`,
    clearSearch: '검색어 지우기',
    connectedGroups: '연결된 그룹',
    currentStructure: '현재 구성',
    description: [
      '컴포넌트, 앱, 라이브러리, 도구, MCP 자료를 한곳에서 볼 수 있게 정리했습니다.',
      '이미 만들어진 화면을 빠르게 찾고, 다음에 손볼 곳으로 바로 이동할 수 있습니다.',
    ],
    eyebrow: 'React + TypeScript 작업 허브',
    featureCards: [
      {
        description: '메뉴를 뒤지지 않아도 한 번의 검색으로 필요한 화면까지 바로 이동합니다.',
        title: '필요한 화면을 빠르게 찾기',
      },
      {
        description: '저장 상태, 입력, 업로드, 내보내기까지 실제 화면처럼 만져볼 수 있습니다.',
        title: '정적인 목업을 넘어서기',
      },
      {
        description: '공용 카드, 버튼, 검색, 내비게이션을 함께 써서 다음 화면을 더 빨리 완성합니다.',
        title: '계속 키우기 쉬운 구조',
      },
    ],
    majorSections: '주요 섹션',
    note: [
      '라우팅, 카탈로그 데이터, 검색, 다크 모드, 사이드바 이동 흐름이 연결되어 있습니다.',
      '다음 단계에서는 페이지별 상호작용, 문구, 반응형 QA를 더 촘촘히 다듬으면 됩니다.',
    ],
    open: '열기',
    projectMap: '프로젝트 맵',
    quickActions: '빠른 이동',
    quickActionsDescription: '주요 섹션을 열어 지금 어디까지 준비됐는지 확인하세요.',
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
    title: '솔루시오모스 작업 공간을 한눈에 확인하세요',
    viewComponents: '컴포넌트부터 보기',
    workPrinciples: '작업 기준',
    workPrinciplesDescription: '화면을 찾기 쉽고 확장하기 쉬운 구조로 유지하면서, 같은 레이아웃과 카탈로그 데이터를 함께 쓰도록 정리했습니다.',
  },
} as const;

export const asideItems = {
  en: [
    { title: 'Where things stand', description: 'Home, routing, search, and dark mode are already wired together.' },
    { title: 'Good place to start', description: 'Open Components or Tools to review the reusable patterns first.' },
    { title: 'Next polish pass', description: 'Keep tightening copy, interactions, and responsive behavior page by page.' },
    { title: 'Health check', description: 'Typecheck and production build should stay green after each batch.' },
    { title: 'Copy rule', description: 'Every empty state should explain what the user can actually do.' },
    { title: 'Shared base', description: 'Common components and catalog data make each new page faster to finish.' },
  ],
  ko: [
    { title: '현재 상태', description: '홈, 라우팅, 검색, 다크 모드는 이미 연결되어 있습니다.' },
    { title: '먼저 볼 곳', description: '컴포넌트나 도구 섹션에서 재사용 패턴을 먼저 확인해보세요.' },
    { title: '다음 다듬기', description: '페이지별 문구, 상호작용, 반응형 상태를 차례로 더 매끄럽게 만듭니다.' },
    { title: '상태 확인', description: '작업 단위마다 타입체크와 프로덕션 빌드가 통과하도록 유지합니다.' },
    { title: '문구 기준', description: '임시 문구는 사용자가 무엇을 할 수 있는지 알려주는 문장으로 바꿉니다.' },
    { title: '공용 기반', description: '공용 컴포넌트와 카탈로그 데이터 덕분에 다음 페이지를 더 빨리 확장할 수 있습니다.' },
  ],
} as const;

const routeCopy: Record<AppLanguage, Record<string, LocalizedRouteCopy>> = {
  en: {},
  ko: {
    home: { label: '홈', description: '전체 구조와 검색 흐름을 한눈에 보는 시작 화면입니다.', keywords: ['시작', '메인'] },
    components: { label: '컴포넌트', description: '바로 가져다 쓸 수 있는 UI 패턴을 모아둔 공간입니다.', keywords: ['구성 요소', 'ui'] },
    'full-apps': { label: '전체 앱', description: '여러 UI 조각을 엮어 만든 실제 업무 화면 예시입니다.', keywords: ['데모', '업무 앱'] },
    libraries: { label: '라이브러리', description: '아이콘, 설정, 공용 에셋을 다시 쓰기 쉽게 모아둔 곳입니다.', keywords: ['자료', '에셋'] },
    tools: { label: '도구', description: '제작, 변환, 편집 작업을 빠르게 처리하는 작은 도구 모음입니다.', keywords: ['툴', '유틸리티'] },
    mcp: { label: 'MCP', description: '공용 컴포넌트 지식을 관리하고 배포하는 흐름을 살펴봅니다.', keywords: ['모델 컨텍스트'] },
    '/': { label: '홈', description: '전체 구조와 검색 흐름을 한눈에 보는 시작 화면입니다.', keywords: ['시작', '메인'] },
    '/components': { label: '컴포넌트', description: '바로 가져다 쓸 수 있는 UI 패턴을 모아둔 공간입니다.', keywords: ['구성 요소', 'ui'] },
    '/components/accordions': { label: '아코디언', description: '긴 내용을 접고 펼치며 깔끔하게 정리합니다.', keywords: ['접기', '펼치기'] },
    '/components/animations': { label: '애니메이션', description: '상태 변화와 전환을 부드럽게 보여줍니다.', keywords: ['모션', '전환'] },
    '/components/app-shells': { label: '앱 셸', description: '업무 화면의 기본 레이아웃을 빠르게 잡습니다.', keywords: ['레이아웃', '셸'] },
    '/components/badge': { label: '배지', description: '상태와 우선순위를 짧은 라벨로 보여줍니다.', keywords: ['태그', '상태'] },
    '/components/buttons': { label: '버튼', description: '주요 행동과 보조 행동을 분명하게 나눕니다.', keywords: ['액션', 'cta'] },
    '/components/button-group': { label: '버튼 그룹', description: '비슷한 선택지를 한곳에 묶어 빠르게 전환합니다.', keywords: ['세그먼트', '컨트롤'] },
    '/components/calendars': { label: '캘린더', description: '날짜 선택과 일정 확인을 한 흐름으로 다룹니다.', keywords: ['날짜', '일정'] },
    '/components/cards': { label: '카드', description: '정보를 작고 읽기 쉬운 단위로 묶습니다.', keywords: ['패널', '표면'] },
    '/components/drawer': { label: '드로어', description: '현재 화면을 유지한 채 옆에서 상세 내용을 엽니다.', keywords: ['패널', '시트'] },
    '/components/dropdowns': { label: '드롭다운', description: '추가 작업과 선택지를 필요할 때만 보여줍니다.', keywords: ['메뉴', '선택'] },
    '/components/gallery': { label: '갤러리', description: '이미지와 시각 자료를 고르고 비교하기 쉽게 보여줍니다.', keywords: ['이미지', '미디어'] },
    '/components/input-fields': { label: '입력 필드', description: '입력값을 받고 바로 상태를 안내합니다.', keywords: ['폼', '입력'] },
    '/components/modals': { label: '모달', description: '중요한 선택을 실행하기 전에 사용자의 주의를 모읍니다.', keywords: ['대화상자', '오버레이'] },
    '/components/navigation-bars': { label: '내비게이션 바', description: '상단에서 주요 이동 경로와 시작 액션을 보여줍니다.', keywords: ['헤더', '메뉴'] },
    '/components/sidebar': { label: '사이드바', description: '메뉴가 많은 화면에서도 현재 위치를 놓치지 않게 합니다.', keywords: ['사이드 내비', '탐색'] },
    '/components/steppers': { label: '스테퍼', description: '여러 단계의 진행 상황을 차분하게 안내합니다.', keywords: ['단계', '진행'] },
    '/components/tabs': { label: '탭', description: '관련 정보를 한 공간에서 빠르게 오가게 합니다.', keywords: ['탭', '전환'] },
    '/components/toggles': { label: '토글', description: '켜짐과 꺼짐 상태를 짧고 분명하게 바꿉니다.', keywords: ['스위치', '설정'] },
    '/full-apps': { label: '전체 앱', description: '여러 UI 조각을 엮어 만든 실제 업무 화면 예시입니다.', keywords: ['데모', '업무 앱'] },
    '/full-apps/chrome-extensions': { label: '크롬 확장', description: '확장 프로그램 구성과 설치 흐름을 한 화면에서 점검합니다.', keywords: ['확장', '크롬'] },
    '/full-apps/cleaning-confirmation': { label: '청소 확인', description: '방문 일정, 청소 상태, 고객 확인을 함께 관리합니다.', keywords: ['청소', '방문', '서비스'] },
    '/full-apps/feedback-app': { label: '피드백 앱', description: '고객 의견을 모으고 답변 흐름까지 이어갑니다.', keywords: ['후기', '리뷰', '고객 의견'] },
    '/full-apps/project-management': { label: '프로젝트 관리', description: '작업, 일정, 팀 현황을 한 화면에서 추적합니다.', keywords: ['프로젝트', '작업', '칸반'] },
    '/libraries': { label: '라이브러리', description: '아이콘, 설정, 공용 에셋을 다시 쓰기 쉽게 모아둔 곳입니다.', keywords: ['자료', '에셋'] },
    '/libraries/custom-svg-library': { label: '커스텀 SVG 라이브러리', description: 'SVG 아이콘을 가져오고 정리해 바로 재사용합니다.', keywords: ['아이콘', '벡터'] },
    '/libraries/yaml-library': { label: 'YAML 라이브러리', description: '자주 쓰는 YAML 설정을 저장하고 변환합니다.', keywords: ['설정', '스키마'] },
    '/mcp': { label: 'MCP', description: '공용 컴포넌트 지식을 관리하고 배포하는 흐름을 살펴봅니다.', keywords: ['모델 컨텍스트'] },
    '/tools': { label: '도구', description: '제작, 변환, 편집 작업을 빠르게 처리하는 작은 도구 모음입니다.', keywords: ['툴', '유틸리티'] },
    '/tools/form-builder': { label: '폼 빌더', description: '필드를 조합해 폼을 만들고 바로 미리 봅니다.', keywords: ['폼', '양식'] },
    '/tools/logo-generator': { label: '로고 생성기', description: '간단한 브랜드 시안을 빠르게 만들고 내보냅니다.', keywords: ['로고', '브랜드'] },
    '/tools/powerts-toolkit': { label: 'PowerT 툴킷', description: 'PowerT 코드를 다듬고 변환하는 작업 도구입니다.', keywords: ['변환', '타입스크립트'] },
    '/tools/svg-editor': { label: 'SVG 에디터', description: 'SVG 도형을 그리고 조정한 뒤 바로 내보냅니다.', keywords: ['svg', '벡터', '편집'] },
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
  const routeCopyEntry = routeCopy[language][item.path] ?? {};

  return {
    ...item,
    category: localizeCategory(language, item.category) ?? item.category,
    description: routeCopyEntry.description ?? item.description,
    keywords: [...item.keywords, ...(routeCopyEntry.keywords ?? [])],
    name: routeCopyEntry.label ?? item.name,
  };
}

export function getCatalogItemCopy(language: AppLanguage, item: CatalogItem) {
  const routeCopyEntry = routeCopy[language][item.path] ?? {};

  return {
    category: localizeCategory(language, item.category),
    description: routeCopyEntry.description ?? item.description,
    name: routeCopyEntry.label ?? item.name,
  };
}

export function getCatalogSearchText(language: AppLanguage, item: CatalogItem) {
  const routeCopyEntry = routeCopy[language][item.path] ?? {};

  return [
    item.name,
    item.description,
    item.category ?? '',
    routeCopyEntry.label ?? '',
    routeCopyEntry.description ?? '',
    ...(routeCopyEntry.keywords ?? []),
    localizeCategory(language, item.category) ?? '',
  ];
}

export function getFullAppHighlights(language: AppLanguage, appName: string, fallback: string[]) {
  return fullAppHighlightCopy[language][appName] ?? fullAppHighlightCopy[language].default ?? fallback;
}

export function getYamlTemplateCopy<TTemplate extends YamlTemplateLike>(language: AppLanguage, template: TTemplate) {
  const templateCopy = yamlTemplateCopy[language][template.id];

  return {
    ...template,
    description: templateCopy?.description ?? template.description,
    title: templateCopy?.title ?? template.title,
  };
}

export function getYamlTemplateSearchText(language: AppLanguage, template: YamlTemplateLike) {
  const templateCopy = yamlTemplateCopy[language][template.id];

  return [
    template.title,
    template.description,
    template.code,
    templateCopy?.title ?? '',
    templateCopy?.description ?? '',
  ];
}

export function getComponentShowcaseConfigCopy(language: AppLanguage, config: ComponentShowcaseConfig): ComponentShowcaseConfig {
  const showcaseCopy = componentShowcaseCopy[language][`${config.title}|${config.titleHighlight}`];

  if (!showcaseCopy) {
    return config;
  }

  return {
    ...config,
    description: showcaseCopy.description,
    eyebrow: showcaseCopy.eyebrow ?? config.eyebrow,
    sections: config.sections.map((section) => {
      const sectionCopy = showcaseCopy.sections[section.title];

      return {
        ...section,
        description: sectionCopy?.description ?? section.description,
        id: section.id ?? section.title,
        title: sectionCopy?.title ?? section.title,
      };
    }),
    title: showcaseCopy.title,
    titleHighlight: showcaseCopy.titleHighlight,
  };
}
