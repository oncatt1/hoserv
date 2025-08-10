import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { getUser } from '../../utils/auth';

export default function Header(){
    const [login, setLogin] = useState(''); 

    const fetchData = async () => {
        console.log("ddd");
        const user = await getUser();
        setLogin(user.user.login);
    };
    fetchData();

    return(
        <header className="h-[60px] 2xl:h-[80px] top-0 px-10 flex items-center justify-between 
        bg-gradient-to-bl from-gray-600 via-purple-900 to-purple-950
        shadow-violet-900 shadow-2xl/30">
            <div className="flex-1/10 border-r-2 border-violet-900/20">
                <div className='flex items-center'>
                    <img src="\icon.png" alt="icon" className='px-2 w-[50px]'/>
                    <span className='font-bold text-2xl 2xl:text-3xl cursor-pointer'><Link to="/">HoServ</Link></span>
                </div>
            </div>
            <div className="flex-5/10 px-4"> 
                <span className="cursor-pointer"><Link to="/photos">Twoje zdjęcia</Link></span>
            </div>
            <div className="flex-2/10 text-right font-semibold text-[15px]">
                <span className="cursor-pointer"><Link to="/admin">Panel Administratora</Link></span>
            </div>
            <div className="flex-1/10 text-right font-semibold text-[17px]">
                <span className="cursor-pointer"><Link to="/profile">{login} Profil</Link></span>
            </div>
        </header>
    )
}