
export type SymmetryMode = 1 | 2 | 4 | 8 | 12;

export interface Point {
  x: number;
  y: number;
}

export interface DrawPath {
  points: Point[];
  isCut: boolean;
}

export type TemplateCategory = 'text' | 'pattern' | 'structure';

export interface Template {
  id: string;
  label: string;
  category: TemplateCategory;
  symmetry: SymmetryMode; // Default symmetry for this template
  config: {
    type: 'skeleton' | 'silhouette' | 'solid'; // How to render the red paper
    shape: 'circle' | 'square' | 'diamond' | 'octagon'; // The bounding shape
    text?: string; // For text templates
    path?: string; // For pattern silhouettes
    extraPath?: string; // Optional overlay path (e.g. for connecting text parts)
  }
}

export interface Stamp {
  id: string;
  label: string;
  path: string; // SVG path data (normalized 0-100 usually)
}

export type ToolMode = 'brush' | 'stamp';

// --- New Types for Couplet Mode ---

export type AppMode = 'cut' | 'write';

export type CoupletFormat = 'vertical' | 'horizontal' | 'square';

export interface CoupletPaper {
  id: string;
  label: string;
  format: CoupletFormat;
  ratio: number; // width / height
  texture: 'plain' | 'speckled' | 'clouds' | 'dragon';
}

export type InkColor = 'black' | 'gold';
