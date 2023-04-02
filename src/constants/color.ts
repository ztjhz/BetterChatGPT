export type ColorPalette =
  | '--color-50'
  | '--color-100'
  | '--color-200'
  | '--color-300'
  | '--color-400'
  | '--color-500'
  | '--color-600'
  | '--color-700'
  | '--color-800'
  | '--color-900';

export const grayColorPalette: Record<ColorPalette, string> = {
  '--color-50': '#f7f7f8',
  '--color-100': '#ececf1',
  '--color-200': '#d9d9e3',
  '--color-300': '#d1d5db',
  '--color-400': '#acacbe',
  '--color-500': '#8e8ea0',
  '--color-600': '#4b5563',
  '--color-700': '#40414f',
  '--color-800': '#343541',
  '--color-900': '#202123',
};

export const cyanColorPalette: Record<ColorPalette, string> = {
  '--color-50': '#ecfeff',
  '--color-100': '#cffafe',
  '--color-200': '#a5f3fc',
  '--color-300': '#67e8f9',
  '--color-400': '#22d3ee',
  '--color-500': '#06b6d4',
  '--color-600': '#0891b2',
  '--color-700': '#0e7490',
  '--color-800': '#155e75',
  '--color-900': '#164e63',
};
