import type { AppLanguage } from '@/app/context/LanguageContext';
import type { BuilderField, BuilderFieldType } from './types';

export type FormBuilderCopy = {
  actions: {
    backToBuilder: string;
    downloadSchema: string;
    editForm: string;
    exportCode: string;
    previewForm: string;
    resetBuilder: string;
  };
  canvas: {
    addField: string;
    addSelected: string;
    canvasDescription: string;
    canvasTitle: string;
    fillPrompt: string;
    previewDescription: string;
    previewTitle: string;
    submitFallback: string;
    untitled: string;
  };
  code: {
    copied: string;
    copyCode: string;
    description: string;
    downloadReady: string;
    initialStatus: string;
    copyBlocked: string;
    copiedStatus: string;
    title: string;
  };
  fieldCard: {
    delete: (label: string) => string;
    duplicate: (label: string) => string;
    moveDown: (label: string) => string;
    moveUp: (label: string) => string;
    toggleRequired: (label: string) => string;
  };
  fieldInput: {
    option1: string;
    option2: string;
    placeholder: (label: string) => string;
    selectOption: string;
  };
  fieldTypes: {
    description: string;
    labels: Record<BuilderFieldType, string>;
    title: string;
  };
  metrics: {
    optional: string;
    required: string;
    total: string;
  };
  page: {
    description: string;
    highlight: string;
    title: string;
  };
  settings: {
    description: string;
    formName: string;
    showLabels: string;
    submitText: string;
    title: string;
  };
  status: {
    autosaved: string;
    draftSaved: string;
    required: (label: string) => string;
    reset: string;
    schemaReady: string;
    submitBlocked: (count: number) => string;
    submitted: (formName: string, responseCount: number) => string;
  };
  starter: {
    formName: string;
    fields: Record<number, string>;
    submitText: string;
  };
};

