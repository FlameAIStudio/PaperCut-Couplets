
import React, { useState } from 'react';
import { SymmetryMode, Template, TemplateCategory, ToolMode, Stamp as StampType } from '../types';
import { SYMMETRY_OPTIONS, TEMPLATES, MAX_BRUSH_SIZE, MIN_BRUSH_SIZE, STAMPS } from '../constants';
import { Scissors, RefreshCw, Download, Grid, Layers, Layout, Paintbrush, Stamp, RotateCcw, PenTool } from 'lucide-react';

interface ControlsProps {
  symmetry: SymmetryMode;
  setSymmetry: (mode: SymmetryMode) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  showGuides: boolean;
  setShowGuides: (show: boolean) => void;
  template: Template;
  setTemplate: (template: Template) => void;
  onClear: () => void;
  onUndo: () => void;
  onExport: () => void;
  activeTool: ToolMode;
  setActiveTool: (tool: ToolMode) => void;
  selectedStamp: StampType | null;
  setSelectedStamp: (stamp: StampType | null) => void;
}

const Controls: React.FC<ControlsProps> = ({
  symmetry,
  setSymmetry,
  brushSize,
  setBrushSize,
  showGuides,
  setShowGuides,
  template,
  setTemplate,
  onClear,
  onUndo,
  onExport,
  activeTool,
  setActiveTool,
  selectedStamp,
  setSelectedStamp
}) => {
  const [activeTab, setActiveTab] = useState<'layout' | 'tools'>('layout');

  const renderTemplateGroup = (title: string, category: TemplateCategory) => (
      <div className="space-y-2">
         <div className="flex items-center gap-2 mb-1 opacity-80">
            <h3 className="font-bold text-xs uppercase tracking-wider border-b border-[#facc15]/20 pb-1 w-full">{title}</h3>
         </div>
         <div className="grid grid-cols-2 gap-2">
             {TEMPLATES.filter(t => t.category === category).map(t => (
                 <button
                    type="button"
                    key={t.id}
                    title={t.label}
                    onClick={() => {
                        setTemplate(t);
                        setSymmetry(t.symmetry);
                    }}
                    className={`p-2 rounded border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 min-h-[50px] active:scale-95 ${
                        template.id === t.id
                        ? 'bg-[#facc15] text-[#7c0a0a] border-[#facc15] ring-2 ring-[#facc15]/30'
                        : 'bg-[#4a0404] text-[#facc15]/80 border-[#facc15]/20 hover:border-[#facc15] hover:bg-[#5e0505]'
                    }`}
                 >
                    {t.category === 'text' && <span className="font-calligraphy text-xl">{t.config.text}</span>}
                    {t.category === 'pattern' && <Stamp size={16} />}
                    {t.category === 'structure' && <Grid size={16} />}
                    <span className="text-[10px] text-center leading-tight">{t.label.split(' / ')[0]}</span>
                 </button>
             ))}
         </div>
      </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#7c0a0a] text-[#facc15] border-l-4 border-[#9a1c1c] shadow-2xl relative z-20">
      
      {/* Header */}
      <div className="p-4 border-b border-[#facc15]/30 text-center shrink-0">
        <h2 className="text-xl font-calligraphy">工具箱</h2>
        <p className="text-[10px] opacity-70 font-serif tracking-widest uppercase">Toolbox</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#facc15]/20 shrink-0">
        <button 
          type="button"
          onClick={() => setActiveTab('layout')}
          className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'layout' ? 'bg-[#9a1c1c] text-[#facc15]' : 'bg-[#6b0808] text-[#facc15]/60 hover:text-[#facc15]'}`}
        >
          <Layout size={16} />
          纸张 Paper
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('tools')}
          className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'tools' ? 'bg-[#9a1c1c] text-[#facc15]' : 'bg-[#6b0808] text-[#facc15]/60 hover:text-[#facc15]'}`}
        >
          <Scissors size={16} />
          剪切 Cut
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* LAYOUT TAB */}
        {activeTab === 'layout' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             {renderTemplateGroup('1. 字类 / Characters', 'text')}
             {renderTemplateGroup('2. 形状 / Shapes', 'pattern')}
             {renderTemplateGroup('3. 骨架 / Structure', 'structure')}
             
             <div className="text-[10px] text-[#facc15]/50 italic border-t border-[#facc15]/10 pt-2">
                 * Select a paper style to start. The skeleton handles connection points automatically.<br/>
                 * 选择纸张样式开始。骨架已预设连接点，防止断裂。
             </div>
          </div>
        )}

        {/* TOOLS TAB */}
        {activeTab === 'tools' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            
            {/* Tool Mode Switcher */}
            <div className="flex bg-[#4a0404] p-1 rounded-lg border border-[#facc15]/20">
                <button
                    onClick={() => setActiveTool('brush')}
                    className={`flex-1 py-2 rounded flex items-center justify-center gap-2 text-xs font-bold transition-all ${activeTool === 'brush' ? 'bg-[#facc15] text-[#7c0a0a] shadow-sm' : 'text-[#facc15]/60 hover:text-[#facc15]'}`}
                >
                    <PenTool size={14} /> 剪刀 Brush
                </button>
                <button
                    onClick={() => setActiveTool('stamp')}
                    className={`flex-1 py-2 rounded flex items-center justify-center gap-2 text-xs font-bold transition-all ${activeTool === 'stamp' ? 'bg-[#facc15] text-[#7c0a0a] shadow-sm' : 'text-[#facc15]/60 hover:text-[#facc15]'}`}
                >
                    <Stamp size={14} /> 印章 Stamp
                </button>
            </div>

            {/* Brush Size Slider */}
            <div className="space-y-3">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        <Paintbrush size={18} />
                        <h3 className="font-bold text-sm uppercase tracking-wider">
                            {activeTool === 'brush' ? '刀痕粗细 / Size' : '印章大小 / Size'}
                        </h3>
                    </div>
                    <span className="text-sm font-mono bg-[#4a0404] px-2 py-1 rounded">{brushSize}</span>
                </div>
                <input
                    type="range"
                    min={MIN_BRUSH_SIZE}
                    max={MAX_BRUSH_SIZE}
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full h-2 bg-[#4a0404] rounded-lg appearance-none cursor-pointer accent-[#facc15]"
                />
            </div>

            {/* STAMP GRID (Only visible if Stamp Tool is active) */}
            {activeTool === 'stamp' && (
                <div className="space-y-2 animate-in fade-in zoom-in duration-200">
                     <div className="flex items-center gap-2 mb-1 opacity-80">
                        <h3 className="font-bold text-xs uppercase tracking-wider border-b border-[#facc15]/20 pb-1 w-full">选择花纹 / Pattern</h3>
                     </div>
                     <div className="grid grid-cols-4 gap-2">
                         {STAMPS.map(s => (
                             <button
                                key={s.id}
                                onClick={() => setSelectedStamp(s)}
                                title={s.label}
                                className={`aspect-square rounded border flex items-center justify-center p-2 transition-all active:scale-95 ${
                                    selectedStamp?.id === s.id 
                                    ? 'bg-[#facc15] text-[#7c0a0a] border-[#facc15]' 
                                    : 'bg-[#4a0404] border-[#facc15]/20 hover:border-[#facc15]'
                                }`}
                             >
                                 <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                                     <path d={s.path} />
                                 </svg>
                             </button>
                         ))}
                     </div>
                     <div className="text-[10px] text-[#facc15]/50 italic">
                         * Click on paper to apply stamp.<br/>* 点击红纸即可印出花纹。
                     </div>
                </div>
            )}

            {/* Folding Options */}
            <div className="space-y-3 pt-4 border-t border-[#facc15]/20">
                <div className="flex items-center gap-2 mb-2">
                    <Layers size={18} />
                    <h3 className="font-bold text-sm uppercase tracking-wider">折叠方式 / Folds</h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                {SYMMETRY_OPTIONS.map((option) => (
                    <button
                    type="button"
                    key={option.value}
                    onClick={() => setSymmetry(option.value)}
                    className={`
                        px-3 py-2 rounded text-left transition-all duration-300 border
                        flex items-center justify-between
                        ${symmetry === option.value 
                        ? 'bg-[#facc15]/90 text-[#7c0a0a] border-[#facc15]' 
                        : 'bg-[#4a0404] text-[#facc15] border-[#facc15]/20 hover:bg-[#5e0505]'
                        }
                    `}
                    >
                    <span className="font-bold text-sm">{option.label}</span>
                    <span className="text-[10px] opacity-70">{option.value}x</span>
                    </button>
                ))}
                </div>
            </div>
             
             {/* Guides Toggle */}
            <button
                type="button"
                onClick={() => setShowGuides(!showGuides)}
                className={`w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm ${
                    showGuides 
                    ? 'bg-[#facc15]/10 border-[#facc15] text-[#facc15]' 
                    : 'bg-[#4a0404] border-transparent text-gray-400 hover:text-[#facc15]'
                }`}
                >
                <Grid size={16} />
                <span>{showGuides ? '隐藏参考线 / Hide Guides' : '显示参考线 / Show Guides'}</span>
            </button>
          </div>
        )}

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
          className="col-span-1 flex items-center justify-center p-3 rounded-lg bg-[#4a0404] text-white hover:bg-[#b91c1c] transition-colors border border-[#facc15]/20 active:scale-95"
        >
          <RefreshCw size={20} />
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

export default Controls;
