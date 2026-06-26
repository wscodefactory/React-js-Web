import type { AppLanguage } from '@/app/context/LanguageContext';
import type { ConversionTarget, QuickToolValue } from './types';

export type PowerToolkitCopy = {
  history: {
    clear: string;
    delete: string;
    description: string;
    empty: string;
    emptyInput: string;
    export: string;
    load: string;
    targetLabels: Record<ConversionTarget, string>;
    title: string;
    unknownTime: string;
  };
  page: {
    activity: {
      title: string;
      items: Array<{ detail: string; title: string }>;
    };
    description: string;
    highlight: string;
    metrics: {
      availableTools: string;
      categories: string;
      usesToday: string;
    };
    resources: Record<string, { category: string; description: string; title: string }>;
    resourcesTitle: string;
    title: string;
  };
  processor: {
    addInput: string;
    commandMissing: string;
    commandMissingOutput: string;
    commandReady: (count: number, packageManager: string) => string;
    configMissing: string;
    configMissingOutput: string;
    configReady: (count: number) => string;
    convertedPairs: string;
    formatterFallback: string;
    formatterSuccess: string;
    invalidJson: string;
    noHotspots: string;
    noPairs: string;
    performanceOutputTitle: string;
    performanceRecommendations: string;
    performanceReady: (lineCount: number, recommendationCount: number) => string;
    powerFxMissing: string;
    powerFxMissingOutput: string;
    powerFxReady: (count: number, target: ConversionTarget) => string;
    unknownParsingError: string;
    validJson: string;
    validJsonOutput: string;
  };
  quick: {
    actionStatus: {
      copyBlocked: string;
      copyFirst: string;
      copied: string;
      downloadFirst: string;
      downloaded: string;
    };
    buttons: {
      clear: string;
      copied: string;
      copy: string;
      download: string;
      loadSample: string;
      run: string;
    };
    emptyOutput: string;
    help: Record<QuickToolValue, string>;
    options: Record<QuickToolValue, string>;
    outputTarget: string;
    placeholders: Record<QuickToolValue, string>;
    result: string;
    targetOptions: Record<ConversionTarget, string>;
    title: string;
  };
};

