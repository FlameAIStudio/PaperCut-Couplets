
import React from 'react';
import { CoupletPaper, InkColor } from '../types';
import { COUPLET_PAPERS, MAX_BRUSH_SIZE, MIN_BRUSH_SIZE } from '../constants';
import { Brush, Download, Eraser, RotateCcw, ScrollText } from 'lucide-react';

interface CoupletControlsProps {
  paper: CoupletPaper;
  setPaper: (p: CoupletPaper) => void;
  inkColor: InkColor;
  setInkColor: (c: InkColor) => void;
  brushSize: number;
  setBrushSize: (s: number) => void;
  onClear: () => void;
  onUndo: () => void;
  onExport: () => void;
}

const CoupletControls: React.FC<CoupletControlsProps> = ({
  paper,
  setPaper,
  inkColor,
  setInkColor,
  brushSize,
  setBrushSize,
  onClear,
  onUndo,
  onExport
}) => {
  return (
    <div className="flex flex-col h-full bg-[#7c0a0a] text-[#facc15] border-l-4 border-[#9a1c1c] shadow-2xl relative z-20">
      
      {/* Header */}
      <div className="p-4 border-b border-[#facc15]/30 text-center shrink-0">
        <h2 className="text-xl font-calligraphy">文房四宝</h2>
        <p className="text-[10px] opacity-70 font-serif tracking-widest uppercase">Calligraphy Tools</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        
        {/* Paper Selection */}
        <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1 opacity-80 border-b border-[#facc15]/20 pb-1">
                <ScrollText size={16} />
                <h3 className="font-bold text-xs uppercase tracking-wider">选择纸张 / Paper</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {COUPLET_PAPERS.map(p => (
                    <button
                        key={p.id}
                        onClick={() => setPaper(p)}
                        className={`p-2 rounded border text-xs font-bold transition-all flex flex-col items-center gap-1 active:scale-95 min-h-[50px] justify-center ${
                            paper.id === p.id
                            ? 'bg-[#facc15] text-[#7c0a0a] border-[#facc15] ring-2 ring-[#facc15]/30'
                            : 'bg-[#4a0404] text-[#facc15]/80 border-[#facc15]/20 hover:border-[#facc15] hover:bg-[#5e0505]'
                        }`}
                    >
                        {/* Mini preview icons */}
                        <div className={`border border-current opacity-50 ${
                            p.format === 'vertical' ? 'w-2 h-6' : 
                            p.format === 'horizontal' ? 'w-6 h-2' : 'w-4 h-4'
                        }`}></div>
                        <span>{p.label.split(' / ')[0]}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Ink Color */}
        <div className="space-y-3">
             <div className="flex items-center gap-2 mb-1 opacity-80 border-b border-[#facc15]/20 pb-1">
                <div className="w-4 h-4 rounded-full bg-black border border-white/50"></div>
                <h3 className="font-bold text-xs uppercase tracking-wider">墨色 / Ink</h3>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => setInkColor('black')}
                    className={`flex-1 py-3 rounded border flex items-center justify-center gap-2 text-sm font-bold ${
                        inkColor === 'black'
                        ? 'bg-black text-white border-white'
                        : 'bg-[#2a0505] text-gray-400 border-[#facc15]/20'
                    }`}
                >
                    <span className="w-3 h-3 rounded-full bg-black border border-gray-600"></span> 墨黑
                </button>
                <button
                    onClick={() => setInkColor('gold')}
                    className={`flex-1 py-3 rounded border flex items-center justify-center gap-2 text-sm font-bold ${
                        inkColor === 'gold'
                        ? 'bg-[#facc15] text-[#7c0a0a] border-white'
                        : 'bg-[#4a0404] text-[#facc15]/60 border-[#facc15]/20'
                    }`}
                >
                    <span className="w-3 h-3 rounded-full bg-[#facc15] border border-orange-500"></span> 金粉
                </button>
            </div>
        </div>

        {/* Brush Size */}
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-1 opacity-80 border-b border-[#facc15]/20 pb-1">
                <div className="flex items-center gap-2">
                    <Brush size={16} />
                    <h3 className="font-bold text-xs uppercase tracking-wider">笔锋 / Size</h3>
                </div>
                <span className="text-xs font-mono bg-[#4a0404] px-2 py-0.5 rounded">{brushSize}</span>
            </div>
            <input
                type="range"
                min={MIN_BRUSH_SIZE}
                max={MAX_BRUSH_SIZE * 1.5} // Allow larger brush for calligraphy
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full h-2 bg-[#4a0404] rounded-lg appearance-none cursor-pointer accent-[#facc15]"
            />
        </div>

      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-[#facc15]/20 bg-[#6b0808] shrink-0 grid grid-cols-4 gap-2">
        <button
          type="button"
          onClick={onUndo}
          title="Undo"
          className="col-span-1 flex items-center justify-center p-3 rounded-lg bg-[#4a0404] text-white hover:bg-[#b91c1c] transition-colors border border-[#facc15]/20 active:scale-95"
        >
          <RotateCcw size={20} />
        </button>

        <button
          type="button"
          onClick={onClear}
          title="Clear"
          className="col-span-1 flex items-center justify-center p-3 rounded-lg bg-[#4a0404] text-white hover:bg-[#b91c1c] transition-colors border border-[#facc15]/20 active:scale-95"
        >
          <Eraser size={20} />
        </button>
        
        <button
          type="button"
          onClick={onExport}
          className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-[#facc15] to-[#d97706] text-[#7c0a0a] font-bold shadow-lg hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all transform hover:-translate-y-1 active:scale-95"
        >
          <Download size={20} />
          <span>保存 / Save</span>
        </button>
      </div>

    </div>
  );
};

export default CoupletControls;
