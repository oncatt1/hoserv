import { Link } from "react-router-dom";
import { useUserStore } from "../utils/auth";

export default function Unauthorized(){
    
    const { user } = useUserStore();
    return(
        <div className="flex flex-col justify-center items-center p-20">
            <div className="flex flex-col justify-center items-center p-10 shadow-2xl rounded-2xl">
                <span className="text-4xl p-2">Błąd 401</span>
                <span className="text-2xl p-2 pb-5">Brak dostępu</span>
                <Link to={user ? "/photos" : "/login"} className="cursor-pointer">
                    <button className="rounded-full cursor-pointer
                    bg-gradient-to-tr from-fuchsia-900/50 to-fuchsia-900/50 via-fuchsia-950/50 
                    dark:from-gray-900/50 dark:to-zinc-700/50 dark:via-slate-700/50
                    via-90% text-white p-4 shadow-2xl">{user ? "Zdjęcia" : "Zaloguj się"}</button>
                </Link>
            </div>
        </div>
    )
}