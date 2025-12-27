import { Link } from "react-router-dom";
import { useUserStore } from "../utils/auth";
import { Card } from "../components/card";

export default function Unauthorized(){
    
    const { user } = useUserStore();
    return(
        <Card>
            <span className="text-4xl p-2">Błąd 401</span>
            <span className="text-2xl p-2 pb-5">Brak dostępu</span>
            <Link to={user ? "/photos" : "/login"} className="cursor-pointer">
                <button className="
                btn-base btn-primary
                p-4 opacity-0 animate-fadeIn
                ">{user ? "Zdjęcia" : "Zaloguj się"}</button>
            </Link>
        </Card>
    )
}