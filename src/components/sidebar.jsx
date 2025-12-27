import { useLocation, useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetchGet";
import { useUserStore } from "../utils/auth";
import { useFetchPost } from "../hooks/useFetchPost";
import { useEffect, useMemo } from "react";
import { MdAdd, MdOutline7kPlus } from "react-icons/md";

export default function Sidebar() {
    const location = useLocation().pathname;

    if (location !== "/photos") return null;

    return <SidebarContent />;
}
function SidebarContent() {
    const { user } = useUserStore();
    const navigate = useNavigate();

    const dbUrl = `${import.meta.env.VITE_API_URL}/getDBs`; 
    const folderUrl = `${import.meta.env.VITE_API_URL}/getFolders`;
    const { data, refetch: refetchDbs } = useFetch(dbUrl);
    
    const userOptions = useMemo(() => {
        return data ? { access: data.id } : null;
    }, [data]);

    const { data: generalData } = useFetchPost(folderUrl, { access: 1 });
    const { data: userData } = useFetchPost(folderUrl, userOptions);
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
    const addFolder = async (id, db) => {
        navigate(`/addFolder?id=${encodeURIComponent(id)}&db=${encodeURIComponent(db)}`);
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

    const bgButton = `text-right p-1 bg-slate-700/30 rounded-2xl`;

    return (
        <aside className="w-64 h-full overflow-y-auto opacity-0 animate-fadeIn
        bg-slate-800/60 backdrop-blur-md border-r border-slate-700/50">
            {/* User Database Section */}
            {data.name && (
                <div className="p-2">
                    <div className={`flex flex-row w-full justify-between ${headerClass}`}
                        onClick={() => onTableNameClick("", data.name)}>
                        <div>
                            {data.name.replace("photos_", "")}
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                            <div className={bgButton} onClick={() => addFolder(data.id, data.name.replace("photos_", ""))}>
                                <MdAdd/>
                            </div>
                        </div>
                    </div>
                    {userData?.result?.map((entry, i) => (
                        <div 
                            key={i} 
                            onClick={() => onTableNameClick(entry.id, data.name)} 
                            className={rowClass}
                        >
                            {entry.name}
                        </div>
                    ))}
                </div>
            )}
            {/* General/Admin Database Section */}
            {user !== import.meta.env.VITE_ADMIN_NAME && data.general && (
                <div className="p-2">
                    <div className={`flex flex-row w-full justify-between ${headerClass}`}
                        onClick={() => onTableNameClick("", data.general)}>
                        <div>
                            {data.general.replace("photos_", "")}
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                            <div className={bgButton} onClick={() => addFolder(1, data.general.replace("photos_", ""))}>
                                <MdAdd/>
                            </div>
                        </div>

                    </div>
                    {generalData?.result?.map((entry, i) => (
                        <div 
                            key={i} 
                            onClick={() => onTableNameClick(entry.id, data.general)} 
                            className={rowClass}
                        >
                            {entry.name}
                        </div>
                    ))}
                </div>
            )}
        </aside>
    );
}