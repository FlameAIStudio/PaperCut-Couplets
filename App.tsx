
import React, { useState, useRef, useCallback } from 'react';
import PaperCanvas from './components/PaperCanvas';
import Controls from './components/Controls';
import CoupletCanvas from './components/CoupletCanvas';
import CoupletControls from './components/CoupletControls';
import { SymmetryMode, Template, ToolMode, Stamp, AppMode, CoupletPaper, InkColor } from './types';
import { INITIAL_BRUSH_SIZE, TEMPLATES, STAMPS, COUPLET_PAPERS } from './constants';
import { Scissors, PenTool } from 'lucide-react';

const App: React.FC = () => {
  // --- App Mode State ---
  const [appMode, setAppMode] = useState<AppMode>('cut');

  // --- Paper Cut State ---
  const [symmetry, setSymmetry] = useState<SymmetryMode>(8);
  const [cutBrushSize, setCutBrushSize] = useState<number>(INITIAL_BRUSH_SIZE);
  const [showGuides, setShowGuides] = useState<boolean>(true);
  const [template, setTemplate] = useState<Template>(TEMPLATES[0]);
  const [activeTool, setActiveTool] = useState<ToolMode>('brush');
  const [selectedStamp, setSelectedStamp] = useState<Stamp | null>(STAMPS[0]);

  // --- Couplet State ---
  const [coupletPaper, setCoupletPaper] = useState<CoupletPaper>(COUPLET_PAPERS[0]);
  const [inkColor, setInkColor] = useState<InkColor>('black');
  const [writeBrushSize, setWriteBrushSize] = useState<number>(12);

  // --- Common State ---
  const [clearTrigger, setClearTrigger] = useState(0);
  const [undoTrigger, setUndoTrigger] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleExport = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      const prefix = appMode === 'cut' ? 'paper-cut' : 'couplet';
      link.download = `${prefix}-${Date.now()}.png`;
      // Export directly from the canvas to preserve transparency (alpha channel)
      // This allows the paper cut to be used as an overlay (e.g., on a window photo)
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  const handleClear = () => {
    setClearTrigger(prev => prev + 1);
  };

  const handleUndo = () => {
    setUndoTrigger(prev => prev + 1);
  };

  const onCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-[#2b0505]">

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#7c0a0a] text-[#facc15] border-b border-[#facc15]/30 shrink-0 z-50 relative">
        <h1 className="text-xl font-calligraphy">
          {appMode === 'cut' ? '春节剪纸' : '写春联'}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setAppMode(appMode === 'cut' ? 'write' : 'cut')}
            className="text-xs border border-[#facc15]/50 px-2 py-1 rounded"
          >
            切换 / Switch
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative flex flex-col items-center bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')] bg-[#4a0404]">

        {/* Mode Switcher (Desktop) - Now part of Layout Flow (not absolute) */}
        <div className="mt-4 md:mt-6 shrink-0 bg-[#2b0505]/80 backdrop-blur border border-[#facc15]/30 rounded-full p-1 z-30 hidden md:flex shadow-xl transition-transform hover:scale-105">
          <button
            onClick={() => setAppMode('cut')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 font-bold ${appMode === 'cut'
              ? 'bg-[#facc15] text-[#7c0a0a] shadow-lg'
              : 'text-[#facc15]/50 hover:text-[#facc15]'
              }`}
          >
            <Scissors size={16} /> 剪窗花
          </button>
          <button
            onClick={() => setAppMode('write')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 font-bold ${appMode === 'write'
              ? 'bg-[#facc15] text-[#7c0a0a] shadow-lg'
              : 'text-[#facc15]/50 hover:text-[#facc15]'
              }`}
          >
            <PenTool size={16} /> 写春联
          </button>
        </div>

        {/* Background Decorations (Absolute positioned, behind content) */}
        <div className="absolute bottom-0 left-0 text-[#facc15]/5 pointer-events-none hidden md:block transform rotate-180 z-0">
          <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0 C20 0 0 20 0 50 C0 80 20 100 50 100 C80 100 100 80 100 50 C100 20 80 0 50 0 Z M50 90 C30 90 10 70 10 50 C10 30 30 10 50 10 C70 10 90 30 90 50 C90 70 70 90 50 90 Z" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 text-[#facc15]/5 pointer-events-none hidden md:block transform -scale-x-100 rotate-180 z-0">
          <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0 C20 0 0 20 0 50 C0 80 20 100 50 100 C80 100 100 80 100 50 C100 20 80 0 50 0 Z M50 90 C30 90 10 70 10 50 C10 30 30 10 50 10 C70 10 90 30 90 50 C90 70 70 90 50 90 Z" />
          </svg>
        </div>

        {/* Hanging Lanterns/Tags */}
        <div className="absolute top-0 w-full h-full pointer-events-none z-20 overflow-hidden">
          <div className="absolute top-0 left-4 md:left-12 flex flex-col items-center origin-top animate-[swing_5s_ease-in-out_infinite]">
            <div className="w-1 h-20 md:h-32 bg-gradient-to-b from-[#facc15] to-[#d97706] shadow-[0_0_5px_rgba(250,204,21,0.5)]"></div>
            <div className="w-4 h-3 bg-[#b91c1c] -mt-1 z-10 rounded-sm shadow-sm"></div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#991b1b] rounded-full flex items-center justify-center text-[#facc15] font-calligraphy text-xl md:text-2xl border-2 border-[#facc15] shadow-xl relative -mt-1 z-10">
              <span className="drop-shadow-sm mt-1">福</span>
            </div>
          </div>
          <div className="absolute top-0 right-4 md:right-12 flex flex-col items-center origin-top animate-[swing_5s_ease-in-out_infinite]">
            <div className="w-1 h-20 md:h-32 bg-gradient-to-b from-[#facc15] to-[#d97706] shadow-[0_0_5px_rgba(250,204,21,0.5)]"></div>
            <div className="w-4 h-3 bg-[#b91c1c] -mt-1 z-10 rounded-sm shadow-sm"></div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#991b1b] rounded-full flex items-center justify-center text-[#facc15] font-calligraphy text-xl md:text-2xl border-2 border-[#facc15] shadow-xl relative -mt-1 z-10">
              <span className="drop-shadow-sm mt-1">春</span>
            </div>
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-6 left-8 text-[#facc15] pointer-events-none hidden md:block z-0">
          <h1 className="text-6xl font-calligraphy drop-shadow-md text-transparent bg-clip-text bg-gradient-to-br from-[#facc15] to-[#d97706]" style={{ WebkitTextStroke: '1px #b45309' }}>
            {appMode === 'cut' ? '春节剪纸' : '新春对联'}
          </h1>
          <p className="text-lg font-serif mt-2 tracking-[0.3em] opacity-80">
            {appMode === 'cut' ? 'PAPER CUT GENERATOR' : 'COUPLET CALLIGRAPHY'}
          </p>
        </div>

        {/* --- DYNAMIC CANVAS CONTENT WRAPPER --- */}
        {/* Uses flex-1 to occupy remaining space, ensuring separation from the top Switcher */}
        <div className="flex-1 w-full flex items-center justify-center p-4 md:p-8 md:py-10 md:pl-80 relative z-10 overflow-hidden">
          <div className={`transition-all duration-500 ${appMode === 'cut'
            ? 'w-full max-w-xl md:max-w-2xl max-h-[90vh] aspect-square shadow-2xl'
            : 'w-full h-full max-h-[90vh] flex items-center justify-center'
            }`}>
            {appMode === 'cut' ? (
              <PaperCanvas
                symmetry={symmetry}
                brushSize={cutBrushSize}
                showGuides={showGuides}
                template={template}
                activeTool={activeTool}
                selectedStamp={selectedStamp}
                onCanvasReady={onCanvasReady}
                triggerClear={clearTrigger}
                undoTrigger={undoTrigger}
              />
            ) : (
              <CoupletCanvas
                paper={coupletPaper}
                brushSize={writeBrushSize}
                inkColor={inkColor}
                onCanvasReady={onCanvasReady}
                triggerClear={clearTrigger}
                undoTrigger={undoTrigger}
              />
            )}
          </div>
        </div>

      </div>

      {/* Controls Sidebar - Switches based on Mode */}
      <div className="w-full md:w-80 h-[45vh] md:h-full shrink-0 transition-colors duration-500 z-40 relative shadow-2xl">
        {appMode === 'cut' ? (
          <Controls
            symmetry={symmetry}
            setSymmetry={setSymmetry}
            brushSize={cutBrushSize}
            setBrushSize={setCutBrushSize}
            showGuides={showGuides}
            setShowGuides={setShowGuides}
            template={template}
            setTemplate={setTemplate}
            onClear={handleClear}
            onUndo={handleUndo}
            onExport={handleExport}
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            selectedStamp={selectedStamp}
            setSelectedStamp={setSelectedStamp}
          />
        ) : (
          <CoupletControls
            paper={coupletPaper}
            setPaper={setCoupletPaper}
            inkColor={inkColor}
            setInkColor={setInkColor}
            brushSize={writeBrushSize}
            setBrushSize={setWriteBrushSize}
            onClear={handleClear}
            onUndo={handleUndo}
            onExport={handleExport}
          />
        )}
      </div>

    </div>
  );
};

export default App;