export const formBuilderCopy: Record<AppLanguage, FormBuilderCopy> = {
  en: {
    actions: {
      backToBuilder: 'Back to Builder',
      downloadSchema: 'Download Schema',
      editForm: 'Edit Form',
      exportCode: 'Export Code',
      previewForm: 'Preview Form',
      resetBuilder: 'Reset Builder',
    },
    canvas: {
      addField: 'Add field',
      addSelected: 'Add the selected field type here',
      canvasDescription: 'Arrange fields and check how the final form will feel.',
      canvasTitle: 'Form canvas',
      fillPrompt: 'Fill out the fields below to test the flow.',
      previewDescription: 'Try the form before you export it.',
      previewTitle: 'Form preview',
      submitFallback: 'Submit',
      untitled: 'Untitled Form',
    },
    code: {
      copied: 'Copied',
      copiedStatus: 'Code copied. You can paste it into your project.',
      copyBlocked: 'Clipboard copy was blocked. Download the HTML file instead.',
      copyCode: 'Copy code',
      description: 'Copy the current form or download it as an HTML file.',
      downloadReady: 'The form HTML is ready to download.',
      initialStatus: 'Your current form code is ready to copy or download.',
      title: 'Export code',
    },
    fieldCard: {
      delete: (label) => `Delete ${label}`,
      duplicate: (label) => `Duplicate ${label}`,
      moveDown: (label) => `Move ${label} down`,
      moveUp: (label) => `Move ${label} up`,
      toggleRequired: (label) => `Toggle required for ${label}`,
    },
    fieldInput: {
      option1: 'Option 1',
      option2: 'Option 2',
      placeholder: (label) => `Enter ${label.toLowerCase()}`,
      selectOption: 'Select an option',
    },
    fieldTypes: {
      description: 'Pick a field to add it to the form.',
      labels: {
        checkbox: 'Checkbox',
        date: 'Date Picker',
        email: 'Email',
        number: 'Number',
        radio: 'Radio',
        select: 'Dropdown',
        text: 'Text Input',
        textarea: 'Text Area',
      },
      title: 'Field types',
    },
    metrics: {
      optional: 'Optional',
      required: 'Required',
      total: 'Total Fields',
    },
    page: {
      description: 'Build a form, preview the experience, and export the result when it feels right.',
      highlight: 'Form',
      title: 'Builder',
    },
    settings: {
      description: 'Configure the base behavior before publishing.',
      formName: 'Form Name',
      showLabels: 'Show field labels',
      submitText: 'Submit Button Text',
      title: 'Form Settings',
    },
    status: {
      autosaved: 'Draft is autosaved locally.',
      draftSaved: 'Starter form saved as the current draft.',
      required: (label) => `${label} is required.`,
      reset: 'Builder reset to the starter form.',
      schemaReady: 'Form schema is ready to download.',
      submitBlocked: (count) => `Complete ${count} required field${count === 1 ? '' : 's'} before submitting.`,
      submitted: (formName, responseCount) => `${formName} submitted with ${responseCount} responses.`,
    },
    starter: {
      formName: 'Contact Form',
      fields: {
        1: 'Full Name',
        2: 'Email Address',
        3: 'Project Details',
      },
      submitText: 'Submit',
    },
  },
  ko: {
    actions: {
      backToBuilder: '빌더로 돌아가기',
      downloadSchema: '스키마 다운로드',
      editForm: '폼 편집',
      exportCode: '코드 내보내기',
      previewForm: '폼 미리보기',
      resetBuilder: '빌더 초기화',
    },
    canvas: {
      addField: '필드 추가',
      addSelected: '선택한 필드 유형을 여기에 추가',
      canvasDescription: '필드를 배치하고 최종 폼 흐름을 확인하세요.',
      canvasTitle: '폼 캔버스',
      fillPrompt: '아래 필드를 입력해 흐름을 테스트하세요.',
      previewDescription: '내보내기 전에 폼을 직접 테스트하세요.',
      previewTitle: '폼 미리보기',
      submitFallback: '제출',
      untitled: '제목 없는 폼',
    },
    code: {
      copied: '복사됨',
      copiedStatus: '코드가 복사되었습니다. 프로젝트에 바로 붙여넣을 수 있습니다.',
      copyBlocked: '클립보드 복사가 차단되었습니다. HTML 파일을 다운로드하세요.',
      copyCode: '코드 복사',
      description: '현재 폼을 복사하거나 HTML 파일로 다운로드하세요.',
      downloadReady: '폼 HTML을 다운로드할 준비가 되었습니다.',
      initialStatus: '현재 폼 코드를 복사하거나 다운로드할 준비가 되었습니다.',
      title: '코드 내보내기',
    },
    fieldCard: {
      delete: (label) => `${label} 삭제`,
      duplicate: (label) => `${label} 복제`,
      moveDown: (label) => `${label} 아래로 이동`,
      moveUp: (label) => `${label} 위로 이동`,
      toggleRequired: (label) => `${label} 필수 여부 전환`,
    },
    fieldInput: {
      option1: '옵션 1',
      option2: '옵션 2',
      placeholder: (label) => `${label} 입력`,
      selectOption: '옵션 선택',
    },
    fieldTypes: {
      description: '폼에 추가할 필드를 선택하세요.',
      labels: {
        checkbox: '체크박스',
        date: '날짜 선택',
        email: '이메일',
        number: '숫자',
        radio: '라디오',
        select: '드롭다운',
        text: '텍스트 입력',
        textarea: '긴 텍스트',
      },
      title: '필드 유형',
    },
    metrics: {
      optional: '선택',
      required: '필수',
      total: '전체 필드',
    },
    page: {
      description: '폼을 만들고 경험을 미리 본 뒤 알맞을 때 결과를 내보내세요.',
      highlight: '폼',
      title: '빌더',
    },
    settings: {
      description: '게시 전에 기본 동작을 설정하세요.',
      formName: '폼 이름',
      showLabels: '필드 라벨 표시',
      submitText: '제출 버튼 텍스트',
      title: '폼 설정',
    },
    status: {
      autosaved: '초안이 로컬에 자동 저장됩니다.',
      draftSaved: '시작 폼을 현재 초안으로 저장했습니다.',
      required: (label) => `${label}은 필수입니다.`,
      reset: '빌더를 시작 폼으로 초기화했습니다.',
      schemaReady: '폼 스키마를 다운로드할 준비가 되었습니다.',
      submitBlocked: (count) => `제출하려면 필수 필드 ${count}개를 완료하세요.`,
      submitted: (formName, responseCount) => `${formName}이 응답 ${responseCount}개와 함께 제출되었습니다.`,
    },
    starter: {
      formName: '문의 폼',
      fields: {
        1: '이름',
        2: '이메일 주소',
        3: '프로젝트 상세',
      },
      submitText: '제출',
    },
  },
};

export function getFormBuilderFieldTypeLabel(language: AppLanguage, type: BuilderFieldType) {
  return formBuilderCopy[language].fieldTypes.labels[type];
}

export function getStarterFields(language: AppLanguage, fields: BuilderField[]) {
  const starterLabels = formBuilderCopy[language].starter.fields;

  return fields.map((field) => ({
    ...field,
    label: starterLabels[field.id] ?? getFormBuilderFieldTypeLabel(language, field.type),
  }));
}
