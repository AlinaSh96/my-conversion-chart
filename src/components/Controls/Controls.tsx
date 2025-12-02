import React from 'react';
import styles from './Controls.module.css';
import VariationsSelector from './VariationsSelector';
import RangeSelector from './RangeSelector';
import LineStyleSelector from './LineStyleSelector';
import ExportButton from '../ExportButton/ExportButton';
import { LineStyle, Theme, Aggregation } from '../../types';
import { makeT } from '../../constants/translations';

const t = makeT('en');

type ControlsProps = {
    variationNames: string[];
    selectedVariation: string;
    setSelectedVariation: (v: string) => void;
    aggregation: Aggregation;
    setAggregation: (a: Aggregation) => void;
    lineStyle: LineStyle;
    setLineStyle: (s: LineStyle) => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onReset: () => void;
    zoomInDisabled?: boolean;
    zoomOutDisabled?: boolean;
    theme: Theme;
    toggleTheme: () => void;
    exportTargetRef: React.RefObject<HTMLDivElement | null>;
};

const Controls: React.FC<ControlsProps> = ({
    variationNames,
    selectedVariation,
    setSelectedVariation,
    aggregation,
    setAggregation,
    lineStyle,
    setLineStyle,
    onZoomIn,
    onZoomOut,
    onReset,
    zoomInDisabled,
    zoomOutDisabled,
    toggleTheme,
    exportTargetRef,
    theme,
}) => {
    return (
        <div className={styles.controlsContainer}>
            {/* Левая группа */}
            <div className={styles.controlsLeft}>
                <VariationsSelector
                    variationNames={variationNames}
                    selectedVariation={selectedVariation}
                    setSelectedVariation={setSelectedVariation}
                />
                <RangeSelector aggregation={aggregation} setAggregation={setAggregation} />
            </div>


            <div className={styles.controlsRight}>
                <LineStyleSelector lineStyle={lineStyle} setLineStyle={setLineStyle} />
                <div className={`${styles.control} ${styles.zoomButtons}`}>
                    <button onClick={onZoomIn} disabled={zoomInDisabled} aria-label={t('zoomIn')}>+</button>
                    <button onClick={onZoomOut} disabled={zoomOutDisabled} aria-label={t('zoomOut')}>−</button>
                </div>
                <div className={styles.control}>
                    <button onClick={onReset} aria-label={t('resetZoom')}>↻</button>
                </div>
                <div className={styles.control}>
                    <button onClick={toggleTheme} aria-label={theme === Theme.Light ? t('enableDarkTheme') : t('enableLightTheme')}>
                        {theme === Theme.Light ? t('dark') : t('light')}
                    </button>
                </div>
                <div className={styles.control}>
                    <ExportButton targetRef={exportTargetRef} />
                </div>
            </div>
        </div>
    );
};

export default React.memo(Controls);
