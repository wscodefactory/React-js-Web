import type { AppLanguage } from '@/app/context/LanguageContext';
import type { ExportFormat, ExportQuality, ExportScale } from './types';

export type SvgEditorCopy = {
  actions: {
    copySvg: string;
    exportSvg: string;
    hideSource: string;
    importSvg: string;
    redo: string;
    resetCanvas: string;
    sourceTitle: string;
    undo: string;
  };
  canvas: {
    grid: string;
    guides: string;
    resizeHandle: (handle: string) => string;
    stats: {
      none: string;
      position: string;
      selected: string;
      size: string;
      zoom: string;
    };
    title: string;
  };
  exportSettings: {
    format: string;
    quality: string;
    qualityOptions: Record<ExportQuality, string>;
    scale: string;
    scaleOptions: Record<ExportScale, string>;
    title: string;
    formatOptions: Record<ExportFormat, string>;
  };
  layers: {
    delete: (name: string) => string;
    duplicate: (name: string) => string;
    editable: string;
    lock: (name: string) => string;
    locked: string;
    title: string;
    toggleVisibility: (name: string) => string;
    unlock: (name: string) => string;
  };
  page: {
    description: string;
    title: string;
    titleHighlight: string;
  };
  properties: {
    empty: string;
    fill: string;
    height: string;
    opacity: string;
    stroke: string;
    strokeWidth: string;
    title: string;
    width: string;
  };
  shapeNames: {
    circle: string;
    copy: string;
    importedCircle: string;
    importedEllipse: string;
    importedPath: string;
    importedRect: string;
    path: string;
    rectangle: string;
  };
  status: {
    alreadyStarter: string;
    canvasReset: string;
    copied: string;
    copyFallback: (message?: string) => string;
    createdPath: (name: string, pointCount: number) => string;
    deleted: (name: string) => string;
    duplicated: (name: string) => string;
    exported: (format: string) => string;
    exportFailed: string;
    imported: (count: number, fileName: string) => string;
    importedEmpty: string;
    lockedDelete: (name: string) => string;
    lockedDrag: (name: string) => string;
    lockedDuplicate: (name: string) => string;
    lockedProperties: (name: string) => string;
    moved: (name: string, x: number, y: number) => string;
    nothingRedo: string;
    nothingUndo: string;
    pathTooShort: string;
    penMode: string;
    ready: string;
    redo: string;
    resized: (name: string, width: number, height: number) => string;
    selectMode: string;
    toggledLock: (name: string, locked: boolean) => string;
    undo: string;
  };
  tools: {
    circle: string;
    pen: string;
    rectangle: string;
    select: string;
    title: string;
  };
};

