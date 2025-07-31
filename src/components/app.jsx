
import Welcome from "../sites/welcome";
import Profile from "../sites/profile";
import Photos from "../sites/photos";
import AddPhoto from "../sites/add_photo";
import { Route, Routes} from "react-router-dom";

export default function App(){
    return(
        <Routes>
            <Route path="/" element={<Welcome/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/photos" element={<Photos/>} />
            <Route path="/add_photo" element={<AddPhoto/>} />
        </Routes>
    )
}