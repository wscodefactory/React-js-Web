import type { AppLanguage } from "@/app/context/LanguageContext";
import type { ExtensionTemplate, PreviewNote, PreviewTab } from "./types";

export const chromeExtensionText = {
  en: {
    checklist: {
      completeAll: "Mark all done",
      progress: (templateName: string, completed: number, total: number) => `${templateName} / ${completed} of ${total} complete`,
      progressSaved: "Checklist progress is saved for this template.",
      reset: "Reset checklist",
      title: "Build checklist",
    },
    fileList: {
      bundleReady: (count: number, fileName: string) => `${count} starter files packed into ${fileName}.`,
      copied: (path: string) => `${path} copied. You can paste it where you need it.`,
      copiedButton: "Copied",
      copy: "Copy",
      copyBlocked: "Clipboard copy was blocked. Download the file instead.",
      description: "Copy one file or download the whole extension starter as a ZIP.",
      downloadAll: "Download all",
      file: "File",
      fileReady: (path: string) => `${path} is ready to download.`,
      noFiles: "No starter files are available to bundle.",
      selectFile: "Select a file to inspect or copy.",
      title: "Starter files",
    },
    implementation: {
      popupBody: "Use the preview shell as the first popup route, then connect list actions.",
      popupTitle: "Popup",
      storageBody: (hasStorage: boolean) => hasStorage
        ? "Save template data with the declared storage permission."
        : "Match persistence to the permissions selected for this template.",
      storageTitle: "Storage",
      testingBody: "Load the unpacked folder, verify permissions, then test the popup flow.",
      testingTitle: "Testing",
    },
    manifest: {
      copied: "Manifest copied. You can paste it into the extension folder.",
      copy: "Copy",
      copyBlocked: "Clipboard copy was blocked. Download the JSON instead.",
      copiedButton: "Copied",
      description: "Built from the template you selected.",
      download: "JSON",
      ready: "Manifest is ready to copy or download.",
      title: "Manifest preview",
    },
    notes: {
      add: "Add preview note",
      added: (title: string) => `${title} added.`,
      empty: "No notes match this view.",
      newBody: "Drafted from the popup preview.",
      newTitle: (count: number) => `New note ${count}`,
      pinned: "Pinned",
      ready: "Popup preview ready.",
      search: "Search notes",
    },
    page: {
      description: "Plan extension files, preview the popup, and keep setup notes in one place.",
      highlight: "Chrome",
      title: "Extensions",
    },
    panel: {
      darkTheme: "Preview dark theme",
      hideNotes: "Hide implementation notes",
      lightTheme: "Preview light theme",
      openNotes: "Open implementation notes",
    },
  },
  ko: {
    checklist: {
      completeAll: "전체 완료",
      progress: (templateName: string, completed: number, total: number) => `${templateName} / ${total}개 중 ${completed}개 완료`,
      progressSaved: "이 템플릿의 체크리스트 진행 상태를 저장했습니다.",
      reset: "체크리스트 초기화",
      title: "빌드 체크리스트",
    },
    fileList: {
      bundleReady: (count: number, fileName: string) => `스타터 파일 ${count}개를 ${fileName}로 묶었습니다.`,
      copied: (path: string) => `${path} 파일을 복사했습니다. 필요한 곳에 붙여넣을 수 있습니다.`,
      copiedButton: "복사됨",
      copy: "복사",
      copyBlocked: "브라우저에서 복사가 차단됐습니다. 파일 다운로드를 사용하세요.",
      description: "파일 하나를 복사하거나 확장 스타터 전체를 ZIP으로 다운로드하세요.",
      downloadAll: "전체 다운로드",
      file: "파일",
      fileReady: (path: string) => `${path} 파일을 다운로드할 수 있습니다.`,
      noFiles: "묶을 스타터 파일이 없습니다.",
      selectFile: "확인하거나 복사할 파일을 선택하세요.",
      title: "스타터 파일",
    },
    implementation: {
      popupBody: "미리보기 셸을 첫 팝업 화면으로 연결하고, 그다음 목록 액션을 붙이세요.",
      popupTitle: "팝업",
      storageBody: (hasStorage: boolean) => hasStorage
        ? "선언한 storage 권한으로 템플릿 데이터를 저장합니다."
        : "선택한 권한에 맞춰 데이터 저장 방식을 정하세요.",
      storageTitle: "저장소",
      testingBody: "압축 해제 폴더를 로드하고 권한을 확인한 뒤 팝업 흐름을 테스트하세요.",
      testingTitle: "테스트",
    },
    manifest: {
      copied: "매니페스트를 복사했습니다. 확장 폴더에 붙여넣을 수 있습니다.",
      copy: "복사",
      copyBlocked: "브라우저에서 복사가 차단됐습니다. JSON 다운로드를 사용하세요.",
      copiedButton: "복사됨",
      description: "선택한 템플릿을 바탕으로 만들었습니다.",
      download: "JSON",
      ready: "매니페스트를 복사하거나 다운로드할 수 있습니다.",
      title: "매니페스트 미리보기",
    },
    notes: {
      add: "미리보기 메모 추가",
      added: (title: string) => `${title}을 추가했습니다.`,
      empty: "이 보기에 맞는 메모가 없습니다.",
      newBody: "팝업 미리보기에서 작성한 초안입니다.",
      newTitle: (count: number) => `새 메모 ${count}`,
      pinned: "고정됨",
      ready: "팝업 미리보기를 사용할 수 있습니다.",
      search: "메모 검색",
    },
    page: {
      description: "확장 파일을 설계하고, 팝업을 미리 보며, 설정 메모까지 한곳에서 정리하세요.",
      highlight: "Chrome",
      title: "Extensions",
    },
    panel: {
      darkTheme: "다크 테마 미리보기",
      hideNotes: "구현 메모 닫기",
      lightTheme: "라이트 테마 미리보기",
      openNotes: "구현 메모 열기",
    },
  },
} as const;

