import React from 'react';
import styles from './Controls.module.css';
import { makeT } from '../../constants/translations';

const t = makeT('en');

type VariationsSelectorProps = {
  variationNames: string[];
  selectedVariation: string;
  setSelectedVariation: (v: string) => void;
};

const VariationsSelector: React.FC<VariationsSelectorProps> = ({
  variationNames,
  selectedVariation,
  setSelectedVariation,
}) => {
  return (
    <>
      <label htmlFor="variations-select">{t('variations')}:</label>
      <select
        id="variations-select"
        className={styles.variationsSelect}
        value={selectedVariation}
        onChange={(e) => setSelectedVariation(e.target.value)}
      >
        <option value="all">{t('allVariations')}</option>
        {variationNames.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </>
  );
};

export default React.memo(VariationsSelector);
