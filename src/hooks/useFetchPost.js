import { useState, useEffect, useCallback } from "react";

export const useFetchPost = (url, options = null) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [trigger, setTrigger] = useState(0);

    // Add refetch function
    const refetch = useCallback(() => {
        setTrigger(prev => prev + 1);
    }, []);

    useEffect(() => {  
        if (!url || !options) return;
        
        const controller = new AbortController();
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    credentials: 'include',
                    body: JSON.stringify(options),
                    signal: controller.signal
                });
                if (!res.ok) throw new Error(`Nie udano zebrac danych ze ${url}`);

                const json = await res.json();
                setData(json);

            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message);
                    console.error(`FETCH ERROR: ${url}`, err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => controller.abort();

    }, [url, JSON.stringify(options), trigger]);

    return { data, loading, error, refetch };
};