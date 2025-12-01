export type Lang = 'en';

const dict = {
  en: {
    date: 'Date',
    noData: 'No Data',
    variations: 'Variations',
    period: 'Period',
    lineStyle: 'Line Style',
    dark: 'Dark',
    light: 'Light',
    exportPng: 'Export PNG',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    resetZoom: 'Reset',
    allVariations: 'All variations',
    day: 'Day',
    week: 'Week',
    errorTitle: 'Something went wrong',
    errorUnknown: 'Unknown error',
    errorDetails: 'Details (dev mode)',
    errorReload: 'Reload application',
    enableDarkTheme: 'Enable dark theme',
    enableLightTheme: 'Enable light theme',
  },
} as const;

export const makeT = (lang: Lang) => (key: keyof typeof dict['en']) => dict[lang][key];
