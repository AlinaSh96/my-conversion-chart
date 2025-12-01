import { useState, useEffect, useMemo } from 'react';
import type { RawData, ChartPoint, Aggregation } from '../types';
import { transformToChartData, getVariationNames } from '../lib/dataTransform';


export const useData = (aggregation: Aggregation = 'day') => {
    const [rawData, setRawData] = useState<RawData | null>(null);
    const [chartData, setChartData] = useState<ChartPoint[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const variationNames = useMemo(() => 
        rawData ? getVariationNames(rawData) : [],
        [rawData]
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await fetch('/data.json');
                if (!res.ok) throw new Error('Failed to load data');
                const data: RawData = await res.json();
                setRawData(data);
                setChartData(transformToChartData(data, aggregation));
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [aggregation]);


    return { rawData, chartData, variationNames, loading, error };
};