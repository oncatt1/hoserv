import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { useUserStore } from '../utils/auth';

export default function Header(){
    const {user , fetchUser} = useUserStore();
    useEffect(() => {
        if(!user) return;
        fetchUser();
    }, [user]);
    return(
        <header className="
            sticky top-0 z-30
            h-[60px] 2xl:h-[80px]
            px-10
            flex items-center justify-between
            bg-slate-800/80
            backdrop-blur-md
            border-b border-slate-700/80
            shadow-[0_4px_16px_-8px_rgba(0,0,0,0.6)]
            ">
            {/* Logo */}
            <div className="flex-1/10">
                <div className="flex items-center">
                <img src="/icon.png" alt="icon" className="px-2 w-[50px]" />
                <span className="font-bold text-2xl 2xl:text-3xl cursor-pointer">
                    <Link to="/">HoServ</Link>
                </span>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-5/10 px-4 flex items-center">
                <Link
                to={user ? "/photos" : "/login"}
                className="cursor-pointer hover:text-slate-300 transition-colors"
                >
                Twoje zdjęcia
                </Link>
            </div>

            {/* Admin panel */}
            <div className="flex-2/10 text-right font-semibold text-[15px]">
                {user === "admin" && (
                <Link to="/admin" className="cursor-pointer font-bold hover:text-amber-400">
                    Panel Administratora
                </Link>
                )}
            </div>

            {/* Profile */}
            <div className="flex-1/10 text-right font-semibold text-[17px]">
                <Link
                to={user ? "/profile" : "/login"}
                className="cursor-pointer hover:text-slate-300 transition-colors"
                >
                {user ? (
                    <>
                    <span className="font-thin">{user}</span> · Profil
                    </>
                ) : (
                    "Zaloguj się"
                )}
                </Link>
            </div>
        </header>
    )
}