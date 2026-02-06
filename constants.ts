
import { Stamp, SymmetryMode, Template, CoupletPaper } from "./types";

export const PAPER_COLOR = '#D92222'; // Vivid Chinese Red
export const BACKGROUND_COLOR = '#FFFFFF'; // White backing to show cuts
export const GUIDE_COLOR = 'rgba(250, 204, 21, 0.4)'; // Transparent Gold

export const SYMMETRY_OPTIONS: { value: SymmetryMode; label: string; description: string }[] = [
  { value: 1, label: '单折 (None)', description: 'No symmetry' },
  { value: 2, label: '对折 (2-Fold)', description: 'Left-Right Mirror' },
  { value: 4, label: '四折 (4-Fold)', description: 'Square Mirror' },
  { value: 8, label: '八折 (8-Fold)', description: 'Snowflake / Window Flower' },
  { value: 12, label: '六瓣/十二折 (6-Petal)', description: 'Radial 6-Petal Flower' },
];

export const STAMPS: Stamp[] = [
  {
    id: 'ingot',
    label: '元宝 Ingot',
    // Gold ingot shape
    path: 'M10 40 Q10 70 30 80 Q50 95 70 80 Q90 70 90 40 Q90 20 70 30 Q50 10 30 30 Q10 20 10 40 Z'
  },
  {
    id: 'diamond',
    label: '菱形 Diamond',
    path: 'M50 5 L85 50 L50 95 L15 50 Z'
  },
  {
    id: 'star',
    label: '星芒 Star',
    // "Fat" star
    path: 'M50 2 L63 40 L98 40 L70 60 L80 95 L50 75 L20 95 L30 60 L2 40 L37 40 Z'
  },
  {
    id: 'heart',
    label: '爱心 Heart',
    path: 'M50 30 C50 30 20 10 5 35 C-5 55 50 95 50 95 C50 95 105 55 95 35 C80 10 50 30 50 30 Z'
  }
];

