import React, { useState, useCallback, useRef, useEffect } from 'react';
import ConversionChart from '../components/Chart/ConversionChart/index';
import Controls from '../components/Controls/Controls';
import { useData } from '../hooks/useData';
import { LineStyle, Theme, Aggregation } from '../types';
import { MIN_VISIBLE_POINTS, ZOOM_STEP_RATIO, ZOOM_OUT_RATIO } from '../constants/chart';
import styles from './Main.module.css';

const Main: React.FC = () => {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const [theme, setTheme] = useState<Theme>(Theme.Light);
    const [aggregation, setAggregation] = useState<Aggregation>(Aggregation.Day);
    const { chartData, variationNames, loading, error } = useData(aggregation);

    const [selectedVariation, setSelectedVariation] = useState<string>('all');
    const [lineStyle, setLineStyle] = useState<LineStyle>(LineStyle.Line);
    const [visibleRange, setVisibleRange] = useState<[number, number] | null>(null);

    // Drag state for panning
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<number>(0);
    const dragStartRange = useRef<[number, number] | null>(null);

    const visibleVariations =
        selectedVariation === 'all' ? variationNames : [selectedVariation];

    const startIndex = visibleRange?.[0] ?? 0;
    const endIndex = visibleRange?.[1] ?? (chartData.length - 1);
    const visibleLength = endIndex - startIndex + 1;

    const handleZoomIn = useCallback(() => {
        const step = Math.floor(visibleLength / ZOOM_STEP_RATIO);
        if (step <= 0) return;
        const newStart = startIndex + step;
        const newEnd = endIndex - step;
        if (newEnd - newStart + 1 < MIN_VISIBLE_POINTS) return;
        setVisibleRange([newStart, newEnd]);
    }, [visibleLength, startIndex, endIndex]);

    const handleZoomOut = useCallback(() => {
        if (!chartData.length) return;
        const step = Math.floor(visibleLength / ZOOM_OUT_RATIO);
        const newStart = Math.max(startIndex - step, 0);
        const newEnd = Math.min(endIndex + step, chartData.length - 1);
        setVisibleRange([newStart, newEnd]);
    }, [chartData.length, visibleLength, startIndex, endIndex]);

    const handleResetZoom = useCallback(() => setVisibleRange(null), []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (visibleRange === null) return;
        e.preventDefault();
        setIsDragging(true);
        setDragStart(e.clientX);
        dragStartRange.current = [startIndex, endIndex];
    }, [visibleRange, startIndex, endIndex]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light);
    }, [theme]);

    useEffect(() => {
        const el = document.documentElement;
        if (theme === Theme.Dark) {
            el.classList.add('theme-dark');
            el.classList.remove('theme-light');
        } else {
            el.classList.add('theme-light');
            el.classList.remove('theme-dark');
        }
    }, [theme]);

    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!isDragging || !dragStartRange.current) return;
            
            const deltaX = e.clientX - dragStart;
            const chartWidth = chartRef.current?.offsetWidth || 1;
            const pointsPerPixel = visibleLength / chartWidth;
            const pointsDelta = Math.round(deltaX * pointsPerPixel);
            
            if (pointsDelta === 0) return;
            
            const [origStart, origEnd] = dragStartRange.current;
            let newStart = origStart - pointsDelta;
            let newEnd = origEnd - pointsDelta;
            
            if (newStart < 0) {
                newStart = 0;
                newEnd = visibleLength - 1;
            }
            if (newEnd >= chartData.length) {
                newEnd = chartData.length - 1;
                newStart = newEnd - visibleLength + 1;
            }
            
            setDragStart(e.clientX);
            dragStartRange.current = [newStart, newEnd];
            setVisibleRange([newStart, newEnd]);
        };

        const handleGlobalMouseUp = () => {
            setIsDragging(false);
            dragStartRange.current = null;
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging, dragStart, visibleLength, chartData.length]);

    if (loading) return <div className={styles.loadingContainer}>Loading data...</div>;
    if (error) return <div className={styles.errorContainer}>Error: {error}</div>;
    if (!chartData.length) return <div className={styles.emptyContainer}>No data to display</div>;

    // Filter chartDataVisible to only dates where selected variation(s) have data
    let chartDataVisible = chartData.slice(startIndex, endIndex + 1);
    if (selectedVariation !== 'all') {
        chartDataVisible = chartDataVisible.filter(point => {
            const val = point[selectedVariation];
            return val !== undefined && val !== null;
        });
    }
    
    // Calculate if zoom in would be valid
    const zoomInStep = Math.floor(visibleLength / ZOOM_STEP_RATIO);
    const wouldBeVisibleAfterZoomIn = zoomInStep > 0 ? (endIndex - zoomInStep) - (startIndex + zoomInStep) + 1 : 0;
    const canZoomIn = zoomInStep > 0 && wouldBeVisibleAfterZoomIn >= MIN_VISIBLE_POINTS;
    
    // Check if already at full range
    const isAtFullRange = startIndex === 0 && endIndex === chartData.length - 1;
    const canZoomOut = !isAtFullRange;


    return (
        <div className={styles.container}>
            <Controls
                variationNames={variationNames}
                selectedVariation={selectedVariation}
                setSelectedVariation={setSelectedVariation}
                aggregation={aggregation}
                setAggregation={setAggregation}
                lineStyle={lineStyle}
                setLineStyle={setLineStyle}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onReset={handleResetZoom}
                zoomInDisabled={!canZoomIn || loading}
                zoomOutDisabled={!canZoomOut || loading}
                theme={theme}
                toggleTheme={toggleTheme}
                exportTargetRef={chartRef}
            />

            <div 
                className={styles.chartWrapper}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                style={{ 
                    cursor: isDragging ? 'grabbing' : (visibleRange !== null ? 'grab' : 'default'),
                    userSelect: 'none',
                    WebkitUserSelect: 'none'
                }}
            >
                <ConversionChart
                    ref={chartRef}
                    data={chartDataVisible}
                    visibleVariations={visibleVariations}
                    lineStyle={lineStyle}
                    theme={theme}
                    connectNulls={visibleVariations.length === 1}
                />
            </div>
        </div>
    );
};

export default Main;
