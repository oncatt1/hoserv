
import Welcome from "../sites/welcome";
import Profile from "../sites/profile";
import Photos from "../sites/photos";
import Login from "../sites/login";
import { Route, Routes} from "react-router-dom";
import Admin from "../sites/admin";

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