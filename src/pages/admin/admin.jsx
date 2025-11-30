import Loading from "../../components/loading";
import { useFetch } from "../../hooks/useFetchGet";
import { useUserStore } from "../../utils/auth";
import Unauthorized from "../unauthorized";

export default function Admin(){
    const { user } = useUserStore();
    const usageUrl = `${import.meta.env.VITE_API_URL}/getUsage`;
    
    const { data } = useFetch(usageUrl);
    
    if (user !== import.meta.env.VITE_ADMIN_NAME) return <Unauthorized/>;
    if (!user || !data) return <Loading/>;       
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
                    <div className="indent-3">Wykorzystanie dysków: {data.totalUsage} bajtów z {data.DISK_SIZE} bajtów ({data.totalUsagePercent}%)</div>
                </div>
                <div>
                    <div className="indent-3">Ilość wszystkich zdjęć: [ddoed]</div>
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