export const svgEditorCopy: Record<AppLanguage, SvgEditorCopy> = {
  en: {
    actions: {
      copySvg: 'Copy SVG',
      exportSvg: 'Export SVG',
      hideSource: 'Hide SVG source',
      importSvg: 'Import SVG',
      redo: 'Redo',
      resetCanvas: 'Reset Canvas',
      sourceTitle: 'SVG Source',
      undo: 'Undo',
    },
    canvas: {
      grid: 'Grid',
      guides: 'Guides',
      resizeHandle: (handle) => `Resize ${handle}`,
      stats: {
        none: 'None',
        position: 'Position',
        selected: 'Selected',
        size: 'Size',
        zoom: 'Zoom',
      },
      title: 'Canvas',
    },
    exportSettings: {
      format: 'Format',
      formatOptions: {
        jpg: 'JPG',
        png: 'PNG',
        svg: 'SVG',
        webp: 'WebP',
      },
      quality: 'Quality',
      qualityOptions: {
        high: 'High',
        low: 'Low',
        medium: 'Medium',
      },
      scale: 'Scale',
      scaleOptions: {
        '1x': '1x',
        '2x': '2x',
        '3x': '3x',
      },
      title: 'Export Settings',
    },
    layers: {
      delete: (name) => `Delete ${name}`,
      duplicate: (name) => `Duplicate ${name}`,
      editable: 'Editable',
      lock: (name) => `Lock ${name}`,
      locked: 'Locked',
      title: 'Layers',
      toggleVisibility: (name) => `Toggle ${name} visibility`,
      unlock: (name) => `Unlock ${name}`,
    },
    page: {
      description: 'Create and edit scalable vector graphics with professional tools',
      title: 'Editor',
      titleHighlight: 'SVG',
    },
    properties: {
      empty: 'Select a shape to edit its properties.',
      fill: 'Fill Color',
      height: 'Height',
      opacity: 'Opacity',
      stroke: 'Stroke Color',
      strokeWidth: 'Stroke Width',
      title: 'Properties',
      width: 'Width',
    },
    shapeNames: {
      circle: 'Circle',
      copy: 'Copy',
      importedCircle: 'Imported Circle',
      importedEllipse: 'Imported Ellipse',
      importedPath: 'Imported Path',
      importedRect: 'Imported Rect',
      path: 'Path',
      rectangle: 'Rectangle',
    },
    status: {
      alreadyStarter: 'Canvas is already at the starter layout.',
      canvasReset: 'Canvas reset to the starter layout.',
      copied: 'SVG markup copied to clipboard.',
      copyFallback: (message) => `${message ? `${message} ` : ''}SVG markup is available in the source panel.`,
      createdPath: (name, pointCount) => `${name} drawn with ${pointCount} points.`,
      deleted: (name) => `${name} removed from canvas.`,
      duplicated: (name) => `${name} added to layers.`,
      exported: (format) => `Canvas exported as ${format.toUpperCase()}.`,
      exportFailed: 'Export failed.',
      imported: (count, fileName) => `${count} shapes imported from ${fileName}.`,
      importedEmpty: 'Imported SVG, but no supported rect or circle elements were found.',
      lockedDelete: (name) => `${name} is locked. Unlock it before deleting.`,
      lockedDrag: (name) => `${name} is locked. Unlock it before dragging.`,
      lockedDuplicate: (name) => `${name} is locked. Unlock it before duplicating.`,
      lockedProperties: (name) => `${name} is locked. Unlock it before editing properties.`,
      moved: (name, x, y) => `${name} moved to X: ${x}, Y: ${y}.`,
      nothingRedo: 'Nothing to redo.',
      nothingUndo: 'Nothing to undo.',
      pathTooShort: 'Drag a longer stroke to create a path.',
      penMode: 'Pen mode enabled. Drag directly on the canvas to draw a path.',
      ready: 'Select a shape or add a new one with the tool palette.',
      redo: 'Redo applied.',
      resized: (name, width, height) => `${name} resized to W: ${width}, H: ${height}.`,
      selectMode: 'Select mode enabled. Click a layer or shape to edit it.',
      toggledLock: (name, locked) => `${name} ${locked ? 'locked' : 'unlocked'}.`,
      undo: 'Undo applied.',
    },
    tools: {
      circle: 'Circle',
      pen: 'Pen',
      rectangle: 'Rectangle',
      select: 'Select',
      title: 'Tools',
    },
  },
  ko: {
    actions: {
      copySvg: 'SVG 복사',
      exportSvg: 'SVG 내보내기',
      hideSource: 'SVG 소스 숨기기',
      importSvg: 'SVG 가져오기',
      redo: '다시 실행',
      resetCanvas: '캔버스 초기화',
      sourceTitle: 'SVG 소스',
      undo: '실행 취소',
    },
    canvas: {
      grid: '그리드',
      guides: '가이드',
      resizeHandle: (handle) => `${handle} 핸들 크기 조정`,
      stats: {
        none: '없음',
        position: '위치',
        selected: '선택',
        size: '크기',
        zoom: '확대',
      },
      title: '캔버스',
    },
    exportSettings: {
      format: '형식',
      formatOptions: {
        jpg: 'JPG',
        png: 'PNG',
        svg: 'SVG',
        webp: 'WebP',
      },
      quality: '품질',
      qualityOptions: {
        high: '높음',
        low: '낮음',
        medium: '보통',
      },
      scale: '배율',
      scaleOptions: {
        '1x': '1배',
        '2x': '2배',
        '3x': '3배',
      },
      title: '내보내기 설정',
    },
    layers: {
      delete: (name) => `${name} 삭제`,
      duplicate: (name) => `${name} 복제`,
      editable: '편집 가능',
      lock: (name) => `${name} 잠금`,
      locked: '잠김',
      title: '레이어',
      toggleVisibility: (name) => `${name} 표시 전환`,
      unlock: (name) => `${name} 잠금 해제`,
    },
    page: {
      description: '전문 도구로 확장 가능한 벡터 그래픽을 만들고 편집하세요.',
      title: '편집기',
      titleHighlight: 'SVG',
    },
    properties: {
      empty: '속성을 편집할 도형을 선택하세요.',
      fill: '채우기 색상',
      height: '높이',
      opacity: '불투명도',
      stroke: '선 색상',
      strokeWidth: '선 두께',
      title: '속성',
      width: '너비',
    },
    shapeNames: {
      circle: '원',
      copy: '복사본',
      importedCircle: '가져온 원',
      importedEllipse: '가져온 타원',
      importedPath: '가져온 패스',
      importedRect: '가져온 사각형',
      path: '패스',
      rectangle: '사각형',
    },
    status: {
      alreadyStarter: '캔버스가 이미 시작 레이아웃입니다.',
      canvasReset: '캔버스를 시작 레이아웃으로 초기화했습니다.',
      copied: 'SVG 마크업을 클립보드에 복사했습니다.',
      copyFallback: (message) => `${message ? `${message} ` : ''}SVG 마크업은 소스 패널에서 확인할 수 있습니다.`,
      createdPath: (name, pointCount) => `${name}을 ${pointCount}개 포인트로 그렸습니다.`,
      deleted: (name) => `${name}을 캔버스에서 삭제했습니다.`,
      duplicated: (name) => `${name}을 레이어에 추가했습니다.`,
      exported: (format) => `캔버스를 ${format.toUpperCase()} 형식으로 내보냈습니다.`,
      exportFailed: '내보내기에 실패했습니다.',
      imported: (count, fileName) => `${fileName}에서 도형 ${count}개를 가져왔습니다.`,
      importedEmpty: 'SVG를 가져왔지만 지원되는 사각형이나 원 요소를 찾지 못했습니다.',
      lockedDelete: (name) => `${name}은 잠겨 있습니다. 삭제하려면 먼저 잠금을 해제하세요.`,
      lockedDrag: (name) => `${name}은 잠겨 있습니다. 드래그하려면 먼저 잠금을 해제하세요.`,
      lockedDuplicate: (name) => `${name}은 잠겨 있습니다. 복제하려면 먼저 잠금을 해제하세요.`,
      lockedProperties: (name) => `${name}은 잠겨 있습니다. 속성을 편집하려면 먼저 잠금을 해제하세요.`,
      moved: (name, x, y) => `${name}을 X: ${x}, Y: ${y} 위치로 옮겼습니다.`,
      nothingRedo: '다시 실행할 작업이 없습니다.',
      nothingUndo: '실행 취소할 작업이 없습니다.',
      pathTooShort: '패스를 만들려면 더 길게 드래그하세요.',
      penMode: '펜 모드입니다. 캔버스에서 직접 드래그해 패스를 그리세요.',
      ready: '도형을 선택하거나 도구 팔레트에서 새 도형을 추가하세요.',
      redo: '다시 실행했습니다.',
      resized: (name, width, height) => `${name} 크기를 W: ${width}, H: ${height}로 조정했습니다.`,
      selectMode: '선택 모드입니다. 레이어나 도형을 클릭해 편집하세요.',
      toggledLock: (name, locked) => `${name}을 ${locked ? '잠갔습니다' : '잠금 해제했습니다'}.`,
      undo: '실행 취소했습니다.',
    },
    tools: {
      circle: '원',
      pen: '펜',
      rectangle: '사각형',
      select: '선택',
      title: '도구',
    },
  },
};

