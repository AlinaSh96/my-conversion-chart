import React from 'react';
import { format } from 'date-fns';
import type { CustomTooltipProps, ChartPoint } from '../../../types';
import { variationColors } from '../../../constants/colors';
import { makeT } from '../../../constants/translations';
import styles from './CustomTooltip.module.css';

const t = makeT('en');

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, label, payload, theme, visibleVariations, decimals }) => {
  if (!active || !payload || payload.length === 0) return null;

  const seriesColors = variationColors[theme] ?? {};
  const dateLabel = label ? format(new Date(label), 'dd.MM.yyyy') : '';

  // Build items from the full data point to include nulls/undefined values too
  const dataPoint = (payload?.[0]?.payload ?? {}) as ChartPoint;
  const items = visibleVariations
    .map((key) => {
      const raw = dataPoint ? (dataPoint)[key] : null;
      const val = raw == null ? null : Number(raw);
      return {
        key,
        value: Number.isFinite(val as number) ? (val as number) : null,
        color: seriesColors[key] || '#999',
      };
    })
    .sort((a, b) => {
      if (a.value == null && b.value == null) return 0;
      if (a.value == null) return 1;
      if (b.value == null) return -1;
      return b.value - a.value;
    });

  if (items.length === 0) return null;

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <div className={styles.header}>{t('date')}: {dateLabel}</div>
      <div className={styles.list}>
        {items.map((it) => (
          <div key={it.key} className={styles.item}>
            <span aria-hidden className={styles.dot} style={{ backgroundColor: it.color }} />
            <span className={styles.label}>{it.key}</span>
            {it.value == null ? (
              <span className={styles.value} style={{ opacity: 0.7 }}>{t('noData')}</span>
            ) : (
              <span className={styles.value}>{it.value.toFixed(decimals)}%</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(CustomTooltip);
