import { useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { copyTextToClipboard } from '../../utils/clipboard';
import { initialShapes } from './data';
import { exportAsset } from './exportAsset';
import { buildSvgMarkup, parseImportedSvg } from './svgMarkup';
import { getSvgShapeDisplayName, svgEditorCopy } from './copy';
import { areShapeListsEqual, cloneShapes, getNextSelectedShapeId, getNextShapeId, SVG_HISTORY_LIMIT } from './shapeListUtils';
import {
  applyShapeUpdates,
  createDuplicateShape,
  createPathShape,
  createShapeForTool,
  getSanitizedFreehandPoints,
  moveShapeToPosition,
} from './shapeTransformUtils';
import type { ExportFormat, ExportQuality, ExportScale, SvgPoint, SvgShape } from './types';

export function useSvgEditorController() {
  const { language } = useLanguage();
  const text = svgEditorCopy[language];
  const displayShapeName = (name: string) => getSvgShapeDisplayName(language, name);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const transformSnapshotRef = useRef<SvgShape[] | null>(null);
  const [shapes, setShapes] = useState<SvgShape[]>(() => cloneShapes(initialShapes));
  const [undoStack, setUndoStack] = useState<SvgShape[][]>([]);
  const [redoStack, setRedoStack] = useState<SvgShape[][]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<number | null>(initialShapes[0].id);
  const [activeTool, setActiveTool] = useState('select');
  const [showGrid, setShowGrid] = useState(true);
  const [showGuides, setShowGuides] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('svg');
  const [exportQuality, setExportQuality] = useState<ExportQuality>('high');
  const [exportScale, setExportScale] = useState<ExportScale>('1x');
  const [status, setStatus] = useState(text.status.ready);

  const selectedShape = shapes.find((shape) => shape.id === selectedShapeId);
  const svgMarkup = useMemo(() => buildSvgMarkup(shapes), [shapes]);

  const pushHistory = (snapshot: SvgShape[]) => {
    const nextSnapshot = cloneShapes(snapshot);

    setUndoStack((current) => {
      const lastSnapshot = current[current.length - 1];

      if (lastSnapshot && areShapeListsEqual(lastSnapshot, nextSnapshot)) {
        return current;
      }

      return [...current, nextSnapshot].slice(-SVG_HISTORY_LIMIT);
    });
    setRedoStack([]);
  };

  const applyShapesWithHistory = (nextShapes: SvgShape[]) => {
    if (areShapeListsEqual(shapes, nextShapes)) {
      return false;
    }

    pushHistory(shapes);
    setShapes(cloneShapes(nextShapes));
    return true;
  };

  const selectToolOrAddShape = (tool: string) => {
    setActiveTool(tool);

    if (tool === 'select') {
      setStatus(text.status.selectMode);
      return;
    }

    if (tool === 'pen') {
      setStatus(text.status.penMode);
      return;
    }

    pushHistory(shapes);
    const nextId = getNextShapeId(shapes);
    const nextShape = createShapeForTool(tool, nextId);

    setShapes((current) => [...current, nextShape]);
    setSelectedShapeId(nextId);
    setStatus(text.status.duplicated(displayShapeName(nextShape.name)));
  };

  const createFreehandPath = (points: SvgPoint[]) => {
    const nextPoints = getSanitizedFreehandPoints(points);

    if (nextPoints.length < 2) {
      setStatus(text.status.pathTooShort);
      return;
    }

    const nextId = getNextShapeId(shapes);
    const pathShape = createPathShape(nextId, nextPoints);

    pushHistory(shapes);
    setShapes((current) => [...current, pathShape]);
    setSelectedShapeId(nextId);
    setStatus(text.status.createdPath(displayShapeName(pathShape.name), nextPoints.length));
  };

  const updateSelectedShape = (updates: Partial<SvgShape>) => {
    if (selectedShapeId === null) return;

    const shape = shapes.find((item) => item.id === selectedShapeId);

    if (shape?.locked) {
      setStatus(text.status.lockedProperties(displayShapeName(shape.name)));
      return;
    }

    const nextShapes = shapes.map((shapeItem) => (
      shapeItem.id === selectedShapeId ? applyShapeUpdates(shapeItem, updates) : shapeItem
    ));

    applyShapesWithHistory(nextShapes);
  };

  const moveShape = (id: number, position: Pick<SvgShape, 'x' | 'y'>) => {
    setShapes((current) => current.map((shape) => {
      if (shape.id !== id || shape.locked) {
        return shape;
      }

      return moveShapeToPosition(shape, position);
    }));
  };

  const resizeShape = (id: number, geometry: Pick<SvgShape, 'x' | 'y' | 'width' | 'height'>) => {
    setShapes((current) => current.map((shape) => (
      shape.id === id && !shape.locked ? applyShapeUpdates(shape, geometry) : shape
    )));
  };

  const beginShapeTransform = (id: number) => {
    const shape = shapes.find((item) => item.id === id);

    if (shape && !shape.locked) {
      transformSnapshotRef.current = cloneShapes(shapes);
    }
  };

  const commitShapeTransform = () => {
    const snapshot = transformSnapshotRef.current;

    if (snapshot && !areShapeListsEqual(snapshot, shapes)) {
      pushHistory(snapshot);
    }

    transformSnapshotRef.current = null;
  };

  const finishShapeDrag = (id: number) => {
    const shape = shapes.find((item) => item.id === id);
    commitShapeTransform();

    if (shape && !shape.locked) {
      setStatus(text.status.moved(displayShapeName(shape.name), shape.x, shape.y));
    }
  };

  const finishShapeResize = (id: number) => {
    const shape = shapes.find((item) => item.id === id);
    commitShapeTransform();

    if (shape && !shape.locked) {
      setStatus(text.status.resized(displayShapeName(shape.name), shape.width, shape.height));
    }
  };

  const handleLockedShapeDrag = (id: number) => {
    const shape = shapes.find((item) => item.id === id);

    if (shape) {
      setStatus(text.status.lockedDrag(displayShapeName(shape.name)));
    }
  };

  const toggleVisibility = (id: number) => {
    const nextShapes = shapes.map((shape) => (shape.id === id ? { ...shape, visible: !shape.visible } : shape));

    applyShapesWithHistory(nextShapes);
  };

  const toggleLock = (id: number) => {
    const shape = shapes.find((item) => item.id === id);

    if (shape) {
      const nextShapes = shapes.map((shapeItem) => (
        shapeItem.id === id ? { ...shapeItem, locked: !shapeItem.locked } : shapeItem
      ));

      applyShapesWithHistory(nextShapes);
      setStatus(text.status.toggledLock(displayShapeName(shape.name), !shape.locked));
    }
  };

  const duplicateShape = (id: number) => {
    const shape = shapes.find((item) => item.id === id);

    if (!shape) return;

    if (shape.locked) {
      setStatus(text.status.lockedDuplicate(displayShapeName(shape.name)));
      return;
    }

    const nextId = getNextShapeId(shapes);
    const duplicate = createDuplicateShape(shape, nextId);

    pushHistory(shapes);
    setShapes((current) => [...current, duplicate]);
    setSelectedShapeId(nextId);
    setStatus(text.status.duplicated(displayShapeName(duplicate.name)));
  };

  const deleteShape = (id: number) => {
    const shape = shapes.find((item) => item.id === id);

    if (!shape) return;

    if (shape.locked) {
      setStatus(text.status.lockedDelete(displayShapeName(shape.name)));
      return;
    }

    const remainingShapes = shapes.filter((item) => item.id !== id);
    pushHistory(shapes);
    setShapes(remainingShapes);
    setSelectedShapeId((current) => (current === id ? remainingShapes[0]?.id ?? null : current));
    setStatus(text.status.deleted(displayShapeName(shape.name)));
  };

  const handleExport = async () => {
    try {
      await exportAsset(svgMarkup, exportFormat, exportScale, exportQuality);
      setStatus(text.status.exported(exportFormat));
    } catch (error) {
      setStatus(language === 'en' && error instanceof Error ? error.message : text.status.exportFailed);
    }
  };

  const handleImportFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const importedShapes = parseImportedSvg(String(reader.result ?? ''), getNextShapeId(shapes));

      if (importedShapes.length === 0) {
        setStatus(text.status.importedEmpty);
        return;
      }

      pushHistory(shapes);
      setShapes((current) => [...current, ...importedShapes]);
      setSelectedShapeId(importedShapes[0].id);
      setStatus(text.status.imported(importedShapes.length, file.name));
    };

    reader.readAsText(file, 'UTF-8');
    event.target.value = '';
  };

  const resetCanvas = () => {
    const resetShapes = cloneShapes(initialShapes);

    if (!applyShapesWithHistory(resetShapes)) {
      setStatus(text.status.alreadyStarter);
      return;
    }

    setSelectedShapeId(resetShapes[0]?.id ?? null);
    setActiveTool('select');
    setStatus(text.status.canvasReset);
  };

  const undo = () => {
    if (undoStack.length === 0) {
      setStatus(text.status.nothingUndo);
      return;
    }

    const previousShapes = undoStack[undoStack.length - 1];
    const nextUndoStack = undoStack.slice(0, -1);

    setUndoStack(nextUndoStack);
    setRedoStack((current) => [cloneShapes(shapes), ...current].slice(0, SVG_HISTORY_LIMIT));
    setShapes(cloneShapes(previousShapes));
    setSelectedShapeId((current) => getNextSelectedShapeId(previousShapes, current));
    setStatus(text.status.undo);
  };

  const redo = () => {
    if (redoStack.length === 0) {
      setStatus(text.status.nothingRedo);
      return;
    }

    const nextShapes = redoStack[0];

    setRedoStack((current) => current.slice(1));
    setUndoStack((current) => [...current, cloneShapes(shapes)].slice(-SVG_HISTORY_LIMIT));
    setShapes(cloneShapes(nextShapes));
    setSelectedShapeId((current) => getNextSelectedShapeId(nextShapes, current));
    setStatus(text.status.redo);
  };

  const copySvgMarkup = async () => {
    try {
      const wasCopied = await copyTextToClipboard(svgMarkup);

      if (!wasCopied) {
        throw new Error('Clipboard copy failed.');
      }

      setStatus(text.status.copied);
      setShowSource(false);
    } catch (error) {
      setShowSource(true);
      setStatus(language === 'en' && error instanceof Error ? text.status.copyFallback(error.message) : text.status.copyFallback());
    }
  };

  return {
    activeTool,
    beginShapeTransform,
    canRedo: redoStack.length > 0,
    canUndo: undoStack.length > 0,
    copySvgMarkup,
    createFreehandPath,
    deleteShape,
    fileInputRef,
    handleExport,
    handleImportFile,
    handleLockedShapeDrag,
    redo,
    resetCanvas,
    exportFormat,
    exportQuality,
    exportScale,
    selectedShape,
    selectedShapeId,
    selectToolOrAddShape,
    setExportFormat,
    setExportQuality,
    setExportScale,
    setSelectedShapeId,
    setShowGrid,
    setShowGuides,
    setShowSource,
    shapes,
    showSource,
    showGrid,
    showGuides,
    status,
    svgMarkup,
    toggleLock,
    toggleVisibility,
    undo,
    duplicateShape,
    finishShapeDrag,
    finishShapeResize,
    moveShape,
    resizeShape,
    updateSelectedShape,
  };
}
