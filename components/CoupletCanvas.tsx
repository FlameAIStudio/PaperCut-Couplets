
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CoupletPaper, InkColor, Point } from '../types';

interface CoupletCanvasProps {
  paper: CoupletPaper;
  brushSize: number;
  inkColor: InkColor;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
  triggerClear: number;
  undoTrigger: number;
}

const CoupletCanvas: React.FC<CoupletCanvasProps> = ({
  paper,
  brushSize,
  inkColor,
  onCanvasReady,
  triggerClear,
  undoTrigger
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calligraphy Physics State
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const lastWidthRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const historyRef = useRef<ImageData[]>([]);

  // Config
  const MIN_WIDTH_RATIO = 0.5;
  const MAX_WIDTH_RATIO = 0.6;
  const VELOCITY_WEIGHT = 0.02;

  const INK_STYLES = {
    black: { fill: 'rgba(20, 20, 20, 0.9)' },
    gold: { fill: 'rgba(250, 204, 21, 0.9)' }
  };

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    if (historyRef.current.length >= 10) {
      historyRef.current.shift();
    }
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  }, []);

  useEffect(() => {
    if (undoTrigger > 0 && canvasRef.current && historyRef.current.length > 0) {
      const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        const lastState = historyRef.current.pop();
        if (lastState) {
          ctx.putImageData(lastState, 0, 0);
        }
      }
    }
  }, [undoTrigger]);

  const drawPaperTexture = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.globalCompositeOperation = 'source-over';

    // 1. Base Gradient (Rich Red)
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#D92222');
    gradient.addColorStop(1, '#B91C1C');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 2. High Performance Noise
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const isSpeckled = paper.texture === 'speckled';

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 15;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }

    if (isSpeckled) {
      // Gold specks
      for (let j = 0; j < width * height * 0.005; j++) {
        const idx = Math.floor(Math.random() * (width * height)) * 4;
        data[idx] = 250;   // R
        data[idx + 1] = 204; // G
        data[idx + 2] = 21;  // B
        data[idx + 3] = 200; // A
      }
    }
    ctx.putImageData(imageData, 0, 0);

    // 3. Layout Guides (The "Circles" or Grids)
    ctx.save();

    // Determine grid layout based on Paper ID or Format
    let rows = 1;
    let cols = 1;
    let drawGuide = false;

    if (paper.id.includes('vertical_7')) { rows = 7; drawGuide = true; }
    else if (paper.id.includes('vertical_5')) { rows = 5; drawGuide = true; }
    else if (paper.format === 'horizontal') { rows = 1; cols = 4; drawGuide = true; }

    if (drawGuide) {
      const cellWidth = width / cols;
      const cellHeight = height / rows;
      // Diameter should fit within the cell (mostly determined by width for vertical couplets)
      const diameter = Math.min(cellWidth, cellHeight) * 0.85;

      // Pattern Style
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'; // Subtle Watermark
      ctx.lineWidth = 2;

      // Specific styling for "clouds" texture (used in vertical_7)
      if (paper.texture === 'clouds') {
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.2)'; // Faint Gold
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Calculate Exact Center
          const cx = c * cellWidth + cellWidth / 2;
          const cy = r * cellHeight + cellHeight / 2;

          ctx.beginPath();
          ctx.arc(cx, cy, diameter / 2, 0, Math.PI * 2);
          ctx.stroke();

          // Decorative inner ring for 'clouds'
          if (paper.texture === 'clouds') {
            ctx.beginPath();
            ctx.arc(cx, cy, diameter / 2 - 4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0,0,0,0.02)';
            ctx.fill();
          }
        }
      }
    }

    // 4. Special Dragon Border for Square (Doufang)
    if (paper.texture === 'dragon' && paper.format === 'square') {
      // Dragon Scales Background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      const r = 24;
      for (let y = 0; y < height + r; y += r * 0.8) {
        const offset = (Math.floor(y / (r * 0.8)) % 2) * (r);
        for (let x = -r; x < width + r; x += r * 2) {
          ctx.beginPath();
          ctx.arc(x + offset, y, r, 0, Math.PI, false);
          ctx.fill();
        }
      }

      // Gold Diamond Guide
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width / 2, 10);
      ctx.lineTo(width - 10, height / 2);
      ctx.lineTo(width / 2, height - 10);
      ctx.lineTo(10, height / 2);
      ctx.closePath();
      ctx.stroke();

      // Border
      ctx.lineWidth = 12;
      ctx.strokeRect(6, 6, width - 12, height - 12);
    }

    ctx.restore();
    historyRef.current = [];
  }, [paper]);

  const resetCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    drawPaperTexture(ctx, canvas.width, canvas.height);
  }, [drawPaperTexture]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();

      let drawWidth, drawHeight;
      const containerRatio = rect.width / rect.height;

      if (paper.ratio > containerRatio) {
        drawWidth = rect.width;
        drawHeight = rect.width / paper.ratio;
      } else {
        drawHeight = rect.height;
        drawWidth = rect.height * paper.ratio;
      }

      const MAX_PIXELS = 4000 * 4000;
      if (drawWidth * dpr * drawHeight * dpr > MAX_PIXELS) {
        const scale = Math.sqrt(MAX_PIXELS / (drawWidth * dpr * drawHeight * dpr));
        drawWidth *= scale;
        drawHeight *= scale;
      }

      canvas.style.width = `${drawWidth}px`;
      canvas.style.height = `${drawHeight}px`;

      const newWidth = Math.floor(drawWidth * dpr);
      const newHeight = Math.floor(drawHeight * dpr);

      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;
        resetCanvas();
      }
    };

    handleResize();
    onCanvasReady(canvas);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [paper, onCanvasReady, resetCanvas]);

  useEffect(() => {
    if (triggerClear > 0) {
      resetCanvas();
    }
  }, [triggerClear, resetCanvas]);

  // --- Calligraphy Physics Engine ---
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

  const drawInkDot = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    saveState();
    const point = getCoordinates(e);
    if (!point) return;

    isDrawingRef.current = true;
    lastPointRef.current = point;
    lastTimeRef.current = Date.now();

    const dpr = window.devicePixelRatio || 1;
    const initialWidth = (brushSize * dpr) * 0.8;
    lastWidthRef.current = initialWidth;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (ctx && canvas) {
      const style = INK_STYLES[inkColor];
      ctx.fillStyle = style.fill;
      ctx.shadowBlur = 0;
      drawInkDot(ctx, point.x, point.y, initialWidth / 2);
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    if (e.cancelable) e.preventDefault();

    const point = getCoordinates(e);
    if (!point) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!ctx || !canvas) return;

    const currentTime = Date.now();
    const timeDiff = currentTime - lastTimeRef.current;

    if (timeDiff === 0 && point.x === lastPointRef.current?.x && point.y === lastPointRef.current?.y) return;

    const p1 = lastPointRef.current!;
    const p2 = point;

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 1.5) return;

    const velocity = distance / (timeDiff || 1);

    const dpr = window.devicePixelRatio || 1;
    const baseSize = brushSize * dpr;

    const targetWidth = Math.max(
      baseSize * MIN_WIDTH_RATIO,
      baseSize * MAX_WIDTH_RATIO - (velocity * VELOCITY_WEIGHT * baseSize)
    );

    const newWidth = lastWidthRef.current * 0.7 + targetWidth * 0.3;
    const stepSize = Math.max(1, newWidth / 3);
    const steps = Math.ceil(distance / stepSize);

    const style = INK_STYLES[inkColor];
    ctx.fillStyle = style.fill;

    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const x = p1.x + dx * t;
      const y = p1.y + dy * t;
      const w = lastWidthRef.current + (newWidth - lastWidthRef.current) * t;
      drawInkDot(ctx, x, y, w / 2);
    }

    lastPointRef.current = point;
    lastWidthRef.current = newWidth;
    lastTimeRef.current = currentTime;
  };

  const handleEnd = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center shadow-2xl bg-[#1a0505] p-2 md:p-4 rounded-lg"
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      <canvas
        ref={canvasRef}
        className="touch-none shadow-lg cursor-crosshair"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      />
    </div>
  );
};

export default CoupletCanvas;
