import { useState , useEffect} from "react";

export const useFetch = (url) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    useEffect(() => {
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
                console.log("FETCH ERROR:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [url])

    return { data, loading, error };
    
}