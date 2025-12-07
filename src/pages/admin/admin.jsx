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

    return(
        <div className="p-8 opacity-0 animate-fadeIn">
            <div className="p-2 m-3 flex w-2/3 border-b-2 border-violet-700/20 dark:border-zinc-700/20 mb-10">
                <div className="flex-2/3 text-2xl">
                    Panel administratora
                </div>
            </div>
            <div className="bg-purple-800/20 dark:bg-gray-800/20 p-6 rounded-t-2xl">
                <span className="text-xl border-b-2 border-violet-600/20 dark:border-zinc-600/20">Informacje</span>
                <div>
                    <div className="indent-3">Wykorzystanie dysków: {dataUsage.totalUsage} bajtów z {dataUsage.DISK_SIZE} bajtów ({dataUsage.totalUsagePercent}%)</div>
                </div>
                <div>
                    <div className="indent-3">Ilość wszystkich zdjęć: {dataPhotoCount.totalUsage}</div>
                </div>
            </div>
            <div className="bg-purple-800/20 dark:bg-gray-800/20 p-6">
                <span className="text-xl border-b-2 border-violet-600/20 dark:border-zinc-600/20">Połączenia</span>
                <div>
                    <div className="indent-3 underline">
                        <span className="cursor-pointer"><a href="http://localhost/phpmyadmin/index.php?route=/" target="_blank">Połącz z PHPmyAdmin</a></span></div>
                    <div className="indent-3 underline">
                        <span className="cursor-pointer">Wyświetl logi</span></div>
                    <div className="indent-3 underline">
                        <span className="cursor-pointer">Zrestartuj serwer</span></div>
                    <div className="indent-3 underline">
                        <span className="cursor-pointer">Zamknij serwer</span></div>
                </div>
            </div>
            <div className="bg-purple-800/20 dark:bg-gray-800/20 p-6 rounded-b-2xl  ">
                <span className="text-xl border-b-2 border-violet-600/20 dark:border-zinc-600/20">Ustawienia</span>
                <div>

                </div>
            </div>
        </div>
        
    )
    
}