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
                <button className="rounded-full cursor-pointer
                bg-gradient-to-tr opacity-0 animate-fadeIn
                from-gray-900/50 to-zinc-700/50 via-slate-700/50
                via-90% text-white p-4 shadow-2xl">{user ? "Zdjęcia" : "Zaloguj się"}</button>
            </Link>
        </Card>
    )
}