
import Welcome from "../pages/welcome";
import Profile from "../pages/profile";
import Photos from "../pages/photos";
import Login from "../pages/login";
import { Route, Routes} from "react-router-dom";
import Admin from "../pages/admin/admin";
import { GetLoginState, useUserStore } from "../utils/auth";
import { useEffect } from "react";
import AddPhoto from "../pages/addphoto";

export default function App(){
    const isLogged = GetLoginState();
    const { user, fetchUser } = useUserStore();
    useEffect(() => {
        console.log(isLogged);
        if(isLogged) { fetchUser(); } // czemu to sie odpala 8 razy
    }, []);
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