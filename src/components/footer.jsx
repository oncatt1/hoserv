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
    <footer className="
        flex items-center justify-between
        h-12 2xl:h-16
        px-8
        bg-slate-800/70
        backdrop-blur-md
        border-t border-slate-700/50
        shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.6)]
        max-xl:text-xs
    ">  
        {data && (
            <>
                <div className="flex flex-col basis-1/2">
                <span className="text-xs text-slate-400">
                    Pojemność dysków
                </span>
                <span className="font-medium text-slate-200">
                    {data.totalUsagePercent}%
                    <span className="ml-2 text-slate-500">
                    {setFooterDashes(data.totalUsagePercent)}
                    </span>
                </span>
                </div>

                <div className="flex flex-col basis-1/2 text-right">
                <span className="text-xs text-slate-400">
                    Twoje wykorzystanie
                </span>
                <span className="font-medium text-slate-200">
                    {data.userUsagePercent}%
                    <span className="ml-2 text-slate-500">
                    {setFooterDashes(data.userUsagePercent)}
                    </span>
                </span>
                </div>
            </>
        )}
        <ErrorPopout error={error} />
    </footer>
);


}
export default Footer