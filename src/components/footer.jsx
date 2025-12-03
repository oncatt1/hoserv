import { useLocation } from "react-router-dom"
import { useFetch } from "../hooks/useFetchGet"
import { ErrorPopout } from "./common/ErrorPopout";
import { useUserStore } from "../utils/auth";

function Footer(){
    let location = useLocation().pathname
    if (location === "/" || location === "/login") return null;

    
    const {user , fetchUser} = useUserStore();
    let usageUrl = user ? `${import.meta.env.VITE_API_URL}/getUsage` : null;
    const { data, error } = useFetch(usageUrl, { enabled: !!usageUrl });

    
    const setFooterDashes = (UsagePercent) => {
        var filled = Math.ceil(UsagePercent / 4);
        const empty = 25 - filled;
        return "[" + "=".repeat(filled) + "-".repeat(empty) + "]";
    }
    return (
    <footer className="flex clear-both bottom-0 h-[50px] 2xl:h-[70px] items-center px-10
        bg-gradient-to-br to-blue-900 shadow-blue-600/70 dark:from-gray-900 dark:shadow-stone-800 dark:to-zinc-900 
        shadow-2xl justify-between max-xl:text-xs"
    >  
        {data && (
            <>
                <div className="flex-1/2">
                    Pojemność dysków: {data.totalUsagePercent}% 
                    {setFooterDashes(data.totalUsagePercent)}
                </div>

                <div className="flex-1/2 text-right">
                    Twoje wykorzystanie: {data.userUsagePercent}%
                    {setFooterDashes(data.userUsagePercent)}
                </div>
            </>
        )}

        <ErrorPopout error={error} />
    </footer>
);


}
export default Footer