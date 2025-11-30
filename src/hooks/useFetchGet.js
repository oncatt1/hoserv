import { useState , useEffect} from "react";

export const useFetch = (url) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    useEffect(() => {  
        if(!url) return;
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(url, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (!res.ok) throw new Error(`Nie udano zebrac danych ze ${url}`);
                const data = await res.json();
                setData(data);
            } catch (err) {
                setError(err.message);
                throw new Error(`FETCH ERROR: ${url}`, err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [url])

    return { data, loading, error };
    
}