import { useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { copyTextToClipboard } from '../../utils/clipboard';
import { initialShapes } from './data';
import { exportAsset } from './exportAsset';
import { buildSvgMarkup, parseImportedSvg } from './svgMarkup';
import { SVG_CANVAS_HEIGHT, SVG_CANVAS_WIDTH, SVG_MIN_SHAPE_SIZE } from './constants';
import { clampCanvasPoint, getPointBounds, getPointDistance, scalePathPoints, translatePathPoints } from './pathGeometry';
import type { ExportFormat, ExportQuality, ExportScale, SvgPoint, SvgShape, SvgShapeType } from './types';

const HISTORY_LIMIT = 50;

const cloneShapes = (shapeList: SvgShape[]) => shapeList.map((shape) => ({
  ...shape,
  points: shape.points?.map((point) => ({ ...point })),
}));

const areShapeListsEqual = (firstList: SvgShape[], secondList: SvgShape[]) => (
  JSON.stringify(firstList) === JSON.stringify(secondList)
);

const getNextSelectedShapeId = (shapeList: SvgShape[], currentId: number | null) => {
  if (currentId !== null && shapeList.some((shape) => shape.id === currentId)) {
    return currentId;
  }

  return shapeList[0]?.id ?? null;
};

export function useSvgEditorController() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const transformSnapshotRef = useRef<SvgShape[] | null>(null);
  const [shapes, setShapes] = useState<SvgShape[]>(() => cloneShapes(initialShapes));
  const [history, setHistory] = useState<SvgShape[][]>([]);
  const [future, setFuture] = useState<SvgShape[][]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<number | null>(initialShapes[0].id);
  const [activeTool, setActiveTool] = useState('select');
  const [showGrid, setShowGrid] = useState(true);
  const [showGuides, setShowGuides] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('svg');
  const [quality, setQuality] = useState<ExportQuality>('high');
  const [scale, setScale] = useState<ExportScale>('1x');
  const [status, setStatus] = useState('Select a shape or add a new one with the tool palette.');

  const selectedShape = shapes.find((shape) => shape.id === selectedShapeId);
  const svgMarkup = useMemo(() => buildSvgMarkup(shapes), [shapes]);

  const pushHistory = (snapshot: SvgShape[]) => {
    const nextSnapshot = cloneShapes(snapshot);

    setHistory((current) => {
      const lastSnapshot = current[current.length - 1];

      if (lastSnapshot && areShapeListsEqual(lastSnapshot, nextSnapshot)) {
        return current;
      }

      return [...current, nextSnapshot].slice(-HISTORY_LIMIT);
    });
    setFuture([]);
  };

  const applyShapesWithHistory = (nextShapes: SvgShape[]) => {
    if (areShapeListsEqual(shapes, nextShapes)) {
      return false;
    }

    pushHistory(shapes);
    setShapes(cloneShapes(nextShapes));
    return true;
  };

  const clampShapeGeometry = (shape: SvgShape, updates: Partial<SvgShape>) => {
    const next = { ...shape, ...updates };
    const width = Math.round(Math.min(Math.max(next.width, SVG_MIN_SHAPE_SIZE), SVG_CANVAS_WIDTH));
    const height = Math.round(Math.min(Math.max(next.height, SVG_MIN_SHAPE_SIZE), SVG_CANVAS_HEIGHT));
    const x = Math.round(Math.min(Math.max(next.x, 0), Math.max(0, SVG_CANVAS_WIDTH - width)));
    const y = Math.round(Math.min(Math.max(next.y, 0), Math.max(0, SVG_CANVAS_HEIGHT - height)));

    return { ...next, height, width, x, y };
  };

  const applyShapeUpdates = (shape: SvgShape, updates: Partial<SvgShape>) => {
    const nextShape = clampShapeGeometry(shape, updates);
    const shouldTransformPath = shape.type === 'path'
      && Boolean(shape.points?.length)
      && ['height', 'width', 'x', 'y'].some((key) => key in updates);

    if (!shouldTransformPath) {
      return nextShape;
    }

    return {
      ...nextShape,
      points: scalePathPoints(shape, nextShape),
    };
  };

  const getSanitizedFreehandPoints = (points: SvgPoint[]) => (
    points.map(clampCanvasPoint).filter((point, index, pointList) => (
      index === 0 || getPointDistance(pointList[index - 1], point) >= 2
    ))
  );

  const addShape = (tool: string) => {
    setActiveTool(tool);

    if (tool === 'select') {
      setStatus('Select mode enabled. Click a layer or shape to edit it.');
      return;
    }

    if (tool === 'pen') {
      setStatus('Pen mode enabled. Drag directly on the canvas to draw a path.');
      return;
    }

    pushHistory(shapes);
    const nextId = Math.max(0, ...shapes.map((shape) => shape.id)) + 1;
    const shapeType: SvgShapeType = tool === 'circle' ? 'circle' : 'rect';
    const nextShape: SvgShape = {
      id: nextId,
      name: shapeType === 'circle' ? `Circle ${nextId}` : `Rectangle ${nextId}`,
      type: shapeType,
      x: 80 + (nextId * 36) % 360,
      y: 80 + (nextId * 28) % 240,
      width: shapeType === 'circle' ? 180 : 240,
      height: shapeType === 'circle' ? 180 : 160,
      fill: '#16a34a',
      stroke: '#000000',
      strokeWidth: 2,
      opacity: 100,
      visible: true,
      locked: false,
    };

    setShapes((current) => [...current, nextShape]);
    setSelectedShapeId(nextId);
    setStatus(`${nextShape.name} added to canvas.`);
  };

  const createFreehandPath = (points: SvgPoint[]) => {
    const nextPoints = getSanitizedFreehandPoints(points);

    if (nextPoints.length < 2) {
      setStatus('Drag a longer stroke to create a path.');
      return;
    }

    const nextId = Math.max(0, ...shapes.map((shape) => shape.id)) + 1;
    const pathShape: SvgShape = {
      id: nextId,
      name: `Path ${nextId}`,
      type: 'path',
      ...getPointBounds(nextPoints),
      fill: 'none',
      stroke: '#111827',
      strokeWidth: 3,
      opacity: 100,
      points: nextPoints,
      visible: true,
      locked: false,
    };

    pushHistory(shapes);
    setShapes((current) => [...current, pathShape]);
    setSelectedShapeId(nextId);
    setStatus(`${pathShape.name} drawn with ${nextPoints.length} points.`);
  };

  const updateSelectedShape = (updates: Partial<SvgShape>) => {
    if (selectedShapeId === null) return;

    const shape = shapes.find((item) => item.id === selectedShapeId);

    if (shape?.locked) {
      setStatus(`${shape.name} is locked. Unlock it before editing properties.`);
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

      const dx = position.x - shape.x;
      const dy = position.y - shape.y;

      return {
        ...shape,
        ...position,
        points: shape.type === 'path' ? translatePathPoints(shape.points, dx, dy) : shape.points,
      };
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
      setStatus(`${shape.name} moved to X: ${shape.x}, Y: ${shape.y}.`);
    }
  };

  const finishShapeResize = (id: number) => {
    const shape = shapes.find((item) => item.id === id);
    commitShapeTransform();

    if (shape && !shape.locked) {
      setStatus(`${shape.name} resized to W: ${shape.width}, H: ${shape.height}.`);
    }
  };

  const handleLockedShapeDrag = (id: number) => {
    const shape = shapes.find((item) => item.id === id);

    if (shape) {
      setStatus(`${shape.name} is locked. Unlock it before dragging.`);
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
      setStatus(`${shape.name} ${shape.locked ? 'unlocked' : 'locked'}.`);
    }
  };

  const duplicateShape = (id: number) => {
    const shape = shapes.find((item) => item.id === id);

    if (!shape) return;

    if (shape.locked) {
      setStatus(`${shape.name} is locked. Unlock it before duplicating.`);
      return;
    }

    const nextId = Math.max(0, ...shapes.map((item) => item.id)) + 1;
    const nextX = Math.min(shape.x + 24, Math.max(0, SVG_CANVAS_WIDTH - shape.width));
    const nextY = Math.min(shape.y + 24, Math.max(0, SVG_CANVAS_HEIGHT - shape.height));
    const duplicate: SvgShape = {
      ...shape,
      id: nextId,
      name: `${shape.name} Copy`,
      points: shape.type === 'path' ? translatePathPoints(shape.points, nextX - shape.x, nextY - shape.y) : shape.points,
      x: nextX,
      y: nextY,
      locked: false,
    };

    pushHistory(shapes);
    setShapes((current) => [...current, duplicate]);
    setSelectedShapeId(nextId);
    setStatus(`${duplicate.name} added to layers.`);
  };

  const deleteShape = (id: number) => {
    const shape = shapes.find((item) => item.id === id);

    if (!shape) return;

    if (shape.locked) {
      setStatus(`${shape.name} is locked. Unlock it before deleting.`);
      return;
    }

    const remainingShapes = shapes.filter((item) => item.id !== id);
    pushHistory(shapes);
    setShapes(remainingShapes);
    setSelectedShapeId((current) => (current === id ? remainingShapes[0]?.id ?? null : current));
    setStatus(`${shape.name} removed from canvas.`);
  };

  const handleExport = async () => {
    try {
      await exportAsset(svgMarkup, format, scale, quality);
      setStatus(`Canvas exported as ${format.toUpperCase()}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Export failed.');
    }
  };

  const handleImportFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const importedShapes = parseImportedSvg(String(reader.result ?? ''), Math.max(0, ...shapes.map((shape) => shape.id)) + 1);

      if (importedShapes.length === 0) {
        setStatus('Imported SVG, but no supported rect or circle elements were found.');
        return;
      }

      pushHistory(shapes);
      setShapes((current) => [...current, ...importedShapes]);
      setSelectedShapeId(importedShapes[0].id);
      setStatus(`${importedShapes.length} shapes imported from ${file.name}.`);
    };

    reader.readAsText(file, 'UTF-8');
    event.target.value = '';
  };

  const resetCanvas = () => {
    const resetShapes = cloneShapes(initialShapes);

    if (!applyShapesWithHistory(resetShapes)) {
      setStatus('Canvas is already at the starter layout.');
      return;
    }

    setSelectedShapeId(resetShapes[0]?.id ?? null);
    setActiveTool('select');
    setStatus('Canvas reset to the starter layout.');
  };

  const undo = () => {
    if (history.length === 0) {
      setStatus('Nothing to undo.');
      return;
    }

    const previousShapes = history[history.length - 1];
    const nextHistory = history.slice(0, -1);

    setHistory(nextHistory);
    setFuture((current) => [cloneShapes(shapes), ...current].slice(0, HISTORY_LIMIT));
    setShapes(cloneShapes(previousShapes));
    setSelectedShapeId((current) => getNextSelectedShapeId(previousShapes, current));
    setStatus('Undo applied.');
  };

  const redo = () => {
    if (future.length === 0) {
      setStatus('Nothing to redo.');
      return;
    }

    const nextShapes = future[0];

    setFuture((current) => current.slice(1));
    setHistory((current) => [...current, cloneShapes(shapes)].slice(-HISTORY_LIMIT));
    setShapes(cloneShapes(nextShapes));
    setSelectedShapeId((current) => getNextSelectedShapeId(nextShapes, current));
    setStatus('Redo applied.');
  };

  const copySvgMarkup = async () => {
    try {
      const wasCopied = await copyTextToClipboard(svgMarkup);

      if (!wasCopied) {
        throw new Error('Clipboard copy failed.');
      }

      setStatus('SVG markup copied to clipboard.');
      setShowSource(false);
    } catch (error) {
      setShowSource(true);
      setStatus(error instanceof Error ? `${error.message} SVG markup is available in the source panel.` : 'SVG markup is available in the source panel.');
    }
  };

  return {
    activeTool,
    addShape,
    beginShapeTransform,
    canRedo: future.length > 0,
    canUndo: history.length > 0,
    copySvgMarkup,
    createFreehandPath,
    deleteShape,
    fileInputRef,
    format,
    handleExport,
    handleImportFile,
    handleLockedShapeDrag,
    quality,
    redo,
    resetCanvas,
    scale,
    selectedShape,
    selectedShapeId,
    setFormat,
    setQuality,
    setScale,
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
