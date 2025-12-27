import { useUserStore} from '../utils/auth';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const {user , fetchUser} = useUserStore();
    const navigate = useNavigate();

    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(credentials)
            });
            if (res.ok){
                navigate("/photos");
                fetchUser();
                return { success: true }
            } else {
                const err = await res.json();
                setError(err.message || "Login failed");
                return { success: false, error: err };
            }
        } catch (err) {
            setError(err.message);
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    };
    return { login, loading, error };
};
