import { Link } from 'react-router-dom'

export default function Header(){
    return(
        <header className="h-[60px] 2xl:h-[80px] sticky top-0 px-10 flex items-center justify-between 
        bg-gradient-to-bl from-gray-600 via-purple-900 to-purple-950
        shadow-violet-900 shadow-2xl/30">
            <div className="flex-1/5">
                <span className='font-bold text-2xl 2xl:text-3xl'>HoServ</span>
            </div>
            <div className="flex-3/5 ">
                <li className="flex gap-40 px-2">
                    <ul className="cursor-pointer"><Link to="/"> Strona główna</Link></ul>
                    <ul className="cursor-pointer"><Link to="/photos">Twoje zdjęcia</Link></ul>
                    <ul className="cursor-pointer"><Link to="/add_photos">Dodaj zdjęcie</Link></ul>
                </li>
            </div>
            <div className="flex-1/5 text-right font-semibold text-[17px]">
                <span className="cursor-pointer"><Link to="/profile">profil</Link></span>
            </div>
        </header>
    )
}