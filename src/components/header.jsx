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
                <Link to="/">
                    <div className='flex items-center'>
                        <img src="\icon.png" alt="icon" className='px-2 w-[50px]'/>
                        <span className='font-bold text-2xl 2xl:text-3xl cursor-pointer'>HoServ</span>
                    </div>
                </Link>
            </div>

            <div className="flex-5/10 px-4"> 
                <Link to={user ? "/photos" : "/login"}>
                    <span className="cursor-pointer">Twoje zdjęcia</span>
                </Link>
            </div>

            <div className="flex-2/10 text-right font-semibold text-xl p-2">
                {user == "admin" ? 
                    <Link to="/admin">
                        <span className="cursor-pointer font-bold">Panel Administratora</span> 
                    </Link> : "" 
                }
            </div>
        
            <div className="flex-1/10 text-right font-semibold text-xl p-2">
                <Link to={user ? "/profile" : "/login"}>
                    <span className="cursor-pointer">
                        {user ? 
                            (<><span className="font-thin">{user}</span> - Profil</>) : 'Zaloguj się'
                        }
                    </span>
                </Link>
            </div>
        </header>
    )
}