import React from 'react';
import styles from './Controls.module.css';
import type { Aggregation } from '../../types';
import { makeT } from '../../constants/translations';

const t = makeT('en');

type RangeSelectorProps = {
  aggregation: Aggregation;
  setAggregation: (a: Aggregation) => void;
};

const RangeSelector: React.FC<RangeSelectorProps> = ({ aggregation, setAggregation }) => {
  return (
    <>
      <label htmlFor="aggregation-select">{t('period')}:</label>
      <select
        id="aggregation-select"
        className={styles.rangeSelector}
        value={aggregation}
        onChange={(e) => setAggregation(e.target.value as Aggregation)}
      >
        <option value="day">{t('day')}</option>
        <option value="week">{t('week')}</option>
      </select>
    </>
  );
};

export default React.memo(RangeSelector);
