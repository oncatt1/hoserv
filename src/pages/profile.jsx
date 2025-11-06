import { useUserStore} from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function Profile(){
    const navigate = useNavigate();
    const logout = useUserStore((state) => state.logout);
    const { user } = useUserStore();
    const useLogoutUser = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });
        if (res.ok){
            logout();
            navigate("/");
        }
    }
    return(
        <div className="p-8">
            <div className="p-2 m-3 flex w-2/3 border-b-2 border-violet-700/20 dark:border-zinc-700/20 mb-10">
                <div className=" flex-2/3  text-2xl ">
                    {user}
                </div>
                <div onClick={useLogoutUser} className="cursor-pointer flex-1/3 text-right text-sm flex flex-col justify-end">
                    Wyloguj się
                </div>
            </div>
            <div className="bg-purple-800/20 dark:bg-gray-800/20 p-6 rounded-t-2xl ">
                <span className="text-xl border-b-2 border-violet-600/20 dark:border-zinc-600/20">Informacje</span>
                <div className="">
                    <div className="indent-3">Dostęp do: [nazwy tablic]</div><br />
                    <div className="indent-3">Ilość dostępnych zdjęć: [ilość]</div><br />
                    <div className="indent-3">Wykorzystanie dysków: [usage]</div>
                </div>
            </div>
        </div>
    )
}