import type { Theme } from "../types";

export const variationColors: Record<Theme, Record<string, string>> = {
  light: {
    Original: '#FF8346',
    'Variation A': '#46464F',
    'Variation B': '#4142EF',
    'Variation C': '#35BDAD',
  },
  dark: {
    Original: '#FF8346',
    'Variation A': '#C7C5D0',
    'Variation B': '#A1A3FF',
    'Variation C': '#35BDAD',
  },
};

export const tooltipColors: Record<Theme, { bg: string; border: string; text: string; cursor: string }> = {
  light: {
    bg: '#ffffff',
    border: '#dddddd',
    text: '#222222',
    cursor: '#222222',
  },
  dark: {
    bg: '#1e1e1e',
    border: '#444444',
    text: '#eeeeee',
    cursor: '#dddddd',
  },
};