import Loading from '../components/loading';
import { useFetch } from '../hooks/useFetchGet';
import { useUserStore} from '../utils/auth';
import { data, useNavigate } from 'react-router-dom';

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
    const usageUrl = `${import.meta.env.VITE_API_URL}/getUsage`;
    const dbNameUrl = `${import.meta.env.VITE_API_URL}/getDBs`;
    const photoCountUrl = `${import.meta.env.VITE_API_URL}/getPhotoCount`;

    const { data: dataUsage } = useFetch(usageUrl);
    const { data: dataDb } = useFetch(dbNameUrl);
    const { data: dataPhotoCount } = useFetch(photoCountUrl);

    if(!dataUsage || !dataDb || !dataPhotoCount) return <Loading/>;
    var count = dataPhotoCount.userDbPhotoCount + dataPhotoCount.generalDbPhotoCount;

    return(
        <div className="p-8 opacity-0 animate-fadeIn">
            moza po srodku moze zrobic wszystko
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
                    <div className="indent-3">Dostęp do: {dataDb.tableName}</div><br />
                    <div className="indent-3">Ilość dostępnych zdjęć: {count}</div><br />
                    <div className="indent-3">Wykorzystanie dysków: {dataUsage.userUsagePercent}%</div>
                </div>
            </div>
        </div>
    )
}