import type { RawData, ChartPoint } from '../types';
import { Aggregation } from '../types';
import { parseISO, format, startOfWeek } from 'date-fns';
import { DEFAULT_VARIATION_ID } from '../constants/chart';

const calculateConversionRate = (visits: number, conversions: number): number =>
  visits > 0 ? (conversions / visits) * 100 : 0;

export const transformToChartData = (
  raw: RawData,
  aggregation: Aggregation = Aggregation.Day
): ChartPoint[] => {
  const { variations, data } = raw;
  const result: ChartPoint[] = [];

  data.forEach((day) => {
    let dateKey = day.date;
    if (aggregation === Aggregation.Week) {
      const weekStart = startOfWeek(parseISO(day.date), { weekStartsOn: 1 });
      dateKey = format(weekStart, 'yyyy-MM-dd');
    }

    const point: ChartPoint = { date: dateKey };

    variations.forEach((v) => {
      const id = v.id?.toString() ?? DEFAULT_VARIATION_ID;
      if (day.visits[id] !== undefined && day.conversions[id] !== undefined) {
        point[v.name] = calculateConversionRate(day.visits[id], day.conversions[id]);
      } else {
        // Mark missing data explicitly as null to allow connectNulls to bridge
        point[v.name] = null;
      }
    });

    result.push(point);
  });

  return result.sort((a, b) => (a.date > b.date ? 1 : -1));
};

export const getVariationNames = (raw: RawData): string[] =>
  raw.variations.map((v) => v.name);
