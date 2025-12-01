import React from 'react';
import styles from './Controls.module.css';
import { LineStyle } from '../../types';
import { makeT } from '../../constants/translations';

const t = makeT('en');

type LineStyleSelectorProps = {
  lineStyle: LineStyle;
  setLineStyle: (s: LineStyle) => void;
};

const LineStyleSelector: React.FC<LineStyleSelectorProps> = ({ lineStyle, setLineStyle }) => (
    <>
      <label htmlFor="line-style-select">{t('lineStyle')}:</label>
      <select 
        id="line-style-select"
        className={styles.lineStyleSelector}
        value={lineStyle} 
        onChange={(e) => setLineStyle(e.target.value as LineStyle)}
      >
        <option value={LineStyle.Line}>{LineStyle.Line}</option>
        <option value={LineStyle.Smooth}>{LineStyle.Smooth}</option>
        <option value={LineStyle.Area}>{LineStyle.Area}</option>
      </select>
    </>
);

export default React.memo(LineStyleSelector);