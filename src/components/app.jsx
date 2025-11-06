
import Welcome from "../pages/welcome";
import Profile from "../pages/profile";
import Photos from "../pages/photos";
import Login from "../pages/login";
import { Route, Routes} from "react-router-dom";
import Admin from "../pages/admin/admin";
import { GetLoginState, useUserStore } from "../utils/auth";
import { useEffect, useState } from "react";
import AddPhoto from "../pages/addphoto";

export default function App(){
    const { user, fetchUser } = useUserStore();
    const [isLogged, setIsLogged] = useState(null);

    useEffect(() => {
        let mounted = true;
        const checkLoginAndFetch = async () => {
            try {
                const logged = await GetLoginState();
                if (!mounted) return;
                setIsLogged(logged);
                if (logged) {
                    fetchUser();
                }
            } catch (err) {
                console.error('Failed to check login state', err);
            }
        };

        checkLoginAndFetch();

        return () => { mounted = false; };
    }, [fetchUser]);
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