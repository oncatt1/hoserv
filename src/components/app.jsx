
import Welcome from "../pages/welcome";
import Profile from "../pages/profile";
import Photos from "../pages/photos";
import Login from "../pages/login";
import { Route, Routes} from "react-router-dom";
import Admin from "../pages/admin/admin";

export default function App(){
    return(
        <Routes>
            <Route path="/" element={<Welcome/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/photos" element={<Photos/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/admin" element={<Admin/>} />
        </Routes>
    )
}