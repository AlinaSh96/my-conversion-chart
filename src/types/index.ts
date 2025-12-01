export type RawPoint = {
  id: number;
  name: string;
  date: string;
  visits: Record<string, number>;
  conversions: Record<string, number>;
};

export type RawData = Record<string, RawPoint[]>;

export interface ChartPointBase {
  date: string;
}
export type ChartPoint = ChartPointBase & Record<string, number | string | null>;

export type Aggregation = 'day' | 'week';

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export enum LineStyle {
  Line = 'line',
  Smooth = 'smooth',
  Area = 'area',
}

export type RechartsPayloadItem = {
  color?: string;
  dataKey?: string;
  value?: number;
};

export type CustomTooltipProps = {
  active?: boolean;
  label?: string;
  payload?: Array<RechartsPayloadItem & { payload?: ChartPoint }>;
  theme: Theme;
  visibleVariations: string[];
  decimals: number;
};