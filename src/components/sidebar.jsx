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

    const headerClass = `
        font-medium text-gray-400
        cursor-pointer
        m-1 px-3 py-2
        transition-all duration-200
        bg-slate-900/30
        hover:bg-slate-900/20 hover:text-gray-300
        rounded-md
        border-t border-gray-600/60
    `;


    const rowClass = `
        cursor-pointer
        ml-6
        px-3 py-2
        transition-all duration-200
        hover:text-gray-300 hover:bg-slate-900/10
        border-b border-gray-700/60
        rounded-sm
        truncate
    `;

    return (
        <aside className="w-64 h-full overflow-y-auto p-3 opacity-0 animate-fadeIn
        bg-slate-800/60 backdrop-blur-md border-r border-slate-700/50">
            {/* User Database Section */}
            {data.name && (
                <div className="p-2">
                    <div 
                        className={headerClass}
                        onClick={() => onTableNameClick("", data.name)} 
                    >
                        {data.name.replace("photos_", "")}
                    </div>
                    {userData?.tableNames?.map((entry, i) => (
                        <div 
                            key={i} 
                            onClick={() => onTableNameClick(entry.folder, data.name)} 
                            className={rowClass}
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
                        className={headerClass}
                        onClick={() => onTableNameClick("", data.general)} 
                    >
                        {data.general.replace("photos_", "")}
                    </div>
                    {generalData?.tableNames?.map((entry, i) => (
                        <div 
                            key={i} 
                            onClick={() => onTableNameClick(entry.folder, data.general)} 
                            className={rowClass}
                        >
                            {entry.folder}
                        </div>
                    ))}
                </div>
            )}
        </aside>
    );
}