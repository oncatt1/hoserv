import { ErrorPopout } from '../components/common/ErrorPopout';
import Loading from '../components/loading';
import { useFetch } from '../hooks/useFetchGet';
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
                'Content-Type': 'application/json',
                'X-CSRF-Token': localStorage.getItem('csrfToken')
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

    const { data: dataUsage,  error: errorDataUsage} = useFetch(usageUrl);
    const { data: dataDb, error: errorDataDb} = useFetch(dbNameUrl);
    const { data: dataPhotoCount, error: errorDataPhotoCount } = useFetch(photoCountUrl);

    if(errorDataDb || errorDataPhotoCount || errorDataUsage) return <ErrorPopout error={errorDataDb || errorDataPhotoCount || errorDataUsage} />;
    if(!dataUsage || !dataDb || !dataPhotoCount) return <Loading/>;
    
    var count = dataPhotoCount.userDbPhotoCount + dataPhotoCount.generalDbPhotoCount;
    if(user === import.meta.env.VITE_ADMIN_NAME) count /= 2;

   return (
    <div className="p-8 opacity-0 animate-fadeIn flex flex-col items-center">
        {/* User header */}
        <div className="flex w-2/3 p-4 mb-10 border-b-2 border-slate-700/40 rounded-lg">
            <div className="flex-2/3 text-2xl font-semibold text-gray-200">
                {user}
            </div>
            <div 
                onClick={useLogoutUser} 
                className="flex-1/3 text-right text-sm text-gray-400 cursor-pointer hover:text-gray-200 transition-colors flex items-end justify-end"
            >
                Wyloguj się
            </div>
        </div>

        {/* User info card */}
        <div className="bg-gray-800/20 p-6 rounded-2xl shadow-inner w-2/3 border border-slate-700/50">
            <span className="text-xl font-semibold border-b-2 border-zinc-600/20 pb-2 mb-4 inline-block">
                Informacje
            </span>
            <div className="space-y-3 text-gray-200">
                <div className="indent-3">Dostęp do: {dataDb.name}</div>
                <div className="indent-3">Ilość dostępnych zdjęć: {count}</div>
                <div className="indent-3">Wykorzystanie dysków: {dataUsage.userUsagePercent}%</div>
            </div>
        </div>
    </div>
)

}