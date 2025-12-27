import { useState, useEffect, useCallback } from "react";

export const useFetch = (url) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [trigger, setTrigger] = useState(0);

    const refetch = useCallback(() => {
        setTrigger(prev => prev + 1);
    }, []);

    useEffect(() => {  
        if (!url) return;
        
        const controller = new AbortController();
        
        const fetchData = async () => { 
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(url, {
                    credentials: 'include',
                    signal: controller.signal
                });
                
                if (!res.ok) throw new Error(`Failed to fetch ${url}`);

                const json = await res.json();
                setData(json);

            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => controller.abort();

    }, [url, trigger]);

    return { data, loading, error, refetch };
};