import { useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { initialShapes } from './data';
import { exportAsset } from './exportAsset';
import { buildSvgMarkup, parseImportedSvg } from './svgMarkup';
import type { ExportFormat, ExportQuality, ExportScale, SvgShape, SvgShapeType } from './types';

export function useSvgEditorController() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [shapes, setShapes] = useState(initialShapes);
  const [selectedShapeId, setSelectedShapeId] = useState<number | null>(initialShapes[0].id);
  const [activeTool, setActiveTool] = useState('select');
  const [showGrid, setShowGrid] = useState(true);
  const [showGuides, setShowGuides] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('svg');
  const [quality, setQuality] = useState<ExportQuality>('high');
  const [scale, setScale] = useState<ExportScale>('1x');
  const [status, setStatus] = useState('Select a shape or add a new one with the tool palette.');

  const selectedShape = shapes.find((shape) => shape.id === selectedShapeId);
  const svgMarkup = useMemo(() => buildSvgMarkup(shapes), [shapes]);

  const addShape = (tool: string) => {
    setActiveTool(tool);

    if (tool === 'select') {
      setStatus('Select mode enabled. Click a layer or shape to edit it.');
      return;
    }

    const nextId = Math.max(0, ...shapes.map((shape) => shape.id)) + 1;
    const shapeType: SvgShapeType = tool === 'circle' ? 'circle' : tool === 'pen' ? 'path' : 'rect';
    const nextShape: SvgShape = {
      id: nextId,
      name: shapeType === 'circle' ? `Circle ${nextId}` : shapeType === 'path' ? `Path ${nextId}` : `Rectangle ${nextId}`,
      type: shapeType,
      x: 40 + (nextId * 18) % 180,
      y: 40 + (nextId * 14) % 120,
      width: shapeType === 'circle' ? 90 : 120,
      height: shapeType === 'circle' ? 90 : 80,
      fill: shapeType === 'path' ? 'none' : '#16a34a',
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

  const updateSelectedShape = (updates: Partial<SvgShape>) => {
    if (!selectedShapeId) return;

    const shape = shapes.find((item) => item.id === selectedShapeId);

    if (shape?.locked) {
      setStatus(`${shape.name} is locked. Unlock it before editing properties.`);
      return;
    }

    setShapes((current) => current.map((shapeItem) => (shapeItem.id === selectedShapeId ? { ...shapeItem, ...updates } : shapeItem)));
  };

  const toggleVisibility = (id: number) => {
    setShapes((current) => current.map((shape) => (shape.id === id ? { ...shape, visible: !shape.visible } : shape)));
  };

  const toggleLock = (id: number) => {
    setShapes((current) => current.map((shape) => (shape.id === id ? { ...shape, locked: !shape.locked } : shape)));
    const shape = shapes.find((item) => item.id === id);

    if (shape) {
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
    const duplicate: SvgShape = {
      ...shape,
      id: nextId,
      name: `${shape.name} Copy`,
      x: Math.min(shape.x + 24, 320),
      y: Math.min(shape.y + 24, 220),
      locked: false,
    };

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

      setShapes((current) => [...current, ...importedShapes]);
      setSelectedShapeId(importedShapes[0].id);
      setStatus(`${importedShapes.length} shapes imported from ${file.name}.`);
    };

    reader.readAsText(file, 'UTF-8');
    event.target.value = '';
  };

  return {
    activeTool,
    addShape,
    deleteShape,
    fileInputRef,
    format,
    handleExport,
    handleImportFile,
    quality,
    scale,
    selectedShape,
    selectedShapeId,
    setFormat,
    setQuality,
    setScale,
    setSelectedShapeId,
    setShowGrid,
    setShowGuides,
    shapes,
    showGrid,
    showGuides,
    status,
    toggleLock,
    toggleVisibility,
    duplicateShape,
    updateSelectedShape,
  };
}
