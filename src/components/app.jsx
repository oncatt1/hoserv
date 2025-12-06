import Welcome from "../pages/welcome";
import Profile from "../pages/profile";
import Photos from "../pages/photos";
import Login from "../pages/login";
import { Route, Routes, useLocation} from "react-router-dom";
import Admin from "../pages/admin/admin";
import { GetLoginState, useUserStore } from "../utils/auth";
import { useEffect, useState } from "react";
import AddPhoto from "../pages/addphoto";
import { useNavigate } from 'react-router-dom';

export default function App(){
    const { user, fetchUser } = useUserStore();
    const [isLogged, setIsLogged] = useState(null);
    const navigate = useNavigate();
    
    const location = useLocation().pathname;

    useEffect(() => {
        
        let mounted = true;
        const checkLoginAndFetch = async () => {
            try {
                const logged = await GetLoginState();
                if (!mounted) return;
                setIsLogged(logged);
                if (logged) {
                    fetchUser();
                } else {
                    if(location !== "/") navigate("/login");
                }
            } catch (err) {
                console.error('Failed to check login state', err);
                if (mounted) setIsLogged(false);
            }
        };

        checkLoginAndFetch();
        return () => { mounted = false; };
    }, [fetchUser, navigate]);

    if (isLogged === null) {
        return null;
    }

    return(
        <Routes>
            <Route path="/" element={<Welcome/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/photos" element={<Photos/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/admin" element={<Admin/>} />
            <Route path="/add" element={<AddPhoto/>} />
        </Routes>
    )
}