const extensionTemplateCopy: Record<AppLanguage, Record<string, Pick<ExtensionTemplate, "category" | "description" | "name">>> = {
  en: {},
  ko: {
    notes: {
      name: "빠른 메모 확장",
      category: "생산성",
      description: "팝업에서 메모를 빠르게 남기고 로컬 저장소에 보관하는 템플릿입니다.",
    },
    tabs: {
      name: "탭 정리 확장",
      category: "브라우저 유틸리티",
      description: "열린 탭을 묶고, 세션을 검색하며, 필요한 작업 공간을 다시 여는 흐름입니다.",
    },
    links: {
      name: "빠른 링크 확장",
      category: "내비게이션",
      description: "자주 여는 대시보드와 문서를 팝업 안에 고정해두는 바로가기 패널입니다.",
    },
  },
};

const previewNoteCopy: Record<AppLanguage, Record<number, Pick<PreviewNote, "body" | "title">>> = {
  en: {},
  ko: {
    1: { title: "리서치 메모", body: "회의 전에 자료 출처를 요약합니다." },
    2: { title: "코드 리뷰", body: "라우트 처리와 빈 상태를 확인합니다." },
    3: { title: "릴리스 체크리스트", body: "빌드, 타입체크, 권한 검증을 진행합니다." },
    4: { title: "아이디어", body: "커맨드 팔레트 단축키를 추가합니다." },
  },
};

const checklistCopy: Record<AppLanguage, Record<string, string>> = {
  en: {},
  ko: {
    "Define permissions": "권한 정의",
    "Create popup UI": "팝업 UI 만들기",
    "Connect storage": "저장소 연결",
    "Run browser test": "브라우저 테스트",
  },
};

const previewTabCopy: Record<AppLanguage, Record<PreviewTab, string>> = {
  en: {
    All: "All",
    Pinned: "Pinned",
    Recent: "Recent",
  },
  ko: {
    All: "전체",
    Pinned: "고정",
    Recent: "최근",
  },
};

export function getExtensionTemplateCopy(language: AppLanguage, template: ExtensionTemplate): ExtensionTemplate {
  const templateCopy = extensionTemplateCopy[language][template.id];

  return templateCopy ? { ...template, ...templateCopy } : template;
}

export function getPreviewNoteCopy(language: AppLanguage, note: PreviewNote): PreviewNote {
  const noteCopy = previewNoteCopy[language][note.id];

  return noteCopy ? { ...note, ...noteCopy } : note;
}

export function getChecklistItemLabel(language: AppLanguage, item: string) {
  return checklistCopy[language][item] ?? item;
}

export function getPreviewTabLabel(language: AppLanguage, tab: PreviewTab) {
  return previewTabCopy[language][tab] ?? tab;
}
