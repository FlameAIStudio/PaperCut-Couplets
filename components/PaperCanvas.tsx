
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SymmetryMode, Point, Template, Stamp, ToolMode } from '../types';
import { PAPER_COLOR } from '../constants';

interface PaperCanvasProps {
  symmetry: SymmetryMode;
  brushSize: number;
  showGuides: boolean;
  template: Template;
  activeTool: ToolMode;
  selectedStamp: Stamp | null;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
  triggerClear: number;
  undoTrigger: number;
}

const PaperCanvas: React.FC<PaperCanvasProps> = ({
  symmetry,
  brushSize,
  showGuides,
  template,
  activeTool,
  selectedStamp,
  onCanvasReady,
  triggerClear,
  undoTrigger
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smoothing Buffer
  const pointsBufferRef = useRef<Point[]>([]);
  const lastRecordedPointRef = useRef<Point | null>(null);

  const historyRef = useRef<ImageData[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const MIN_DRAW_DISTANCE = 4;

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (historyRef.current.length >= 20) {
      historyRef.current.shift();
    }
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  }, []);

  useEffect(() => {
    if (undoTrigger > 0 && canvasRef.current && historyRef.current.length > 0) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        const lastState = historyRef.current.pop();
        if (lastState) {
          ctx.putImageData(lastState, 0, 0);
        }
      }
    }
  }, [undoTrigger]);

  const resetCanvasContent = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;

    // 1. Clear Canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    historyRef.current = [];

    // 2. Draw Base Shape (Solid Red)
    // We draw the shape normally first using source-over
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = PAPER_COLOR;
    ctx.strokeStyle = PAPER_COLOR;

    if (template.config.type === 'solid') {
      ctx.beginPath();
      if (template.config.shape === 'circle') {
        ctx.arc(cx, cy, width * 0.45, 0, Math.PI * 2);
      } else if (template.config.shape === 'diamond') {
        ctx.moveTo(cx, 0); ctx.lineTo(width, cy); ctx.lineTo(cx, height); ctx.lineTo(0, cy); ctx.closePath();
      } else {
        const margin = width * 0.05;
        ctx.rect(margin, margin, width - margin * 2, height - margin * 2);
      }
      ctx.fill();
    }
    else if (template.config.type === 'silhouette' && template.config.path) {
      ctx.save();
      ctx.translate(cx, cy);
      const s = (width * 0.9) / 100;
      ctx.scale(s, s);
      ctx.translate(-50, -50);
      const p = new Path2D(template.config.path);
      ctx.fill(p, 'evenodd');
      ctx.restore();
    }
    else if (template.config.type === 'skeleton' && template.config.text) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.font = `900 ${width * 0.72}px "Noto Serif SC", serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = width * 0.028;
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;
      const yOffset = width * 0.06;
      // Draw both fill and stroke to ensure a thick, solid character
      ctx.strokeText(template.config.text, 0, yOffset);
      ctx.fillText(template.config.text, 0, yOffset);

      if (template.config.extraPath) {
        ctx.save();
        // Reset text transforms to apply standardized 0-100 scaling for the path
        // We are currently translated to (cx, cy)
        const s = (width * 0.9) / 100;
        ctx.scale(s, s);
        ctx.translate(-50, -50);
        const p = new Path2D(template.config.extraPath);
        ctx.fill(p, 'evenodd');
        ctx.restore();
      }

      ctx.restore();
    }

    // 3. Apply Texture (Source Atop)
    // This composites the texture ONLY onto the existing non-transparent pixels (the shape we just drawn)
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';

    // Create a noise texture
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tCtx = tempCanvas.getContext('2d');

    if (tCtx) {
      const iData = tCtx.createImageData(width, height);
      const d = iData.data;
      // Generate Organic Paper Fiber Texture
      for (let i = 0; i < d.length; i += 4) {
        const noise = Math.random();
        // Higher threshold for less dense, more natural flecks
        if (noise > 0.55) {
          // Instead of pure black, use a deep burgundy/brown for warmth
          // This simulates the fibers in traditional red paper
          d[i] = 100 + Math.random() * 40;   // R: Dark Red
          d[i + 1] = Math.random() * 20;       // G: Very low
          d[i + 2] = Math.random() * 20;       // B: Very low
          // Varying opacity for depth
          d[i + 3] = 20 + Math.floor(Math.random() * 40);
        }
      }
      tCtx.putImageData(iData, 0, 0);
      // Draw the noise pattern onto the shape
      ctx.drawImage(tempCanvas, 0, 0);
    }

    ctx.restore();

    // Reset to default for user drawing
    ctx.globalCompositeOperation = 'source-over';

  }, [template]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height);
      const newWidth = size * dpr;
      const newHeight = size * dpr;

      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
        resetCanvasContent(canvas);
      }
    };

    handleResize();
    onCanvasReady(canvas);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onCanvasReady, resetCanvasContent]);

  useEffect(() => {
    if ((triggerClear > 0 || template) && canvasRef.current) {
      resetCanvasContent(canvasRef.current);
    }
  }, [triggerClear, template, resetCanvasContent]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const applyStamp = (ctx: CanvasRenderingContext2D, point: Point, width: number, height: number) => {
    if (!selectedStamp) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const startRel = { x: point.x - centerX, y: point.y - centerY };

    ctx.globalCompositeOperation = 'destination-out';

    const numSectors = symmetry === 1 ? 1 : symmetry / 2;
    const angleStep = (2 * Math.PI) / numSectors;
    const scaleBase = (brushSize / 20) * (width / 200);
    const stampPath = new Path2D(selectedStamp.path);

    const drawSingleStamp = () => {
      ctx.save();
      ctx.translate(startRel.x, startRel.y);
      ctx.scale(scaleBase, scaleBase);
      ctx.translate(-50, -50);
      ctx.fill(stampPath, 'evenodd');
      ctx.restore();
    };

    if (symmetry === 1) {
      ctx.save();
      ctx.translate(centerX, centerY);
      drawSingleStamp();
      ctx.restore();
    } else {
      for (let i = 0; i < numSectors; i++) {
        const theta = i * angleStep;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(theta);
        drawSingleStamp();
        ctx.restore();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(theta);
        ctx.scale(-1, 1);
        drawSingleStamp();
        ctx.restore();
      }
    }
  };


  // --- MIDPOINT SMOOTHING DRAW LOGIC ---
  const getMidPoint = (p1: Point, p2: Point) => {
    return {
      x: p1.x + (p2.x - p1.x) / 2,
      y: p1.y + (p2.y - p1.y) / 2,
    };
  };

  // Helper to execute a drawing action in all symmetric sectors
  const drawSymmetricAction = (ctx: CanvasRenderingContext2D, width: number, height: number, drawFn: (ctx: CanvasRenderingContext2D) => void) => {
    const centerX = width / 2;
    const centerY = height / 2;

    const dpr = window.devicePixelRatio || 1;
    ctx.lineWidth = brushSize * dpr;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'destination-out';

    const numSectors = symmetry === 1 ? 1 : symmetry / 2;
    const angleStep = (2 * Math.PI) / numSectors;

    if (symmetry === 1) {
      ctx.save();
      ctx.translate(centerX, centerY);
      drawFn(ctx);
      ctx.restore();
    } else {
      for (let i = 0; i < numSectors; i++) {
        const theta = i * angleStep;
        // Rotate
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(theta);
        drawFn(ctx);
        ctx.restore();
        // Mirror
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(theta);
        ctx.scale(-1, 1);
        drawFn(ctx);
        ctx.restore();
      }
    }
  };

  const processFallingScraps = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = new Uint32Array(imageData.data.buffer);
    const pixelCount = width * height;
    const visited = new Uint8Array(pixelCount);
    const components: { startIndex: number, size: number }[] = [];

    for (let i = 0; i < pixelCount; i++) {
      if (data[i] !== 0 && visited[i] === 0) {
        let size = 0;
        const queue = [i];
        visited[i] = 1;
        let head = 0;
        while (head < queue.length) {
          const idx = queue[head++];
          size++;
          const x = idx % width;
          const y = (idx / width) | 0;
          if (x > 0) { const n = idx - 1; if (data[n] !== 0 && visited[n] === 0) { visited[n] = 1; queue.push(n); } }
          if (x < width - 1) { const n = idx + 1; if (data[n] !== 0 && visited[n] === 0) { visited[n] = 1; queue.push(n); } }
          if (y > 0) { const n = idx - width; if (data[n] !== 0 && visited[n] === 0) { visited[n] = 1; queue.push(n); } }
          if (y < height - 1) { const n = idx + width; if (data[n] !== 0 && visited[n] === 0) { visited[n] = 2; queue.push(n); } }
        }
        components.push({ startIndex: i, size });
      }
    }

    if (components.length > 1) {
      components.sort((a, b) => b.size - a.size);
      const largest = components[0];
      visited.fill(0);
      const queue = [largest.startIndex];
      visited[largest.startIndex] = 2;
      let head = 0;
      while (head < queue.length) {
        const idx = queue[head++];
        const x = idx % width;
        const y = (idx / width) | 0;
        if (x > 0) { const n = idx - 1; if (data[n] !== 0 && visited[n] === 0) { visited[n] = 2; queue.push(n); } }
        if (x < width - 1) { const n = idx + 1; if (data[n] !== 0 && visited[n] === 0) { visited[n] = 2; queue.push(n); } }
        if (y > 0) { const n = idx - width; if (data[n] !== 0 && visited[n] === 0) { visited[n] = 2; queue.push(n); } }
        if (y < height - 1) { const n = idx + width; if (data[n] !== 0 && visited[n] === 0) { visited[n] = 2; queue.push(n); } }
      }
      let hasChange = false;
      for (let i = 0; i < pixelCount; i++) {
        if (data[i] !== 0 && visited[i] !== 2) {
          data[i] = 0;
          hasChange = true;
        }
      }
      if (hasChange) {
        ctx.putImageData(imageData, 0, 0);
      }
    }
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    saveState();
    const point = getCoordinates(e);
    if (!point) return;

    // Reset last recorded point on new stroke
    lastRecordedPointRef.current = point;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (activeTool === 'stamp') {
      applyStamp(ctx, point, canvas.width, canvas.height);
      setIsProcessing(true);
      setTimeout(() => {
        processFallingScraps();
        setIsProcessing(false);
      }, 10);
    } else {
      // Brush Mode
      setIsDrawing(true);
      pointsBufferRef.current = [point];

      // Draw a single dot
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const relPoint = { x: point.x - cx, y: point.y - cy };

      drawSymmetricAction(ctx, canvas.width, canvas.height, (context) => {
        context.beginPath();
        context.arc(relPoint.x, relPoint.y, (brushSize * (window.devicePixelRatio || 1)) / 4, 0, Math.PI * 2);
        context.fill(); // Fill dot for better start
      });
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || activeTool !== 'brush') return;
    if (e.cancelable) e.preventDefault();

    const point = getCoordinates(e);
    if (!point) return;

    // --- STABILIZATION LOGIC ---
    // Calculate distance from last recorded point
    if (lastRecordedPointRef.current) {
      const dx = point.x - lastRecordedPointRef.current.x;
      const dy = point.y - lastRecordedPointRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // If movement is too small (jitters), ignore it
      if (dist < MIN_DRAW_DISTANCE) return;
    }
    lastRecordedPointRef.current = point;
    // ---------------------------

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Buffer Strategy for Smoothing
    pointsBufferRef.current.push(point);
    const buffer = pointsBufferRef.current;
    const len = buffer.length;

    if (len > 2) {
      // We need 3 points to smooth: p0 -> p1 -> p2
      // We draw the curve for the segment around p1
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      const p0 = buffer[len - 3];
      const p1 = buffer[len - 2];
      const p2 = buffer[len - 1];

      // Calculate midpoints relative to center (for symmetry logic)
      const relP0 = { x: p0.x - cx, y: p0.y - cy };
      const relP1 = { x: p1.x - cx, y: p1.y - cy };
      const relP2 = { x: p2.x - cx, y: p2.y - cy };

      const mid1 = getMidPoint(relP0, relP1);
      const mid2 = getMidPoint(relP1, relP2);

      drawSymmetricAction(ctx, canvas.width, canvas.height, (context) => {
        context.beginPath();
        context.moveTo(mid1.x, mid1.y);
        context.quadraticCurveTo(relP1.x, relP1.y, mid2.x, mid2.y);
        context.stroke();
      });
    }
  };

  const handleEnd = () => {
    if (isDrawing) {
      setIsDrawing(false);
      // Process scraps logic...
      pointsBufferRef.current = [];
      lastRecordedPointRef.current = null;
      setIsProcessing(true);
      setTimeout(() => {
        processFallingScraps();
        setIsProcessing(false);
      }, 10);
    }
  };

  const renderGuides = () => {
    if (!showGuides) return null;
    const lines = [];
    const numSectors = symmetry === 1 ? 1 : symmetry;
    if (numSectors > 1) {
      for (let i = 0; i < numSectors; i++) {
        const angle = (360 / numSectors) * i;
        lines.push(
          <div
            key={i}
            className="absolute top-0 left-1/2 h-1/2 w-0 border-l border-dashed border-yellow-400/50 origin-bottom-left"
            style={{
              transform: `rotate(${angle}deg)`,
              left: '50%',
              top: '0%',
              height: '50%'
            }}
          />
        );
      }
    }
    return (
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden rounded-sm">
        {lines}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center shadow-xl"
      style={{
        aspectRatio: '1/1',
        maxWidth: '90%',
        maxHeight: '90%',
      }}
    >
      <canvas
        ref={canvasRef}
        className={`touch-none rounded-sm relative z-20 ${activeTool === 'stamp' ? 'cursor-cell' : 'cursor-crosshair'}`}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        style={{
          width: '100%',
          height: '100%',
          filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))',
          transform: 'translateZ(0)'
        }}
      />
      {renderGuides()}
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="bg-black/50 text-white px-3 py-1 rounded-full text-xs font-serif backdrop-blur-sm animate-pulse">
            计算中 / Processing...
          </div>
        </div>
      )}
    </div>
  );
};

export default PaperCanvas;
