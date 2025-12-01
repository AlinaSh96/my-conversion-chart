import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { LineStyle, Theme, type ChartPoint } from '../../../types';
import { variationColors, tooltipColors } from '../../../constants/colors';
import { 
  CHART_HEIGHT, 
  CHART_GRID_OPACITY, 
  CHART_AXIS_FONT_SIZE,
  CHART_TOOLTIP_DECIMAL_PLACES,
  SVG_FILTER_BLUR_DEVIATION,
  SMOOTH_LINE_STROKE_WIDTH,
  SMOOTH_LINE_STROKE_OPACITY
} from '../../../constants/chart';
import CustomTooltip from '../CustomTooltip';
import styles from './ConversionChart.module.css';

type Props = {
  data: ChartPoint[];
  visibleVariations: string[];
  lineStyle: LineStyle;
  theme: Theme;
  connectNulls?: boolean;
};

const ConversionChart = React.forwardRef<HTMLDivElement, Props>(({ data, visibleVariations, lineStyle, theme, connectNulls = false }, ref) => {
  const colors = useMemo(() => variationColors[theme] ?? {}, [theme]);

  const areaSeries = useMemo(() => {
    if (lineStyle !== LineStyle.Area) return null;
    return visibleVariations.map((v) => {
      const stroke = colors[v] ?? '#999';
      return (
        <Area
          key={`area-${v}`}
          type="monotone"
          dataKey={v}
          stroke={stroke}
          fill={stroke}
          fillOpacity={0.15}
          connectNulls={connectNulls}
          isAnimationActive={false}
        />
      );
    });
  }, [lineStyle, visibleVariations, colors, connectNulls]);

  const smoothSeries = useMemo(() => {
    if (lineStyle !== LineStyle.Smooth) return null;
    return visibleVariations.map((v) => {
      const stroke = colors[v] ?? '#999';
      return (
        <Line
          key={`smooth-${v}`}
          type="monotone"
          dataKey={v}
          stroke={stroke}
          strokeWidth={SMOOTH_LINE_STROKE_WIDTH}
          strokeOpacity={SMOOTH_LINE_STROKE_OPACITY}
          dot={false}
          strokeLinecap="round"
          connectNulls={connectNulls}
          isAnimationActive={false}
          filter="url(#strongSmoothBlur)"
        />
      );
    });
  }, [lineStyle, visibleVariations, colors, connectNulls]);

  const lineSeries = useMemo(() => {
    if (lineStyle !== LineStyle.Line) return null;
    return visibleVariations.map((v) => {
      const stroke = colors[v] ?? '#999';
      return (
        <Line
          key={`line-${v}`}
          type="linear"
          dataKey={v}
          stroke={stroke}
          strokeWidth={2}
          dot={false}
          strokeLinecap="round"
          connectNulls={connectNulls}
          isAnimationActive={false}
        />
      );
    });
  }, [lineStyle, visibleVariations, colors, connectNulls]);

  return (
    <div ref={ref} className={`${styles.chartContainer} ${styles[theme]}`}>
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <ComposedChart data={data} margin={{ top: 10, right: 16, bottom: 28, left: 0 }}>
          {/* Enhanced SVG filters for smooth curves */}
          <defs>
            <filter id="strongSmoothBlur" x="-200%" y="-200%" width="1500%" height="1500%">
              <feGaussianBlur in="SourceGraphic" stdDeviation={SVG_FILTER_BLUR_DEVIATION} result="blur" />
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <CartesianGrid strokeDasharray="3 3" opacity={CHART_GRID_OPACITY} />
          <XAxis dataKey="date" tick={{ fontSize: CHART_AXIS_FONT_SIZE }} />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: CHART_AXIS_FONT_SIZE }}
            domain={['auto', 'auto']}
          />
          <Tooltip
            cursor={{ stroke: tooltipColors[theme].cursor, strokeWidth: 1, opacity: 0.5 }}
            content={<CustomTooltip theme={theme} visibleVariations={visibleVariations} decimals={CHART_TOOLTIP_DECIMAL_PLACES} />}
          />
          <Legend wrapperStyle={{ paddingTop: 8 }} />
          {areaSeries}
          {smoothSeries}
          {lineSeries}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
});

export default React.memo(ConversionChart);
