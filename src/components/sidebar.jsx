import { useLocation, useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetchGet";
import { useUserStore } from "../utils/auth";
import { useFetchPost } from "../hooks/useFetchPost";
import { useEffect, useMemo } from "react";

export default function Sidebar() {
    const location = useLocation().pathname;

    if (location !== "/photos") return null;

    return <SidebarContent />;
}
function SidebarContent() {
    const { user } = useUserStore();
    const navigate = useNavigate();

    const dbUrl = `${import.meta.env.VITE_API_URL}/getDBs`; 
    const dbTablesUrl = `${import.meta.env.VITE_API_URL}/getDbTables`;

    const { data, refetch: refetchDbs } = useFetch(dbUrl);

    const userDbName = data?.name;
    const generalDbName = data?.general;

    const userOptions = useMemo(() => {
        return userDbName ? { dbName: userDbName } : null;
    }, [userDbName]);

    const generalOptions = useMemo(() => {
        return generalDbName ? { dbName: generalDbName } : null;
    }, [generalDbName]);

    const { data: userData } = useFetchPost(dbTablesUrl, userOptions);
    const { data: generalData } = useFetchPost(dbTablesUrl, generalOptions);

    // Refetch all data when user changes
    useEffect(() => {
        if (user) {
            refetchDbs();
        }
    }, [user, refetchDbs]);

    if (!data) return null;

    const onTableNameClick = async (name, db) => {
        navigate(`/photos?folder=${encodeURIComponent(name)}&db=${encodeURIComponent(db)}`);
    }

    return (
        <aside className="w-1/6 overflow-y-auto h-[525px] bg-violet-800/30 dark:bg-slate-800/40 rounded-br-4xl p-3">
            {/* User Database Section */}
            {data.name && (
                <div className="p-2">
                    <div 
                        className="font-medium text-gray-500 cursor-pointer bg-slate-900/40 hover:bg-slate-800/30 rounded-2xl m-1 p-1 transition-colors"
                        onClick={() => onTableNameClick("", data.name)} 
                    >
                        {data.name.replace("photos_", "")}
                    </div>
                    {userData?.tableNames?.map((entry, i) => (
                        <div 
                            key={i} 
                            onClick={() => onTableNameClick(entry.folder, data.name)} 
                            className="cursor-pointer indent-5 bg-slate-900/40 hover:bg-slate-800/40 rounded-2xl m-1 p-1 transition-colors"
                        >
                            {entry.folder}
                        </div>
                    ))}
                </div>
            )}

            {/* General/Admin Database Section */}
            {user !== import.meta.env.VITE_ADMIN_NAME && data.general && (
                <div className="p-2">
                    <div 
                        className="font-medium text-gray-500 cursor-pointer bg-slate-900/40 hover:bg-slate-800/30 rounded-2xl m-1 p-1 transition-colors"
                        onClick={() => onTableNameClick("", data.general)} 
                    >
                        {data.general.replace("photos_", "")}
                    </div>
                    {generalData?.tableNames?.map((entry, i) => (
                        <div 
                            key={i} 
                            onClick={() => onTableNameClick(entry.folder, data.general)} 
                            className="cursor-pointer indent-5 bg-slate-900/40 hover:bg-slate-800/40 rounded-2xl m-1 p-1 transition-colors"
                        >
                            {entry.folder}
                        </div>
                    ))}
                </div>
            )}
        </aside>
    );
}