export function getSvgShapeDisplayName(language: AppLanguage, name: string) {
  if (language === 'en') {
    return name;
  }

  const text = svgEditorCopy[language].shapeNames;
  const copySuffix = ' Copy';
  const hasCopySuffix = name.endsWith(copySuffix);
  const baseName = hasCopySuffix ? name.slice(0, -copySuffix.length) : name;

  const replacements: Array<[RegExp, string]> = [
    [/^Rectangle(?: (\d+))?$/, text.rectangle],
    [/^Circle(?: (\d+))?$/, text.circle],
    [/^Path(?: (\d+))?$/, text.path],
    [/^Imported Rect(?: (\d+))?$/, text.importedRect],
    [/^Imported Circle(?: (\d+))?$/, text.importedCircle],
    [/^Imported Ellipse(?: (\d+))?$/, text.importedEllipse],
    [/^Imported Path(?: (\d+))?$/, text.importedPath],
  ];

  const translated = replacements.reduce<string | null>((result, [pattern, label]) => {
    if (result) {
      return result;
    }

    const match = baseName.match(pattern);
    return match ? `${label}${match[1] ? ` ${match[1]}` : ''}` : null;
  }, null) ?? baseName;

  return hasCopySuffix ? `${translated} ${text.copy}` : translated;
}
