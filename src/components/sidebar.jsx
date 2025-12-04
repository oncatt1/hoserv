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
    const location = useLocation().pathname;

    if (location !== "/photos") return null;

    const dbUrl = `${import.meta.env.VITE_API_URL}/getDBs`; 
    const dbTablesUrl = `${import.meta.env.VITE_API_URL}/getDbTables`;

    const { data, refetch: refetchDbs } = useFetch(dbUrl);

    const userDbName = data?.name ?? "";
    const generalDbName = data?.general ?? "";

    const userOptions = useMemo(() => ({ dbName: userDbName }), [userDbName]);
    const generalOptions = useMemo(() => ({ dbName: generalDbName }), [generalDbName]);

    const { data: userData, refetch: refetchUserData } = useFetchPost(dbTablesUrl, userOptions);
    const { data: generalData, refetch: refetchGeneralData } = useFetchPost(dbTablesUrl, generalOptions);

    // Refetch all data when user changes
    useEffect(() => {
        if (user) {
            refetchDbs();
        }
    }, [user, refetchDbs]);

    // Refetch table data when database names are loaded
    useEffect(() => {
        if (userDbName) {
            refetchUserData();
        }
    }, [userDbName, refetchUserData]);

    useEffect(() => {
        if (generalDbName) {
            refetchGeneralData();
        }
    }, [generalDbName, refetchGeneralData]);

    if (!data || !userData || !generalData) return null;


    const onTableNameClick = async (name) => {
        console.log(name); // rewrite 
    }

    return (
        <aside className="w-1/6 overflow-y-auto h-[525px] bg-violet-800/30 dark:bg-slate-800/40 rounded-br-4xl p-3">
            <div className="p-2">
                <div className="font-medium text-gray-500">{data.name.replace("photos_", "")}</div>
                {userData?.tableNames?.map((entry, i) => (
                    <div key={i} onClick={() => onTableNameClick(entry.folder)} className="indent-5 bg-slate-900/40 hover:bg-slate-800/40 rounded-2xl m-1">{entry.folder}</div>
                ))}
            </div>
            {user === import.meta.env.VITE_ADMIN_NAME ? null : (
                <div className="p-2">
                    <div className="font-medium text-gray-500">{data.general.replace("photos_", "")}</div>
                    {generalData?.tableNames?.map((entry, i) => (
                        <div key={i} onClick={() => onTableNameClick(entry.folder)} className="indent-5 bg-slate-900/40 hover:bg-slate-800/40 rounded-2xl m-1">{entry.folder}</div>
                    ))}
                </div>
            )}
        </aside>
    );
}