export const powerToolkitCopy: Record<AppLanguage, PowerToolkitCopy> = {
  en: {
    history: {
      clear: 'Clear',
      delete: 'Delete',
      description: 'Reload previous inputs, outputs, and selected targets.',
      empty: 'Process a quick tool result to save it here.',
      emptyInput: 'Empty input',
      export: 'Export History',
      load: 'Load',
      targetLabels: {
        javascript: 'Plain JavaScript',
        react: 'React handler',
      },
      title: 'Recent Runs',
      unknownTime: 'Unknown time',
    },
    page: {
      activity: {
        title: 'Recently Used',
        items: [
          { title: 'Code Formatter', detail: '2 minutes ago' },
          { title: 'JSON Validator', detail: '15 minutes ago' },
          { title: 'Data Converter', detail: '1 hour ago' },
        ],
      },
      description: 'Clean up snippets, generate setup notes, and keep recent conversions close.',
      highlight: "PowerT's",
      metrics: {
        availableTools: 'Available Tools',
        categories: 'Categories',
        usesToday: 'Uses Today',
      },
      resources: {
        'Code Formatter': { title: 'Code Formatter', description: 'Format and beautify TypeScript code', category: 'Development' },
        'Command Generator': { title: 'Command Generator', description: 'Generate common CLI commands', category: 'Development' },
        'Config Builder': { title: 'Config Builder', description: 'Build configuration files', category: 'Setup' },
        'Data Converter': { title: 'Data Converter', description: 'Convert between different data formats', category: 'Data' },
        'JSON Validator': { title: 'JSON Validator', description: 'Validate and format JSON data', category: 'Validation' },
        'Performance Analyzer': { title: 'Performance Analyzer', description: 'Analyze code performance', category: 'Optimization' },
      },
      resourcesTitle: 'All Tools',
      title: 'Toolkit',
    },
    processor: {
      addInput: 'Add input before processing.',
      commandMissing: 'No command found.',
      commandMissingOutput: 'Add command=vite build or paste a shell command.',
      commandReady: (count, packageManager) => `${count} script${count === 1 ? '' : 's'} ready for ${packageManager}.`,
      configMissing: 'No config pairs found.',
      configMissingOutput: 'Try input like: appName=Power Tools',
      configReady: (count) => `Built config from ${count} setting${count === 1 ? '' : 's'}.`,
      convertedPairs: 'Converted key=value pairs to JSON.',
      formatterFallback: 'Whitespace normalized. JSON parsing was not applied.',
      formatterSuccess: 'JSON formatted successfully.',
      invalidJson: 'Invalid JSON.',
      noHotspots: 'No obvious hot spots found in this snippet.',
      noPairs: 'No key=value pairs found.',
      performanceOutputTitle: 'Performance scan',
      performanceReady: (lineCount, recommendationCount) => `Analyzed ${lineCount} code line${lineCount === 1 ? '' : 's'} with ${recommendationCount} recommendation${recommendationCount === 1 ? '' : 's'}.`,
      performanceRecommendations: 'Recommendations',
      powerFxMissing: 'No Power Fx statements found.',
      powerFxMissingOutput: 'Try Set(varName, true); Notify("Saved", NotificationType.Success)',
      powerFxReady: (count, target) => `Converted ${count} Power Fx statement${count === 1 ? '' : 's'} to ${target === 'react' ? 'React' : 'JavaScript'}.`,
      unknownParsingError: 'Unknown parsing error.',
      validJson: 'Valid JSON.',
      validJsonOutput: 'No syntax issues found.',
    },
    quick: {
      actionStatus: {
        copyBlocked: 'Copy was blocked. Use download instead.',
        copyFirst: 'Process the input before copying a result.',
        copied: 'Result copied. You can paste it where you need it.',
        downloadFirst: 'Process the input before downloading a result.',
        downloaded: 'Result is ready to download.',
      },
      buttons: {
        clear: 'Clear',
        copied: 'Copied',
        copy: 'Copy',
        download: 'Download',
        loadSample: 'Load sample',
        run: 'Run tool',
      },
      emptyOutput: 'Run the tool to see the output here.',
      help: {
        command: 'Generates package scripts and run commands from task settings.',
        config: 'Builds app config and environment values from key=value lines.',
        converter: 'Converts key=value lines into a JSON object.',
        formatter: 'Formats JSON or lightly normalizes TypeScript-style whitespace.',
        performance: 'Scans React or TypeScript snippets for common performance signals.',
        powerfx: 'Converts common Power Fx actions into React handlers or plain JavaScript.',
        validator: 'Checks whether the pasted content is valid JSON.',
      },
      options: {
        command: 'Command Generator',
        config: 'Config Builder',
        converter: 'Data Converter',
        formatter: 'Code Formatter',
        performance: 'Performance Analyzer',
        powerfx: 'Power Fx Converter',
        validator: 'JSON Validator',
      },
      outputTarget: 'Output target',
      placeholders: {
        command: 'task=build\ncommand=vite build\npackageManager=npm',
        config: 'appName=Power Tools\napiUrl=https://api.example.com',
        converter: 'appName=Power Tools\nenabled=true',
        formatter: 'Paste JSON or TypeScript-style text here...',
        performance: 'Paste React or TypeScript code here...',
        powerfx: 'Set(varSaving, true); Notify("Saved", NotificationType.Success)',
        validator: 'Paste JSON to validate...',
      },
      result: 'Result',
      targetOptions: {
        javascript: 'Plain JavaScript',
        react: 'React handler',
      },
      title: 'Quick tool',
    },
  },
  ko: {
    history: {
      clear: '비우기',
      delete: '삭제',
      description: '이전 입력, 출력, 선택한 대상을 다시 불러오세요.',
      empty: '빠른 도구를 실행하면 결과가 여기에 저장됩니다.',
      emptyInput: '빈 입력',
      export: '히스토리 내보내기',
      load: '불러오기',
      targetLabels: {
        javascript: '일반 JavaScript',
        react: 'React 핸들러',
      },
      title: '최근 실행',
      unknownTime: '알 수 없는 시간',
    },
    page: {
      activity: {
        title: '최근 사용',
        items: [
          { title: '코드 포매터', detail: '2분 전' },
          { title: 'JSON 검증기', detail: '15분 전' },
          { title: '데이터 변환기', detail: '1시간 전' },
        ],
      },
      description: '스니펫을 정리하고 설정 메모를 생성하며 최근 변환을 가까이에 보관하세요.',
      highlight: "PowerT's",
      metrics: {
        availableTools: '사용 가능 도구',
        categories: '카테고리',
        usesToday: '오늘 사용',
      },
      resources: {
        'Code Formatter': { title: '코드 포매터', description: 'TypeScript 코드를 정리하고 보기 좋게 포맷합니다.', category: '개발' },
        'Command Generator': { title: '명령 생성기', description: '자주 쓰는 CLI 명령을 생성합니다.', category: '개발' },
        'Config Builder': { title: '설정 빌더', description: '설정 파일을 구성합니다.', category: '설정' },
        'Data Converter': { title: '데이터 변환기', description: '서로 다른 데이터 형식 간 변환을 돕습니다.', category: '데이터' },
        'JSON Validator': { title: 'JSON 검증기', description: 'JSON 데이터를 검증하고 포맷합니다.', category: '검증' },
        'Performance Analyzer': { title: '성능 분석기', description: '코드 성능 신호를 분석합니다.', category: '최적화' },
      },
      resourcesTitle: '전체 도구',
      title: '툴킷',
    },
    processor: {
      addInput: '처리할 입력을 추가하세요.',
      commandMissing: '명령을 찾지 못했습니다.',
      commandMissingOutput: 'command=vite build를 추가하거나 셸 명령을 붙여넣으세요.',
      commandReady: (count, packageManager) => `${packageManager}용 스크립트 ${count}개가 준비되었습니다.`,
      configMissing: '설정 쌍을 찾지 못했습니다.',
      configMissingOutput: '예: appName=Power Tools',
      configReady: (count) => `설정 ${count}개로 config를 만들었습니다.`,
      convertedPairs: 'key=value 쌍을 JSON으로 변환했습니다.',
      formatterFallback: '공백을 정리했습니다. JSON 파싱은 적용하지 않았습니다.',
      formatterSuccess: 'JSON 포맷이 완료되었습니다.',
      invalidJson: '올바르지 않은 JSON입니다.',
      noHotspots: '이 스니펫에서 뚜렷한 병목 신호를 찾지 못했습니다.',
      noPairs: 'key=value 쌍을 찾지 못했습니다.',
      performanceOutputTitle: '성능 스캔',
      performanceReady: (lineCount, recommendationCount) => `코드 ${lineCount}줄을 분석했고 추천 ${recommendationCount}개를 찾았습니다.`,
      performanceRecommendations: '추천 사항',
      powerFxMissing: 'Power Fx 문을 찾지 못했습니다.',
      powerFxMissingOutput: '예: Set(varName, true); Notify("Saved", NotificationType.Success)',
      powerFxReady: (count, target) => `Power Fx 문 ${count}개를 ${target === 'react' ? 'React' : 'JavaScript'}로 변환했습니다.`,
      unknownParsingError: '알 수 없는 파싱 오류입니다.',
      validJson: '올바른 JSON입니다.',
      validJsonOutput: '문법 문제를 찾지 못했습니다.',
    },
    quick: {
      actionStatus: {
        copyBlocked: '복사가 차단되었습니다. 다운로드를 사용하세요.',
        copyFirst: '결과를 복사하려면 먼저 입력을 처리하세요.',
        copied: '결과가 복사되었습니다. 필요한 곳에 붙여넣을 수 있습니다.',
        downloadFirst: '결과를 다운로드하려면 먼저 입력을 처리하세요.',
        downloaded: '결과를 다운로드할 준비가 되었습니다.',
      },
      buttons: {
        clear: '지우기',
        copied: '복사됨',
        copy: '복사',
        download: '다운로드',
        loadSample: '샘플 불러오기',
        run: '도구 실행',
      },
      emptyOutput: '도구를 실행하면 결과가 여기에 표시됩니다.',
      help: {
        command: '작업 설정에서 package script와 실행 명령을 생성합니다.',
        config: 'key=value 줄에서 앱 설정과 환경 값을 만듭니다.',
        converter: 'key=value 줄을 JSON 객체로 변환합니다.',
        formatter: 'JSON을 포맷하거나 TypeScript 스타일 공백을 가볍게 정리합니다.',
        performance: 'React 또는 TypeScript 스니펫에서 흔한 성능 신호를 찾습니다.',
        powerfx: '일반적인 Power Fx 액션을 React 핸들러나 JavaScript로 변환합니다.',
        validator: '붙여넣은 내용이 올바른 JSON인지 확인합니다.',
      },
      options: {
        command: '명령 생성기',
        config: '설정 빌더',
        converter: '데이터 변환기',
        formatter: '코드 포매터',
        performance: '성능 분석기',
        powerfx: 'Power Fx 변환기',
        validator: 'JSON 검증기',
      },
      outputTarget: '출력 대상',
      placeholders: {
        command: 'task=build\ncommand=vite build\npackageManager=npm',
        config: 'appName=Power Tools\napiUrl=https://api.example.com',
        converter: 'appName=Power Tools\nenabled=true',
        formatter: 'JSON 또는 TypeScript 스타일 텍스트를 붙여넣으세요...',
        performance: 'React 또는 TypeScript 코드를 붙여넣으세요...',
        powerfx: 'Set(varSaving, true); Notify("Saved", NotificationType.Success)',
        validator: '검증할 JSON을 붙여넣으세요...',
      },
      result: '결과',
      targetOptions: {
        javascript: '일반 JavaScript',
        react: 'React 핸들러',
      },
      title: '빠른 도구',
    },
  },
};
