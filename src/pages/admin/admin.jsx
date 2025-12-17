import Loading from "../../components/loading";
import { useFetch } from "../../hooks/useFetchGet";
import { useUserStore } from "../../utils/auth";
import Unauthorized from "../unauthorized";

export default function Admin(){
    const usageUrl = `${import.meta.env.VITE_API_URL}/getUsage`;
    const photoCountUrl = `${import.meta.env.VITE_API_URL}/getPhotoCount`;

    const { data: dataUsage,  error: errorDataUsage} = useFetch(usageUrl);
    const { data: dataPhotoCount, error: errorDataPhotoCount } = useFetch(photoCountUrl);
    const { user } = useUserStore();

    if (user !== import.meta.env.VITE_ADMIN_NAME) return <Unauthorized/>;
    if(errorDataPhotoCount || errorDataUsage) return <ErrorPopout error={errorDataPhotoCount || errorDataUsage} />;
    if (!user || !dataUsage || !dataPhotoCount) return <Loading/>;     

    return (
    <div className="p-8 opacity-0 animate-fadeIn flex flex-col items-center space-y-6">
        {/* Header */}
        <div className="flex w-2/3 p-4 border-b-2 border-violet-700/20 dark:border-zinc-700/20 rounded-lg">
            <div className="text-2xl font-semibold text-gray-200">
                Panel administratora
            </div>
        </div>

        {/* Info Card */}
        <div className="bg-gray-800/20 p-6 rounded-t-2xl shadow-inner w-2/3">
            <span className="text-xl font-semibold border-b-2 border-zinc-600/20 pb-2 mb-4 inline-block">
                Informacje
            </span>
            <div className="space-y-2 text-gray-200">
                <div className="indent-3">
                    Wykorzystanie dysków: {dataUsage.totalUsage} bajtów z {dataUsage.DISK_SIZE} bajtów ({dataUsage.totalUsagePercent}%)
                </div>
                <div className="indent-3">
                    Ilość wszystkich zdjęć: {dataPhotoCount.totalUsage}
                </div>
            </div>
        </div>

        {/* Connections Card */}
        <div className="bg-gray-800/20 p-6 shadow-inner w-2/3">
            <span className="text-xl font-semibold border-b-2 border-zinc-600/20 pb-2 mb-4 inline-block">
                Połączenia
            </span>
            <div className="space-y-2 text-gray-200">
                <div className="indent-3 underline cursor-pointer">
                    <a href="http://localhost/phpmyadmin/index.php?route=/" target="_blank" className="hover:text-gray-100">
                        Połącz z PHPmyAdmin
                    </a>
                </div>
                <div className="indent-3 underline cursor-pointer hover:text-gray-100">
                    Wyświetl logi
                </div>
                <div className="indent-3 underline cursor-pointer hover:text-gray-100">
                    Zrestartuj serwer
                </div>
                <div className="indent-3 underline cursor-pointer hover:text-gray-100">
                    Zamknij serwer
                </div>
            </div>
        </div>

    </div>
);

    
}