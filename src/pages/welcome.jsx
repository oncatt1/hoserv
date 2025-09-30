import { Link } from "react-router-dom";

export default function Welcome(){
    return(
        <div className="flex flex-col justify-center items-center p-20">
            <span className="py-20 text-4xl">Wrzuć swoje zdjęcia na HoServ</span>
            <Link to="/login" className="cursor-pointer">
                <button className="rounded-full cursor-pointer
                bg-gradient-to-tr from-fuchsia-900/50 to-fuchsia-900/50 via-fuchsia-950/50 
                dark:from-gray-900/50 dark:to-zinc-700/50 dark:via-slate-700/50
                via-90% text-white p-4 shadow-2xl">Zaloguj się</button>
            </Link>
        </div>
    )
}