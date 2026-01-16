import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export const useAdd = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const add = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const folder = data.get('folder');
            const access = data.get('access');
            console.log(data);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/addPhoto?folder=${folder}&user=${access}`, {
                method: 'POST',
                headers: {'X-CSRF-Token': localStorage.getItem('csrfToken')},
                credentials: 'include',
                body: data
            });
            if (res.ok){
                navigate("/photos");
                return { success: true }
            } else {
                const err = await res.json();
                console.log(err);
                setError(JSON.stringify(err) || "Addition failed");
                return { success: false, error: err };
            }
        } catch (err) {
            setError(err.message);
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    };
    return { add, loading, error };
};