export const TEMPLATES: Template[] = [
  // --- Group A: Text (Skeleton) ---
  {
    id: 'fu',
    label: '福 · 圆形窗花 / Fu (Fortune)',
    category: 'text',
    symmetry: 1,
    config: {
      type: 'skeleton',
      shape: 'circle',
      text: '福'
    }
  },
  {
    id: 'chun',
    label: '春 · 菱形贴窗 / Chun (Spring)',
    category: 'text',
    symmetry: 2,
    config: {
      type: 'skeleton',
      shape: 'diamond',
      text: '春'
    }
  },
  {
    id: 'cai',
    label: '财 · 招财进宝 / Cai (Wealth)',
    category: 'text',
    symmetry: 1,
    config: {
      type: 'skeleton',
      shape: 'square',
      text: '财'
    }
  },
  {
    id: 'nian',
    label: '年 · 恭贺新禧 / Nian (Year)',
    category: 'text',
    symmetry: 1,
    config: {
      type: 'skeleton',
      shape: 'square',
      text: '年'
    }
  },
  {
    id: 'lu',
    label: '禄 · 高官厚禄 / Lu (Prosperity)',
    category: 'text',
    symmetry: 1,
    config: {
      type: 'skeleton',
      shape: 'square',
      text: '禄'
    }
  },
  {
    id: 'shou',
    label: '寿 · 健康长寿 / Shou (Longevity)',
    category: 'text',
    symmetry: 1,
    config: {
      type: 'skeleton',
      shape: 'circle',
      text: '寿'
    }
  },
  {
    id: 'xi',
    label: '禧 · 恭贺新禧 / Xi (Joy)',
    category: 'text',
    symmetry: 1,
    config: {
      type: 'skeleton',
      shape: 'square',
      text: '禧'
    }
  },
  {
    id: 'ji',
    label: '吉 · 大吉大利 / Ji (Luck)',
    category: 'text',
    symmetry: 2,
    config: {
      type: 'skeleton',
      shape: 'diamond',
      text: '吉'
    }
  },
  {
    id: 'xiang',
    label: '祥 · 吉祥如意 / Xiang (Auspicious)',
    category: 'text',
    symmetry: 1,
    config: {
      type: 'skeleton',
      shape: 'square',
      text: '祥'
    }
  },
  {
    id: 'li',
    label: '利 · 顺顺利利 / Li (Success)',
    category: 'text',
    symmetry: 1,
    config: {
      type: 'skeleton',
      shape: 'square',
      text: '利'
    }
  },

  // --- Group B: Pattern (Silhouette) ---
  {
    id: 'dumpling',
    label: '饺 · 更岁交子 / Dumpling',
    category: 'pattern',
    symmetry: 1, // Asymmetric side view
    config: {
      type: 'silhouette',
      shape: 'square',
      // Optimized Dumpling: Crescent shape with high arch
      path: 'M 15 55 Q 50 95 85 55 Q 90 45 80 40 Q 50 15 20 40 Q 10 45 15 55 Z'
    }
  },
  {
    id: 'yuanbao',
    label: '宝 · 金元宝 / Gold Ingot',
    category: 'pattern',
    symmetry: 2, // Perfect for 2-fold
    config: {
      type: 'silhouette',
      shape: 'square',
      // Traditional Sycee: Boat base, rounded inward ears, high round belly
      path: 'M 8 52 C 8 80 32 92 50 92 C 68 92 92 80 92 52 C 92 38 78 38 72 48 C 66 22 34 22 28 48 C 22 38 8 38 8 52 Z'
    }
  },
  {
    id: 'snowflake',
    label: '雪 · 瑞雪丰年 / Snowflake',
    category: 'pattern',
    symmetry: 12, // 12-fold creates beautiful radial symmetry for snowflakes
    config: {
      type: 'silhouette',
      shape: 'circle',
      // Perfect Symmetrical Rounded 6-Point Star
      path: 'M 50 5 Q 65 25 89 27 Q 75 50 89 73 Q 65 75 50 95 Q 35 75 11 73 Q 25 50 11 27 Q 35 25 50 5 Z'
    }
  },
  {
    id: 'knot',
    label: '结 · 中国结 / Chinese Knot',
    category: 'pattern',
    symmetry: 2,
    config: {
      type: 'silhouette',
      shape: 'square',
      // Chinese Knot Outline
      path: 'M50 2 L62 15 L90 35 Q98 48 90 60 L65 85 L70 98 L30 98 L35 85 L10 60 Q2 48 10 35 L38 15 Z'
    }
  },
  {
    id: 'lantern',
    label: '灯 · 大红灯笼 / Lantern',
    category: 'pattern',
    symmetry: 2,
    config: {
      type: 'silhouette',
      shape: 'square',
      // Classic Palace Lantern shape
      path: 'M35 5 L65 5 L65 12 C88 25 88 75 65 88 L65 95 L35 95 L35 88 C12 75 12 25 35 12 L35 5 Z'
    }
  },
  {
    id: 'bag',
    label: '袋 · 福袋 / Lucky Bag',
    category: 'pattern',
    symmetry: 2,
    config: {
      type: 'silhouette',
      shape: 'square',
      // Rounded money bag with tied neck
      path: 'M50 8 C65 8 70 18 68 22 C67 24 62 25 58 26 C75 30 88 50 85 75 C83 92 68 96 50 96 C32 96 17 92 15 75 C12 50 25 30 42 26 C38 25 33 24 32 22 C30 18 35 8 50 8 Z'
    }
  },
  {
    id: 'flower',
    label: '花 · 六瓣富贵 / Flower (6-Petal)',
    category: 'pattern',
    symmetry: 12,
    config: {
      type: 'silhouette',
      shape: 'circle',
      // Round, soft, chubby 6-Petal Flower. 
      // Symmetric control points for perfect smoothness.
      path: 'M 50 2 C 62 2 57.1 13.7 67.5 19.7 C 77.9 25.7 85.6 15.6 91.6 26 C 97.6 36.4 85 38 85 50 C 85 62 97.6 63.6 91.6 74 C 85.6 84.4 77.9 74.3 67.5 80.3 C 57.1 86.3 62 98 50 98 C 38 98 42.9 86.3 32.5 80.3 C 22.1 74.3 14.4 84.4 8.4 74 C 2.4 63.6 15 62 15 50 C 15 38 2.4 36.4 8.4 26 C 14.4 15.6 22.1 25.7 32.5 19.7 C 42.9 13.7 38 2 50 2 Z'
    }
  },
  {
    id: 'fan',
    label: '扇 · 扇面 / Chinese Fan',
    category: 'pattern',
    symmetry: 1, // Default 1 for painting-style cuts, but works with 2
    config: {
      type: 'silhouette',
      shape: 'square',
      // Significantly wider fan shape
      path: 'M2 35 Q50 0 98 35 L62 88 Q50 92 38 88 Z'
    }
  },
  {
    id: 'gourd',
    label: '葫 · 福禄双全 / Gourd',
    category: 'pattern',
    symmetry: 2,
    config: {
      type: 'silhouette',
      shape: 'square',
      // Traditional Gourd shape (Hulu)
      path: 'M50 10 C40 10 34 16 34 25 C34 32 38 38 42 40 C30 42 20 52 20 68 C20 85 35 95 50 95 C65 95 80 85 80 68 C80 52 70 42 58 40 C62 38 66 32 66 25 C66 16 60 10 50 10 Z'
    }
  },
  {
    id: 'fish',
    label: '鱼 · 连年有余 / Koi',
    category: 'pattern',
    symmetry: 2,
    config: {
      type: 'silhouette',
      shape: 'square',
      // Elegant Koi shape
      path: 'M50 5 Q30 20 25 45 Q25 70 35 85 L25 98 L50 92 L75 98 L65 85 Q75 70 75 45 Q70 20 50 5 Z'
    }
  },

  // --- Group C: Structure (Solid) ---
  {
    id: 'circle_base',
    label: '圆 · 团团圆圆 / Circle',
    category: 'structure',
    symmetry: 8,
    config: {
      type: 'solid',
      shape: 'circle'
    }
  },
  {
    id: 'diamond_base',
    label: '方 · 四平八稳 / Square',
    category: 'structure',
    symmetry: 4,
    config: {
      type: 'solid',
      shape: 'square'
    }
  }
];

export const INITIAL_BRUSH_SIZE = 8;
export const MAX_BRUSH_SIZE = 40;
export const MIN_BRUSH_SIZE = 2;

// --- Couplet Constants ---

export const COUPLET_PAPERS: CoupletPaper[] = [
  {
    id: 'square_fu',
    label: '斗方 · 福 / Square (Fu)',
    format: 'square',
    ratio: 1,
    texture: 'dragon'
  },
  {
    id: 'vertical_7',
    label: '七言联 / 7-Char Vertical',
    format: 'vertical',
    ratio: 0.25, // 1:4
    texture: 'clouds'
  },
  {
    id: 'vertical_5',
    label: '五言联 / 5-Char Vertical',
    format: 'vertical',
    ratio: 0.3, // Roughly 1:3.3
    texture: 'speckled'
  },
  {
    id: 'horizontal',
    label: '横批 / Horizontal Scroll',
    format: 'horizontal',
    ratio: 3.5, // 3.5:1
    texture: 'plain'
  }
];
