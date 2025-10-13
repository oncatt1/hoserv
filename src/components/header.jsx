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
        <header className="h-[60px] 2xl:h-[80px] top-0 px-10 flex items-center justify-between 
        bg-gradient-to-bl from-gray-600 dark:from-gray-900 via-purple-900 dark:via-zinc-800 
        to-purple-950 dark:to-zinc-900 shadow-violet-900 dark:shadow-stone-800 shadow-2xl/30">
            <div className="flex-1/10">
                <div className='flex items-center'>
                    <img src="\icon.png" alt="icon" className='px-2 w-[50px]'/>
                    <span className='font-bold text-2xl 2xl:text-3xl cursor-pointer'><Link to="/">HoServ</Link></span>
                </div>
            </div>
            <div className="flex-5/10 px-4"> 
                <span className="cursor-pointer"><Link to={user ? "/photos" : "/login"}>Twoje zdjęcia</Link></span>
            </div>
            <div className="flex-2/10 text-right font-semibold text-[15px]">
                {user == "admin" ? 
                    <span className="cursor-pointer font-bold"><Link to="/admin">Panel Administratora</Link></span> : "" 
                }
            </div>
        
            <div className="flex-1/10 text-right font-semibold text-[17px]">
                <span className="cursor-pointer"><Link to={user ? "/profile" : "/login"}>
                    {user ? 
                        (<><span className="font-thin">{user}</span> - Profil</>) : 'Zaloguj się'
                    }
                </Link></span>
            </div>
        </header>
    )
}