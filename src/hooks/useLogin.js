
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../utils/auth";
export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('https://192.168.8.175:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(credentials)
            });
            if (res.ok){
                await getUser();
                navigate("/photos");
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
